package com.ifinance.service;

import com.ifinance.model.document.Investment;
import com.ifinance.model.document.MiscExpense;
import com.ifinance.model.document.TravelRecord;
import com.ifinance.repository.ExpenseRepository;
import com.ifinance.repository.InvestmentRepository;
import com.ifinance.repository.TravelRepository;
import com.ifinance.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for generating comprehensive financial reports
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final TravelRepository travelRepository;
    private final ExpenseRepository expenseRepository;
    private final InvestmentRepository investmentRepository;

    /**
     * Get comprehensive summary for a date range
     */
    public Map<String, Object> getComprehensiveSummary(LocalDate startDate, LocalDate endDate) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Generating comprehensive summary for user {} between {} and {}", userId, startDate, endDate);

        // Fetch all data
        // Note: For same-day queries, we need to use inclusive end date
        // MongoDB's $gte and $lte operators work with LocalDate, but Spring Data's Between is inclusive on both ends
        List<TravelRecord> travelRecords;
        List<MiscExpense> expenses;
        List<Investment> investments;
        
        if (startDate.equals(endDate)) {
            // For single day, use exact date match to ensure we get all records
            travelRecords = travelRepository.findByUserIdAndDate(userId, startDate);
            expenses = expenseRepository.findByUserIdAndDateOrderByCreatedAtDesc(userId, startDate);
            investments = investmentRepository.findByUserIdAndDateOrderByCreatedAtDesc(userId, startDate);
        } else {
            // For date ranges, use between query
            travelRecords = travelRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
            expenses = expenseRepository.findByUserIdAndDateBetweenOrderByDateDescCreatedAtDesc(userId, startDate, endDate);
            investments = investmentRepository.findByUserIdAndDateBetweenOrderByDateDescCreatedAtDesc(userId, startDate, endDate);
        }

        // Calculate totals
        BigDecimal totalTravel = travelRecords.stream()
                .map(TravelRecord::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = expenses.stream()
                .map(MiscExpense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalInvestments = investments.stream()
                .map(Investment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal grandTotal = totalTravel.add(totalExpenses).add(totalInvestments);

        Map<String, Object> summary = new HashMap<>();
        summary.put("startDate", startDate);
        summary.put("endDate", endDate);
        summary.put("totalTravel", totalTravel);
        summary.put("totalExpenses", totalExpenses);
        summary.put("totalInvestments", totalInvestments);
        summary.put("grandTotal", grandTotal);
        summary.put("travelCount", travelRecords.size());
        summary.put("expenseCount", expenses.size());
        summary.put("investmentCount", investments.size());
        summary.put("totalTransactions", travelRecords.size() + expenses.size() + investments.size());

        return summary;
    }

    /**
     * Get daily summary (for today)
     */
    public Map<String, Object> getDailySummary() {
        LocalDate today = LocalDate.now();
        log.debug("Generating daily summary for {}", today);
        return getComprehensiveSummary(today, today);
    }

    /**
     * Get weekly summary (Monday to Sunday)
     * - If today is Monday: show only today
     * - If today is Tuesday-Saturday: show from last Monday to next Sunday
     * - If today is Sunday: show from last Monday to today
     */
    public Map<String, Object> getWeeklySummary() {
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate;

        DayOfWeek dayOfWeek = today.getDayOfWeek();

        if (dayOfWeek == DayOfWeek.MONDAY) {
            // Monday: show only today
            startDate = today;
            endDate = today;
        } else if (dayOfWeek == DayOfWeek.SUNDAY) {
            // Sunday: show from last Monday to today
            startDate = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            endDate = today;
        } else {
            // Tuesday to Saturday: show from last Monday to next Sunday
            startDate = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            endDate = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        }

        log.debug("Generating weekly summary from {} to {}", startDate, endDate);
        return getComprehensiveSummary(startDate, endDate);
    }

    /**
     * Get monthly summary (first day to last day of current month)
     */
    public Map<String, Object> getMonthlySummary() {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.withDayOfMonth(1);
        LocalDate endDate = today.with(TemporalAdjusters.lastDayOfMonth());

        log.debug("Generating monthly summary from {} to {}", startDate, endDate);
        return getComprehensiveSummary(startDate, endDate);
    }

    /**
     * Get recent transactions (last 5 from all sources combined)
     */
    public Map<String, Object> getRecentTransactions() {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching recent transactions for user {}", userId);

        // Fetch recent records from each source
        List<TravelRecord> recentTravel = travelRepository.findTop10ByUserIdOrderByDateDescCreatedAtDesc(userId);
        List<MiscExpense> recentExpenses = expenseRepository.findTop10ByUserIdOrderByDateDescCreatedAtDesc(userId);
        List<Investment> recentInvestments = investmentRepository.findTop10ByUserIdOrderByDateDescCreatedAtDesc(userId);

        // Convert to DTOs with type information
        List<Map<String, Object>> allTransactions = new ArrayList<>();

        // Add travel records
        for (TravelRecord travel : recentTravel) {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("type", "TRAVEL");
            transaction.put("date", travel.getDate());
            transaction.put("amount", travel.getCost());
            transaction.put("description", "Travel - " + travel.getTimeOfDay().getDisplayName());
            transaction.put("id", travel.getId());
            transaction.put("createdAt", travel.getCreatedAt());
            allTransactions.add(transaction);
        }

        // Add expenses
        for (MiscExpense expense : recentExpenses) {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("type", "EXPENSE");
            transaction.put("date", expense.getDate());
            transaction.put("amount", expense.getAmount());
            transaction.put("description", expense.getCategory().getDisplayName() + 
                    (expense.getDescription() != null && !expense.getDescription().isEmpty() 
                            ? " - " + expense.getDescription() 
                            : ""));
            transaction.put("id", expense.getId());
            transaction.put("category", expense.getCategory());
            transaction.put("createdAt", expense.getCreatedAt());
            allTransactions.add(transaction);
        }

        // Add investments
        for (Investment investment : recentInvestments) {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("type", "INVESTMENT");
            transaction.put("date", investment.getDate());
            transaction.put("amount", investment.getAmount());
            transaction.put("description", investment.getCategory().getDisplayName() + 
                    (investment.getDescription() != null && !investment.getDescription().isEmpty() 
                            ? " - " + investment.getDescription() 
                            : ""));
            transaction.put("id", investment.getId());
            transaction.put("category", investment.getCategory());
            transaction.put("createdAt", investment.getCreatedAt());
            allTransactions.add(transaction);
        }

        // Sort by date desc, then createdAt desc, and take top 5
        List<Map<String, Object>> sortedTransactions = allTransactions.stream()
                .sorted((t1, t2) -> {
                    LocalDate date1 = (LocalDate) t1.get("date");
                    LocalDate date2 = (LocalDate) t2.get("date");
                    int dateCompare = date2.compareTo(date1);
                    if (dateCompare != 0) {
                        return dateCompare;
                    }
                    // If dates are equal, sort by createdAt
                    return ((java.time.LocalDateTime) t2.get("createdAt"))
                            .compareTo((java.time.LocalDateTime) t1.get("createdAt"));
                })
                .limit(5)
                .collect(Collectors.toList());

        // Remove createdAt from response (used only for sorting)
        sortedTransactions.forEach(t -> t.remove("createdAt"));

        return Map.of("transactions", sortedTransactions);
    }

    /**
     * Get custom date range summary
     */
    public Map<String, Object> getCustomSummary(LocalDate startDate, LocalDate endDate) {
        log.debug("Generating custom summary from {} to {}", startDate, endDate);
        return getComprehensiveSummary(startDate, endDate);
    }
}

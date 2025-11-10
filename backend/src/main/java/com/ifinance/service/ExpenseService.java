package com.ifinance.service;

import com.ifinance.exception.ResourceNotFoundException;
import com.ifinance.model.document.MiscExpense;
import com.ifinance.model.dto.ExpenseDto;
import com.ifinance.model.enums.ExpenseCategory;
import com.ifinance.model.enums.PaymentMethod;
import com.ifinance.repository.ExpenseRepository;
import com.ifinance.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for managing miscellaneous expenses
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    /**
     * Create a new expense
     */
    @Transactional
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Creating expense for user: {}", userId);

        MiscExpense expense = expenseDto.toDocument(userId);
        MiscExpense savedExpense = expenseRepository.save(expense);

        log.info("Created expense with id: {} for user: {}", savedExpense.getId(), userId);
        return ExpenseDto.fromDocument(savedExpense);
    }

    /**
     * Get all expenses for current user with pagination
     */
    public Page<ExpenseDto> getAllExpenses(Pageable pageable) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching expenses for user: {}", userId);

        Page<MiscExpense> expenses = expenseRepository.findByUserIdOrderByDateDescCreatedAtDesc(userId, pageable);
        return expenses.map(ExpenseDto::fromDocument);
    }

    /**
     * Get all expenses for current user without pagination
     */
    public List<ExpenseDto> getAllExpenses() {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching all expenses for user: {}", userId);

        List<MiscExpense> expenses = expenseRepository.findByUserIdOrderByDateDescCreatedAtDesc(userId);
        return expenses.stream()
                .map(ExpenseDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get expense by ID
     */
    public ExpenseDto getExpenseById(String id) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching expense {} for user: {}", id, userId);

        MiscExpense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        return ExpenseDto.fromDocument(expense);
    }

    /**
     * Get expenses by category
     */
    public List<ExpenseDto> getExpensesByCategory(ExpenseCategory category) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching expenses by category {} for user: {}", category, userId);

        List<MiscExpense> expenses = expenseRepository.findByUserIdAndCategoryOrderByDateDesc(userId, category);
        return expenses.stream()
                .map(ExpenseDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get expenses by payment method
     */
    public List<ExpenseDto> getExpensesByPaymentMethod(PaymentMethod paymentMethod) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching expenses by payment method {} for user: {}", paymentMethod, userId);

        List<MiscExpense> expenses = expenseRepository.findByUserIdAndPaymentMethodOrderByDateDesc(userId, paymentMethod);
        return expenses.stream()
                .map(ExpenseDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get expenses by date range
     */
    public List<ExpenseDto> getExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching expenses between {} and {} for user: {}", startDate, endDate, userId);

        List<MiscExpense> expenses = expenseRepository
                .findByUserIdAndDateBetweenOrderByDateDescCreatedAtDesc(userId, startDate, endDate);
        return expenses.stream()
                .map(ExpenseDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get expenses by date range and category
     */
    public List<ExpenseDto> getExpensesByDateRangeAndCategory(
            LocalDate startDate, LocalDate endDate, ExpenseCategory category) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching expenses between {} and {} for category {} and user: {}",
                startDate, endDate, category, userId);

        List<MiscExpense> expenses = expenseRepository
                .findByUserIdAndDateBetweenAndCategoryOrderByDateDescCreatedAtDesc(
                        userId, startDate, endDate, category);
        return expenses.stream()
                .map(ExpenseDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get expenses by date range and payment method
     */
    public List<ExpenseDto> getExpensesByDateRangeAndPaymentMethod(
            LocalDate startDate, LocalDate endDate, PaymentMethod paymentMethod) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching expenses between {} and {} for payment method {} and user: {}",
                startDate, endDate, paymentMethod, userId);

        List<MiscExpense> expenses = expenseRepository
                .findByUserIdAndDateBetweenAndPaymentMethodOrderByDateDescCreatedAtDesc(
                        userId, startDate, endDate, paymentMethod);
        return expenses.stream()
                .map(ExpenseDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get expenses for a specific date
     */
    public List<ExpenseDto> getExpensesByDate(LocalDate date) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching expenses for date {} and user: {}", date, userId);

        List<MiscExpense> expenses = expenseRepository.findByUserIdAndDateOrderByCreatedAtDesc(userId, date);
        return expenses.stream()
                .map(ExpenseDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Search expenses by description
     */
    public List<ExpenseDto> searchExpensesByDescription(String keyword) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Searching expenses by keyword '{}' for user: {}", keyword, userId);

        List<MiscExpense> expenses = expenseRepository.searchByDescription(userId, keyword);
        return expenses.stream()
                .map(ExpenseDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Update expense
     */
    @Transactional
    public ExpenseDto updateExpense(String id, ExpenseDto expenseDto) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Updating expense {} for user: {}", id, userId);

        MiscExpense existingExpense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        // Update fields
        existingExpense.setDate(expenseDto.getDate());
        existingExpense.setCategory(expenseDto.getCategory());
        existingExpense.setAmount(expenseDto.getAmount());
        existingExpense.setDescription(expenseDto.getDescription());
        existingExpense.setPaymentMethod(expenseDto.getPaymentMethod());
        existingExpense.setOtherCategoryName(expenseDto.getOtherCategoryName());

        MiscExpense updatedExpense = expenseRepository.save(existingExpense);
        log.info("Updated expense {} for user: {}", id, userId);

        return ExpenseDto.fromDocument(updatedExpense);
    }

    /**
     * Delete expense
     */
    @Transactional
    public void deleteExpense(String id) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Deleting expense {} for user: {}", id, userId);

        MiscExpense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expenseRepository.delete(expense);
        log.info("Deleted expense {} for user: {}", id, userId);
    }

    /**
     * Get expense summary (total and count)
     */
    public Map<String, Object> getExpenseSummary(LocalDate startDate, LocalDate endDate) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Calculating expense summary between {} and {} for user: {}", startDate, endDate, userId);

        List<MiscExpense> expenses = expenseRepository
                .findByUserIdAndDateBetweenOrderByDateDescCreatedAtDesc(userId, startDate, endDate);

        BigDecimal totalAmount = expenses.stream()
                .map(MiscExpense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Group by category
        Map<ExpenseCategory, BigDecimal> categoryBreakdown = expenses.stream()
                .collect(Collectors.groupingBy(
                        MiscExpense::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, MiscExpense::getAmount, BigDecimal::add)
                ));

        // Group by payment method
        Map<PaymentMethod, BigDecimal> paymentMethodBreakdown = expenses.stream()
                .collect(Collectors.groupingBy(
                        MiscExpense::getPaymentMethod,
                        Collectors.reducing(BigDecimal.ZERO, MiscExpense::getAmount, BigDecimal::add)
                ));

        return Map.of(
                "totalAmount", totalAmount,
                "count", expenses.size(),
                "startDate", startDate,
                "endDate", endDate,
                "categoryBreakdown", categoryBreakdown,
                "paymentMethodBreakdown", paymentMethodBreakdown
        );
    }
}

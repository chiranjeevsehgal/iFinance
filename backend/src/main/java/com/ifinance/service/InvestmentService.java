package com.ifinance.service;

import com.ifinance.exception.ResourceNotFoundException;
import com.ifinance.model.document.Investment;
import com.ifinance.model.dto.InvestmentDto;
import com.ifinance.model.enums.InvestmentCategory;
import com.ifinance.repository.InvestmentRepository;
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
 * Service for managing investments and savings
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;

    /**
     * Create a new investment
     */
    @Transactional
    public InvestmentDto createInvestment(InvestmentDto investmentDto) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Creating investment for user: {}", userId);

        Investment investment = investmentDto.toDocument(userId);
        Investment savedInvestment = investmentRepository.save(investment);

        log.info("Created investment with id: {} for user: {}", savedInvestment.getId(), userId);
        return InvestmentDto.fromDocument(savedInvestment);
    }

    /**
     * Get all investments for current user with pagination
     */
    public Page<InvestmentDto> getAllInvestments(Pageable pageable) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching investments for user: {}", userId);

        Page<Investment> investments = investmentRepository.findByUserIdOrderByDateDescCreatedAtDesc(userId, pageable);
        return investments.map(InvestmentDto::fromDocument);
    }

    /**
     * Get all investments for current user without pagination
     */
    public List<InvestmentDto> getAllInvestments() {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching all investments for user: {}", userId);

        List<Investment> investments = investmentRepository.findByUserIdOrderByDateDescCreatedAtDesc(userId);
        return investments.stream()
                .map(InvestmentDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get investment by ID
     */
    public InvestmentDto getInvestmentById(String id) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching investment {} for user: {}", id, userId);

        Investment investment = investmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        return InvestmentDto.fromDocument(investment);
    }

    /**
     * Get investments by category
     */
    public List<InvestmentDto> getInvestmentsByCategory(InvestmentCategory category) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching investments by category {} for user: {}", category, userId);

        List<Investment> investments = investmentRepository.findByUserIdAndCategoryOrderByDateDesc(userId, category);
        return investments.stream()
                .map(InvestmentDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get investments by date range
     */
    public List<InvestmentDto> getInvestmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching investments between {} and {} for user: {}", startDate, endDate, userId);

        List<Investment> investments = investmentRepository
                .findByUserIdAndDateBetweenOrderByDateDescCreatedAtDesc(userId, startDate, endDate);
        return investments.stream()
                .map(InvestmentDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get investments by date range and category
     */
    public List<InvestmentDto> getInvestmentsByDateRangeAndCategory(
            LocalDate startDate, LocalDate endDate, InvestmentCategory category) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching investments between {} and {} for category {} and user: {}",
                startDate, endDate, category, userId);

        List<Investment> investments = investmentRepository
                .findByUserIdAndDateBetweenAndCategoryOrderByDateDescCreatedAtDesc(
                        userId, startDate, endDate, category);
        return investments.stream()
                .map(InvestmentDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get investments for a specific date
     */
    public List<InvestmentDto> getInvestmentsByDate(LocalDate date) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching investments for date {} and user: {}", date, userId);

        List<Investment> investments = investmentRepository.findByUserIdAndDateOrderByCreatedAtDesc(userId, date);
        return investments.stream()
                .map(InvestmentDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Search investments by description
     */
    public List<InvestmentDto> searchInvestmentsByDescription(String keyword) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Searching investments by keyword '{}' for user: {}", keyword, userId);

        List<Investment> investments = investmentRepository.searchByDescription(userId, keyword);
        return investments.stream()
                .map(InvestmentDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Update investment
     */
    @Transactional
    public InvestmentDto updateInvestment(String id, InvestmentDto investmentDto) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Updating investment {} for user: {}", id, userId);

        Investment existingInvestment = investmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        // Update fields
        existingInvestment.setDate(investmentDto.getDate());
        existingInvestment.setCategory(investmentDto.getCategory());
        existingInvestment.setAmount(investmentDto.getAmount());
        existingInvestment.setDescription(investmentDto.getDescription());
        existingInvestment.setOtherCategoryName(investmentDto.getOtherCategoryName());

        Investment updatedInvestment = investmentRepository.save(existingInvestment);
        log.info("Updated investment {} for user: {}", id, userId);

        return InvestmentDto.fromDocument(updatedInvestment);
    }

    /**
     * Delete investment
     */
    @Transactional
    public void deleteInvestment(String id) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Deleting investment {} for user: {}", id, userId);

        Investment investment = investmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        investmentRepository.delete(investment);
        log.info("Deleted investment {} for user: {}", id, userId);
    }

    /**
     * Get investment summary (total and count)
     */
    public Map<String, Object> getInvestmentSummary(LocalDate startDate, LocalDate endDate) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Calculating investment summary between {} and {} for user: {}", startDate, endDate, userId);

        List<Investment> investments = investmentRepository
                .findByUserIdAndDateBetweenOrderByDateDescCreatedAtDesc(userId, startDate, endDate);

        BigDecimal totalAmount = investments.stream()
                .map(Investment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Group by category
        Map<InvestmentCategory, BigDecimal> categoryBreakdown = investments.stream()
                .collect(Collectors.groupingBy(
                        Investment::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Investment::getAmount, BigDecimal::add)
                ));

        return Map.of(
                "totalAmount", totalAmount,
                "count", investments.size(),
                "startDate", startDate,
                "endDate", endDate,
                "categoryBreakdown", categoryBreakdown
        );
    }
}

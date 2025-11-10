package com.ifinance.repository;

import com.ifinance.model.document.MiscExpense;
import com.ifinance.model.enums.ExpenseCategory;
import com.ifinance.model.enums.PaymentMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for MiscExpense
 */
@Repository
public interface ExpenseRepository extends MongoRepository<MiscExpense, String> {

    /**
     * Find all expenses for a user with pagination
     */
    Page<MiscExpense> findByUserIdOrderByDateDescCreatedAtDesc(String userId, Pageable pageable);

    /**
     * Find all expenses for a user without pagination
     */
    List<MiscExpense> findByUserIdOrderByDateDescCreatedAtDesc(String userId);

    /**
     * Find expense by ID and userId
     */
    Optional<MiscExpense> findByIdAndUserId(String id, String userId);

    /**
     * Find expenses by userId and category
     */
    List<MiscExpense> findByUserIdAndCategoryOrderByDateDesc(String userId, ExpenseCategory category);

    /**
     * Find expenses by userId and payment method
     */
    List<MiscExpense> findByUserIdAndPaymentMethodOrderByDateDesc(String userId, PaymentMethod paymentMethod);

    /**
     * Find expenses by userId and date range
     */
    List<MiscExpense> findByUserIdAndDateBetweenOrderByDateDescCreatedAtDesc(
            String userId, LocalDate startDate, LocalDate endDate);

    /**
     * Find expenses by userId, date range, and category
     */
    List<MiscExpense> findByUserIdAndDateBetweenAndCategoryOrderByDateDescCreatedAtDesc(
            String userId, LocalDate startDate, LocalDate endDate, ExpenseCategory category);

    /**
     * Find expenses by userId, date range, and payment method
     */
    List<MiscExpense> findByUserIdAndDateBetweenAndPaymentMethodOrderByDateDescCreatedAtDesc(
            String userId, LocalDate startDate, LocalDate endDate, PaymentMethod paymentMethod);

    /**
     * Find expenses by userId for a specific date
     */
    List<MiscExpense> findByUserIdAndDateOrderByCreatedAtDesc(String userId, LocalDate date);

    /**
     * Delete by ID and userId
     */
    void deleteByIdAndUserId(String id, String userId);

    /**
     * Count expenses by userId
     */
    long countByUserId(String userId);

    /**
     * Count expenses by userId and date range
     */
    long countByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    /**
     * Search expenses by description (case-insensitive)
     */
    @Query("{ 'userId': ?0, 'description': { $regex: ?1, $options: 'i' } }")
    List<MiscExpense> searchByDescription(String userId, String keyword);
}

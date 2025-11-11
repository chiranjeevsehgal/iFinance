package com.ifinance.repository;

import com.ifinance.model.document.Investment;
import com.ifinance.model.enums.InvestmentCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Investment
 */
@Repository
public interface InvestmentRepository extends MongoRepository<Investment, String> {

    /**
     * Find all investments for a user with pagination
     */
    Page<Investment> findByUserIdOrderByDateDescCreatedAtDesc(String userId, Pageable pageable);

    /**
     * Find all investments for a user without pagination
     */
    List<Investment> findByUserIdOrderByDateDescCreatedAtDesc(String userId);

    /**
     * Find investment by ID and userId
     */
    Optional<Investment> findByIdAndUserId(String id, String userId);

    /**
     * Find investments by userId and category
     */
    List<Investment> findByUserIdAndCategoryOrderByDateDesc(String userId, InvestmentCategory category);

    /**
     * Find investments by userId and date range
     */
    List<Investment> findByUserIdAndDateBetweenOrderByDateDescCreatedAtDesc(
            String userId, LocalDate startDate, LocalDate endDate);

    /**
     * Find investments by userId, date range, and category
     */
    List<Investment> findByUserIdAndDateBetweenAndCategoryOrderByDateDescCreatedAtDesc(
            String userId, LocalDate startDate, LocalDate endDate, InvestmentCategory category);

    /**
     * Find investments by userId for a specific date
     */
    List<Investment> findByUserIdAndDateOrderByCreatedAtDesc(String userId, LocalDate date);

    /**
     * Delete by ID and userId
     */
    void deleteByIdAndUserId(String id, String userId);

    /**
     * Count investments by userId
     */
    long countByUserId(String userId);

    /**
     * Count investments by userId and date range
     */
    long countByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    /**
     * Search investments by description (case-insensitive)
     */
    @Query("{ 'userId': ?0, 'description': { $regex: ?1, $options: 'i' } }")
    List<Investment> searchByDescription(String userId, String keyword);
}

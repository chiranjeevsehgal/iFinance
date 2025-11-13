package com.ifinance.repository;

import com.ifinance.model.document.TravelRecord;
import com.ifinance.model.enums.TimeOfDay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for TravelRecord documents
 * All queries are user-specific for data isolation
 */
@Repository
public interface TravelRepository extends MongoRepository<TravelRecord, String> {

    /**
     * Find all travel records for a specific user with pagination
     */
    Page<TravelRecord> findByUserId(String userId, Pageable pageable);

    /**
     * Find all travel records for a user
     */
    List<TravelRecord> findByUserIdOrderByDateDescTimeOfDayAsc(String userId);

    /**
     * Find a travel record by ID and userId (for ownership verification)
     */
    Optional<TravelRecord> findByIdAndUserId(String id, String userId);

    /**
     * Find travel records by user and specific date
     */
    List<TravelRecord> findByUserIdAndDate(String userId, LocalDate date);

    /**
     * Find travel records by user and date range
     */
    List<TravelRecord> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);
    

    /**
     * Find travel records by user, date range, and time of day
     */
    List<TravelRecord> findByUserIdAndDateBetweenAndTimeOfDay(
            String userId, LocalDate startDate, LocalDate endDate, TimeOfDay timeOfDay);

    /**
     * Find travel records by user and time of day
     */
    List<TravelRecord> findByUserIdAndTimeOfDay(String userId, TimeOfDay timeOfDay);

    /**
     * Delete all travel records for a user (for cleanup purposes)
     */
    void deleteByUserId(String userId);

    /**
     * Count travel records for a user in a date range
     */
    long countByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    /**
     * Find top 10 recent travel records for a user
     */
    List<TravelRecord> findTop10ByUserIdOrderByDateDescCreatedAtDesc(String userId);
}

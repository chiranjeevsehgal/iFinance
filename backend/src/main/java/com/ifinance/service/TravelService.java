package com.ifinance.service;

import com.ifinance.exception.ResourceNotFoundException;
import com.ifinance.model.document.TravelRecord;
import com.ifinance.model.dto.TravelRecordDto;
import com.ifinance.model.enums.TimeOfDay;
import com.ifinance.repository.TravelRepository;
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
 * Service for managing travel records
 * All operations are user-specific for data isolation
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TravelService {

    private final TravelRepository travelRepository;

    /**
     * Create a new travel record for the current user
     */
    @Transactional
    public TravelRecordDto createTravelRecord(TravelRecordDto dto) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Creating travel record for user: {}", userId);

        TravelRecord record = dto.toDocument();
        record.setUserId(userId);

        TravelRecord saved = travelRepository.save(record);
        log.info("Travel record created with ID: {}", saved.getId());

        return TravelRecordDto.fromDocument(saved);
    }

    /**
     * Get all travel records for the current user with pagination
     */
    public Page<TravelRecordDto> getAllTravelRecords(Pageable pageable) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching travel records for user: {}", userId);

        Page<TravelRecord> records = travelRepository.findByUserId(userId, pageable);
        return records.map(TravelRecordDto::fromDocument);
    }

    /**
     * Get all travel records for the current user (without pagination)
     */
    public List<TravelRecordDto> getAllTravelRecords() {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching all travel records for user: {}", userId);

        List<TravelRecord> records = travelRepository.findByUserIdOrderByDateDescTimeOfDayAsc(userId);
        return records.stream()
                .map(TravelRecordDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get a travel record by ID (with ownership verification)
     */
    public TravelRecordDto getTravelRecordById(String id) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching travel record {} for user: {}", id, userId);

        TravelRecord record = travelRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Travel record not found with ID: " + id));

        return TravelRecordDto.fromDocument(record);
    }

    /**
     * Get travel records by date
     */
    public List<TravelRecordDto> getTravelRecordsByDate(LocalDate date) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching travel records for user {} on date: {}", userId, date);

        List<TravelRecord> records = travelRepository.findByUserIdAndDate(userId, date);
        return records.stream()
                .map(TravelRecordDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Get travel records by date range
     */
    public List<TravelRecordDto> getTravelRecordsByDateRange(LocalDate startDate, LocalDate endDate) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Fetching travel records for user {} between {} and {}", userId, startDate, endDate);

        List<TravelRecord> records = travelRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        return records.stream()
                .map(TravelRecordDto::fromDocument)
                .collect(Collectors.toList());
    }

    /**
     * Update a travel record (with ownership verification)
     */
    @Transactional
    public TravelRecordDto updateTravelRecord(String id, TravelRecordDto dto) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Updating travel record {} for user: {}", id, userId);

        TravelRecord existingRecord = travelRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Travel record not found with ID: " + id));

        // Update fields
        existingRecord.setDate(dto.getDate());
        existingRecord.setTimeOfDay(dto.getTimeOfDay());
        existingRecord.setCost(dto.getCost());

        TravelRecord updated = travelRepository.save(existingRecord);
        log.info("Travel record {} updated successfully", id);

        return TravelRecordDto.fromDocument(updated);
    }

    /**
     * Delete a travel record (with ownership verification)
     */
    @Transactional
    public void deleteTravelRecord(String id) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Deleting travel record {} for user: {}", id, userId);

        TravelRecord record = travelRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Travel record not found with ID: " + id));

        travelRepository.delete(record);
        log.info("Travel record {} deleted successfully", id);
    }

    /**
     * Get travel summary for a date range
     */
    public Map<String, Object> getTravelSummary(LocalDate startDate, LocalDate endDate) {
        String userId = SecurityUtil.getCurrentUserId();
        log.debug("Calculating travel summary for user {} between {} and {}", userId, startDate, endDate);

        List<TravelRecord> records = travelRepository.findByUserIdAndDateBetween(userId, startDate, endDate);

        BigDecimal totalCost = records.stream()
                .map(TravelRecord::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalCount = records.size();

        long morningCount = records.stream()
                .filter(r -> r.getTimeOfDay() == TimeOfDay.MORNING)
                .count();

        long eveningCount = records.stream()
                .filter(r -> r.getTimeOfDay() == TimeOfDay.EVENING)
                .count();

        BigDecimal morningTotal = records.stream()
                .filter(r -> r.getTimeOfDay() == TimeOfDay.MORNING)
                .map(TravelRecord::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal eveningTotal = records.stream()
                .filter(r -> r.getTimeOfDay() == TimeOfDay.EVENING)
                .map(TravelRecord::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "startDate", startDate,
                "endDate", endDate,
                "totalCost", totalCost,
                "totalCount", totalCount,
                "morningCount", morningCount,
                "eveningCount", eveningCount,
                "morningTotal", morningTotal,
                "eveningTotal", eveningTotal
        );
    }
}

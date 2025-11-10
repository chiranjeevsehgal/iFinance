package com.ifinance.controller;

import com.ifinance.model.dto.TravelRecordDto;
import com.ifinance.service.TravelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Travel Records management
 */
@Slf4j
@RestController
@RequestMapping("/api/travel")
@RequiredArgsConstructor
@Tag(name = "Travel Records", description = "Manage daily travel/commute expenses")
@SecurityRequirement(name = "oauth2")
public class TravelController {

    private final TravelService travelService;

    @Operation(
            summary = "Create a new travel record",
            description = "Creates a new travel record for the authenticated user"
    )
    @ApiResponse(responseCode = "201", description = "Travel record created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @PostMapping
    public ResponseEntity<TravelRecordDto> createTravelRecord(@Valid @RequestBody TravelRecordDto dto) {
        log.info("Creating new travel record");
        TravelRecordDto created = travelService.createTravelRecord(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(
            summary = "Get all travel records",
            description = "Get all travel records for the authenticated user with pagination"
    )
    @ApiResponse(responseCode = "200", description = "Travel records retrieved successfully")
    @GetMapping
    public ResponseEntity<Page<TravelRecordDto>> getAllTravelRecords(
            @PageableDefault(size = 20, sort = "date", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Fetching all travel records with pagination");
        Page<TravelRecordDto> records = travelService.getAllTravelRecords(pageable);
        return ResponseEntity.ok(records);
    }

    @Operation(
            summary = "Get all travel records (no pagination)",
            description = "Get all travel records for the authenticated user without pagination"
    )
    @ApiResponse(responseCode = "200", description = "Travel records retrieved successfully")
    @GetMapping("/all")
    public ResponseEntity<List<TravelRecordDto>> getAllTravelRecordsNoPagination() {
        log.info("Fetching all travel records without pagination");
        List<TravelRecordDto> records = travelService.getAllTravelRecords();
        return ResponseEntity.ok(records);
    }

    @Operation(
            summary = "Get travel record by ID",
            description = "Get a specific travel record by its ID"
    )
    @ApiResponse(responseCode = "200", description = "Travel record found")
    @ApiResponse(responseCode = "404", description = "Travel record not found")
    @GetMapping("/{id}")
    public ResponseEntity<TravelRecordDto> getTravelRecordById(@PathVariable String id) {
        log.info("Fetching travel record with ID: {}", id);
        TravelRecordDto record = travelService.getTravelRecordById(id);
        return ResponseEntity.ok(record);
    }

    @Operation(
            summary = "Get travel records by date",
            description = "Get all travel records for a specific date"
    )
    @ApiResponse(responseCode = "200", description = "Travel records retrieved successfully")
    @GetMapping("/date/{date}")
    public ResponseEntity<List<TravelRecordDto>> getTravelRecordsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        log.info("Fetching travel records for date: {}", date);
        List<TravelRecordDto> records = travelService.getTravelRecordsByDate(date);
        return ResponseEntity.ok(records);
    }

    @Operation(
            summary = "Get travel records by date range",
            description = "Get all travel records within a date range"
    )
    @ApiResponse(responseCode = "200", description = "Travel records retrieved successfully")
    @GetMapping("/range")
    public ResponseEntity<List<TravelRecordDto>> getTravelRecordsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Fetching travel records between {} and {}", startDate, endDate);
        List<TravelRecordDto> records = travelService.getTravelRecordsByDateRange(startDate, endDate);
        return ResponseEntity.ok(records);
    }

    @Operation(
            summary = "Update a travel record",
            description = "Update an existing travel record"
    )
    @ApiResponse(responseCode = "200", description = "Travel record updated successfully")
    @ApiResponse(responseCode = "404", description = "Travel record not found")
    @PutMapping("/{id}")
    public ResponseEntity<TravelRecordDto> updateTravelRecord(
            @PathVariable String id,
            @Valid @RequestBody TravelRecordDto dto) {
        log.info("Updating travel record with ID: {}", id);
        TravelRecordDto updated = travelService.updateTravelRecord(id, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(
            summary = "Delete a travel record",
            description = "Delete a travel record by its ID"
    )
    @ApiResponse(responseCode = "204", description = "Travel record deleted successfully")
    @ApiResponse(responseCode = "404", description = "Travel record not found")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTravelRecord(@PathVariable String id) {
        log.info("Deleting travel record with ID: {}", id);
        travelService.deleteTravelRecord(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Get travel summary",
            description = "Get travel statistics and summary for a date range"
    )
    @ApiResponse(responseCode = "200", description = "Summary retrieved successfully")
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getTravelSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Fetching travel summary between {} and {}", startDate, endDate);
        Map<String, Object> summary = travelService.getTravelSummary(startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}

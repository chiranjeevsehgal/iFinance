package com.ifinance.controller;

import com.ifinance.model.dto.InvestmentDto;
import com.ifinance.model.enums.InvestmentCategory;
import com.ifinance.service.InvestmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing investments and savings
 */
@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
@Tag(name = "Investments", description = "Investment and savings management API")
@SecurityRequirement(name = "oauth2")
public class InvestmentController {

    private final InvestmentService investmentService;

    /**
     * Create new investment
     */
    @PostMapping
    @Operation(summary = "Create a new investment")
    public ResponseEntity<InvestmentDto> createInvestment(@Valid @RequestBody InvestmentDto investmentDto) {
        InvestmentDto created = investmentService.createInvestment(investmentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Get all investments with pagination
     */
    @GetMapping
    @Operation(summary = "Get all investments with pagination")
    public ResponseEntity<Page<InvestmentDto>> getAllInvestments(Pageable pageable) {
        Page<InvestmentDto> investments = investmentService.getAllInvestments(pageable);
        return ResponseEntity.ok(investments);
    }

    /**
     * Get all investments without pagination
     */
    @GetMapping("/all")
    @Operation(summary = "Get all investments without pagination")
    public ResponseEntity<List<InvestmentDto>> getAllInvestmentsNoPagination() {
        List<InvestmentDto> investments = investmentService.getAllInvestments();
        return ResponseEntity.ok(investments);
    }

    /**
     * Get investment by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get investment by ID")
    public ResponseEntity<InvestmentDto> getInvestmentById(@PathVariable String id) {
        InvestmentDto investment = investmentService.getInvestmentById(id);
        return ResponseEntity.ok(investment);
    }

    /**
     * Update investment
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an investment")
    public ResponseEntity<InvestmentDto> updateInvestment(
            @PathVariable String id,
            @Valid @RequestBody InvestmentDto investmentDto) {
        InvestmentDto updated = investmentService.updateInvestment(id, investmentDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete investment
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an investment")
    public ResponseEntity<Void> deleteInvestment(@PathVariable String id) {
        investmentService.deleteInvestment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get investments by category
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Get investments by category")
    public ResponseEntity<List<InvestmentDto>> getInvestmentsByCategory(@PathVariable InvestmentCategory category) {
        List<InvestmentDto> investments = investmentService.getInvestmentsByCategory(category);
        return ResponseEntity.ok(investments);
    }

    /**
     * Get investments by date
     */
    @GetMapping("/date/{date}")
    @Operation(summary = "Get investments for a specific date")
    public ResponseEntity<List<InvestmentDto>> getInvestmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<InvestmentDto> investments = investmentService.getInvestmentsByDate(date);
        return ResponseEntity.ok(investments);
    }

    /**
     * Get investments by date range
     */
    @GetMapping("/date-range")
    @Operation(summary = "Get investments by date range")
    public ResponseEntity<List<InvestmentDto>> getInvestmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) InvestmentCategory category) {

        List<InvestmentDto> investments;

        if (category != null) {
            investments = investmentService.getInvestmentsByDateRangeAndCategory(startDate, endDate, category);
        } else {
            investments = investmentService.getInvestmentsByDateRange(startDate, endDate);
        }

        return ResponseEntity.ok(investments);
    }

    /**
     * Search investments by description
     */
    @GetMapping("/search")
    @Operation(summary = "Search investments by description")
    public ResponseEntity<List<InvestmentDto>> searchInvestments(@RequestParam String keyword) {
        List<InvestmentDto> investments = investmentService.searchInvestmentsByDescription(keyword);
        return ResponseEntity.ok(investments);
    }

    /**
     * Get investment summary
     */
    @GetMapping("/summary")
    @Operation(summary = "Get investment summary for a date range")
    public ResponseEntity<Map<String, Object>> getInvestmentSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> summary = investmentService.getInvestmentSummary(startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}

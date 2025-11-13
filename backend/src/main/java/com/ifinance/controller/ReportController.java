package com.ifinance.controller;

import com.ifinance.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * REST controller for financial reports and summaries
 */
@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Financial reports and analytics API")
@SecurityRequirement(name = "oauth2")
public class ReportController {

    private final ReportService reportService;

    /**
     * Get daily summary (today)
     */
    @GetMapping("/daily")
    @Operation(summary = "Get daily summary for today")
    public ResponseEntity<Map<String, Object>> getDailySummary() {
        log.info("Fetching daily summary");
        Map<String, Object> summary = reportService.getDailySummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * Get weekly summary (Monday to Sunday based on current day)
     */
    @GetMapping("/weekly")
    @Operation(summary = "Get weekly summary (Monday to Sunday)")
    public ResponseEntity<Map<String, Object>> getWeeklySummary() {
        log.info("Fetching weekly summary");
        Map<String, Object> summary = reportService.getWeeklySummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * Get monthly summary (current month)
     */
    @GetMapping("/monthly")
    @Operation(summary = "Get monthly summary for current month")
    public ResponseEntity<Map<String, Object>> getMonthlySummary() {
        log.info("Fetching monthly summary");
        Map<String, Object> summary = reportService.getMonthlySummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * Get custom date range summary
     */
    @GetMapping("/custom")
    @Operation(summary = "Get summary for custom date range")
    public ResponseEntity<Map<String, Object>> getCustomSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Fetching custom summary from {} to {}", startDate, endDate);
        Map<String, Object> summary = reportService.getCustomSummary(startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    /**
     * Get recent transactions (last 5)
     */
    @GetMapping("/recent-transactions")
    @Operation(summary = "Get last 5 recent transactions from all sources")
    public ResponseEntity<Map<String, Object>> getRecentTransactions() {
        log.info("Fetching recent transactions");
        Map<String, Object> transactions = reportService.getRecentTransactions();
        return ResponseEntity.ok(transactions);
    }
}

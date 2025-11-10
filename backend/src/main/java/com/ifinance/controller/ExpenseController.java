package com.ifinance.controller;

import com.ifinance.model.dto.ExpenseDto;
import com.ifinance.model.enums.ExpenseCategory;
import com.ifinance.model.enums.PaymentMethod;
import com.ifinance.service.ExpenseService;
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
 * REST controller for managing miscellaneous expenses
 */
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Tag(name = "Expenses", description = "Miscellaneous expense management API")
@SecurityRequirement(name = "oauth2")
public class ExpenseController {

    private final ExpenseService expenseService;

    /**
     * Create new expense
     */
    @PostMapping
    @Operation(summary = "Create a new expense")
    public ResponseEntity<ExpenseDto> createExpense(@Valid @RequestBody ExpenseDto expenseDto) {
        ExpenseDto created = expenseService.createExpense(expenseDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Get all expenses with pagination
     */
    @GetMapping
    @Operation(summary = "Get all expenses with pagination")
    public ResponseEntity<Page<ExpenseDto>> getAllExpenses(Pageable pageable) {
        Page<ExpenseDto> expenses = expenseService.getAllExpenses(pageable);
        return ResponseEntity.ok(expenses);
    }

    /**
     * Get all expenses without pagination
     */
    @GetMapping("/all")
    @Operation(summary = "Get all expenses without pagination")
    public ResponseEntity<List<ExpenseDto>> getAllExpensesNoPagination() {
        List<ExpenseDto> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    /**
     * Get expense by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<ExpenseDto> getExpenseById(@PathVariable String id) {
        ExpenseDto expense = expenseService.getExpenseById(id);
        return ResponseEntity.ok(expense);
    }

    /**
     * Update expense
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an expense")
    public ResponseEntity<ExpenseDto> updateExpense(
            @PathVariable String id,
            @Valid @RequestBody ExpenseDto expenseDto) {
        ExpenseDto updated = expenseService.updateExpense(id, expenseDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete expense
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get expenses by category
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Get expenses by category")
    public ResponseEntity<List<ExpenseDto>> getExpensesByCategory(@PathVariable ExpenseCategory category) {
        List<ExpenseDto> expenses = expenseService.getExpensesByCategory(category);
        return ResponseEntity.ok(expenses);
    }

    /**
     * Get expenses by payment method
     */
    @GetMapping("/payment-method/{paymentMethod}")
    @Operation(summary = "Get expenses by payment method")
    public ResponseEntity<List<ExpenseDto>> getExpensesByPaymentMethod(@PathVariable PaymentMethod paymentMethod) {
        List<ExpenseDto> expenses = expenseService.getExpensesByPaymentMethod(paymentMethod);
        return ResponseEntity.ok(expenses);
    }

    /**
     * Get expenses by date
     */
    @GetMapping("/date/{date}")
    @Operation(summary = "Get expenses for a specific date")
    public ResponseEntity<List<ExpenseDto>> getExpensesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ExpenseDto> expenses = expenseService.getExpensesByDate(date);
        return ResponseEntity.ok(expenses);
    }

    /**
     * Get expenses by date range
     */
    @GetMapping("/date-range")
    @Operation(summary = "Get expenses by date range")
    public ResponseEntity<List<ExpenseDto>> getExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) ExpenseCategory category,
            @RequestParam(required = false) PaymentMethod paymentMethod) {

        List<ExpenseDto> expenses;

        if (category != null) {
            expenses = expenseService.getExpensesByDateRangeAndCategory(startDate, endDate, category);
        } else if (paymentMethod != null) {
            expenses = expenseService.getExpensesByDateRangeAndPaymentMethod(startDate, endDate, paymentMethod);
        } else {
            expenses = expenseService.getExpensesByDateRange(startDate, endDate);
        }

        return ResponseEntity.ok(expenses);
    }

    /**
     * Search expenses by description
     */
    @GetMapping("/search")
    @Operation(summary = "Search expenses by description")
    public ResponseEntity<List<ExpenseDto>> searchExpenses(@RequestParam String keyword) {
        List<ExpenseDto> expenses = expenseService.searchExpensesByDescription(keyword);
        return ResponseEntity.ok(expenses);
    }

    /**
     * Get expense summary
     */
    @GetMapping("/summary")
    @Operation(summary = "Get expense summary for a date range")
    public ResponseEntity<Map<String, Object>> getExpenseSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> summary = expenseService.getExpenseSummary(startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}

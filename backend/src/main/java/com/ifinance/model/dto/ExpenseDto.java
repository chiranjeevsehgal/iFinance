package com.ifinance.model.dto;

import com.ifinance.model.document.MiscExpense;
import com.ifinance.model.enums.ExpenseCategory;
import com.ifinance.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for MiscExpense
 * Does not expose userId (obtained from security context)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDto {

    private String id;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Category is required")
    private ExpenseCategory category;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String description;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    // Custom category name when category is OTHER
    private String otherCategoryName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Create DTO from document
     */
    public static ExpenseDto fromDocument(MiscExpense expense) {
        return ExpenseDto.builder()
                .id(expense.getId())
                .date(expense.getDate())
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .description(expense.getDescription())
                .paymentMethod(expense.getPaymentMethod())
                .otherCategoryName(expense.getOtherCategoryName())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }

    /**
     * Convert DTO to document (without userId and timestamps)
     */
    public MiscExpense toDocument() {
        return MiscExpense.builder()
                .id(this.id)
                .date(this.date)
                .category(this.category)
                .amount(this.amount)
                .description(this.description)
                .paymentMethod(this.paymentMethod)
                .otherCategoryName(this.otherCategoryName)
                .build();
    }

    /**
     * Convert DTO to document with userId
     */
    public MiscExpense toDocument(String userId) {
        MiscExpense expense = this.toDocument();
        expense.setUserId(userId);
        return expense;
    }
}

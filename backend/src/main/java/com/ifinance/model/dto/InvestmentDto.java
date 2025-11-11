package com.ifinance.model.dto;

import com.ifinance.model.document.Investment;
import com.ifinance.model.enums.InvestmentCategory;
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
 * DTO for Investment
 * Does not expose userId (obtained from security context)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentDto {

    private String id;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Category is required")
    private InvestmentCategory category;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String description;

    // Custom category name when category is OTHER
    private String otherCategoryName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Create DTO from document
     */
    public static InvestmentDto fromDocument(Investment investment) {
        return InvestmentDto.builder()
                .id(investment.getId())
                .date(investment.getDate())
                .category(investment.getCategory())
                .amount(investment.getAmount())
                .description(investment.getDescription())
                .otherCategoryName(investment.getOtherCategoryName())
                .createdAt(investment.getCreatedAt())
                .updatedAt(investment.getUpdatedAt())
                .build();
    }

    /**
     * Convert DTO to document (without userId and timestamps)
     */
    public Investment toDocument() {
        return Investment.builder()
                .id(this.id)
                .date(this.date)
                .category(this.category)
                .amount(this.amount)
                .description(this.description)
                .otherCategoryName(this.otherCategoryName)
                .build();
    }

    /**
     * Convert DTO to document with userId
     */
    public Investment toDocument(String userId) {
        Investment investment = this.toDocument();
        investment.setUserId(userId);
        return investment;
    }
}

package com.ifinance.model.dto;

import com.ifinance.model.document.TravelRecord;
import com.ifinance.model.enums.TimeOfDay;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for TravelRecord API requests and responses
 * Note: userId is not included as it's automatically set from SecurityContext
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelRecordDto {

    private String id;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Time of day is required")
    private TimeOfDay timeOfDay;

    @NotNull(message = "Cost is required")
    @PositiveOrZero(message = "Cost must be zero or positive")
    private BigDecimal cost;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Convert TravelRecord document to DTO
     */
    public static TravelRecordDto fromDocument(TravelRecord record) {
        return TravelRecordDto.builder()
                .id(record.getId())
                .date(record.getDate())
                .timeOfDay(record.getTimeOfDay())
                .cost(record.getCost())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }

    /**
     * Convert DTO to TravelRecord document
     * Note: userId must be set separately
     */
    public TravelRecord toDocument() {
        return TravelRecord.builder()
                .id(this.id)
                .date(this.date)
                .timeOfDay(this.timeOfDay)
                .cost(this.cost)
                .build();
    }
}

package com.ifinance.model.document;

import com.ifinance.model.enums.TimeOfDay;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Document representing a travel record (commute expense)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "travel_records")
@CompoundIndexes({
    @CompoundIndex(name = "user_date_idx", def = "{'userId': 1, 'date': -1}"),
    @CompoundIndex(name = "user_date_time_idx", def = "{'userId': 1, 'date': -1, 'timeOfDay': 1}")
})
public class TravelRecord {

    @Id
    private String id;

    @NotNull(message = "User ID is required")
    private String userId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Time of day is required")
    private TimeOfDay timeOfDay;

    @NotNull(message = "Cost is required")
    @Positive(message = "Cost must be positive")
    private BigDecimal cost;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

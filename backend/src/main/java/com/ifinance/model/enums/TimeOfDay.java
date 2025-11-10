package com.ifinance.model.enums;

/**
 * Enum representing time of day for travel records
 */
public enum TimeOfDay {
    MORNING("Morning"),
    EVENING("Evening");

    private final String displayName;

    TimeOfDay(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

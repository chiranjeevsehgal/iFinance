package com.ifinance.model.enums;

/**
 * Enum representing payment methods for expenses
 */
public enum PaymentMethod {
    CASH("Cash", "💵"),
    UPI("UPI", "📱"),
    DEBIT_CARD("Debit Card", "💳"),
    CREDIT_CARD("Credit Card", "💳"),
    OTHER("Other", "💰");

    private final String displayName;
    private final String icon;

    PaymentMethod(String displayName, String icon) {
        this.displayName = displayName;
        this.icon = icon;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getIcon() {
        return icon;
    }
}

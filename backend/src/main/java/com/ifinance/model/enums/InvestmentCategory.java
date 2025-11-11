package com.ifinance.model.enums;

/**
 * Investment category enum for categorizing investment and savings records.
 * Each category has a display name and an associated emoji icon.
 */
public enum InvestmentCategory {
    STOCKS("Stocks", "📈"),
    MUTUAL_FUNDS("Mutual Funds", "📊"),
    FIXED_DEPOSIT("Fixed Deposit", "🏦"),
    SAVINGS_ACCOUNT("Savings Account", "💰"),
    GOLD("Gold", "🪙"),
    REAL_ESTATE("Real Estate", "🏠"),
    CRYPTO("Cryptocurrency", "₿"),
    OTHER("Other", "📁");

    private final String displayName;
    private final String icon;

    InvestmentCategory(String displayName, String icon) {
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

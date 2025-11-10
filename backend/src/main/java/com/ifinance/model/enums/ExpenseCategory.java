package com.ifinance.model.enums;

/**
 * Enum representing categories of miscellaneous expenses
 */
public enum ExpenseCategory {
    FOOD("Food", "🍔"),
    GROCERIES("Groceries", "🛒"),
    ENTERTAINMENT("Entertainment", "🎬"),
    HEALTH("Health", "🏥"),
    UTILITIES("Utilities", "💡"),
    SHOPPING("Shopping", "🛍️"),
    EDUCATION("Education", "📚"),
    OTHER("Other", "⚙️");

    private final String displayName;
    private final String icon;

    ExpenseCategory(String displayName, String icon) {
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

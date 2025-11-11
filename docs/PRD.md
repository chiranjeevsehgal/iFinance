# Product Requirements Document (PRD)
## iFinance - Personal Finance Web Application

---

## Document Information
- **Product Name**: iFinance
- **Version**: 1.0.0
- **Last Updated**: November 11, 2025
- **Status**: Active Development - Phase 4 Complete
- **Owner**: Solo Developer
- **Document Type**: Product Requirements Document

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Target Users](#target-users)
4. [Success Metrics](#success-metrics)
5. [Product Scope](#product-scope)
6. [Functional Requirements](#functional-requirements)
7. [Non-Functional Requirements](#non-functional-requirements)
8. [Technical Architecture](#technical-architecture)
9. [User Interface Design](#user-interface-design)
10. [Development Phases](#development-phases)
11. [Future Considerations](#future-considerations)
12. [Assumptions and Constraints](#assumptions-and-constraints)

---

## Executive Summary

**iFinance** is a personal finance management web application designed to help users track daily expenses, travel costs, and investments/savings with minimal complexity. The application focuses on simplicity and ease of use, providing clear insights into spending patterns through comprehensive daily, weekly, and monthly summaries.

### Key Highlights
- **Multi-user application** with Google OAuth2 authentication
- **Minimal glass theme** for modern, clean aesthetics
- **Simple data entry** with cost-focused tracking
- **Investment & savings tracking** across multiple categories
- **Comprehensive reporting** to identify spending patterns
- **Secure user data isolation**
- **Local deployment** with cloud database (MongoDB Atlas)

---

## Product Vision

### Vision Statement
To provide a simple, elegant, and efficient way to track personal finances on a daily basis, enabling better financial awareness and identifying areas of overspending without the complexity of traditional finance management tools.

### Problem Statement
Many personal finance apps are overly complex with features that most users don't need. There's a need for a straightforward application that focuses on:
- Quick daily expense entry
- Simple categorization
- Clear visibility into spending patterns
- Understanding where money is being spent the most
- Secure, personal data with easy authentication

### Solution
A lightweight web application with minimal glass-themed UI that allows:
- Easy sign-in with Google account
- Fast entry of daily travel costs (morning/evening)
- Quick logging of miscellaneous expenses (with credit card as payment method option)
- Investment and savings tracking across multiple categories
- Visual summaries showing spending patterns across different time periods
- Secure, isolated data for each user

---

## Target Users

### Primary User
- **Profile**: Individual users seeking simple expense tracking
- **Use Case**: Personal finance tracking for daily expenses
- **Technical Proficiency**: Any level (Google account required)
- **Device**: Desktop/laptop browser, mobile-friendly
- **Frequency**: Daily usage for expense entry and periodic reviews

### User Characteristics
- Has a Google account for authentication
- Values simplicity and speed over feature richness
- Wants to quickly log expenses throughout the day
- Needs clear visibility into spending patterns
- Prefers minimal, clean interfaces
- Values data privacy and security

---

## Success Metrics

### Primary Success Metrics

1. **Daily Usage**
   - **Goal**: Daily expense logging habit formation
   - **Measurement**: Number of days with at least one entry per week
   - **Target**: 5-7 days per week

2. **Better Tracking**
   - **Goal**: Comprehensive expense coverage
   - **Measurement**: 
     - Percentage of actual expenses logged
     - Number of entries per day
   - **Target**: 80%+ of expenses tracked

3. **Spending Awareness**
   - **Goal**: Identify overspending areas
   - **Measurement**: 
     - Regular use of summary/reports feature
     - Ability to identify top spending categories
   - **Target**: Weekly review of spending patterns

### Secondary Success Metrics

4. **Data Completeness**
   - All expense types covered (travel, misc expenses, investments)
   - Consistent logging without gaps

5. **User Satisfaction**
   - Quick entry time (<30 seconds per expense)
   - Easy navigation between features
   - Clear visual presentation of data

---

## Product Scope

### In Scope (MVP - Phase 1)

#### Core Features (Equal Priority)
1. **User Authentication**
   - Google OAuth2 sign-in
   - Automatic user profile creation
   - Session management
   - Secure logout

2. **Daily Travel Records**
   - Morning and evening travel cost tracking
   - Date-based entry and retrieval
   - Simple cost input
   - User-specific data

3. **Miscellaneous Expenses**
   - Category-based expense tracking
   - Payment method tracking (including credit card)
   - Description field for context
   - User-specific data

4. **Investments & Savings**
   - Multi-category investment tracking (Stocks, Mutual Funds, FDs, Gold, etc.)
   - Date-based organization
   - Description field for notes
   - User-specific data

5. **Summary & Reports**
   - Daily, weekly, and monthly summaries
   - Total calculation across all expense types
   - Visual breakdown by category
   - Spending trend visualization
   - User-specific reports

#### Technical Features
- RESTful API backend with Spring Boot
- OAuth2 Google authentication with Spring Security
- Angular frontend with Tailwind CSS
- MongoDB Atlas database
- Minimal glass-themed UI
- Session-based security
- User data isolation

### Out of Scope (Not in MVP)

#### Explicitly Excluded (As of Now)
- Admin roles and management
- Data sharing between users
- Budget planning and alerts
- Recurring expense automation
- Bill reminders and notifications
- Multi-currency support
- Data export/import functionality
- Mobile native application
- Receipt image upload
- Investment tracking
- Cloud deployment (production)
- Third-party integrations (bank sync, etc.)
- Social features

---

## Functional Requirements

### FR-0: User Authentication & Authorization

#### FR-0.1: Google Sign-In
- **Description**: Users sign in using their Google account
- **Flow**:
  1. User clicks "Sign in with Google" button
  2. Redirected to Google OAuth2 consent screen
  3. After approval, redirected back to app
  4. Session created automatically
- **First-Time Users**: User profile automatically created with Google details
- **Returning Users**: Existing profile loaded, lastLogin updated

#### FR-0.2: User Profile
- **Description**: User profile automatically managed from Google account
- **Fields**:
  - Google ID (unique identifier)
  - Email (from Google)
  - Name (from Google)
  - Profile Picture (from Google)
  - Created At
  - Last Login
- **Profile Display**: Name and profile picture shown in header
- **API Endpoint**: `GET /api/user/me` - Get current user info

#### FR-0.3: Session Management
- **Description**: User session maintained across browser restarts
- **Session Store**: MongoDB-based session persistence
- **Session Timeout**: 7 days of inactivity
- **Logout**: `GET /logout` - Clear session, redirect to login

#### FR-0.4: Data Isolation
- **Description**: Users can only access their own data
- **Implementation**: All API calls automatically filtered by authenticated user ID
- **Security**: No cross-user data access possible
- **Validation**: Backend validates userId from session, never from request

---

### FR-1: Daily Travel Records

#### FR-1.1: Create Travel Record
- **Description**: User can log a travel expense for morning or evening
- **Input Fields**:
  - Date (default: today)
  - Time of Day (dropdown: Morning/Evening)
  - Cost (number input, required)
- **Validation**:
  - Date cannot be future date
  - Cost must be positive number
- **Success Response**: Travel record saved, confirmation message
- **Error Handling**: Display validation errors inline

#### FR-1.2: View Travel Records
- **Description**: User can view list of all travel records
- **Display Fields**: Date, Time of Day, Cost
- **Features**:
  - Sortable by date (newest first by default)
  - Filter by date range
  - Filter by time of day (morning/evening/all)
  - Pagination (20 records per page)
- **Actions**: Edit, Delete for each record

#### FR-1.3: Edit Travel Record
- **Description**: User can modify existing travel record
- **Functionality**: Pre-populate form with existing data, allow changes
- **Validation**: Same as create

#### FR-1.4: Delete Travel Record
- **Description**: User can remove a travel record
- **Confirmation**: Show confirmation dialog before deletion
- **Success**: Record removed, list updated

#### FR-1.5: Travel Summary
- **Description**: View aggregated travel expenses
- **Views**:
  - Today's travel cost
  - This week's travel cost
  - This month's travel cost
  - Breakdown by morning vs evening

---

### FR-2: Miscellaneous Expenses

#### FR-2.1: Create Expense
- **Description**: User can log a miscellaneous expense
- **Input Fields**:
  - Date (default: today)
  - Category (dropdown: Food, Groceries, Entertainment, Health, Utilities, Shopping, Education, Other)
  - Amount (number input, required)
  - Description (text, optional)
  - Payment Method (dropdown: Cash, UPI, Debit Card, Net Banking, Other)
- **Validation**:
  - Date cannot be future date
  - Amount must be positive number
  - Category must be selected
- **Success Response**: Expense saved, confirmation message

#### FR-2.2: View Expenses
- **Description**: User can view list of all miscellaneous expenses
- **Display Fields**: Date, Category (with icon/badge), Amount, Description, Payment Method
- **Features**:
  - Sortable by date, amount, category
  - Filter by:
    - Date range
    - Category (multi-select)
    - Payment method
  - Search by description
  - Pagination (20 records per page)
- **Visual**: Category-wise colored badges

#### FR-2.3: Edit Expense
- **Description**: User can modify existing expense
- **Functionality**: Pre-populate form, allow changes
- **Validation**: Same as create

#### FR-2.4: Delete Expense
- **Description**: User can remove an expense
- **Confirmation**: Show confirmation dialog
- **Success**: Record removed, list updated

#### FR-2.5: Expense Summary
- **Description**: View aggregated miscellaneous expenses
- **Views**:
  - Total by category
  - Total by payment method
  - Daily/weekly/monthly totals
  - Top spending categories

---

### FR-3: Investments & Savings

#### FR-3.1: Create Investment Record
- **Description**: User can log an investment or savings entry
- **Input Fields**:
  - Date (default: today)
  - Category (dropdown: Stocks, Mutual Funds, Fixed Deposit, Savings Account, Gold, Real Estate, Crypto, Other)
  - Custom Category Name (text input, shown when "Other" selected)
  - Amount (number input, required)
  - Description (text area, optional)
- **Validation**:
  - Date cannot be future date
  - Amount must be positive number
  - Category required
  - Custom category name required when "Other" selected (max 50 characters)
  - Description max 500 characters
- **Success Response**: Investment saved, confirmation message

#### FR-3.2: View Investments
- **Description**: User can view list of all investment records
- **Display Fields**: Date, Category, Amount, Description
- **Features**:
  - Sortable by date, amount, category
  - Filter by date range
  - Filter by category
  - Search by description (text search)
  - Pagination (20 records per page)
  - Category badges with icons and colors

#### FR-3.3: Edit Investment
- **Description**: User can modify existing investment record
- **Functionality**: Pre-populate form, allow changes
- **Validation**: Same as create

#### FR-3.4: Delete Investment
- **Description**: User can remove an investment record
- **Confirmation**: Show confirmation dialog
- **Success**: Record removed, list updated

#### FR-3.5: Investment Summary
- **Description**: View aggregated investment data
- **Views**:
  - Daily/weekly/monthly totals
  - Investment count
  - Category-wise breakdown
  - Total investment amount

---

### FR-4: Summary & Reports

#### FR-4.1: Dashboard Overview
- **Description**: Landing page showing financial snapshot
- **Display Components**:
  - Today's total spending (all categories)
  - This week's total spending
  - This month's total spending
  - Quick stats cards (glass effect):
    - Total Travel Cost
    - Total Misc Expenses
    - Total Investments & Savings
    - Grand Total
  - Transaction counts for each category

#### FR-4.2: Daily Summary
- **Description**: Detailed breakdown for a specific day
- **Input**: Date selector (default: today)
- **Display**:
  - Travel costs (morning + evening)
  - Miscellaneous expenses (by category)
  - Investment records
  - Daily total
- **Visualization**: Donut chart showing category distribution

#### FR-4.3: Weekly Summary
- **Description**: Aggregated view for a week
- **Input**: Week selector or start date
- **Display**:
  - Day-by-day breakdown (7 days)
  - Category-wise totals
  - Payment method distribution
  - Weekly total
- **Visualization**: Bar chart showing daily spending

#### FR-4.4: Monthly Summary
- **Description**: Comprehensive monthly financial report
- **Input**: Month and year selector
- **Display**:
  - Weekly breakdown (4-5 weeks)
  - Category-wise totals
  - Top spending days
  - Comparison with previous month
  - Monthly total
- **Visualization**: 
  - Line chart showing spending trend
  - Pie chart for category breakdown

#### FR-4.5: Custom Date Range Report
- **Description**: User-defined date range analysis
- **Input**: Start date and end date selectors
- **Display**:
  - All metrics similar to period summaries
  - Customized based on date range
- **Limitation**: Maximum 90 days range

#### FR-4.6: Category Breakdown
- **Description**: Detailed analysis by expense category
- **Display**:
  - Spending by category (all types)
  - Percentage distribution
  - Category trends over time
  - Top spending categories
- **Visualization**: Horizontal bar chart or pie chart

#### FR-4.7: Spending Trends
- **Description**: Historical spending patterns
- **Input**: Number of months to analyze (default: 6)
- **Display**:
  - Month-over-month comparison
  - Spending trends (increasing/decreasing)
  - Average monthly spending
- **Visualization**: Line chart with trend line

---

## Non-Functional Requirements

### NFR-1: Performance

#### NFR-1.1: Response Time
- API endpoints should respond within 500ms for 95% of requests
- Page load time should be under 2 seconds
- Database queries should be optimized with appropriate indexes

#### NFR-1.2: Data Loading
- Implement pagination for lists (default 20 items per page)
- Use lazy loading for Angular modules
- Skeleton loaders for better perceived performance

### NFR-2: Usability

#### NFR-2.1: User Interface
- Clean, minimal glass-themed design
- Intuitive navigation with clear hierarchy
- Responsive layout (desktop-first, but mobile-friendly)
- Consistent spacing and typography

#### NFR-2.2: Data Entry Speed
- Quick entry forms with sensible defaults
- Tab navigation support
- Auto-focus on primary input fields
- Keyboard shortcuts for common actions

#### NFR-2.3: Error Handling
- Clear, non-technical error messages
- Inline validation feedback
- Confirmation dialogs for destructive actions
- Toast notifications for success/error states

### NFR-3: Reliability

#### NFR-3.1: Data Integrity
- All database operations should be atomic
- Proper validation on both frontend and backend
- Data consistency checks

#### NFR-3.2: Error Recovery
- Graceful error handling (no application crashes)
- Meaningful error messages with recovery suggestions
- Logging of errors for debugging

### NFR-4: Maintainability

#### NFR-4.1: Code Quality
- Follow Java and TypeScript best practices
- Comprehensive inline documentation
- Modular, reusable components
- Clear separation of concerns (MVC pattern)

#### NFR-4.2: Testing
- Unit tests for business logic
- Component tests for Angular components
- Integration tests for API endpoints

### NFR-5: Security

#### NFR-5.1: Authentication
- OAuth2 authentication with Google
- Session-based security with MongoDB session store
- Automatic session renewal on activity
- Secure logout functionality

#### NFR-5.2: Data Protection
- Input validation and sanitization
- Protection against common vulnerabilities (XSS, injection, CSRF)
- HTTPS for production (future consideration)
- User data isolation (users can only see their own data)

#### NFR-5.3: Session Security
- HttpOnly session cookies
- Secure cookie flag in production
- CSRF protection enabled
- Session timeout after 7 days of inactivity

### NFR-6: Scalability

#### NFR-6.1: Data Volume
- Support for 10,000+ records without performance degradation
- Efficient querying with MongoDB indexes
- Pagination for large datasets

#### NFR-6.2: Future Growth
- Architecture supports multiple users
- Modular design for easy feature additions
- Database schema flexible for future fields
- Can add admin roles if needed

### NFR-7: Compatibility

#### NFR-7.1: Browser Support
- Modern browsers (Chrome, Firefox, Edge, Safari - latest 2 versions)
- JavaScript enabled required
- Minimum resolution: 1280x720

#### NFR-7.2: Technology Versions
- Java 21
- Angular 20
- Node 22
- Spring Boot 3.x
- MongoDB 6.x+

---

## Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│                  (Angular 20 + Tailwind CSS)            │
│                  "Sign in with Google" Button           │
└──────────────────────┬──────────────────────────────────┘
                       │ 1. OAuth2 Login
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Google OAuth2 Server                        │
│         (Handles Authentication)                         │
└──────────────────────┬──────────────────────────────────┘
                       │ 2. Auth Token
                       ▼
┌──────────────────────▼──────────────────────────────────┐
│              Spring Boot Application                     │
│                  (Java 21, Port 8080)                    │
│  ┌────────────────────────────────────────────────┐    │
│  │  Security Layer (OAuth2 + Session Management)  │    │
│  └────────────────┬───────────────────────────────┘    │
│  ┌────────────────▼───────────────────────────────┐    │
│  │  Controllers (REST API Endpoints)              │    │
│  └────────────────┬───────────────────────────────┘    │
│  ┌────────────────▼───────────────────────────────┐    │
│  │  Services (Business Logic + User Filtering)    │    │
│  └────────────────┬───────────────────────────────┘    │
│  ┌────────────────▼───────────────────────────────┐    │
│  │  Repositories (Data Access Layer)              │    │
│  └────────────────┬───────────────────────────────┘    │
└───────────────────┼─────────────────────────────────────┘
                    │ MongoDB Driver
┌───────────────────▼─────────────────────────────────────┐
│              MongoDB Atlas (Cloud)                       │
│         Collections: users, sessions,                    │
│         travel_records, misc_expenses,                   │
│         investments                                      │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Backend Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Spring Boot | 3.x | Application framework |
| Language | Java | 21 | Programming language |
| Build Tool | Maven | Latest | Dependency management |
| Database | MongoDB Atlas | 6.x+ | NoSQL database (cloud) |
| ODM | Spring Data MongoDB | Latest | Database operations |
| Security | Spring Security | Latest | Authentication & Authorization |
| OAuth2 | OAuth2 Client | Latest | Google authentication |
| Session Store | Spring Session MongoDB | Latest | Session persistence |
| Validation | Jakarta Bean Validation | Latest | Input validation |
| API Docs | SpringDoc OpenAPI | Latest | API documentation |

#### Frontend Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Angular | 20 | Frontend framework |
| Runtime | Node.js | 22 | JavaScript runtime |
| Styling | Tailwind CSS | Latest | Utility-first CSS |
| HTTP Client | Angular HttpClient | Built-in | API communication |
| Forms | Reactive Forms | Built-in | Form handling |
| State | RxJS | Built-in | Reactive programming |
| Charts | Chart.js / ng2-charts | Latest | Data visualization |
| Date Handling | date-fns | Latest | Date manipulation |

### Backend Structure

```
src/main/java/com/ifinance/
├── IFinanceApplication.java          # Main application class
├── config/
│   ├── MongoConfig.java              # MongoDB configuration
│   ├── SecurityConfig.java           # Spring Security & OAuth2 configuration
│   ├── CorsConfig.java               # CORS configuration
│   └── OpenApiConfig.java            # Swagger configuration
├── security/
│   ├── OAuth2LoginSuccessHandler.java # OAuth2 login success handler
│   ├── OAuth2UserService.java        # Custom OAuth2 user service
│   └── CustomUserPrincipal.java      # User principal with session details
├── controller/
│   ├── AuthController.java           # Authentication endpoints
│   ├── UserController.java           # User profile endpoints
│   ├── TravelController.java         # Travel records API
│   ├── ExpenseController.java        # Misc expenses API
│   ├── InvestmentController.java     # Investments & savings API
│   └── ReportController.java         # Reports and summaries API
├── service/
│   ├── UserService.java              # User management logic
│   ├── TravelService.java            # Travel business logic
│   ├── ExpenseService.java           # Expense business logic
│   ├── InvestmentService.java        # Investment business logic
│   └── ReportService.java            # Report generation logic
├── repository/
│   ├── UserRepository.java           # User data access
│   ├── TravelRepository.java         # Travel data access
│   ├── ExpenseRepository.java        # Expense data access
│   └── InvestmentRepository.java     # Investment data access
├── model/
│   ├── document/
│   │   ├── User.java                 # User document
│   │   ├── TravelRecord.java         # Travel document
│   │   ├── MiscExpense.java          # Expense document
│   │   └── Investment.java           # Investment document
│   ├── dto/
│   │   ├── UserDto.java              # User DTO
│   │   ├── TravelRecordDto.java      # Travel DTO
│   │   ├── ExpenseDto.java           # Expense DTO
│   │   ├── InvestmentDto.java        # Investment DTO
│   │   └── SummaryDto.java           # Summary response DTO
│   └── enums/
│       ├── TimeOfDay.java            # MORNING, EVENING
│       ├── ExpenseCategory.java      # Expense categories
│       ├── PaymentMethod.java        # Payment methods
│       └── InvestmentCategory.java   # Investment categories
├── exception/
│   ├── ResourceNotFoundException.java # Custom exception
│   ├── UnauthorizedException.java    # Unauthorized access exception
│   ├── ValidationException.java      # Validation exception
│   └── GlobalExceptionHandler.java   # Global error handler
└── util/
    ├── DateUtil.java                 # Date utility methods
    ├── ValidationUtil.java           # Validation helpers
    └── SecurityUtil.java             # Security utility methods
```

### Frontend Structure

```
src/app/
├── app.component.ts                  # Root component
├── app.routes.ts                     # Route configuration
├── core/
│   ├── services/
│   │   ├── auth.service.ts           # Authentication service
│   │   ├── api.service.ts            # Base API service
│   │   ├── user.service.ts           # User profile service
│   │   ├── travel.service.ts         # Travel API service
│   │   ├── expense.service.ts        # Expense API service
│   │   ├── investment.service.ts     # Investment API service
│   │   └── report.service.ts         # Report API service
│   ├── guards/
│   │   └── auth.guard.ts             # Route authentication guard
│   ├── models/
│   │   ├── user.model.ts             # User interface
│   │   ├── travel-record.model.ts    # Travel interface
│   │   ├── expense.model.ts          # Expense interface
│   │   ├── investment.model.ts       # Investment interface
│   │   └── summary.model.ts          # Summary interface
│   └── interceptors/
│       ├── http-error.interceptor.ts # Error handling
│       ├── loading.interceptor.ts    # Loading state
│       └── credentials.interceptor.ts # Add credentials to requests
├── shared/
│   ├── components/
│   │   ├── glass-card/               # Reusable glass card
│   │   ├── date-picker/              # Custom date picker
│   │   ├── loading-spinner/          # Loading indicator
│   │   └── confirmation-dialog/      # Confirmation modal
│   ├── directives/
│   │   └── currency-input.directive.ts # Currency formatting
│   └── pipes/
│       ├── currency.pipe.ts          # Custom currency pipe
│       └── date-format.pipe.ts       # Date formatting pipe
├── auth/
│   ├── login/                        # Login page component
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.css
│   └── callback/                     # OAuth callback handler
├── features/
│   ├── dashboard/
│   │   ├── dashboard.component.ts    # Main dashboard
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.css
│   ├── travel/
│   │   ├── travel-list/              # Travel records list
│   │   ├── travel-form/              # Travel entry form
│   │   └── travel.component.ts       # Travel parent
│   ├── expenses/
│   │   ├── expense-list/             # Expense list
│   │   ├── expense-form/             # Expense entry form
│   │   └── expenses.component.ts     # Expenses parent
│   ├── investments/
│   │   ├── investment-list/          # Investment list
│   │   ├── investment-form/          # Investment form
│   │   └── investment.component.ts   # Investments parent
│   └── reports/
│       ├── daily-report/             # Daily summary
│       ├── weekly-report/            # Weekly summary
│       ├── monthly-report/           # Monthly summary
│       ├── category-breakdown/       # Category analysis
│       └── reports.component.ts      # Reports parent
└── layout/
    ├── header/                       # Top navigation with user profile
    ├── sidebar/                      # Side navigation
    └── footer/                       # Footer (optional)
```

### Database Schema

#### Collection: users
```json
{
  "_id": ObjectId("..."),
  "googleId": "1234567890",           // Google OAuth ID (unique)
  "email": "user@example.com",        // Email from Google (unique)
  "name": "John Doe",                 // Full name from Google
  "profilePicture": "https://...",    // Profile picture URL from Google
  "createdAt": ISODate("2025-11-10T10:00:00Z"),
  "lastLogin": ISODate("2025-11-10T10:00:00Z"),
  "updatedAt": ISODate("2025-11-10T10:00:00Z")
}
```
**Indexes:**
- `{ googleId: 1 }` - Unique index for Google ID lookup
- `{ email: 1 }` - Unique index for email lookup

#### Collection: travel_records
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),          // Reference to users collection (required)
  "date": ISODate("2025-11-10T00:00:00Z"),
  "timeOfDay": "MORNING",              // MORNING | EVENING
  "cost": 50.00,
  "createdAt": ISODate("2025-11-10T08:30:00Z"),
  "updatedAt": ISODate("2025-11-10T08:30:00Z")
}
```
**Indexes:**
- `{ userId: 1, date: -1 }` - Compound index for user-specific date queries
- `{ userId: 1, date: 1, timeOfDay: 1 }` - For specific time queries
- `{ createdAt: -1 }` - For sorting by creation time

#### Collection: misc_expenses
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),          // Reference to users collection (required)
  "date": ISODate("2025-11-10T00:00:00Z"),
  "category": "FOOD",                  // FOOD | GROCERIES | ENTERTAINMENT | HEALTH | UTILITIES | SHOPPING | EDUCATION | OTHER
  "amount": 250.00,
  "description": "Lunch at restaurant",
  "paymentMethod": "UPI",              // CASH | UPI | DEBIT_CARD | NET_BANKING | OTHER
  "createdAt": ISODate("2025-11-10T13:00:00Z"),
  "updatedAt": ISODate("2025-11-10T13:00:00Z")
}
```
**Indexes:**
- `{ userId: 1, date: -1 }` - Compound index for user-specific date queries
- `{ userId: 1, category: 1 }` - For category filtering
- `{ createdAt: -1 }` - For sorting

#### Collection: investments
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),          // Reference to User
  "date": ISODate("2025-11-10T00:00:00Z"),
  "category": "STOCKS",               // STOCKS, MUTUAL_FUNDS, FIXED_DEPOSIT, SAVINGS_ACCOUNT, GOLD, REAL_ESTATE, CRYPTO, OTHER
  "amount": 10000.00,
  "description": "Monthly SIP in mutual fund",
  "otherCategoryName": null,          // Custom category name when category is OTHER
  "createdAt": ISODate("2025-11-10T15:00:00Z"),
  "updatedAt": ISODate("2025-11-10T15:00:00Z")
}
```
**Indexes:**
- `{ userId: 1, date: -1 }` - Compound index for user-specific date queries
- `{ userId: 1, category: 1 }` - Compound index for category filtering
- Text index on `description` - For search within user's data
- `{ createdAt: -1 }` - For sorting

#### Collection: sessions (Spring Session)
```json
{
  "_id": String,                      // Session ID
  "sessionData": Binary,              // Serialized session data
  "expireAt": ISODate("...")          // TTL for automatic cleanup
}
```
**Indexes:**
- `{ expireAt: 1 }` - TTL index for automatic session cleanup

### API Endpoints

**Note:** All endpoints except authentication endpoints require user to be authenticated. All data endpoints automatically filter by the authenticated user's ID.

#### Authentication API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/oauth2/authorization/google` | Initiate Google OAuth2 login flow |
| GET | `/login/oauth2/code/google` | OAuth2 callback (handled by Spring Security) |
| POST | `/api/auth/logout` | Logout and invalidate session |
| GET | `/api/user/me` | Get current authenticated user profile |
| PUT | `/api/user/me` | Update user profile (name, preferences) |

#### Travel Records API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/travel` | Create travel record (auto-adds userId) |
| GET | `/api/travel` | Get all travel records for current user (paginated) |
| GET | `/api/travel/{id}` | Get specific travel record (must belong to user) |
| PUT | `/api/travel/{id}` | Update travel record (must belong to user) |
| DELETE | `/api/travel/{id}` | Delete travel record (must belong to user) |
| GET | `/api/travel/date/{date}` | Get records by date for current user |
| GET | `/api/travel/summary?period={period}` | Get travel summary for current user |

#### Miscellaneous Expenses API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Create expense (auto-adds userId) |
| GET | `/api/expenses` | Get all expenses for current user (paginated) |
| GET | `/api/expenses/{id}` | Get specific expense (must belong to user) |
| PUT | `/api/expenses/{id}` | Update expense (must belong to user) |
| DELETE | `/api/expenses/{id}` | Delete expense (must belong to user) |
| GET | `/api/expenses/category/{category}` | Get by category for current user |
| GET | `/api/expenses/summary?period={period}` | Get expense summary for current user |

#### Investments & Savings API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/investments` | Create investment (auto-adds userId) |
| GET | `/api/investments` | Get all investments for current user (paginated) |
| GET | `/api/investments/{id}` | Get specific investment (must belong to user) |
| PUT | `/api/investments/{id}` | Update investment (must belong to user) |
| DELETE | `/api/investments/{id}` | Delete investment (must belong to user) |
| GET | `/api/investments/category/{category}` | Get by category for current user |
| GET | `/api/investments/summary?period={period}` | Get investment summary for current user |

#### Reports API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/daily?date={date}` | Daily summary for current user |
| GET | `/api/reports/weekly?startDate={date}` | Weekly summary for current user |
| GET | `/api/reports/monthly?year={year}&month={month}` | Monthly summary for current user |
| GET | `/api/reports/custom?startDate={date}&endDate={date}` | Custom date range for current user |
| GET | `/api/reports/category-breakdown?period={period}` | Category analysis for current user |
| GET | `/api/reports/trends?months={count}` | Spending trends for current user |

### Security Considerations

#### Authentication & Authorization
- **OAuth2 with Google**: Secure authentication using Google Sign-In
- **Session Management**: HTTP sessions stored in MongoDB with automatic expiration
- **User Isolation**: All data operations automatically filtered by authenticated user ID
- **Route Protection**: All `/api/**` endpoints require authentication
- **Public Routes**: `/`, `/login`, `/oauth2/**` (OAuth callback URLs)

#### Data Security
- **Input Validation**: Jakarta Bean Validation on all endpoints
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Enabled for state-changing operations
- **Secure Cookies**: HttpOnly and Secure flags for session cookies
- **MongoDB Security**: Connection string in environment variables
- **User Data Isolation**: Service layer enforces userId filtering

#### Session Security
- **Session Store**: MongoDB-based persistent sessions
- **Session Timeout**: 7 days of inactivity
- **Automatic Renewal**: Session extended on user activity
- **Logout**: Complete session invalidation on logout
- **Concurrent Sessions**: Multiple devices supported

#### Future Enhancements
- **HTTPS**: SSL/TLS for production deployment
- **Rate Limiting**: API throttling to prevent abuse
- **Audit Logging**: Track user actions for security monitoring
- **Two-Factor Authentication**: Optional 2FA for enhanced security
- **Account Recovery**: Email-based account recovery flow

---

## User Interface Design

### Design Philosophy: Minimal Glass Theme (Glassmorphism)

#### Visual Principles
1. **Clean & Minimal**: Lots of white space, uncluttered layouts
2. **Glass Effect**: Frosted glass appearance with backdrop blur
3. **Soft Colors**: Gentle gradients, semi-transparent backgrounds
4. **Subtle Animations**: Smooth transitions, no jarring movements
5. **Typography**: Light/thin fonts, clear hierarchy
6. **Iconography**: Minimalist icons (Heroicons or Lucide)

#### Color Palette

**Background:**
```css
bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50
```

**Glass Containers:**
```css
bg-white/30 backdrop-blur-lg border border-white/50 shadow-xl
```

**Text Colors:**
- Primary: `text-gray-900`
- Secondary: `text-gray-600`
- Muted: `text-gray-400`

**Accent Colors (Minimal Use):**
- Success/Income: `green-500/70` - Soft green with transparency
- Expense/Warning: `rose-500/70` - Soft rose/pink with transparency
- Highlight: `purple-500/70` or `indigo-500/70` - Soft purple/indigo
- Neutral: `gray-400/70` - Soft gray for borders

**Interactive Elements:**
- Primary Button: `bg-white/40 hover:bg-white/60 backdrop-blur-md`
- Secondary Button: `bg-gray-100/40 hover:bg-gray-100/60 backdrop-blur-md`
- Input Fields: `bg-white/20 backdrop-blur-md border border-white/40 focus:bg-white/30 focus:border-white/60`

#### Component Design Standards

**Glass Card:**
```html
<div class="bg-white/30 backdrop-blur-lg rounded-2xl border border-white/50 shadow-xl p-6">
  <!-- Card content -->
</div>
```

**Glass Input:**
```html
<input class="bg-white/20 backdrop-blur-md border border-white/40 rounded-lg px-4 py-2
              focus:bg-white/30 focus:border-white/60 transition-all outline-none" />
```

**Glass Button:**
```html
<button class="bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-lg px-6 py-2
               border border-white/50 transition-all duration-300">
  Button Text
</button>
```

### Page Layouts

#### Dashboard Layout
```
┌───────────────────────────────────────────────────────┐
│  Header (Glass)                    [Date: Today ▼]    │
├───────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │  Travel     │ │  Expenses   │ │ Investments │    │
│  │  ₹ 150.00   │ │  ₹ 500.00   │ │  ₹10,000.00  │    │
│  │  Glass Card │ │  Glass Card │ │  Glass Card  │    │
│  └─────────────┘ └─────────────┘ └─────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Today's Total: ₹ 10,650.00 (Glass Card)     │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Recent Transactions (Glass Card)             │    │
│  │  • Morning Travel - ₹50                       │    │
│  │  • Lunch (Food) - ₹200                        │    │
│  │  • Monthly SIP (Mutual Funds) - ₹10,000      │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Category Breakdown (Donut Chart)             │    │
│  │  [Chart with glass background]                │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└───────────────────────────────────────────────────────┘
```

#### Travel Records Page
```
┌───────────────────────────────────────────────────────┐
│  Travel Records                      [+ Add New]       │
├───────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Quick Entry Form (Glass Card)                │    │
│  │  Date: [________] Time: [Morning ▼] Cost: [__]│    │
│  │                                     [Save]     │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Filters: [Date Range] [Time of Day ▼]               │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Date         │ Time    │ Cost    │ Actions   │    │
│  ├──────────────────────────────────────────────┤    │
│  │  2025-11-10   │ Morning │ ₹ 50    │ ✏️ 🗑️     │    │
│  │  2025-11-10   │ Evening │ ₹ 100   │ ✏️ 🗑️     │    │
│  │  2025-11-09   │ Morning │ ₹ 50    │ ✏️ 🗑️     │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  [< Previous] Page 1 of 5 [Next >]                    │
│                                                        │
└───────────────────────────────────────────────────────┘
```

#### Expenses Page
```
┌───────────────────────────────────────────────────────┐
│  Miscellaneous Expenses               [+ Add New]      │
├───────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Quick Entry Form (Glass Card)                │    │
│  │  Date: [________]                             │    │
│  │  Category: [Food ▼]  Amount: [______]         │    │
│  │  Payment: [UPI ▼]    Description: [_______]   │    │
│  │                                     [Save]     │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Filters: [Date Range] [Category ▼] [Payment ▼]      │
│  Search: [_____________________________]              │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Date      │ Category │ Amount │ Payment │...│    │
│  ├──────────────────────────────────────────────┤    │
│  │ 2025-11-10 │ 🍔 Food  │ ₹200   │ UPI     │...│    │
│  │ 2025-11-10 │ 🎬 Ent.  │ ₹500   │ Card    │...│    │
│  │ 2025-11-09 │ 🛒 Groc. │ ₹800   │ Cash    │...│    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└───────────────────────────────────────────────────────┘
```

#### Investments & Savings Page
```
┌───────────────────────────────────────────────────────┐
│  Investments & Savings                 [+ Add New]     │
├───────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Quick Entry Form (Glass Card)                │    │
│  │  Date: [________]                             │    │
│  │  Category: [Stocks ▼]                         │    │
│  │  Amount: [____________]                       │    │
│  │  Description: [___________________] [Save]    │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Filters: [Date Range] [Category ▼]                   │
│  Search: [_____________________________]              │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Date        │ Category      │ Amount    │... │    │
│  ├──────────────────────────────────────────────┤    │
│  │  2025-11-10  │ 📈 Stocks     │ ₹5,000   │... │    │
│  │  2025-11-08  │ 📊 Mutual Fnd │ ₹10,000  │... │    │
│  │  2025-11-05  │ 🏦 Fixed Dep. │ ₹50,000  │... │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└───────────────────────────────────────────────────────┘
```

#### Reports Page
```
┌───────────────────────────────────────────────────────┐
│  Financial Reports                                     │
├───────────────────────────────────────────────────────┤
│                                                        │
│  Period: [Daily ▼] [Weekly ▼] [Monthly ▼] [Custom]   │
│  Date: [2025-11-10 ▼]                                 │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Summary (Glass Card)                         │    │
│  │  Period: Daily - November 10, 2025            │    │
│  │                                               │    │
│  │  Travel:           ₹     150.00  (2 trips)    │    │
│  │  Misc Expenses:    ₹     500.00  (3 entries)  │    │
│  │  Investments:      ₹  10,000.00  (1 entry)    │    │
│  │  ───────────────────────────────────────────  │    │
│  │  Grand Total:      ₹  10,650.00               │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Category Breakdown (Glass Card)              │    │
│  │  [Donut Chart showing expense distribution]   │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Spending Trends (Glass Card)                 │    │
│  │  [Line chart showing last 7 days/weeks/months]│    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└───────────────────────────────────────────────────────┘
```

### UI Components Library

#### Reusable Components
1. **Glass Card**: Base container for all sections
2. **Date Picker**: Custom styled date input with calendar
3. **Dropdown Select**: Glass-themed select with smooth transitions
4. **Text Input**: Glass input field with focus states
5. **Number Input**: Currency-formatted number input
6. **Button**: Primary, secondary, danger variants with glass effect
7. **Loading Spinner**: Glass-themed loading indicator
8. **Toast Notification**: Glass notification with auto-dismiss
9. **Confirmation Dialog**: Glass modal for confirmations
10. **Pagination**: Glass-styled page navigation
11. **Empty State**: Message when no data available
12. **Error State**: Friendly error message display

#### Chart Components
1. **Donut Chart**: Category breakdown visualization
2. **Bar Chart**: Daily/weekly comparison
3. **Line Chart**: Trend analysis over time
4. **Horizontal Bar**: Top categories ranking

---

## Development Phases

### Phase 1: Project Setup, Authentication & Backend Foundation
**Goal**: Set up development environment, implement Google OAuth2 authentication, and create backend structure

**Tasks**:
1. **Project Initialization**
   - Create Spring Boot project with Maven (Spring Security, OAuth2 Client, Spring Data MongoDB dependencies)
   - Set up MongoDB Atlas database
   - Configure application.yml with database connection and OAuth2 settings
   - Create Angular project with Tailwind CSS
   - Configure CORS and API base URL

2. **Google OAuth2 Setup**
   - Create Google Cloud Platform project
   - Configure OAuth2 credentials (Client ID and Secret)
   - Set up authorized redirect URIs
   - Add environment variables for OAuth2 credentials
   - Configure Spring Security with OAuth2 login

3. **Authentication Implementation (Backend)**
   - Create `User` document class with Google OAuth fields
   - Create `UserRepository` interface
   - Implement `UserService` for user management
   - Configure `SecurityConfig` with OAuth2 and session management
   - Create `OAuth2LoginSuccessHandler` for login success
   - Create `OAuth2UserService` for user creation/update
   - Implement `AuthController` with logout endpoint
   - Implement `UserController` with profile endpoints
   - Configure MongoDB session store (spring-session-data-mongodb)
   - Set up security filters and CSRF protection

4. **Backend Base Setup**
   - Set up project structure (packages including security/)
   - Create base document classes with Lombok and userId field
   - Set up MongoDB repositories with user-filtering queries
   - Configure global exception handling (including UnauthorizedException)
   - Set up SpringDoc OpenAPI (Swagger) with security schemes
   - Create utility classes (SecurityUtil for getting current user)

5. **Authentication Implementation (Frontend)**
   - Create `AuthService` for authentication state management
   - Create `UserService` for user profile operations
   - Implement login page component with "Sign in with Google" button
   - Create `AuthGuard` to protect routes
   - Create `CredentialsInterceptor` to include credentials in requests
   - Implement user profile display in header
   - Handle OAuth2 callback and session management

6. **Frontend Base Setup**
   - Configure Tailwind with custom glass theme
   - Set up routing structure with auth guards
   - Create layout components (header with user profile, sidebar)
   - Set up HTTP interceptors (credentials, errors, loading)
   - Create base services
   - Define TypeScript interfaces (including User model)

**Deliverables**:
- ✅ Running Spring Boot application with OAuth2
- ✅ Google Sign-In working end-to-end
- ✅ User registration and profile management
- ✅ MongoDB Atlas connection with session store
- ✅ Angular app with authentication flow
- ✅ Protected routes and auth guards
- ✅ Tailwind configured with glass theme
- ✅ Swagger UI accessible with security
- ✅ User profile display in header

---

### Phase 2: Travel Records Feature
**Goal**: Implement complete travel records functionality with user isolation

**Backend Tasks**:
1. Create `TravelRecord` document class with `userId` field
2. Create `TravelRepository` interface with user-filtered queries
3. Implement `TravelService` with CRUD operations (auto-add userId, filter by userId)
4. Create `TravelController` with REST endpoints (extract userId from SecurityContext)
5. Add validation for travel records
6. Implement summary calculation logic (user-specific)
7. Write unit tests with mock authentication

**Frontend Tasks**:
1. Create travel module with routing (protected by AuthGuard)
2. Implement travel list component with glass styling
3. Create travel form component (create/edit)
4. Implement date picker and time-of-day selector
5. Add filter and search functionality
6. Create travel service for API calls (with credentials)
7. Add pagination
8. Implement edit and delete with confirmation
9. Show loading and error states
10. Handle authentication errors (redirect to login)

**Deliverables**:
- ✅ Complete travel records CRUD for authenticated users
- ✅ User-specific data isolation
- ✅ Glass-themed UI for travel tracking
- ✅ Date-based filtering
- ✅ Summary calculations per user
- ✅ Tested and working feature

---

### Phase 3: Miscellaneous Expenses Feature
**Goal**: Implement complete expense tracking functionality with user isolation

**Backend Tasks**:
1. Create `MiscExpense` document class with `userId` field
2. Create enums for categories and payment methods
3. Create `ExpenseRepository` interface with user-filtered queries
4. Implement `ExpenseService` with CRUD operations (auto-add userId, filter by userId)
5. Create `ExpenseController` with REST endpoints (extract userId from SecurityContext)
6. Add validation and business logic
7. Implement category-based filtering (user-specific)
8. Write unit tests with mock authentication

**Frontend Tasks**:
1. Create expenses module with routing (protected by AuthGuard)
2. Implement expense list component with glass styling
3. Create expense form component (create/edit)
4. Implement category dropdown with icons/badges
5. Add payment method selector
6. Implement multi-filter functionality (category, payment, date)
7. Add search by description
8. Create visual category indicators
9. Add pagination
10. Implement edit and delete with confirmation
11. Handle authentication errors (redirect to login)

**Deliverables**:
- ✅ Complete expense tracking CRUD for authenticated users
- ✅ User-specific data isolation
- ✅ Category-wise organization with visual indicators
- ✅ Payment method tracking (including credit card)
- ✅ Advanced filtering and search
- ✅ Tested and working feature

---

### Phase 4: Investments & Savings Feature
**Goal**: Implement investment and savings tracking with user isolation

**Backend Tasks**:
1. Create `InvestmentCategory` enum with 8 categories
2. Create `Investment` document class with `userId` field
3. Create `InvestmentRepository` interface with user-filtered queries
4. Implement text index for description search (user-scoped)
5. Implement `InvestmentService` with CRUD operations (auto-add userId, filter by userId)
6. Create `InvestmentController` with REST endpoints (extract userId from SecurityContext)
7. Add validation (including custom category name when OTHER selected)
8. Write unit tests with mock authentication

**Frontend Tasks**:
1. Create investment module with routing (protected by AuthGuard)
2. Implement investment list component with glass styling
3. Create investment form component (create/edit)
4. Implement category dropdown with 8 categories and icons
5. Add conditional "Other Category Name" field
6. Implement search functionality for descriptions
7. Add date and category filtering
8. Add pagination
9. Implement edit and delete with confirmation
10. Show investment summary with category breakdown (user-specific)
11. Handle authentication errors (redirect to login)

**Deliverables**:
- ✅ Complete investment tracking CRUD for authenticated users
- ✅ User-specific data isolation
- ✅ Multi-category support with custom categories
- ✅ Search and filtering functionality
- ✅ Simple, fast entry form
- ✅ Tested and working feature

---

### Phase 5: Dashboard & Summary Feature
**Goal**: Create main dashboard with financial overview per user

**Backend Tasks**:
1. Create `ReportService` with aggregation logic (user-filtered)
2. Implement daily summary calculation (per user)
3. Implement weekly summary calculation (per user)
4. Implement monthly summary calculation (per user)
5. Create category breakdown logic (user-specific data)
6. Create `ReportController` with summary endpoints (extract userId from SecurityContext)
7. Optimize queries with aggregation pipeline
8. Write unit tests with mock authentication

**Frontend Tasks**:
1. Create dashboard component with glass styling (protected by AuthGuard)
2. Implement summary cards (travel, expenses, investments, total) for current user
3. Add period selector (daily/weekly/monthly)
4. Show recent transactions list (user-specific)
5. Display transaction counts
6. Add quick navigation to detail pages
7. Implement auto-refresh (optional)
8. Show loading states
9. Display user name/profile picture in header

**Deliverables**:
- ✅ Comprehensive dashboard per user
- ✅ Real-time financial snapshot for logged-in user
- ✅ Period-based summaries
- ✅ Quick access to details
- ✅ Clean, minimal glass UI

---

### Phase 6: Reports & Analytics
**Goal**: Build comprehensive reporting and visualization per user

**Backend Tasks**:
1. Implement custom date range reports (user-filtered)
2. Create category breakdown endpoint (per user)
3. Implement spending trends calculation (user-specific)
4. Add comparison logic (month-over-month per user)
5. Optimize report queries with proper indexes
6. Write unit tests with mock authentication

**Frontend Tasks**:
1. Create reports module with routing (protected by AuthGuard)
2. Implement daily report view (user-specific data)
3. Implement weekly report view (user-specific data)
4. Implement monthly report view (user-specific data)
5. Create custom date range selector
6. Integrate Chart.js for visualizations:
   - Donut chart for category breakdown (user data)
   - Bar chart for daily/weekly comparison (user data)
   - Line chart for trends (user data)
7. Add export functionality (optional - user's data only)
8. Style all reports with glass theme
9. Add drill-down capability (to user's transactions)
10. Handle authentication errors (redirect to login)

**Deliverables**:
- ✅ Complete reporting suite for authenticated users
- ✅ Visual charts and graphs (user-specific data)
- ✅ Multiple time period views
- ✅ Category-wise analysis
- ✅ Spending trends visualization
- ✅ Tested and working feature

---

### Phase 7: Polish & Optimization
**Goal**: Refine UI/UX, optimize performance, fix bugs, ensure security

**Tasks**:
1. **UI/UX Refinement**
   - Fine-tune glass theme across all pages
   - Ensure consistency in spacing and typography
   - Improve responsive behavior
   - Add smooth transitions and animations
   - Enhance loading states
   - Polish toast notifications
   - Improve user profile display and menu

2. **Performance Optimization**
   - Verify MongoDB indexes for user-filtered queries
   - Optimize aggregation queries with userId filtering
   - Implement lazy loading for Angular modules
   - Minimize bundle size
   - Add caching where appropriate (with user context)
   - Optimize session management

3. **Security Hardening**
   - Test authentication flows thoroughly
   - Verify data isolation between users
   - Test session timeout and renewal
   - Validate CSRF protection
   - Test logout and session cleanup
   - Verify no cross-user data leakage

4. **Error Handling**
   - Improve error messages (auth-specific errors)
   - Add better validation feedback
   - Handle edge cases (expired sessions, concurrent logins)
   - Add proper logging (with user context for debugging)

5. **Testing**
   - Write comprehensive unit tests (with mock users)
   - Perform integration testing (multi-user scenarios)
   - Manual testing of all features (different users)
   - Test authentication edge cases
   - Fix identified bugs

6. **Documentation**
   - Add code comments
   - Update API documentation (security schemes)
   - Create user guide (including sign-in instructions)
   - Document setup instructions (OAuth2 setup, environment variables)

**Deliverables**:
- ✅ Polished, production-ready UI
- ✅ Optimized performance
- ✅ Secure multi-user system
- ✅ Comprehensive error handling
- ✅ Bug-free application
- ✅ Well-documented codebase

---

### Phase 8: Deployment & Production Readiness
**Goal**: Deploy application and ensure production readiness

**Tasks**:
1. **Environment Configuration**
   - Set up production MongoDB Atlas cluster
   - Configure production OAuth2 credentials
   - Set environment variables securely
   - Configure HTTPS and secure cookies
   - Set up proper CORS for production domain

2. **Backend Deployment**
   - Choose hosting platform (e.g., Heroku, AWS, Azure, Railway)
   - Configure production application.yml
   - Set up CI/CD pipeline (optional)
   - Configure logging and monitoring
   - Set up health checks

3. **Frontend Deployment**
   - Build production bundle (`ng build --configuration production`)
   - Choose hosting platform (e.g., Vercel, Netlify, Firebase Hosting)
   - Configure environment URLs for production
   - Set up SSL/TLS
   - Configure cache headers

4. **Security & Monitoring**
   - Enable HTTPS everywhere
   - Configure secure session cookies
   - Set up application monitoring (optional)
   - Configure error tracking (optional)
   - Test authentication in production

5. **Testing & Validation**
   - Test complete user flows in production
   - Verify OAuth2 login works
   - Test data isolation between users
   - Verify session persistence
   - Test on multiple browsers

**Deliverables**:
- ✅ Deployed application accessible via URL
- ✅ Secure HTTPS connection
- ✅ Working Google OAuth2 authentication
- ✅ Production-ready MongoDB setup
- ✅ Monitoring and logging configured
- ✅ Tested and validated in production

---

## Future Considerations

### Post-MVP Enhancements

#### Advanced Authentication Features
- **Two-Factor Authentication**: Optional 2FA for enhanced security
- **Email Verification**: Email confirmation for new users
- **Account Recovery**: Email-based password reset (if adding local auth)
- **Additional OAuth Providers**: Microsoft, Facebook, GitHub login options

#### Enhanced User Management
- **User Preferences**: Theme customization, currency preferences
- **Profile Updates**: Allow users to update name, profile picture
- **Account Deletion**: Self-service account deletion
- **Data Export**: Download all personal data (GDPR compliance)

#### Advanced Budgeting
- **Feature**: Set monthly budgets by category
- **Alerts**: Notification when approaching budget limit
- **Visualization**: Budget vs actual spending comparison
- **Budget Templates**: Pre-defined budget templates

#### Recurring Expenses
- **Feature**: Mark expenses as recurring (monthly bills, subscriptions)
- **Automation**: Auto-generate recurring expenses
- **Tracking**: View all recurring costs
- **Reminders**: Upcoming recurring expense notifications

#### Bill Reminders
- **Feature**: Set reminders for upcoming bills
- **Notifications**: Browser/email notifications for due dates
- **Calendar**: Integration with calendar view
- **Payment Tracking**: Mark bills as paid

#### Data Management
- **Export**: CSV/Excel export for all data (per user)
- **Import**: Bulk import from CSV (user-specific)
- **Backup**: Manual/automatic backup functionality
- **Data Sharing**: Share data with family members (controlled access)

#### Receipt Management
- **Feature**: Upload receipt images (per user)
- **Storage**: Cloud storage integration (AWS S3, Google Drive)
- **OCR**: Automatic expense extraction from receipts (future)
- **Attachments**: Link receipts to expenses

#### Advanced Analytics
- **Forecasting**: Predict future spending based on trends
- **Comparison**: Year-over-year comparisons
- **Insights**: AI-powered spending insights
- **Goals**: Financial goals tracking

#### Mobile App
- **Platform**: React Native or Flutter
- **Features**: Same functionality as web app
- **Offline**: Offline mode with sync

#### Third-Party Integrations
- **Bank Sync**: Automatic transaction import from bank accounts
- **Investment Platforms**: Portfolio tracking integration with investment platforms
- **Payment Methods**: Integration with UPI, payment apps for automatic expense tracking

#### Progressive Web App (PWA)
- **Feature**: Install as desktop/mobile app
- **Offline**: Offline functionality
- **Notifications**: Push notifications

---

## Assumptions and Constraints

### Assumptions

1. **Multi-User with Google OAuth2**
   - Application supports multiple users via Google authentication
   - Users sign in with Google accounts (no password management)
   - Each user has isolated data (cannot see others' data)
   - Open registration (anyone with Google account can sign up)

2. **Deployment**
   - Application accessible via web URL (cloud deployment in Phase 8)
   - MongoDB Atlas used for database (cloud-hosted)
   - Session-based authentication with MongoDB session store
   - HTTPS required for production

3. **Manual Entry**
   - All expenses manually entered by user
   - No automatic bank sync or transaction import
   - User responsible for data accuracy
   - No receipt OCR in MVP

4. **Currency**
   - Default currency is Indian Rupee (₹)
   - No multi-currency support in MVP
   - All amounts stored as numbers (no currency conversion)

5. **Date Handling**
   - All dates in IST (Indian Standard Time)
   - Historical data entry allowed
   - Future date entries prevented
   - Date-based filtering and reporting

6. **Data Retention**
   - All data stored indefinitely per user
   - No automatic archiving or deletion
   - User responsible for data management
   - No data sharing between users in MVP

7. **Browser Support**
   - Modern browsers only (Chrome, Firefox, Edge, Safari)
   - JavaScript enabled required
   - Desktop-first design (responsive for mobile)
   - OAuth2 redirect support required

8. **Google OAuth2 Prerequisites**
   - Users must have Google accounts
   - Application registered in Google Cloud Console
   - OAuth2 credentials (Client ID, Client Secret) configured
   - Authorized redirect URIs properly set up

### Constraints

1. **Technology Stack**
   - Must use Java 21, Spring Boot 3.x
   - Must use Spring Security with OAuth2 Client
   - Must use Angular 20, Node 22
   - Must use MongoDB Atlas for database
   - Must use Tailwind CSS for styling with glassmorphism theme

2. **Development Resources**
   - Solo developer (no team)
   - No fixed timeline or deadlines
   - Phased development approach (8 phases)
   - Work in progress as time permits

3. **Infrastructure**
   - MongoDB Atlas free tier or paid tier
   - Cloud hosting for production (e.g., Heroku, Railway, Vercel)
   - HTTPS required for OAuth2 and production
   - Google Cloud Platform account required

4. **Authentication Constraints**
   - OAuth2 only (no local username/password)
   - Google as single OAuth provider in MVP
   - Session timeout: 7 days of inactivity
   - No admin or role-based access control in MVP

5. **Data Volume per User**
   - Expected <1,000 records per user initially
   - Should handle up to 10,000 records per user
   - Multiple users supported (no hard limit)
   - MongoDB indexes required for user-filtered queries

6. **Performance**
   - Response time <500ms for 95% of requests
   - Page load <2 seconds
   - Session management adds slight overhead
   - User-specific queries optimized with compound indexes

7. **Security Constraints**
   - CORS configured for specific origins only
   - CSRF protection enabled
   - Session cookies HttpOnly and Secure
   - No data sharing between users
   - No cross-user data access possible

### Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| MongoDB Atlas limits exceeded | Medium | Low | Monitor usage, use compound indexes, upgrade tier if needed |
| Google OAuth2 API changes | High | Low | Use stable OAuth2 APIs, monitor deprecation notices |
| Session management issues | Medium | Medium | Use Spring Session, test session timeout/renewal thoroughly |
| Data isolation bugs | Critical | Low | Implement service-layer filtering, write comprehensive tests |
| OAuth2 configuration errors | High | Medium | Document setup clearly, test redirect URIs, validate credentials |
| Session store performance | Medium | Low | Use MongoDB indexes on sessions, monitor session cleanup |
| Cross-user data leakage | Critical | Very Low | Enforce userId filtering in all queries, audit code regularly |
| Browser compatibility issues | Medium | Medium | Test on multiple browsers, use polyfills if needed |
| Performance degradation with many users | Medium | Medium | Implement pagination, user-scoped indexes, query optimization |
| Single point of failure (local only) | Medium | Low | Future: cloud deployment |
| No authentication security risk | Low | Low | MVP is single-user, add auth if needed |

---

## Success Criteria

### MVP Success Criteria

The MVP will be considered successful if:

1. **Functional Completeness**
   - ✅ All 4 core features implemented and working
   - ✅ CRUD operations for all entity types
   - ✅ Daily/weekly/monthly summaries functional
   - ✅ UI matches glass theme design

2. **Daily Usage Goal**
   - ✅ Application used daily for expense logging
   - ✅ Quick entry forms take <30 seconds
   - ✅ No crashes or major bugs during regular use

3. **Tracking Effectiveness**
   - ✅ 80%+ of actual expenses logged in app
   - ✅ All expense categories captured
   - ✅ Historical data easily accessible

4. **Spending Insights**
   - ✅ Can identify top spending categories
   - ✅ Can see daily/weekly/monthly totals
   - ✅ Can spot overspending patterns
   - ✅ Visual charts provide clear insights

5. **User Experience**
   - ✅ Clean, minimal UI with glass theme
   - ✅ Fast loading times
   - ✅ Intuitive navigation
   - ✅ Error-free data entry

6. **Technical Quality**
   - ✅ Code follows best practices
   - ✅ Proper error handling
   - ✅ Responsive design (desktop-first)
   - ✅ No console errors or warnings

---

## Appendix

### Glossary

- **Glass Theme / Glassmorphism**: UI design style featuring frosted glass effect with semi-transparent backgrounds and backdrop blur
- **CRUD**: Create, Read, Update, Delete operations
- **DTO**: Data Transfer Object - object used for data exchange between layers
- **ODM**: Object Document Mapper - abstraction layer for MongoDB (like ORM for SQL)
- **REST**: Representational State Transfer - API architectural style
- **JWT**: JSON Web Token - authentication token format
- **PWA**: Progressive Web App - web app that can be installed like native app

### References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)

### Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-10 | Solo Developer | Initial PRD created based on copilot-instructions |

---

**End of Product Requirements Document**
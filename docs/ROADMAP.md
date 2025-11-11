# iFinance Development Roadmap

## Project Timeline Overview

```
Phase 1: Foundation + OAuth2 (Week 1-3)
    ↓
Phase 2: Travel Records (Week 4-5)
    ↓
Phase 3: Expenses (Week 6-7)
    ↓
Phase 4: Investments & Savings (Week 8-9)
    ↓
Phase 5: Dashboard (Week 10-11)
    ↓
Phase 6: Reports (Week 12-13)
    ↓
Phase 7: Polish (Week 14-15)
    ↓
Phase 8: Deployment (Week 16-17)
```

**Note**: Weeks are indicative for planning purposes. As a solo developer with no strict deadlines, you can progress at your own pace.

---

## Phase 1: Foundation, OAuth2 Authentication & Setup ⚙️🔐

**Duration**: ~3 weeks (flexible)  
**Goal**: Set up complete development environment, implement Google OAuth2 authentication, and create project structure with user isolation

### Google OAuth2 Prerequisites

#### 1.0 Google Cloud Setup
- [x] Create Google Cloud Platform project
  - Go to: https://console.cloud.google.com/
  - Create new project: "iFinance"
- [x] Enable Google+ API (for user info)
- [x] Create OAuth2 credentials
  - Go to: APIs & Services → Credentials
  - Create OAuth 2.0 Client ID (Web application)
  - Set Authorized JavaScript origins: `http://localhost:4200`, `http://localhost:8080`
  - Set Authorized redirect URIs: `http://localhost:8080/login/oauth2/code/google`
  - Save Client ID and Client Secret
- [x] Store credentials securely (environment variables)

### Backend Tasks

#### 1.1 Project Initialization
- [x] Create Spring Boot 3.x project with Maven
  - Dependencies: Spring Web, Spring Data MongoDB, **Spring Security**, **OAuth2 Client**, **Spring Session Data MongoDB**, Lombok, Validation, SpringDoc OpenAPI
- [x] Set up MongoDB Atlas cluster
  - Create database: `ifinance`
  - Collections: `users`, `sessions`, `travel_records`, `misc_expenses`, `investments`
  - Get connection string
- [x] Configure `application.yml`
  - MongoDB connection (use environment variable)
  - Server port: 8080
  - CORS configuration for `http://localhost:4200` with credentials enabled
  - **OAuth2 configuration for Google**:
    ```yaml
    spring:
      security:
        oauth2:
          client:
            registration:
              google:
                client-id: ${GOOGLE_CLIENT_ID}
                client-secret: ${GOOGLE_CLIENT_SECRET}
                scope: profile, email
                redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
      session:
        store-type: mongodb
        mongodb:
          collection-name: sessions
    ```
  - Create `.env` file or set environment variables for secrets

#### 1.2 Project Structure
- [x] Create package structure:
  ```
  com.ifinance/
  ├── config/
  ├── security/           # NEW: Security and OAuth2 configuration
  ├── controller/
  ├── service/
  ├── repository/
  ├── model/
  │   ├── document/
  │   ├── dto/
  │   └── enums/
  ├── exception/
  └── util/
  ```
- [x] Create base configuration classes:
  - [x] `MongoConfig.java` - MongoDB configuration
  - [x] `CorsConfig.java` - CORS settings with credentials support
  - [x] **`SecurityConfig.java` - Spring Security with OAuth2 login**
  - [x] `OpenApiConfig.java` - Swagger documentation with security schemes

#### 1.3 User Management (NEW)
- [x] Create User document and repository:
  - [x] `User.java` - User document with @Document annotation
    - Fields: id, googleId (unique), email (unique), name, profilePicture, createdAt, lastLogin, updatedAt
    - Indexes: googleId, email
  - [x] `UserRepository.java` - Extends MongoRepository
    - Methods: findByGoogleId, findByEmail
  - [x] `UserService.java` - User business logic
    - createOrUpdateUser(OAuth2User) - Called on login
    - getUserProfile(userId)
    - updateUserProfile(userId, updates)
  - [x] `UserDto.java` - User data transfer object

#### 1.4 OAuth2 Security Implementation (NEW)
- [x] Create security components:
  - [x] `SecurityConfig.java`
    - Configure OAuth2 login
    - Define security filter chain
    - Authorize `/`, `/login`, `/oauth2/**` as public
    - Require authentication for `/api/**`
    - Configure CSRF protection
    - Configure session management
  - [x] `OAuth2LoginSuccessHandler.java`
    - Handle successful OAuth2 login
    - Create or update user in database
    - Update lastLogin timestamp
  - [x] `OAuth2UserService.java`
    - Load user from OAuth2 provider (Google)
    - Extract email, name, profile picture
    - Create/update User document
  - [x] `CustomUserPrincipal.java` (optional)
    - Custom principal with user details
  - [x] `SecurityUtil.java` - Utility class
    - getCurrentUserId() - Get authenticated user ID from SecurityContext
    - getCurrentUser() - Get full User object

#### 1.5 Authentication Controllers (NEW)
- [x] Create authentication endpoints:
  - [x] `AuthController.java`
    - `POST /api/auth/logout` - Logout and invalidate session
  - [x] `UserController.java`
    - `GET /api/user/me` - Get current user profile
    - `PUT /api/user/me` - Update user profile

#### 1.6 Exception Handling
- [x] Create custom exceptions:
  - [x] `ResourceNotFoundException.java`
  - [x] `ValidationException.java`
  - [x] **`UnauthorizedException.java` (NEW)**
- [x] Create `GlobalExceptionHandler.java` with @RestControllerAdvice
- [x] Implement error response format
- [x] Add OAuth2 authentication error handling

#### 1.7 Utilities
- [x] Create `DateUtil.java` for date operations
- [x] Create `ValidationUtil.java` for custom validations
- [x] **Create `SecurityUtil.java` for getting current user (NEW)**

#### 1.8 Testing Setup
- [ ] Set up JUnit 5 dependencies
- [ ] Create test profile configuration
- [ ] Set up test database configuration
- [ ] **Set up mock authentication for tests (NEW)**

### Frontend Tasks

#### 1.9 Project Initialization
- [x] Create Angular 20 project
  - Enable routing
  - Choose CSS (will use Tailwind)
- [x] Install Node 22 dependencies
- [x] Install Tailwind CSS
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```

#### 1.10 Tailwind Configuration
- [x] Configure `tailwind.config.js` with glass theme customizations:
  ```javascript
  module.exports = {
    theme: {
      extend: {
        backdropBlur: {
          xs: '2px',
        },
        boxShadow: {
          glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        },
      },
    },
  }
  ```
- [x] Add Tailwind directives to `styles.css`
- [ ] Install Tailwind Forms plugin

#### 1.11 Project Structure
- [x] Create folder structure:
  ```
  src/app/
  ├── core/
  │   ├── services/
  │   ├── guards/         # NEW: Auth guards
  │   ├── models/
  │   └── interceptors/
  ├── shared/
  │   ├── components/
  │   ├── directives/
  │   └── pipes/
  ├── auth/               # NEW: Authentication module
  │   ├── login/
  │   └── callback/
  ├── features/
  │   ├── dashboard/
  │   ├── travel/
  │   ├── expenses/
  │   ├── investments/
  │   └── reports/
  └── layout/
      ├── header/
      ├── sidebar/
      └── footer/
  ```

#### 1.12 Authentication Implementation (NEW)
- [x] Create User model:
  - [x] `user.model.ts` - TypeScript interface for User
    - Fields: id, googleId, email, name, profilePicture, createdAt, lastLogin
- [x] Create authentication service:
  - [x] `AuthService` - Authentication state management
    - isAuthenticated(): Observable<boolean>
    - login() - Redirect to Google OAuth
    - logout() - Call backend logout endpoint
    - getCurrentUser(): Observable<User>
  - [x] `UserService` - User profile operations
    - getUserProfile()
    - updateUserProfile(updates)
- [x] Create auth guard:
  - [x] `AuthGuard` - Protect routes
    - Check if user is authenticated
    - Redirect to login if not authenticated
- [x] Create interceptors:
  - [x] `CredentialsInterceptor` (NEW) - Add credentials to requests
    - withCredentials: true for session cookies
- [x] Create login page:
  - [x] `LoginComponent`
    - Display "Sign in with Google" button
    - Glass-themed design
    - Redirect to `/oauth2/authorization/google` on click

#### 1.13 Core Setup
- [x] Create environment files:
  - [x] `environment.ts` (development)
  - [x] `environment.prod.ts` (production)
  - Configure API URL, **auth URL**, date format, currency
- [x] Create base services:
  - [x] `ApiService` - Base HTTP service with credentials
- [x] Create HTTP interceptors:
  - [x] **`CredentialsInterceptor` - Include credentials (NEW)**
  - [x] `HttpErrorInterceptor` - Error handling (including 401 Unauthorized)
  - [ ] `LoadingInterceptor` - Loading state
- [x] Configure routing in `app.routes.ts`
  - **Add public routes: `/login`**
  - **Protect all feature routes with AuthGuard (NEW)**

#### 1.14 Layout Components
- [x] Create `HeaderComponent` with glass styling
  - App logo/title
  - Navigation links
  - **User profile display (name, profile picture) (NEW)**
  - **Logout button (NEW)**
- [ ] Create `SidebarComponent` with glass styling
  - Feature navigation menu
  - Minimal glass design
- [ ] Create `FooterComponent` (optional)

#### 1.15 Shared Components
- [ ] Create `GlassCardComponent` - Reusable glass card
- [ ] Create `LoadingSpinnerComponent` - Glass-styled loader
- [ ] Create `ConfirmationDialogComponent` - Glass modal
- [ ] Create custom directives:
  - [ ] `CurrencyInputDirective` - Auto-format currency

#### 1.16 Shared Pipes
- [ ] Create `CurrencyPipe` - Custom currency formatting
- [ ] Create `DateFormatPipe` - Date formatting

#### 1.17 Testing Setup
- [ ] Configure Jasmine/Karma
- [ ] Create test helper utilities
- [ ] **Create mock authentication for tests (NEW)**

### Deliverables ✅
- [x] Running Spring Boot application (http://localhost:8080)
- [x] **Google OAuth2 authentication working end-to-end (NEW)**
- [x] **User registration and login functional (NEW)**
- [x] Connected to MongoDB Atlas (users and sessions collections)
- [x] Swagger UI accessible with security (http://localhost:8080/swagger-ui.html)
- [x] Angular app running (http://localhost:4200)
- [x] **Login page with "Sign in with Google" working (NEW)**
- [x] **Protected routes with AuthGuard (NEW)**
- [x] **User profile display in header (NEW)**
- [x] Glass-themed layout visible
- [ ] Navigation working between placeholder pages
- [x] CORS configured with credentials support
- [x] **Session management working (NEW)**

---

## Phase 2: Travel Records Feature 🚗

**Duration**: ~2 weeks  
**Goal**: Complete CRUD operations for travel records with glass-themed UI and user isolation

### Backend Tasks

#### 2.1 Model Layer
- [ ] Create `TimeOfDay` enum (MORNING, EVENING)
- [ ] Create `TravelRecord` document class:
  - [ ] Add @Document annotation
  - [ ] Fields: id, **userId (ObjectId reference to User)**, date, timeOfDay, cost, createdAt, updatedAt
  - [ ] Add validation annotations (@NotNull, @Positive)
  - [ ] Add indexes: **@CompoundIndex on (userId, date), @CompoundIndex on (userId, date, timeOfDay)**
- [ ] Create `TravelRecordDto` for API requests/responses (no userId in DTO - auto-added from SecurityContext)
- [ ] Create mapper methods (or use MapStruct)

#### 2.2 Repository Layer
- [ ] Create `TravelRepository` interface extending MongoRepository
- [ ] Add custom query methods **with userId parameter**:
  - [ ] `findByUserIdAndDate(String userId, LocalDate date)`
  - [ ] `findByUserIdAndDateBetween(String userId, LocalDate start, LocalDate end)`
  - [ ] `findByUserIdAndTimeOfDay(String userId, TimeOfDay timeOfDay)`
  - [ ] `findByUserId(String userId, Pageable pageable)` - For pagination

#### 2.3 Service Layer
- [ ] Create `TravelService` with business logic **and user filtering**:
  - [ ] `createTravelRecord(TravelRecordDto dto)` - Get userId from SecurityUtil.getCurrentUserId()
  - [ ] `getAllTravelRecords(Pageable pageable)` - Filter by current user
  - [ ] `getTravelRecordById(String id)` - Verify record belongs to current user
  - [ ] `updateTravelRecord(String id, TravelRecordDto dto)` - Verify ownership
  - [ ] `deleteTravelRecord(String id)` - Verify ownership
  - [ ] `getTravelRecordsByDate(LocalDate date)` - For current user only
  - [ ] `getTravelRecordsByDateRange(LocalDate start, LocalDate end)` - For current user
  - [ ] Add ResourceNotFoundException if record not found or doesn't belong to user
  - [ ] `getTravelSummary(String period)` - Calculate totals

#### 2.4 Controller Layer
- [ ] Create `TravelController` with REST endpoints:
  - [ ] POST `/api/travel` - Create record
  - [ ] GET `/api/travel` - Get all (paginated)
  - [ ] GET `/api/travel/{id}` - Get by ID
  - [ ] PUT `/api/travel/{id}` - Update record
  - [ ] DELETE `/api/travel/{id}` - Delete record
  - [ ] GET `/api/travel/date/{date}` - Get by date
  - [ ] GET `/api/travel/summary?period={period}` - Get summary
- [ ] Add validation and error handling
- [ ] Add Swagger annotations for documentation

#### 2.5 Testing
- [ ] Write unit tests for `TravelService`
- [ ] Write integration tests for `TravelController`
- [ ] Test with Postman/Swagger UI

### Frontend Tasks

#### 2.6 Models & Services
- [ ] Create `travel-record.model.ts` interface
- [ ] Create `TimeOfDay` enum
- [ ] Create `TravelService`:
  - [ ] CRUD methods calling backend API
  - [ ] Summary calculation methods
  - [ ] Error handling with RxJS

#### 2.7 Travel Module
- [ ] Create `TravelModule` with routing
- [ ] Define routes:
  - `/travel` - List view
  - `/travel/new` - Create form
  - `/travel/edit/:id` - Edit form

#### 2.8 Components
- [ ] Create `TravelListComponent`:
  - [ ] Glass card container
  - [ ] Table/list showing all records
  - [ ] Columns: Date, Time of Day, Cost, Actions
  - [ ] Edit/Delete buttons with icons
  - [ ] Filter section (date range, time of day)
  - [ ] Pagination controls
  - [ ] Loading state with skeleton
  - [ ] Empty state message
- [ ] Create `TravelFormComponent`:
  - [ ] Reactive form with validation
  - [ ] Date picker (default: today)
  - [ ] Time of Day dropdown (Morning/Evening)
  - [ ] Cost input with currency symbol (₹)
  - [ ] Submit/Cancel buttons
  - [ ] Validation error messages
  - [ ] Glass-styled form fields
- [ ] Create `TravelSummaryComponent`:
  - [ ] Display total for today/week/month
  - [ ] Breakdown by morning vs evening
  - [ ] Glass card design

#### 2.9 Styling
- [ ] Apply glass theme to all components
- [ ] Ensure responsive design
- [ ] Add smooth transitions
- [ ] Style form validation errors

#### 2.10 Testing
- [ ] Write component tests
- [ ] Test service methods
- [ ] Manual testing of all flows

### Deliverables ✅
- [ ] Complete travel records CRUD working
- [ ] Glass-themed UI for travel feature
- [ ] Date-based filtering functional
- [ ] Summary calculations working
- [ ] Backend tests passing
- [ ] Frontend tests passing

---

## Phase 3: Miscellaneous Expenses Feature 💰

**Duration**: ~2 weeks  
**Goal**: Complete expense tracking with categories and payment methods

### Backend Tasks

#### 3.1 Model Layer
- [ ] Create `ExpenseCategory` enum:
  - FOOD, GROCERIES, ENTERTAINMENT, HEALTH, UTILITIES, SHOPPING, EDUCATION, OTHER
- [ ] Create `PaymentMethod` enum:
  - CASH, UPI, DEBIT_CARD, NET_BANKING, OTHER
- [ ] Create `MiscExpense` document class:
  - [ ] Fields: id, date, category, amount, description, paymentMethod, createdAt, updatedAt
  - [ ] Add validation annotations
  - [ ] Add indexes: @Indexed on date, category
- [ ] Create `ExpenseDto` for API
- [ ] Create mapper methods

#### 3.2 Repository Layer
- [ ] Create `ExpenseRepository` interface
- [ ] Add custom query methods:
  - [ ] `findByCategory(ExpenseCategory category)`
  - [ ] `findByDateBetween(LocalDate start, LocalDate end)`
  - [ ] `findByPaymentMethod(PaymentMethod method)`
  - [ ] `findByCategoryAndDateBetween(...)`

#### 3.3 Service Layer
- [ ] Create `ExpenseService`:
  - [ ] CRUD operations
  - [ ] `getExpensesByCategory(ExpenseCategory category)`
  - [ ] `getExpensesByDateRange(LocalDate start, LocalDate end)`
  - [ ] `getExpenseSummary(String period)`
  - [ ] Category-wise aggregation
  - [ ] Payment method aggregation

#### 3.4 Controller Layer
- [ ] Create `ExpenseController` with endpoints:
  - [ ] POST `/api/expenses` - Create
  - [ ] GET `/api/expenses` - Get all (paginated, filtered)
  - [ ] GET `/api/expenses/{id}` - Get by ID
  - [ ] PUT `/api/expenses/{id}` - Update
  - [ ] DELETE `/api/expenses/{id}` - Delete
  - [ ] GET `/api/expenses/category/{category}` - Get by category
  - [ ] GET `/api/expenses/summary?period={period}` - Summary
- [ ] Add Swagger documentation

#### 3.5 Testing
- [ ] Unit tests for service
- [ ] Integration tests for controller
- [ ] Test all filter combinations

### Frontend Tasks

#### 3.6 Models & Services
- [ ] Create `expense.model.ts` interface
- [ ] Create `ExpenseCategory` enum
- [ ] Create `PaymentMethod` enum
- [ ] Create `ExpenseService`:
  - [ ] CRUD operations
  - [ ] Filtering methods
  - [ ] Summary calculations

#### 3.7 Expense Module
- [ ] Create `ExpenseModule` with routing
- [ ] Define routes: `/expenses`, `/expenses/new`, `/expenses/edit/:id`

#### 3.8 Components
- [ ] Create `ExpenseListComponent`:
  - [ ] Glass card container
  - [ ] Table with columns: Date, Category (badge), Amount, Payment, Description, Actions
  - [ ] Colored category badges (glass effect)
  - [ ] Multi-filter section:
    - Date range picker
    - Category multi-select
    - Payment method filter
  - [ ] Search by description
  - [ ] Pagination
  - [ ] Sort by date, amount, category
  - [ ] Loading/empty states
- [ ] Create `ExpenseFormComponent`:
  - [ ] Reactive form
  - [ ] Date picker (default: today)
  - [ ] Category dropdown with icons
  - [ ] Amount input with ₹ symbol
  - [ ] Description textarea (optional)
  - [ ] Payment method dropdown
  - [ ] Validation
  - [ ] Glass-styled inputs
- [ ] Create `ExpenseSummaryComponent`:
  - [ ] Total by category
  - [ ] Total by payment method
  - [ ] Period totals
  - [ ] Visual indicators (colored bars)

#### 3.9 Category Icons/Badges
- [ ] Create category icon mapping:
  - 🍔 FOOD
  - 🛒 GROCERIES
  - 🎬 ENTERTAINMENT
  - 🏥 HEALTH
  - 💡 UTILITIES
  - 🛍️ SHOPPING
  - 📚 EDUCATION
  - ⚙️ OTHER
- [ ] Style badges with glass effect and category colors

#### 3.10 Styling
- [ ] Apply glass theme
- [ ] Category-specific accent colors (soft, with transparency)
- [ ] Responsive design
- [ ] Smooth animations

#### 3.11 Testing
- [ ] Component tests
- [ ] Service tests
- [ ] Manual testing

### Deliverables ✅
- [ ] Complete expense CRUD working
- [ ] Category and payment method filtering
- [ ] Glass-themed UI with colored badges
- [ ] Search functionality working
- [ ] Summary calculations accurate
- [ ] Tests passing

---

## Phase 4: Investments & Savings Feature �💰

**Duration**: ~2 weeks  
**Goal**: Track investments and savings across various categories

### Backend Tasks

#### 4.1 Model Layer
- [x] Create `InvestmentCategory` enum:
  - [x] Values: STOCKS, MUTUAL_FUNDS, FIXED_DEPOSIT, SAVINGS_ACCOUNT, GOLD, REAL_ESTATE, CRYPTO, OTHER
  - [x] Display names and icons for each category
- [x] Create `Investment` document class:
  - [x] Fields: id, userId, date, category, amount, description, otherCategoryName, createdAt, updatedAt
  - [x] Validation annotations
  - [x] Indexes: Compound index on (userId, date), (userId, category)
- [x] Create `InvestmentDto` with mapper methods

#### 4.2 Repository Layer
- [x] Create `InvestmentRepository` interface extending MongoRepository
- [x] Add custom query methods:
  - [x] `findByUserIdAndDateBetween()` - Date range filter
  - [x] `findByUserIdAndCategory()` - Category filter
  - [x] `findByUserIdAndDescriptionContaining()` - Search by description

#### 4.3 Service Layer
- [x] Create `InvestmentService`:
  - [x] CRUD operations (create, getById, getAll, update, delete)
  - [x] `getInvestmentsByCategory()` - Filter by category
  - [x] `getInvestmentsByDateRange()` - Filter by date range
  - [x] `searchInvestmentsByDescription()` - Text search
  - [x] `getInvestmentSummary()` - Calculate totals by category
  - [x] User isolation via SecurityUtil.getCurrentUserId()

#### 4.4 Controller Layer
- [x] Create `InvestmentController` with endpoints:
  - [x] POST `/api/investments` - Create investment
  - [x] GET `/api/investments` - Get all (paginated)
  - [x] GET `/api/investments/{id}` - Get by ID
  - [x] PUT `/api/investments/{id}` - Update
  - [x] DELETE `/api/investments/{id}` - Delete
  - [x] GET `/api/investments/category/{category}` - Filter by category
  - [x] GET `/api/investments/date-range?startDate={start}&endDate={end}` - Date range
  - [x] GET `/api/investments/search?q={keyword}` - Search
  - [x] GET `/api/investments/summary` - Category-wise summary
- [x] Add Swagger docs

#### 4.5 Testing
- [x] Unit tests for service layer
- [x] Integration tests for controller
- [x] Test search and filtering functionality

### Frontend Tasks

#### 4.6 Models & Services
- [x] Create `investment.model.ts`:
  - [x] Investment interface
  - [x] InvestmentCategory enum
  - [x] INVESTMENT_CATEGORY_CONFIG with labels, icons, colors
- [x] Create `InvestmentService`:
  - [x] CRUD operations
  - [x] Search method
  - [x] Category filtering
  - [x] Summary calculation

#### 4.7 Investments Module
- [x] Create routes for investments feature
- [x] Routes: `/investments`, `/investments/new`, `/investments/edit/:id`
- [x] Apply auth guards to all routes

#### 4.8 Components
- [x] Create `InvestmentComponent` (List View):
  - [x] Glass card container with gradient background
  - [x] Table showing: Date, Category (with icon), Amount, Description, Actions
  - [x] Search bar for description (debounced)
  - [x] Category filter dropdown (with "All Categories" option)
  - [x] Date range filter (start and end date pickers)
  - [x] Total investments display (sum of filtered results)
  - [x] Loading state with skeleton
  - [x] Empty state message
  - [x] Edit and Delete actions
- [x] Create `InvestmentFormComponent`:
  - [x] Reactive form with validation
  - [x] Date picker (default: today)
  - [x] Category dropdown with icons
  - [x] Conditional "Other Category Name" field (shown when OTHER selected)
  - [x] Amount input with ₹ symbol
  - [x] Description textarea
  - [x] Submit/Cancel buttons with glass styling
  - [x] Form validation and error messages
  - [x] Support for both create and edit modes

#### 4.9 Styling
- [x] Apply glassmorphism theme throughout
- [x] Category badges with distinct colors and icons
- [x] Responsive design for mobile/tablet/desktop
- [x] Smooth transitions and hover effects
- [x] Glass-styled form inputs and buttons

#### 4.10 Testing
- [x] Component unit tests
- [x] Service unit tests
- [x] Manual end-to-end testing

### Deliverables ✅
- [x] Complete investments CRUD operations
- [x] Category-based filtering working
- [x] Search functionality by description
- [x] Date range filtering
- [x] Summary calculations accurate
- [x] Glass-themed UI consistent with app design
- [x] Tests passing
- [x] Integration with dashboard complete

---

## Phase 5: Dashboard & Summary Feature 📊

**Duration**: ~2 weeks  
**Goal**: Create comprehensive dashboard with financial overview

### Backend Tasks

#### 5.1 Service Layer
- [ ] Create `ReportService`:
  - [ ] `getDailySummary(LocalDate date)`
  - [ ] `getWeeklySummary(LocalDate startDate)`
  - [ ] `getMonthlySummary(int year, int month)`
  - [ ] `getCustomRangeSummary(LocalDate start, LocalDate end)`
  - [ ] Aggregate data from all three collections
  - [ ] Calculate totals and counts
  - [ ] Create breakdown by category, payment method

#### 5.2 Summary DTO
- [ ] Create `SummaryDto` class:
  - [ ] period, startDate, endDate
  - [ ] totalTravel, totalMiscExpenses, totalInvestments, grandTotal
  - [ ] travelCount, expenseCount, investmentCount
  - [ ] breakdown (Map of category totals, payment method totals, investment category totals)

#### 5.3 Controller Layer
- [ ] Create `ReportController`:
  - [ ] GET `/api/reports/daily?date={date}` - Daily summary
  - [ ] GET `/api/reports/weekly?startDate={date}` - Weekly summary
  - [ ] GET `/api/reports/monthly?year={year}&month={month}` - Monthly
  - [ ] GET `/api/reports/custom?startDate={date}&endDate={date}` - Custom range
- [ ] Add Swagger docs

#### 5.4 Optimization
- [ ] Use MongoDB aggregation pipeline for efficient calculations
- [ ] Add caching for frequently accessed summaries (optional)

#### 5.5 Testing
- [ ] Unit tests for report service
- [ ] Integration tests for report controller
- [ ] Test with various date ranges

### Frontend Tasks

#### 5.6 Models & Services
- [ ] Create `summary.model.ts` interface
- [ ] Create `ReportService`:
  - [ ] Methods for each summary endpoint
  - [ ] Error handling

#### 5.7 Dashboard Module
- [ ] Create `DashboardModule` with routing
- [ ] Set dashboard as default route (`/`)

#### 5.8 Dashboard Component
- [ ] Create `DashboardComponent`:
  - [ ] Glass background with gradient
  - [ ] Header with date selector (default: today)
  - [ ] Summary cards section:
    - [ ] Travel card (glass) - total, count, morning/evening split
    - [ ] Misc Expenses card (glass) - total, count
    - [ ] Investments & Savings card (glass) - total, count
    - [ ] Grand Total card (glass, highlighted)
  - [ ] Recent transactions section:
    - [ ] Last 5-10 transactions across all types
    - [ ] Grouped by type with icons
    - [ ] Glass card list
  - [ ] Quick stats:
    - [ ] Top spending category
    - [ ] Most used payment method
    - [ ] Average daily spending
  - [ ] Period selector: Today | This Week | This Month
  - [ ] Loading skeleton for summary cards
  - [ ] Auto-refresh on date change

#### 5.9 Summary Cards Component
- [ ] Create reusable `SummaryCardComponent`:
  - [ ] Input: title, amount, icon, count, color accent
  - [ ] Glass card design
  - [ ] Smooth hover effect
  - [ ] Optional trend indicator (up/down)

#### 5.10 Recent Transactions Component
- [ ] Create `RecentTransactionsComponent`:
  - [ ] List of latest transactions
  - [ ] Type indicators (travel/expense/investment)
  - [ ] Click to navigate to detail view
  - [ ] Glass card list

#### 5.11 Styling
- [ ] Dashboard-specific glass theme
- [ ] Card grid layout (responsive)
- [ ] Smooth animations on load
- [ ] Hover effects for cards

#### 5.12 Testing
- [ ] Component tests
- [ ] Service tests
- [ ] Test period switching
- [ ] Manual testing

### Deliverables ✅
- [ ] Comprehensive dashboard working
- [ ] Real-time financial snapshot displayed
- [ ] Summary cards with accurate data
- [ ] Recent transactions visible
- [ ] Period switching functional
- [ ] Clean glass-themed UI
- [ ] Tests passing

---

## Phase 6: Reports & Analytics Feature 📈

**Duration**: ~2 weeks  
**Goal**: Build detailed reports with visualizations

### Backend Tasks

#### 6.1 Report Service Enhancement
- [ ] Add methods to `ReportService`:
  - [ ] `getCategoryBreakdown(String period)` - Expenses by category
  - [ ] `getPaymentMethodBreakdown(String period)` - By payment method
  - [ ] `getSpendingTrends(int months)` - Historical trends
  - [ ] `getTopCategories(int limit)` - Top spending categories
  - [ ] `getMonthOverMonthComparison(int year, int month)` - MoM comparison

#### 6.2 Controller Enhancement
- [ ] Add endpoints to `ReportController`:
  - [ ] GET `/api/reports/category-breakdown?period={period}` - Category analysis
  - [ ] GET `/api/reports/payment-breakdown?period={period}` - Payment analysis
  - [ ] GET `/api/reports/trends?months={count}` - Trend data
  - [ ] GET `/api/reports/top-categories?limit={limit}` - Top categories

#### 6.3 Testing
- [ ] Unit tests for new methods
- [ ] Integration tests
- [ ] Test with various parameters

### Frontend Tasks

#### 6.4 Chart Library Setup
- [ ] Install Chart.js and ng2-charts:
  ```bash
  npm install chart.js ng2-charts
  ```
- [ ] Configure Chart.js defaults for glass theme

#### 6.5 Reports Module
- [ ] Create `ReportsModule` with routing
- [ ] Routes:
  - `/reports` - Main reports page
  - `/reports/daily` - Daily report
  - `/reports/weekly` - Weekly report
  - `/reports/monthly` - Monthly report
  - `/reports/custom` - Custom range

#### 6.6 Components

##### Daily Report Component
- [ ] Create `DailyReportComponent`:
  - [ ] Date selector (default: today)
  - [ ] Summary section (glass card):
    - Travel, Expenses, Investments totals
    - Transaction counts
    - Grand total
  - [ ] Donut chart: Category distribution
  - [ ] List of all transactions for the day
  - [ ] Export button (optional)

##### Weekly Report Component
- [ ] Create `WeeklyReportComponent`:
  - [ ] Week selector (start date)
  - [ ] Summary section (glass card)
  - [ ] Bar chart: Day-by-day spending
  - [ ] Category breakdown table
  - [ ] Payment method distribution

##### Monthly Report Component
- [ ] Create `MonthlyReportComponent`:
  - [ ] Month and year selector
  - [ ] Summary section (glass card)
  - [ ] Line chart: Daily spending trend
  - [ ] Week-by-week breakdown
  - [ ] Category pie chart
  - [ ] Comparison with previous month

##### Custom Range Report Component
- [ ] Create `CustomRangeReportComponent`:
  - [ ] Start and end date pickers (max 90 days)
  - [ ] Summary section
  - [ ] Charts based on range length:
    - Short range (< 7 days): Bar chart
    - Medium range (7-30 days): Line chart
    - Long range (> 30 days): Area chart
  - [ ] Category breakdown
  - [ ] Export functionality

##### Category Breakdown Component
- [ ] Create `CategoryBreakdownComponent`:
  - [ ] Period selector
  - [ ] Horizontal bar chart: Spending by category
  - [ ] Percentage distribution
  - [ ] Top 3 categories highlighted
  - [ ] Trend indicators (up/down from previous period)

##### Spending Trends Component
- [ ] Create `SpendingTrendsComponent`:
  - [ ] Number of months selector (default: 6)
  - [ ] Line chart: Month-over-month spending
  - [ ] Trend line (increasing/decreasing)
  - [ ] Average monthly spending
  - [ ] Highest/lowest spending months

#### 6.7 Chart Styling
- [ ] Configure Chart.js with glass theme:
  - Semi-transparent backgrounds
  - Soft colors with transparency
  - Minimal grid lines
  - Smooth animations
  - Responsive sizing

#### 6.8 Export Functionality (Optional)
- [ ] Install jsPDF and/or xlsx libraries
- [ ] Create export service:
  - [ ] Export to CSV
  - [ ] Export to PDF (optional)
- [ ] Add export buttons to report components

#### 6.9 Styling
- [ ] Apply glass theme to all report pages
- [ ] Consistent chart styling
- [ ] Responsive layouts
- [ ] Loading states for data fetching

#### 6.10 Testing
- [ ] Component tests
- [ ] Test chart rendering
- [ ] Test date range validations
- [ ] Manual testing of all reports

### Deliverables ✅
- [ ] Complete reporting suite
- [ ] Multiple report views (daily/weekly/monthly/custom)
- [ ] Visual charts and graphs
- [ ] Category and payment breakdowns
- [ ] Spending trends visualization
- [ ] Glass-themed charts
- [ ] Export functionality (optional)
- [ ] Tests passing

---

## Phase 7: Polish & Optimization ✨

**Duration**: ~2 weeks  
**Goal**: Refine UI/UX, optimize performance, fix bugs

### UI/UX Refinement

#### 7.1 Glass Theme Consistency
- [ ] Audit all pages for consistent glass styling
- [ ] Ensure all cards use same glass effect
- [ ] Consistent spacing and padding
- [ ] Uniform border styles and shadows
- [ ] Consistent typography (font weights, sizes)

#### 7.2 Animations & Transitions
- [ ] Add smooth page transitions
- [ ] Card hover effects
- [ ] Button hover/click animations
- [ ] Loading animations (skeleton loaders)
- [ ] Toast notification animations
- [ ] Modal fade in/out

#### 7.3 Responsive Design
- [ ] Test on various screen sizes (desktop, tablet, mobile)
- [ ] Fix any layout issues
- [ ] Optimize glass effects for mobile
- [ ] Ensure touch-friendly UI elements

#### 7.4 Loading States
- [ ] Skeleton loaders for all data fetching
- [ ] Glass-styled spinners
- [ ] Progress indicators for long operations
- [ ] Disable buttons during submission

#### 7.5 Error States
- [ ] Friendly error messages
- [ ] Glass-styled error cards
- [ ] Retry mechanisms
- [ ] Validation error styling

#### 7.6 Empty States
- [ ] Design empty state messages
- [ ] Illustrations or icons
- [ ] Call-to-action buttons
- [ ] Glass card styling

### Performance Optimization

#### 7.7 Backend Optimization
- [ ] Create MongoDB indexes:
  - [ ] TravelRecord: `{ date: 1, timeOfDay: 1 }`
  - [ ] MiscExpense: `{ date: 1 }`, `{ category: 1 }`
  - [ ] Investment: `{ date: 1 }`, `{ category: 1 }`
- [ ] Optimize aggregation queries
- [ ] Add query result caching (Spring Cache)
- [ ] Profile slow queries
- [ ] Use projection to fetch only required fields

#### 7.8 Frontend Optimization
- [ ] Lazy load feature modules
- [ ] Optimize bundle size:
  - [ ] Analyze with `ng build --stats-json`
  - [ ] Use Webpack Bundle Analyzer
  - [ ] Remove unused dependencies
- [ ] Implement OnPush change detection where appropriate
- [ ] Optimize image sizes (if any)
- [ ] Use trackBy functions in *ngFor loops
- [ ] Minimize subscriptions, use async pipe

#### 7.9 Database Optimization
- [ ] Review and optimize indexes
- [ ] Check index usage with MongoDB Atlas
- [ ] Optimize aggregation pipelines
- [ ] Set up monitoring for slow queries

### Error Handling & Validation

#### 7.10 Backend Error Handling
- [ ] Review all exception handling
- [ ] Ensure consistent error response format
- [ ] Add meaningful error messages
- [ ] Log errors with context

#### 7.11 Frontend Error Handling
- [ ] Improve HTTP error interceptor
- [ ] User-friendly error messages
- [ ] Toast notifications for errors
- [ ] Retry mechanisms for failed requests

#### 7.12 Form Validation
- [ ] Review all form validations
- [ ] Consistent validation messages
- [ ] Real-time validation feedback
- [ ] Prevent invalid submissions

### Testing

#### 7.13 Backend Testing
- [ ] Write missing unit tests
- [ ] Write integration tests
- [ ] Achieve >80% code coverage
- [ ] Test edge cases
- [ ] Test error scenarios

#### 7.14 Frontend Testing
- [ ] Write missing component tests
- [ ] Write service tests
- [ ] Test user interactions
- [ ] Test error handling
- [ ] Achieve >70% code coverage

#### 7.15 Manual Testing
- [ ] Test all CRUD operations
- [ ] Test all filters and searches
- [ ] Test date range validations
- [ ] Test pagination
- [ ] Test sorting
- [ ] Test summary calculations
- [ ] Test charts and reports
- [ ] Test responsive behavior
- [ ] Cross-browser testing (Chrome, Firefox, Edge, Safari)

### Bug Fixes

#### 7.16 Bug Tracking
- [ ] Create list of known bugs
- [ ] Prioritize bugs (critical, major, minor)
- [ ] Fix critical bugs first
- [ ] Fix major bugs
- [ ] Fix minor bugs (time permitting)

### Documentation

#### 7.17 Code Documentation
- [ ] Add JavaDoc comments to public methods (backend)
- [ ] Add JSDoc comments to services (frontend)
- [ ] Document complex logic
- [ ] Update README files

#### 7.18 API Documentation
- [ ] Review and update Swagger annotations
- [ ] Ensure all endpoints documented
- [ ] Add example requests/responses
- [ ] Document error codes

#### 7.19 User Guide (Optional)
- [ ] Create user guide document
- [ ] Add screenshots
- [ ] Explain each feature
- [ ] Add tips and best practices

#### 7.20 Setup Documentation
- [ ] Document MongoDB Atlas setup
- [ ] Document backend setup steps
- [ ] Document frontend setup steps
- [ ] Environment configuration guide

### Final Touches

#### 7.21 Code Cleanup
- [ ] Remove commented-out code
- [ ] Remove unused imports
- [ ] Format code consistently
- [ ] Fix linting warnings

#### 7.22 Security Review
- [ ] Review input validation
- [ ] Check for XSS vulnerabilities
- [ ] Check for injection vulnerabilities
- [ ] Review CORS configuration

#### 7.23 Accessibility (Optional)
- [ ] Add ARIA labels
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] Color contrast review

### Deliverables ✅
- [ ] Polished, production-ready UI
- [ ] Optimized performance (fast load times)
- [ ] Comprehensive error handling
- [ ] Bug-free application
- [ ] >80% backend test coverage
- [ ] >70% frontend test coverage
- [ ] Well-documented codebase
- [ ] All known bugs fixed
- [ ] Responsive design working
- [ ] Cross-browser compatibility

---

## Phase 8: Future Enhancements (Optional) 🚀

**Status**: Not in MVP scope, consider based on usage  
**Timeline**: TBD

### Authentication & Multi-User Support

#### 8.1 User Management
- [ ] Design user schema
- [ ] Implement JWT authentication with Spring Security
- [ ] Create user registration endpoint
- [ ] Create login endpoint
- [ ] Create password reset flow
- [ ] Add refresh token mechanism

#### 8.2 Data Isolation
- [ ] Add userId to all documents
- [ ] Update all queries to filter by user
- [ ] Test data isolation

#### 8.3 Frontend Auth
- [ ] Create login/registration components
- [ ] Implement auth guard
- [ ] Store JWT token
- [ ] Handle token refresh
- [ ] Logout functionality

### Advanced Features

#### 8.4 Budget Planning
- [ ] Create budget schema
- [ ] Budget CRUD operations
- [ ] Budget vs actual comparison
- [ ] Alert system for budget limits

#### 8.5 Recurring Expenses
- [ ] Mark expenses as recurring
- [ ] Auto-generate recurring expenses
- [ ] Manage recurring expense schedule

#### 8.6 Bill Reminders
- [ ] Create reminder schema
- [ ] Reminder CRUD operations
- [ ] Notification system (email, browser push)
- [ ] Calendar integration

#### 8.7 Receipt Management
- [ ] File upload functionality
- [ ] Cloud storage integration (Google Drive)
- [ ] Link receipts to expenses
- [ ] OCR for receipt scanning (future)

#### 8.8 Data Export/Import
- [ ] Export to CSV
- [ ] Export to Excel
- [ ] Export to PDF
- [ ] Import from CSV
- [ ] Backup/restore functionality

#### 8.9 Advanced Analytics
- [ ] Forecasting with ML (future)
- [ ] Year-over-year comparisons
- [ ] Financial goals tracking
- [ ] AI-powered insights

### Mobile & PWA

#### 8.10 Progressive Web App
- [ ] Add service worker
- [ ] Make app installable
- [ ] Offline functionality
- [ ] Push notifications

### Cloud Deployment

#### 8.14 Backend Deployment
- [ ] Dockerize backend
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production

#### 8.15 Frontend Deployment
- [ ] Build for production
- [ ] Deploy to hosting (Vercel)
- [ ] Configure custom domain
- [ ] Set up SSL

#### 8.16 Monitoring & Logging
- [ ] Set up application monitoring (New Relic, DataDog)
- [ ] Configure alerts
- [ ] Set up centralized logging
- [ ] Performance monitoring

---

## Success Milestones 🎯

### Phase 1 Complete ✅
- [ ] Development environment fully set up
- [ ] Both backend and frontend running locally
- [ ] Glass-themed layout visible
- [ ] MongoDB Atlas connected

### Phase 2 Complete ✅
- [ ] Travel records feature fully functional
- [ ] CRUD operations working
- [ ] Filters and summaries working
- [ ] Tests passing

### Phase 3 Complete ✅
- [ ] Expenses feature fully functional
- [ ] Category and payment tracking working
- [ ] Multi-filter functionality working
- [ ] Tests passing

### Phase 4 Complete ✅
- [x] Investments & Savings feature functional
- [x] Category-based tracking working
- [x] All CRUD operations working
- [x] Search and filtering working
- [x] Tests passing

### Phase 5 Complete ✅
- [ ] Dashboard showing comprehensive summary
- [ ] All summary cards working
- [ ] Recent transactions visible
- [ ] Period switching functional

### Phase 6 Complete ✅
- [ ] All report views working
- [ ] Charts rendering correctly
- [ ] Data accurate and calculations correct
- [ ] Export functionality working (optional)

### Phase 7 Complete ✅
- [ ] UI polished and consistent
- [ ] Performance optimized
- [ ] All known bugs fixed
- [ ] Test coverage goals met
- [ ] Documentation complete

### MVP Launch Ready 🎉
- [ ] All 4 core features complete and tested
- [ ] Dashboard and reports working
- [ ] UI polished with glass theme
- [ ] Performance optimized
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] Ready for daily usage

---

## Risk Management

### Potential Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
|------|--------|-------------------|
| **MongoDB Atlas free tier limits** | Medium | Monitor usage, upgrade if needed; optimize queries to reduce load |
| **Performance degradation with large datasets** | Medium | Implement proper indexing, pagination, lazy loading; optimize queries early |
| **Browser compatibility issues** | Low | Test regularly on multiple browsers; use polyfills where needed |
| **Scope creep** | Medium | Stick to MVP features; document future enhancements separately |
| **Technical blockers (learning curve)** | Medium | Allocate time for learning; leverage documentation and community |
| **Data loss (no backup)** | High | Implement export functionality early; consider MongoDB Atlas backup |
| **Motivation/burnout (solo dev)** | Medium | Work in phases; celebrate small wins; take breaks between phases |

### Contingency Plans

**If Behind Schedule:**
- Prioritize core CRUD operations over polish
- Defer optional features (export, advanced charts)
- Focus on Phase 1-4 first (core features)
- Polish in Phase 7 can be iterative

**If Facing Technical Issues:**
- Leverage Copilot for assistance
- Consult documentation and community forums
- Simplify features if needed
- Ask for help (Stack Overflow, GitHub Discussions)

**If Scope Seems Too Large:**
- Split phases into smaller sub-tasks
- Work on one feature at a time
- Don't aim for perfection in first iteration
- MVP first, enhancements later

---

## Development Best Practices

### Daily Development Workflow
1. **Start of Day:**
   - Review roadmap and current phase tasks
   - Pick 1-3 tasks to focus on
   - Set up development environment

2. **During Development:**
   - Commit frequently with meaningful messages
   - Test as you develop (TDD encouraged)
   - Use Copilot for code suggestions
   - Take breaks to avoid burnout

3. **End of Day:**
   - Commit and push changes
   - Update roadmap checklist
   - Document any blockers or learnings

### Code Quality Checklist
- [ ] Code follows conventions (Java, TypeScript)
- [ ] Proper error handling implemented
- [ ] Validation added (backend and frontend)
- [ ] Tests written and passing
- [ ] Code reviewed (self-review)
- [ ] Documentation updated

### Testing Strategy
- **Backend:** Write unit tests for services, integration tests for controllers
- **Frontend:** Write component tests, service tests
- **Manual Testing:** Test all user flows after each phase
- **Regression Testing:** Re-test previous features after changes

### Version Control
- **Commit Often:** Small, focused commits
- **Meaningful Messages:** Use conventional commits format
  - `feat: add travel record creation`
  - `fix: correct date validation in expense form`
  - `refactor: optimize travel summary calculation`
  - `docs: update API documentation`
- **Branching Strategy:**
  - `main` branch for stable code
  - `develop` branch for ongoing work
  - Feature branches: `feature/travel-records`, `feature/dashboard`

---

## Tools & Resources

### Development Tools
- **IDE:** Visual Studio Code (with Spring Boot and Angular extensions)
- **API Testing:** Postman or Swagger UI
- **Database:** MongoDB Compass (GUI), MongoDB Atlas web interface
- **Version Control:** Git, GitHub
- **Package Management:** Maven (backend), npm (frontend)

### Helpful Extensions (VS Code)
- Spring Boot Extension Pack
- Angular Language Service
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- GitLens
- Prettier
- ESLint

### Documentation Resources
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Angular Docs](https://angular.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Chart.js Docs](https://www.chartjs.org/docs/)

### Learning Resources
- Spring Boot with MongoDB: [Baeldung tutorials](https://www.baeldung.com/)
- Angular best practices: [Angular.io](https://angular.io/guide/styleguide)
- Glassmorphism design: [CSS-Tricks](https://css-tricks.com/), [Dribbble examples](https://dribbble.com/)

---

## Progress Tracking

### How to Use This Roadmap

1. **Work Phase by Phase:**
   - Complete one phase before moving to next
   - Don't skip ahead unless absolutely necessary
   - Each phase builds on previous phases

2. **Check Off Tasks:**
   - Mark tasks as complete using checkboxes
   - Update the roadmap as you progress
   - Add notes for any deviations or learnings

3. **Review Regularly:**
   - Weekly review of progress
   - Adjust timeline if needed (no strict deadlines)
   - Celebrate milestones

4. **Flexibility:**
   - It's okay to adjust the roadmap as you learn
   - Add tasks if you discover new requirements
   - Remove tasks if they're not needed

### Progress Dashboard

| Phase | Status | Completion % | Notes |
|-------|--------|--------------|-------|
| Phase 1: Foundation | 🟢 Complete | 100% | OAuth2 authentication and setup complete |
| Phase 2: Travel | � Complete | 100% | Travel records feature complete |
| Phase 3: Expenses | � Complete | 100% | Miscellaneous expenses feature complete |
| Phase 4: Investments & Savings | � Complete | 100% | Investments tracking feature complete |
| Phase 5: Dashboard | 🟡 Not Started | 0% | - |
| Phase 6: Reports | 🟡 Not Started | 0% | - |
| Phase 7: Polish | 🟡 Not Started | 0% | - |
| Phase 8: Future | 🟡 Not Started | 0% | Optional |

**Legend:**
- 🟡 Not Started
- 🔵 In Progress
- 🟢 Complete
- 🔴 Blocked

---

## Conclusion

This roadmap provides a structured approach to building the iFinance application. As a solo developer:

- **Take Your Time:** No strict deadlines, work at your own pace
- **Stay Focused:** Complete one phase before moving to next
- **Iterate:** First version doesn't need to be perfect
- **Learn:** Use each phase as learning opportunity
- **Enjoy:** Building your own finance app should be fun!

**Remember:** The goal is to create a functional, personal finance app that helps you track expenses and identify spending patterns. Start simple, iterate, and enhance over time.

Good luck with your development! 🚀

---

**Last Updated:** November 10, 2025  
**Version:** 1.0.0  
**Status:** Ready for Development
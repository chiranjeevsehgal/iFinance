# iFinance - Personal Finance Web Application

## Project Overview
A personal finance management web application built with Spring Boot backend and Angular frontend with Tailwind CSS styling. The application helps track daily expenses, travel costs, and investments & savings with comprehensive reporting features.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Java Version**: 21
- **Build Tool**: Maven
- **Database**: MongoDB Atlas
- **ODM**: Spring Data MongoDB
- **API Style**: RESTful
- **Security**: Spring Security with OAuth2 (Google Sign-In)
- **Authentication**: OAuth2 Google authentication
- **Session Management**: HTTP sessions with MongoDB session store
- **Validation**: Jakarta Bean Validation
- **Documentation**: SpringDoc OpenAPI (Swagger)

### Frontend
- **Framework**: Angular 20
- **Node Version**: 22
- **Styling**: Tailwind CSS
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms
- **State Management**: RxJS / NgRx (for complex state)
- **Date Handling**: date-fns or Angular date pipes
- **Charts**: Chart.js or ng2-charts (for visualizations)

## Architecture Guidelines

### Backend Architecture
```
src/main/java/com/ifinance/
├── config/          # Configuration classes (MongoDB, Security, CORS, etc.)
├── controller/      # REST controllers
├── service/         # Business logic layer
├── repository/      # Data access layer (MongoDB repositories)
├── model/           # Document classes
│   ├── document/    # MongoDB documents
│   └── dto/         # Data Transfer Objects
├── security/        # Security configuration and OAuth2 handlers
├── exception/       # Custom exceptions and global exception handler
└── util/            # Utility classes
```

### Frontend Architecture
```
src/app/
├── core/            # Singleton services, guards, interceptors
│   ├── services/    # Core services (auth, API, etc.)
│   ├── guards/      # Route guards
│   ├── interceptors/ # HTTP interceptors
│   └── models/      # TypeScript interfaces/models
├── shared/          # Shared components, directives, pipes
│   ├── components/  # Reusable components
│   ├── directives/  # Custom directives
│   └── pipes/       # Custom pipes
├── features/        # Feature modules
│   ├── dashboard/   # Dashboard with summaries
│   ├── travel/      # Travel records management
│   ├── expenses/    # Miscellaneous expenses
│   ├── investments/ # Investments & savings tracking
│   └── reports/     # Reports and analytics
└── layout/          # Layout components (header, sidebar, footer)
```

## Core Features & Requirements

### 1. Daily Travel Records
**Purpose**: Track daily commute expenses (morning and evening)

**Backend Requirements**:
- Document: `TravelRecord`
  - Fields: id, userId, date, timeOfDay (MORNING/EVENING), cost, createdAt, updatedAt
  - Enum: `TimeOfDay` (MORNING, EVENING)
- API Endpoints:
  - `POST /api/travel` - Create travel record
  - `GET /api/travel` - Get all records (with pagination, filtering)
  - `GET /api/travel/{id}` - Get specific record
  - `PUT /api/travel/{id}` - Update record
  - `DELETE /api/travel/{id}` - Delete record
  - `GET /api/travel/date/{date}` - Get records by date
  - `GET /api/travel/summary` - Get travel summary (daily/weekly/monthly)

**Frontend Requirements**:
- Component: Travel records page with form and list view
- Quick entry form with morning/evening toggle
- Date picker (default to today)
- Input field: cost only
- List view showing all travel records with edit/delete options
- Filter by date range and time of day

### 2. Daily Miscellaneous Expenses
**Purpose**: Track various daily expenses outside of travel and investments

**Backend Requirements**:
- Document: `MiscExpense`
  - Fields: id, userId, date, category, amount, description, paymentMethod, createdAt, updatedAt
  - Enum: `ExpenseCategory` (FOOD, GROCERIES, ENTERTAINMENT, HEALTH, UTILITIES, SHOPPING, EDUCATION, OTHER)
  - Enum: `PaymentMethod` (CASH, UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING, OTHER)
  - Note: CREDIT_CARD is available as a payment method option here
- API Endpoints:
  - `POST /api/expenses` - Create expense
  - `GET /api/expenses` - Get all expenses (with pagination, filtering)
  - `GET /api/expenses/{id}` - Get specific expense
  - `PUT /api/expenses/{id}` - Update expense
  - `DELETE /api/expenses/{id}` - Delete expense
  - `GET /api/expenses/category/{category}` - Get by category
  - `GET /api/expenses/summary` - Get expense summary

**Frontend Requirements**:
- Quick expense entry form
- Category dropdown with icons
- Amount input with currency symbol
- Payment method selection
- Description field
- List view with filtering by category and date
- Visual category indicators (colored badges)

### 3. Investments & Savings
**Purpose**: Track investments and savings across various categories

**Backend Requirements**:
- Document: `Investment`
  - Fields: id, userId, date, category, amount, description, otherCategoryName, createdAt, updatedAt
  - Enum: `InvestmentCategory` (STOCKS, MUTUAL_FUNDS, FIXED_DEPOSIT, SAVINGS_ACCOUNT, GOLD, REAL_ESTATE, CRYPTO, OTHER)
- API Endpoints:
  - `POST /api/investments` - Create investment
  - `GET /api/investments` - Get all investments (with pagination, filtering)
  - `GET /api/investments/{id}` - Get specific investment
  - `PUT /api/investments/{id}` - Update investment
  - `DELETE /api/investments/{id}` - Delete investment
  - `GET /api/investments/category/{category}` - Get by category
  - `GET /api/investments/date-range?startDate={start}&endDate={end}` - Date range
  - `GET /api/investments/search?q={keyword}` - Search by description
  - `GET /api/investments/summary` - Get category-wise summary

**Frontend Requirements**:
- Investment entry form
- Date picker (default to today)
- Category dropdown with icons (stocks, mutual funds, FD, savings, gold, real estate, crypto, other)
- Conditional "Other Category Name" field (shown when OTHER selected)
- Amount input with currency symbol
- Description field
- List view showing all investments with edit/delete options
- Filter by category and date range
- Search by description
- Total investments display

### 4. Summary & Reports
**Purpose**: Provide daily, weekly, and monthly financial summaries

**Backend Requirements**:
- API Endpoints:
  - `GET /api/reports/daily?date={date}` - Daily summary
  - `GET /api/reports/weekly?startDate={date}` - Weekly summary
  - `GET /api/reports/monthly?year={year}&month={month}` - Monthly summary
  - `GET /api/reports/custom?startDate={date}&endDate={date}` - Custom date range
  - `GET /api/reports/category-breakdown?period={period}` - Expenses by category
  - `GET /api/reports/trends?months={count}` - Spending trends

**Response Format**:
```json
{
  "period": "DAILY/WEEKLY/MONTHLY",
  "startDate": "2025-11-10",
  "endDate": "2025-11-10",
  "totalTravel": 250.00,
  "totalMiscExpenses": 500.00,
  "totalInvestments": 1500.00,
  "grandTotal": 2250.00,
  "travelCount": 2,
  "expenseCount": 5,
  "investmentCount": 3,
  "breakdown": {
    "byCategory": {},
    "byPaymentMethod": {},
    "byInvestmentCategory": {}
  }
}
```

**Frontend Requirements**:
- Dashboard with summary cards showing totals
- Period selector (daily/weekly/monthly)
- Date range picker
- Visual charts:
  - Pie chart for category-wise breakdown
  - Bar chart for daily/weekly trends
  - Line chart for monthly trends
- Summary tables with drill-down capability
- Export functionality (CSV/PDF)

## Database Schema Guidelines

### MongoDB Collections

**User Collection**
```json
{
  "_id": ObjectId,
  "googleId": String,              // Google OAuth ID (unique)
  "email": String,                 // Email from Google
  "name": String,                  // Full name from Google
  "profilePicture": String,        // Profile picture URL from Google
  "createdAt": ISODate,
  "lastLogin": ISODate
}
```

**TravelRecord Collection**
```json
{
  "_id": ObjectId,
  "userId": ObjectId,              // Reference to User collection
  "date": ISODate,
  "timeOfDay": "MORNING|EVENING",
  "cost": Number,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

**MiscExpense Collection**
```json
{
  "_id": ObjectId,
  "userId": ObjectId,              // Reference to User collection
  "date": ISODate,
  "category": "FOOD|GROCERIES|ENTERTAINMENT|...",
  "amount": Number,
  "description": String,
  "paymentMethod": "CASH|UPI|DEBIT_CARD|...",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

**Investment Collection**
```json
{
  "_id": ObjectId,
  "userId": ObjectId,              // Reference to User collection
  "date": ISODate,
  "category": "STOCKS|MUTUAL_FUNDS|FIXED_DEPOSIT|...",
  "amount": Number,
  "description": String,
  "otherCategoryName": String,     // Required when category is OTHER
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Indexes
- **User collection**: `{ googleId: 1 }` (unique), `{ email: 1 }` (unique)
- **All data collections**: Compound index `{ userId: 1, date: -1 }` for user-specific queries
- **TravelRecord**: `{ userId: 1, date: 1, timeOfDay: 1 }`
- **MiscExpense**: `{ userId: 1, category: 1 }`
- **Investment**: `{ userId: 1, date: 1 }`, `{ userId: 1, category: 1 }`

## API Design Principles

### RESTful Conventions
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Use plural nouns for resources (/api/expenses, not /api/expense)
- Use HTTP status codes correctly:
  - 200 OK - Successful GET, PUT
  - 201 Created - Successful POST
  - 204 No Content - Successful DELETE
  - 400 Bad Request - Validation errors
  - 401 Unauthorized - Not authenticated
  - 403 Forbidden - Not authorized
  - 404 Not Found - Resource not found
  - 500 Internal Server Error - Server errors

### Request/Response Format
- All API requests and responses should use JSON
- Use DTOs for request/response bodies (don't expose documents directly)
- Include validation annotations (@NotNull, @NotBlank, @Min, @Max, etc.)
- Use pagination for list endpoints (page, size, sort parameters)

### Error Handling
- Implement global exception handler (@RestControllerAdvice)
- Return consistent error response format:
```json
{
  "timestamp": "2025-11-10T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {"field": "amount", "message": "Amount must be positive"}
  ]
}
```

## Security Requirements

### OAuth2 Authentication (Google Sign-In)
- **Authentication Provider**: Google OAuth2
- **Sign-In Method**: "Sign in with Google" button
- **User Registration**: Automatic on first Google sign-in
- **Session Management**: HTTP sessions stored in MongoDB
- **Authorization**: Users can only access their own data

### Security Implementation
- **Spring Security**: Configure OAuth2 client for Google
- **Protected Endpoints**: All `/api/**` endpoints require authentication
- **Public Endpoints**: `/`, `/login`, `/oauth2/**` (OAuth callback)
- **Session Store**: MongoDB-based session persistence (spring-session-data-mongodb)
- **CORS**: Configured for frontend origin (http://localhost:4200)
- **User Isolation**: All queries filtered by authenticated user's ID

### Google OAuth2 Configuration
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
```

### User Profile
- Automatically created from Google account on first sign-in
- Fields: googleId (unique), email, name, profilePicture
- Profile picture displayed in header
- User info endpoint: `GET /api/user/me`

### Data Access Control
- All data operations automatically filtered by logged-in user
- Service layer methods accept authenticated user from SecurityContext
- Repository queries include userId filter
- No cross-user data access possible

## UI/UX Guidelines

### Tailwind CSS Usage
- Use Tailwind utility classes for styling
- Create custom components in shared module for consistency
- Customize Tailwind config for glassmorphism theme
- Responsive design: mobile-first approach
- Use Tailwind forms plugin for better form styling

### Design Principles - Minimal Glass Theme (Glassmorphism)
- **Clean, minimalist interface** with glassmorphism aesthetic
- **Glass effect cards**: Use `backdrop-blur-md`, `bg-white/10` or `bg-gray-900/10` for semi-transparent backgrounds
- **Subtle borders**: `border border-white/20` or `border-gray-200/20`
- **Soft shadows**: `shadow-xl` with subtle colors, avoid harsh shadows
- **Frosted glass containers** for cards, modals, and forms
- **Minimal animations**: smooth transitions, hover effects with `transition-all duration-300`
- Consistent spacing and typography with light/thin font weights
- Use icons (Heroicons or Lucide icons for modern minimal look)
- Loading states with skeleton loaders (glass effect)
- Success/error toast notifications with glass styling
- Confirmation dialogs with backdrop blur
- Form validation with subtle, non-intrusive error messages

### Color Scheme - Minimal Glass Theme
- **Background**: Light mode with soft gradients (white to light gray/blue/purple)
  - Example: `bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50`
- **Glass Containers**: Semi-transparent white with blur
  - `bg-white/30 backdrop-blur-lg border border-white/50`
- **Text**: Dark gray for primary text, lighter gray for secondary
  - Primary: `text-gray-900`, Secondary: `text-gray-600`
- **Accents** (minimal use):
  - Success: Soft green (`green-500/70`) for income, positive balances
  - Expense: Soft red/pink (`red-500/70` or `rose-500/70`) for expenses
  - Highlight: Soft purple/indigo (`purple-500/70` or `indigo-500/70`) for interactive elements
  - Neutral: Soft gray (`gray-400/70`) for borders and dividers
- **Buttons**: Glass effect with hover states
  - Primary: `bg-white/40 hover:bg-white/60 backdrop-blur-md`
  - Secondary: `bg-gray-100/40 hover:bg-gray-100/60 backdrop-blur-md`
- **Avoid**: Heavy gradients, neon colors, harsh contrasts, solid backgrounds

### Glass Theme Implementation Tips
```css
/* Example Tailwind classes for glass cards */
.glass-card {
  @apply bg-white/30 backdrop-blur-lg rounded-2xl border border-white/50 shadow-xl;
}

.glass-input {
  @apply bg-white/20 backdrop-blur-md border border-white/40 rounded-lg 
         focus:bg-white/30 focus:border-white/60 transition-all;
}

.glass-button {
  @apply bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-lg 
         border border-white/50 transition-all duration-300;
}
```

### Tailwind Config Customization
```javascript
// tailwind.config.js additions
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

## Development Workflow

### Backend Development
1. Create document classes with @Document annotation
2. Create repository interfaces extending MongoRepository
3. Create service layer with business logic
4. Create DTOs and implement mapping (use MapStruct or manual mapping)
5. Create controller with REST endpoints
6. Add validation annotations
7. Write unit tests (JUnit 5, Mockito)
8. Test endpoints with Postman or Swagger UI

### Frontend Development
1. Generate components using Angular CLI
2. Create TypeScript interfaces matching backend DTOs
3. Create services for API communication
4. Implement components with Reactive Forms
5. Style with Tailwind CSS
6. Add error handling and loading states
7. Write unit tests (Jasmine, Karma)
8. Test in browser

### Testing
- Backend: Unit tests for services, integration tests for controllers
- Frontend: Component tests, service tests
- End-to-end testing: Consider Playwright or Cypress
- Manual testing for UI/UX flows

## Environment Configuration

### Backend (application.yml)
```yaml
spring:
  profiles:
    active: dev
  data:
    mongodb:
      uri: ${MONGODB_URI:mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ifinance?retryWrites=true&w=majority}
      database: ifinance
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
  
server:
  port: 8080

# CORS configuration
cors:
  allowed-origins: http://localhost:4200
  allowed-credentials: true
```

**Note**: Environment variables required:
- `MONGODB_URI` - MongoDB Atlas connection string
- `GOOGLE_CLIENT_ID` - Google OAuth2 Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth2 Client Secret

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authUrl: 'http://localhost:8080',
  dateFormat: 'yyyy-MM-dd',
  currency: '₹'
};
```

## Code Quality Standards

### Backend
- Follow Java naming conventions
- Use Lombok to reduce boilerplate (@Data, @Builder, @Document, @Id, etc.)
- Document public APIs with JavaDoc
- Use Optional for nullable returns
- Implement proper exception handling
- Use SLF4J for logging
- Keep methods small and focused (Single Responsibility Principle)
- Use @Indexed annotation for frequently queried fields in MongoDB documents

### Frontend
- Follow Angular style guide
- Use TypeScript strict mode
- Use async pipe in templates where possible
- Unsubscribe from observables (use takeUntil pattern)
- Use OnPush change detection where appropriate
- Keep components lean, move logic to services
- Use interfaces for type safety

## Deployment Considerations

### Backend
- Run locally for now (deployment to cloud can be added later)
- Use environment variables for MongoDB Atlas connection string
- Include health check endpoint: `GET /actuator/health`
- Configure CORS for frontend origin (http://localhost:4200)
- Set up logging with appropriate levels

### Frontend
- Build for production: `ng build --configuration production`
- Optimize bundle size (lazy loading, tree shaking)
- Configure proxy for API calls during development
- Set up environment-specific configurations

## Git Workflow
- Use meaningful commit messages
- Feature branches for new features
- Main/master branch for stable code
- Create .gitignore for both backend and frontend

## Additional Notes

### Future Enhancements (Out of Scope for MVP)
- Budget planning and alerts
- Recurring expense tracking
- Bill reminders
- Multi-currency support
- Data export/import
- Mobile app
- Receipt image upload
- Data sharing between users
- Investment tracking
- Admin dashboard

### Performance Optimization
- Implement caching for frequently accessed data (Spring Cache)
- Use pagination for large datasets
- Lazy loading for Angular modules
- Create appropriate indexes in MongoDB for common queries
- Use projection to fetch only required fields

### Monitoring & Logging
- Log important operations and errors
- Use Spring Boot Actuator for monitoring
- Consider application performance monitoring (APM) tools

## Quick Start Commands

### Backend
```bash
# Create Spring Boot project structure
mvn spring-boot:run

# Run tests
mvn test

# Build
mvn clean package
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
ng serve

# Run tests
ng test

# Build for production
ng build --configuration production
```

## Contact & Questions
- For architectural decisions, follow this document
- For clarifications, refer to specific feature requirements above
- Prioritize clean, maintainable code over quick implementations

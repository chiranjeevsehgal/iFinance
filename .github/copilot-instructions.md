# iFinance - Personal Finance Web Application

## Project Overview
A personal finance management web application built with Spring Boot backend and Angular frontend with Tailwind CSS styling. The application helps track daily expenses, travel costs, and credit card transactions with comprehensive reporting features.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Java Version**: 21
- **Build Tool**: Maven
- **Database**: MongoDB Atlas
- **ODM**: Spring Data MongoDB
- **API Style**: RESTful
- **Security**: None (single-user application, no authentication required)
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
├── config/          # Configuration classes (MongoDB, CORS, etc.)
├── controller/      # REST controllers
├── service/         # Business logic layer
├── repository/      # Data access layer (MongoDB repositories)
├── model/           # Document classes
│   ├── document/    # MongoDB documents
│   └── dto/         # Data Transfer Objects
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
│   ├── credit-card/ # Credit card transactions
│   └── reports/     # Reports and analytics
└── layout/          # Layout components (header, sidebar, footer)
```

## Core Features & Requirements

### 1. Daily Travel Records
**Purpose**: Track daily commute expenses (morning and evening)

**Backend Requirements**:
- Document: `TravelRecord`
  - Fields: id, date, timeOfDay (MORNING/EVENING), cost, createdAt, updatedAt
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
**Purpose**: Track various daily expenses outside of travel and credit cards

**Backend Requirements**:
- Document: `MiscExpense`
  - Fields: id, date, category, amount, description, paymentMethod, createdAt, updatedAt
  - Enum: `ExpenseCategory` (FOOD, GROCERIES, ENTERTAINMENT, HEALTH, UTILITIES, SHOPPING, EDUCATION, OTHER)
  - Enum: `PaymentMethod` (CASH, UPI, DEBIT_CARD, NET_BANKING, OTHER)
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

### 3. Credit Card Transactions
**Purpose**: Track credit card transactions with simple payment titles and amounts

**Backend Requirements**:
- Document: `CreditCardTransaction`
  - Fields: id, date, paymentTitle, amount, createdAt, updatedAt
  - Note: No card management - simplified single collection for all credit card transactions
- API Endpoints:
  - `POST /api/credit-card-transactions` - Add transaction
  - `GET /api/credit-card-transactions` - Get all transactions (with pagination, filtering)
  - `GET /api/credit-card-transactions/{id}` - Get specific transaction
  - `PUT /api/credit-card-transactions/{id}` - Update transaction
  - `DELETE /api/credit-card-transactions/{id}` - Delete transaction
  - `GET /api/credit-card-transactions/date/{date}` - Get transactions by date
  - `GET /api/credit-card-transactions/summary` - Get transaction summary

**Frontend Requirements**:
- Simple transaction entry form
- Date picker (default to today)
- Payment title input (free text, few words describing the transaction)
- Amount input with currency symbol
- Transaction list showing all records with edit/delete options
- Filter by date range
- Search by payment title

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
  "totalCreditCardExpenses": 1500.00,
  "grandTotal": 2250.00,
  "travelCount": 2,
  "expenseCount": 5,
  "creditCardTransactionCount": 3,
  "breakdown": {
    "byCategory": {},
    "byPaymentMethod": {},
    "byTravelMode": {}
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

**TravelRecord Collection**
```json
{
  "_id": ObjectId,
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
  "date": ISODate,
  "category": "FOOD|GROCERIES|ENTERTAINMENT|...",
  "amount": Number,
  "description": String,
  "paymentMethod": "CASH|UPI|DEBIT_CARD|...",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

**CreditCardTransaction Collection**
```json
{
  "_id": ObjectId,
  "date": ISODate,
  "paymentTitle": String,
  "amount": Number,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Indexes
- Create indexes on: date fields (for all collections)
- Text index on paymentTitle for credit card transactions (for search)
- Compound index on (date, timeOfDay) for travel records

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

### No Authentication (Single-User Application)
- This is a single-user local application with no authentication
- All API endpoints are publicly accessible
- No user management or login required
- CORS should be configured to allow frontend origin (http://localhost:4200)

**Note**: If multi-user support is needed in the future, JWT authentication can be added

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
  
server:
  port: 8080

# CORS configuration
cors:
  allowed-origins: http://localhost:4200
```

**Note**: Store MongoDB Atlas connection string in environment variable `MONGODB_URI`

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
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
- Expense sharing/splitting
- Investment tracking

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

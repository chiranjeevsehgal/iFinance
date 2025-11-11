# iFinance Backend

Personal Finance Management Application - Spring Boot Backend with OAuth2 Authentication

## Technology Stack

- **Java**: 21
- **Spring Boot**: 3.4.0
- **Database**: MongoDB Atlas
- **Authentication**: OAuth2 (Google)
- **Session Store**: MongoDB
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven

## Prerequisites

1. **Java 21** installed
2. **Maven** installed (or use Maven wrapper)
3. **MongoDB Atlas** account and cluster
4. **Google Cloud Platform** account for OAuth2 credentials

## Setup Instructions

### 1. Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "iFinance"
3. Enable Google+ API
4. Go to "APIs & Services" → "Credentials"
5. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:4200`, `http://localhost:8080`
   - Authorized redirect URIs: `http://localhost:8080/login/oauth2/code/google`
6. Save the **Client ID** and **Client Secret**

### 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database: `ifinance`
4. Create a database user with read/write permissions
5. Get the connection string (replace `<username>` and `<password>`)

### 3. Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Copy from .env.example and fill in your values
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ifinance?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

**Quick Setup:**
```bash
# Copy the example file
copy .env.example .env

# Edit .env file with your actual credentials
notepad .env
```

**Note**: The `.env` file is automatically loaded by the application. Never commit this file to git!

### 4. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation

Once the application is running, access the Swagger UI:

**Swagger UI**: http://localhost:8080/swagger-ui.html

## Available Endpoints

### Public Endpoints
- `GET /` - Welcome message and API info
- `GET /actuator/health` - Health check
- `GET /oauth2/authorization/google` - Initiate Google OAuth2 login

### Protected Endpoints (Require Authentication)
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/me` - Update current user profile

## Project Structure

```
src/main/java/com/ifinance/
├── IFinanceApplication.java          # Main application class
├── config/
│   ├── MongoConfig.java              # MongoDB configuration
│   ├── SecurityConfig.java           # Spring Security & OAuth2
│   ├── CorsConfig.java               # CORS configuration
│   └── OpenApiConfig.java            # Swagger configuration
├── security/
│   ├── OAuth2LoginSuccessHandler.java # OAuth2 success handler
│   └── CustomOAuth2UserService.java   # Custom OAuth2 user service
├── controller/
│   ├── WelcomeController.java        # Root endpoint
│   └── UserController.java           # User profile endpoints
├── service/
│   └── UserService.java              # User business logic
├── repository/
│   └── UserRepository.java           # User data access
├── model/
│   ├── document/
│   │   └── User.java                 # User document
│   └── dto/
│       └── UserDto.java              # User DTO
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   ├── ValidationException.java
│   └── GlobalExceptionHandler.java   # Global error handler
└── util/
    └── SecurityUtil.java             # Security utilities
```

## Configuration

The application configuration is in `src/main/resources/application.yml`:

- **Server Port**: 8080
- **MongoDB**: Atlas connection
- **OAuth2**: Google authentication
- **Session**: MongoDB-backed sessions (7 days timeout)
- **CORS**: Configured for `http://localhost:4200`

## MongoDB Collections

The application uses the following collections:

1. **users** - User profiles from Google OAuth
2. **sessions** - HTTP session data (auto-managed by Spring Session)

## Testing

Run tests with Maven:

```bash
mvn test
```

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas connection string
- Check that your IP address is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### OAuth2 Issues
- Verify Google Client ID and Secret are correct
- Check authorized redirect URIs in Google Cloud Console
- Ensure `http://localhost:8080/login/oauth2/code/google` is added

### Port Already in Use
If port 8080 is already in use, change it in `application.yml`:
```yaml
server:
  port: 8081
```

## Development

### Adding New Endpoints

1. Create document class in `model/document/`
2. Create repository interface in `repository/`
3. Create service class in `service/`
4. Create controller in `controller/`
5. Add Swagger annotations

### User Isolation

All data operations should filter by authenticated user:

```java
String userId = SecurityUtil.getCurrentUserId();
// Use userId to filter data
```

## Next Steps

- [x] Set up frontend Angular application
- [x] Implement travel records feature
- [x] Implement expenses feature
- [x] Implement investments & savings feature
- [ ] Add dashboard and reports

## License

MIT License

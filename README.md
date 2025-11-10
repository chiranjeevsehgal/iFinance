# iFinance - Personal Finance Web Application

A personal finance management web application built with Spring Boot backend and Angular frontend with Tailwind CSS styling.

## Project Status

✅ **Phase 1 - In Progress**: Foundation & OAuth2 Authentication Setup

### Completed:
- ✅ Spring Boot backend project structure created
- ✅ MongoDB document models (User)
- ✅ OAuth2 Google authentication configuration
- ✅ Security configuration with Spring Security
- ✅ User management service and repository
- ✅ Exception handling framework
- ✅ CORS configuration
- ✅ OpenAPI/Swagger documentation setup
- ✅ Frontend project structure created
- ✅ Tailwind CSS configuration with glass theme

### Next Steps:
1. **Set up Google OAuth2 credentials** (see below)
2. **Set up MongoDB Atlas** (see below)
3. **Install frontend dependencies**
4. **Complete authentication implementation**
5. **Test end-to-end OAuth flow**

## Prerequisites

### Required Software
- **Java 21** - [Download](https://www.oracle.com/java/technologies/downloads/#java21)
- **Node.js 22** - [Download](https://nodejs.org/)
- **Maven** - [Download](https://maven.apache.org/download.cgi) (or use Maven wrapper)
- **Git** - [Download](https://git-scm.com/)

### Cloud Services
- **Google Cloud Platform** account (for OAuth2) - [Sign up](https://console.cloud.google.com/)
- **MongoDB Atlas** account (for database) - [Sign up](https://www.mongodb.com/cloud/atlas)

## Setup Instructions

### 1. Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: **"iFinance"**
3. Enable **Google+ API** or **People API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "People API"
   - Click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Configure consent screen if prompted:
     - User Type: External
     - App name: iFinance
     - User support email: your email
     - Developer contact: your email
   - Application type: **Web application**
   - Name: iFinance Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:4200`
     - `http://localhost:8080`
   - **Authorized redirect URIs**:
     - `http://localhost:8080/login/oauth2/code/google`
   - Click "Create"
5. **Save the Client ID and Client Secret** (you'll need these)

### 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account if you don't have one
3. Create a new cluster (free tier is fine):
   - Choose a cloud provider (AWS/GCP/Azure)
   - Select a region close to you
   - Cluster name: ifinance-cluster
4. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `ifinance_user` (or your choice)
   - Password: Generate a secure password
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
5. Whitelist your IP address:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IP
6. Get connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Driver: Java / Version: 4.3 or later
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `ifinance`

Example: `mongodb+srv://ifinance_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ifinance?retryWrites=true&w=majority`

### 3. Configure Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend

# Copy the example file
copy .env.example .env

# Edit .env with your credentials (use notepad or any text editor)
notepad .env
```

Fill in your actual values in the `.env` file:

```env
MONGODB_URI=mongodb+srv://ifinance_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ifinance?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

**Important:** 
- The `.env` file is already in `.gitignore` and won't be committed to git
- Never share your `.env` file or commit it to version control
- The application automatically loads values from `.env` on startup

### 4. Install and Run Backend

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Verify backend is running:**
- Open browser: http://localhost:8080
- You should see: `{"application":"iFinance API","version":"1.0.0",...}`
- Swagger UI: http://localhost:8080/swagger-ui.html

### 5. Install and Run Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# or
ng serve
```

The frontend will start on `http://localhost:4200`

## Current Project Structure

```
iFinance/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/ifinance/
│   │   ├── IFinanceApplication.java
│   │   ├── config/            # Configuration classes
│   │   ├── security/          # OAuth2 security
│   │   ├── controller/        # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access
│   │   ├── model/             # Documents and DTOs
│   │   ├── exception/         # Exception handling
│   │   └── util/              # Utilities
│   ├── src/main/resources/
│   │   └── application.yml    # Backend configuration
│   ├── pom.xml                # Maven dependencies
│   └── README.md              # Backend documentation
│
├── frontend/                   # Angular frontend
│   ├── src/
│   │   ├── app/               # Angular application (to be created)
│   │   ├── index.html         # Main HTML file
│   │   ├── main.ts            # Bootstrap file
│   │   └── styles.css         # Global styles with Tailwind
│   ├── package.json           # Node dependencies
│   ├── angular.json           # Angular configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── tsconfig.json          # TypeScript configuration
│   └── SETUP.md               # Frontend setup guide
│
├── docs/                       # Documentation
│   ├── PRD.md                 # Product Requirements
│   └── ROADMAP.md             # Development roadmap
│
└── README.md                  # This file
```

## Next Development Steps

### Immediate (Phase 1 - Week 1):

1. **Complete Angular App Structure:**
   ```bash
   cd frontend/src/app
   # Create components, services, guards
   ```

2. **Implement Authentication Services:**
   - Create `AuthService` for OAuth2 flow
   - Create `UserService` for profile management
   - Create `AuthGuard` for route protection
   - Create HTTP interceptors

3. **Create Login Page:**
   - Design glass-themed login page
   - Add "Sign in with Google" button
   - Handle OAuth2 redirect

4. **Create Layout Components:**
   - Header with user profile
   - Sidebar navigation
   - Glass-themed design

5. **Test Authentication Flow:**
   - Test login with Google
   - Verify session persistence
   - Test logout
   - Test route guards

### Upcoming Phases:

- **Phase 2**: Travel Records Feature (CRUD operations)
- **Phase 3**: Miscellaneous Expenses Feature
- **Phase 4**: Credit Card Transactions Feature
- **Phase 5**: Dashboard & Summary
- **Phase 6**: Reports & Analytics
- **Phase 7**: Polish & Optimization
- **Phase 8**: Deployment

## Development Workflow

### Backend Development:
```bash
cd backend
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### Frontend Development:
```bash
cd frontend
npm start
# Frontend runs on http://localhost:4200
```

### Running Both:
Open two terminal windows and run backend and frontend separately.

## API Documentation

Once the backend is running:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

## Troubleshooting

### Backend Issues:

**MongoDB Connection Error:**
- Verify MongoDB URI is correct
- Check network access settings in MongoDB Atlas
- Ensure IP address is whitelisted

**OAuth2 Error:**
- Verify Google Client ID and Secret are correct
- Check redirect URI is exactly: `http://localhost:8080/login/oauth2/code/google`
- Ensure OAuth2 consent screen is configured

**Port 8080 Already in Use:**
- Change port in `application.yml`: `server.port: 8081`
- Update frontend API URL accordingly

### Frontend Issues:

**npm install fails:**
- Ensure Node.js 22 is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then retry

**Port 4200 Already in Use:**
- Kill the process or use different port: `ng serve --port 4201`

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)

## Contributing

This is a personal project for learning and practice. Feel free to fork and modify for your own use.

## License

MIT License

---

**Happy Coding! 🚀**

For detailed technical specifications, see:
- [Product Requirements Document](docs/PRD.md)
- [Development Roadmap](docs/ROADMAP.md)
- [Backend README](backend/README.md)

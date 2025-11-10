# iFinance 💰

> A modern personal finance management web application for tracking daily expenses, travel costs, and credit card transactions.

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-20-red.svg)](https://angular.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

iFinance is a comprehensive personal finance management solution designed to help you track and manage your daily financial activities with ease. Built with modern technologies and featuring a beautiful glassmorphism UI, it offers a seamless experience for monitoring your expenses, travel costs, and credit card transactions.

### ✨ Key Features

**Currently Available:**

- 🔐 **Secure Authentication** - Google OAuth2 sign-in with session management
- 🚗 **Travel Tracking** - Monitor daily commute expenses (morning and evening)
- 💳 **Expense Management** - Track miscellaneous expenses by category and payment method
- 🎨 **Beautiful UI** - Modern glassmorphism design with Tailwind CSS
- 📊 **Smart Filtering** - Filter and search your financial data effortlessly
- 👤 **User Isolation** - Your data is private and secure

---

## 🚀 Technology Stack

### Backend

- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: OAuth2 (Google Sign-In)
- **Security**: Spring Security with session management
- **API Documentation**: OpenAPI 3 (Swagger)
- **Build Tool**: Maven

### Frontend

- **Framework**: Angular 20 (Standalone Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism theme
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms with validation
- **Routing**: Angular Router with guards

### Architecture

- **Pattern**: RESTful API with service-oriented architecture
- **Authentication**: OAuth2 with Google
- **Data Access**: MongoDB with Spring Data
- **Session Store**: MongoDB-based HTTP sessions
- **CORS**: Configured for local development

---

## 🎯 What Makes iFinance Special?

### 🎨 Modern Glassmorphism Design

- Beautiful semi-transparent UI elements
- Smooth backdrop blur effects
- Subtle shadows and borders
- Gradient backgrounds
- Responsive and mobile-friendly

### 🔒 Privacy & Security

- Secure Google OAuth2 authentication
- All data isolated per user
- Session-based security with MongoDB
- No cross-user data access
- Environment-based configuration

### ⚡ Developer-Friendly

- Clean, maintainable code
- Well-documented APIs
- Clear project structure
- Swagger API documentation
- Easy to extend and customize

### 📱 Smart Features

- **Custom Categories**: Create your own expense categories
- **Multiple Payment Methods**: Cash, UPI, Debit Card, Credit Card
- **Advanced Filters**: Filter by date range, category, payment method
- **Search**: Find transactions by description
- **Summaries**: Automatic calculation of totals and breakdowns

---

## 🏃 Quick Start

### Prerequisites

- Java 21 or higher
- Node.js 22 or higher
- MongoDB Atlas account (free tier works)
- Google Cloud Platform account (for OAuth2)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/chiranjeevsehgal/iFinance.git
   cd iFinance
   ```

2. **Set up MongoDB Atlas**

   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a database user
   - Whitelist your IP address
   - Get your connection string

3. **Set up Google OAuth2**

   - Create a project at [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:8080/login/oauth2/code/google`
   - Save Client ID and Client Secret

4. **Configure Backend**

   ```bash
   cd backend
   # Create .env file
   echo MONGODB_URI=your_mongodb_connection_string > .env
   echo GOOGLE_CLIENT_ID=your_google_client_id >> .env
   echo GOOGLE_CLIENT_SECRET=your_google_client_secret >> .env
   ```

5. **Run Backend**

   ```bash
   mvn spring-boot:run
   # Backend starts at http://localhost:8080
   ```

6. **Run Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   # Frontend starts at http://localhost:4200
   ```

7. **Access the Application**
   - Open http://localhost:4200
   - Click "Sign in with Google"
   - Start tracking your finances!

---

## 📖 Usage Guide

### Adding Travel Expenses

1. Navigate to **Travel Records** from the dashboard
2. Click **+ Add Travel Record**
3. Select date (defaults to today)
4. Choose time (Morning ☀️ or Evening 🌙)
5. Enter cost
6. Click **Save**

### Tracking Daily Expenses

1. Navigate to **Expenses** from the dashboard
2. Click **+ Add Expense**
3. Select date
4. Choose category (Food, Groceries, Shopping, etc.)
   - Select "Other" to create custom category
5. Enter amount
6. Choose payment method
7. Add optional description
8. Click **Save**

### Filtering & Search

- Use date range filters to view specific periods
- Filter by category or payment method
- Search transactions by description
- View total amounts automatically calculated

---

## 🤝 Contributing

This is a side project, but suggestions and feedback are welcome!

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add my feature'`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

---

<div align="center">

⭐ Star this repo if you find it helpful!

</div>

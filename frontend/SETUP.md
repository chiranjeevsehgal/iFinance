# iFinance Frontend Setup Guide

## Prerequisites

- **Node.js 22** installed
- **npm** package manager

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The application requires environment configuration files. You have two options:

**Option A: Use the setup script (Windows)**
```bash
setup-env.bat
```

**Option B: Manual setup**
```bash
cd src/environments
copy environment.template.ts environment.ts
copy environment.prod.template.ts environment.prod.ts
```

See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed instructions.

### 3. Run Development Server

```bash
npm start
# or
ng serve
```

The app will be available at `http://localhost:4200`

## Manual Alternative

If you prefer to skip the Angular CLI:

1. Copy the pre-built Angular project files from this repository
2. Run `npm install` in the frontend directory
3. Run `npm start` to start the development server

## Next Steps

After setup is complete:
1. Configure environment files for API URLs
2. Implement authentication services
3. Create layout components
4. Build feature modules

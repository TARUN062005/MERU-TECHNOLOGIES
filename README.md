# FinDash - Invoice Management Application

A complete, production-ready Full-Stack Invoice Management Application rebuilt securely from scratch without any mock values, inline data, templates, or third-party CSS libraries. 

## 🛠️ Technology Stack
- **Frontend**: React + Vite + Custom CSS + React Router DOM + Axios
- **Backend**: Node.js + Express + MongoDB + Mongoose 
- **Authentication**: JWT + Google OAuth 2.0
- **Email Service**: Nodemailer (Gmail SMTP)

---

## 📋 Table of Contents
- [Features](#-application-features)
- [Project Structure](#-project-structure)
- [Session Management](#-session-management)
- [Setup & Installation](#-setup--installation)
- [Environment Setup](#-environment-setup)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## 🔥 Application Features
- **Live Preview Dashboarding**: Full Split-Screen view during Invoice Initialization updating precisely in real-time as state data updates locally.
- **Strict No Overpayments Backend Validator**: Rejects arbitrary values over `BalanceDue` via the backend services, calculating lines efficiently dynamically.
- **Status Autosyncs**: Auto-tags the Invoice Status as `PAID` once the specific payload targets compute exactly a zero `BalanceDue`.
- **Global Toast Notification Context**: Alerts user visually across the architecture successfully across validations, insertions, edits, or archives synchronously.
- **REST APIs Complete Isolation**: Database abstractions strictly limited internally within the `invoiceService` class layers decoupled cleanly from explicit route mapping `invoiceRoutes`.
- **Session Management with Inactivity Timeout**: Automatically logs out users after 15 minutes of inactivity. Previous session data is cleared, and users are redirected to the dashboard after login.
- **Secure Authentication**: JWT tokens with email verification and Google OAuth integration.

---

## 📁 Project Structure

```
invoice-app/
├── frontend/                      # React + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js  # Axios configuration with JWT interceptors
│   │   │   └── invoiceApi.js     # Invoice API calls
│   │   ├── components/
│   │   │   ├── common/           # Reusable components (Button, Card, Modal, etc.)
│   │   │   ├── invoice/          # Invoice-specific components
│   │   │   ├── payment/          # Payment components
│   │   │   ├── layout/           # Layout components (Header, Sidebar, ProtectedRoute)
│   │   │   ├── notification/     # Notification components
│   │   │   └── currency/         # Currency selector
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication & Session Management
│   │   │   └── NotificationContext.jsx # Toast notifications
│   │   ├── hooks/
│   │   │   ├── useInvoices.js    # Fetch all invoices
│   │   │   ├── useInvoice.js     # Fetch single invoice
│   │   │   └── useCreateInvoice.js # Create/update invoice
│   │   ├── pages/                # Route components
│   │   ├── styles/               # Custom CSS
│   │   ├── App.jsx               # Main app routing
│   │   └── main.jsx              # Entry point
│   ├── .env.example              # Environment variables template
│   ├── .env                       # Environment variables (not in git)
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                       # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js # Auth logic (register, login, verify, etc.)
│   │   │   └── invoiceController.js # Invoice CRUD operations
│   │   ├── middleware/
│   │   │   └── authMiddleware.js # JWT verification middleware
│   │   ├── models/               # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Invoice.js
│   │   │   ├── InvoiceLine.js
│   │   │   ├── Payment.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # Auth endpoints
│   │   │   └── invoiceRoutes.js # Invoice endpoints
│   │   ├── services/
│   │   │   └── invoiceService.js # Business logic for invoices
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Server startup
│   ├── .env.example             # Environment variables template
│   ├── .env                      # Environment variables (not in git)
│   ├── package.json
│   ├── seed.js                  # Database seeding script
│   └── README.md
│
└── README.md                     # This file
```

---

## ⏱️ Session Management

### Session Timeout Details
- **Timeout Duration**: 15 minutes (900,000 milliseconds)
- **Inactivity Check**: Every 1 minute
- **User Activity Tracked**: Keyboard input, mouse movement, clicks, scrolling, touch inputs
- **Behavior on Timeout**: Automatic logout with warning notification

### How It Works
1. When user logs in successfully, session timers are initialized
2. User activity (clicks, typing, scrolling, etc.) resets the inactivity counter
3. If no activity is detected for 15 minutes, the user is logged out automatically
4. All previous session data is cleared from localStorage
5. After logout and subsequent login, user is redirected to the **Dashboard**, not the previous page
6. Upon automatic logout, a warning notification appears

### Session Reset on Login
- Previous sessions are completely cleared
- All cached data is removed
- User starts with a fresh session
- Redirects to dashboard, regardless of where they were before logout

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas)
- **Gmail Account** (for email verification)
- **Google OAuth Credentials** (for Google Sign-in)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd invoice-app

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

See the [Environment Setup](#-environment-setup) section below.

### Step 3: Start MongoDB

```bash
# If running MongoDB locally
mongod

# OR use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your Atlas connection string
```

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### Step 5: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` or `http://localhost:3000`

---

## 🔐 Environment Setup

### Backend Environment Variables (.env)

Copy `.env.example` to `.env` and fill in your actual values:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
# Server Port
PORT=5000

# MongoDB Connection String
# Local MongoDB:
MONGO_URI="mongodb://localhost:27017/invoice-app"
# OR MongoDB Atlas:
MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority"

# JWT Secret Key (use a strong random string)
JWT_SECRET="your_super_secret_jwt_key_here_change_in_production"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID_HERE"

# Gmail SMTP Credentials
EMAIL_USER="your_gmail_email@gmail.com"
EMAIL_PASS="your_gmail_app_specific_password"
```

### Frontend Environment Variables (.env)

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```env
# Google Client ID (same as backend)
VITE_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID_HERE"

# Backend API URL
VITE_API_URL="http://localhost:5000/api"
```

---

## 🔑 Obtaining Credentials

### 1. Google OAuth Client ID

#### Step 1: Go to Google Cloud Console
- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Sign in with your Google account

#### Step 2: Create a New Project
- Click on the project dropdown at the top
- Click "NEW PROJECT"
- Enter project name: "FinDash" (or your preferred name)
- Click "CREATE"

#### Step 3: Enable Google Auth API
- In the left sidebar, click "APIs & Services" → "Library"
- Search for "Google+ API"
- Click on it and press "ENABLE"

#### Step 4: Create OAuth 2.0 Credentials
- Go to "APIs & Services" → "Credentials"
- Click "CREATE CREDENTIALS" → "OAuth client ID"
- You may be asked to configure the OAuth consent screen first:
  - Choose "External" user type
  - Fill in the required fields (App name, user support email, etc.)
  - Add scopes: `email`, `profile`, `openid`
  - Save and continue
  
#### Step 5: Configure Redirect URIs
- Application type: "Web application"
- Name: "FinDash App"
- Authorized JavaScript origins:
  ```
  http://localhost:3000
  http://localhost:5173
  <your-production-domain>
  ```
- Authorized redirect URIs:
  ```
  http://localhost:3000/dashboard
  http://localhost:5173/dashboard
  <your-production-domain>/dashboard
  ```
- Click "CREATE"

#### Step 6: Copy Client ID
- Your Google Client ID will be displayed (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
- Copy this to both:
  - `backend/.env` → `GOOGLE_CLIENT_ID`
  - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID`

---

### 2. Gmail App-Specific Password

#### Step 1: Enable 2-Factor Authentication
- Go to [gmail.com](https://gmail.com)
- Click your profile → "Manage your Google Account"
- Go to "Security" tab
- Enable "2-Step Verification" if not already enabled

#### Step 2: Create App Password
- In the Security tab, scroll down to "App passwords"
- Select app: "Mail"
- Select device: "Windows Computer" (or your device)
- Google will generate a 16-character password
- Copy this password

#### Step 3: Configure Email Credentials
- Add to `backend/.env`:
  ```env
  EMAIL_USER="your_gmail_email@gmail.com"
  EMAIL_PASS="the_16_character_app_password_without_spaces"
  ```

**Note**: Use your Gmail app-specific password (16 characters), not your regular Gmail password.

---

### 3. MongoDB Connection

#### Option A: Local MongoDB
```env
MONGO_URI="mongodb://localhost:27017/invoice-app"
```
Ensure MongoDB daemon is running on your machine.

#### Option B: MongoDB Atlas (Cloud)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user with username and password
5. Whitelist your IP address (or 0.0.0.0 for development)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority`
7. Add to `backend/.env`:
   ```env
   MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority"
   ```

---

## 📖 API Documentation Summary

The backend uses RESTful standards exposing pure business models safely.

### Authentication Endpoints
- `POST /api/auth/register` - Register new user (sends verification email)
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/verify` - Verify email with token
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/change-password` - Change user password
- `PUT /api/auth/profile` - Update user profile

### Invoice Endpoints
- `POST /api/invoices` - Bootstraps an initial invoice including its default array lines natively
- `GET /api/invoices/:id` - Populates invoice models deep binding `lineItems` and `payments` records natively utilizing Mongo
- `POST /api/invoices/:id/lines` - Commits a novel `LineItem` entry specifically pushing it securely against its parent invoice constraint recalculating values automatically
- `POST /api/invoices/:id/payments` - Deposits payment allocations updating limits globally processing exceptions smoothly
- `POST /api/invoices/:id/archive` & `restore` - Toggles boolean status flags safely updating UI representation correctly

---

## 🧪 Testing the Application

### Test User
After the application starts, you can either:
1. **Register a new account** (verify email with the token sent)
2. **Use the seed script**:
   ```bash
   cd backend
   npm run seed
   ```

### Test Google OAuth
1. Click "Sign in with Google" on the login page
2. Select your Google account
3. You'll be logged in and redirected to the dashboard

### Test Session Timeout
1. Login to the application
2. Leave it idle for 15 minutes without any activity
3. You'll see a notification: "Session expired due to inactivity. Please login again"
4. You'll be automatically logged out

---

## 📦 Build for Production

### Frontend Build
```bash
cd frontend
npm run build
# Creates optimized build in dist/ folder
```

### Backend Production Setup
1. Update `.env` with production credentials:
   ```env
   NODE_ENV=production
   MONGO_URI=<your-production-mongo-uri>
   JWT_SECRET=<use-a-strong-random-string>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   EMAIL_USER=<your-gmail>
   EMAIL_PASS=<your-app-password>
   ```

2. Start server:
   ```bash
   npm start
   ```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- **Problem**: `MongoNetworkError` or connection timeout
- **Solution**:
  - Ensure MongoDB is running: `mongod`
  - Check `MONGO_URI` in `.env` is correct
  - For Atlas, verify IP is whitelisted

### Email Not Sending
- **Problem**: Verification emails not received
- **Solution**:
  - Use Gmail app-specific password (not regular password)
  - Enable "Less secure app access" (for non-2FA accounts)
  - Check spam folder
  - Verify `EMAIL_USER` and `EMAIL_PASS` are correct

### Google OAuth Not Working
- **Problem**: "Invalid Client ID" or redirect URI mismatch
- **Solution**:
  - Verify `VITE_GOOGLE_CLIENT_ID` matches Google Cloud Console
  - Check redirect URIs in Google Cloud Console include localhost ports
  - Clear browser cookies and cache
  - Restart frontend dev server

### Session Timing Out Too Quickly
- **Problem**: Getting logged out unexpectedly
- **Solution**:
  - Session timeout is 15 minutes of inactivity
  - Keep interacting with the page (click, scroll, type) to extend session
  - Check browser console for errors

### CORS Errors
- **Problem**: `Access to XMLHttpRequest blocked by CORS`
- **Solution**:
  - Ensure backend is running on `http://localhost:5000`
  - Check `VITE_API_URL` in frontend `.env`
  - Backend should have CORS enabled for localhost

---

## 📝 Notes

- Never commit `.env` files to git (they're in `.gitignore`)
- Always use `.env.example` as template for new developers
- Session timeout is 15 minutes - adjust `SESSION_TIMEOUT` constant in `AuthContext.jsx` if needed
- On logout, all previous session data is cleared automatically
- After login, user always goes to dashboard, regardless of previous page

---

## 📄 License

This project is private and confidential.


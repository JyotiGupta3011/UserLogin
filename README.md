# UserLogin — Decoupled MERN Stack Auth App

A full-stack authentication system built with React, Node.js, Express, MongoDB, and JWT. Supports user registration, login, and OTP-based email verification.

---

## 🏗️ Architecture

| Layer | Tech | Hosting |
|---|---|---|
| Frontend | React.js (SPA) | Vercel |
| Backend | Node.js + Express (REST API) | Render |
| Database | MongoDB Atlas | Cloud |
| Auth | JWT + Bcrypt.js | — |

---

## 📂 Project Structure
```
UserLogin/
├── backend/
│   ├── config/         # Database connection (db.js)
│   ├── controllers/    # Logic handlers (authController.js)
│   ├── middleware/     # Rate limiting (rateLimit.js)
│   ├── models/         # Schemas (User.js)
│   ├── routes/         # Endpoints (authRoutes.js)
│   ├── utils/          # Helpers (sendOTP.js)
│   ├── .env            # Environment variables (local only)
│   └── server.js       # Entry point
└── src/
    ├── Components/     # Reusable UI (Navbar, etc.)
    ├── Page/           # Screens (Login, Register, Verify)
    ├── App.js          # Router
    └── index.js        # React DOM entry
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder:
```env
# Network
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret

# Email (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> ⚠️ Never commit your `.env` file. See [Git Security](#-git-security) below.

---

## 🛠️ Installation & Setup

### 1. Backend
```bash
cd backend
npm install express mongoose dotenv cors jsonwebtoken bcryptjs otp-generator nodemailer express-rate-limit
npm install --save-dev nodemon
```

Start the server:
```bash
npx nodemon server.js
```

### 2. Frontend

From the root directory:
```bash
npm install axios react-router-dom lucide-react
```

Start the app:
```bash
npm start
```

---

## 🚀 Quick Command Reference

| Task | Command |
|---|---|
| Install backend deps | `cd backend && npm install` |
| Install frontend deps | `npm install` |
| Start backend | `npx nodemon server.js` |
| Start frontend | `npm start` |

---

## 🛡️ Git Security

Add a `.gitignore` to your root folder to keep secrets out of version control:
```
node_modules/
.env
.DS_Store
build/
dist/
```

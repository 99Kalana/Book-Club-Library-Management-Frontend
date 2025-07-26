📚 Book Club Library Management - Backend
This repository contains the backend API for the Book Club Library Management web application. It is built with Node.js and Express.js, providing RESTful endpoints for managing books, readers, lending, user authentication, and system audit logs.

✨ Features
User Authentication & Authorization: Secure signup, login, logout, and token refresh for librarian users. Role-based access control ensures only authorized users can perform specific actions.

Password Management: Robust "Forgot Password" and "Reset Password" functionality via email.

User Profile Management: Librarians can securely view and update their profile details (name, email, password).

Book Management: Comprehensive CRUD (Create, Read, Update, Delete) operations for managing library book records.

Reader Management: Full CRUD capabilities for managing library reader profiles.

Lending System: Efficiently manage book lending and return processes.

Overdue Books Tracking: Automated identification and management of overdue books.

Notifications: System for handling and sending various notifications (e.g., overdue reminders, system alerts).

Audit Logging: Detailed and immutable logging of key system actions (e.g., user logins, book additions, lending events) for accountability and tracking.

Centralized Error Handling: Robust and consistent error handling for all API endpoints.

🚀 Technologies Used
Node.js: JavaScript runtime environment.

Express.js: Fast, unopinionated, minimalist web framework for Node.js.

MongoDB: Flexible NoSQL database for storing application data.

Mongoose: Elegant MongoDB object modeling for Node.js.

TypeScript: Strongly typed superset of JavaScript that compiles to plain JavaScript.

JWT (JSON Web Tokens): For secure and stateless authentication.

Bcrypt: Library to hash passwords for secure storage.

Nodemailer: Module for Node.js applications to allow easy email sending.

Dotenv: Loads environment variables from a .env file.

Cors: Middleware for enabling Cross-Origin Resource Sharing.

Cookie-parser: Middleware to parse Cookie header and populate req.cookies.

Helmet: Helps secure Express apps by setting various HTTP headers.

Morgan: HTTP request logger middleware for Node.js.

⚙️ Setup and Installation
Follow these steps to get the backend server up and running on your local machine.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (LTS version recommended)

npm or Yarn

MongoDB (local installation or a cloud service like MongoDB Atlas)

Installation Steps
Clone the repository:

git clone <your-backend-repo-url>
cd <your-backend-repo-directory>

Install dependencies:

npm install
# OR
yarn install

Create a .env file:
Create a file named .env in the root of your backend project. This file will store your environment variables. Copy the content below and replace the placeholder values with your actual configuration.

DB_URL="mongodb+srv://<your-username>:<your-password>@cluster0.afo8lnx.mongodb.net/book-club-library-management-mongodb"
PORT=3000
CLIENT_ORIGIN="http://localhost:5173" # URL of your frontend application
ACCESS_TOKEN_SECRET="your_strong_access_token_secret_key"
REFRESH_TOKEN_SECRET="your_strong_refresh_token_secret_key"
NODE_ENV=development # or production

# Email Configuration for Nodemailer (e.g., Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_email@gmail.com
EMAIL_PASS=your_gmail_app_password # Use an App Password if 2FA is enabled (e.g., "effx inqc nnuo fldf")
EMAIL_FROM_NAME="Book Club Library"

DB_URL: Your MongoDB connection string. For MongoDB Atlas, you can find this in your cluster's "Connect" section.

ACCESS_TOKEN_SECRET & REFRESH_TOKEN_SECRET: Generate strong, random strings for these. You can use a tool like node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" in your terminal.

EMAIL_USER & EMAIL_PASS: Your Gmail credentials. If you have 2-Factor Authentication enabled on your Gmail account, you will need to generate an App Password instead of using your regular Gmail password.

Run the server:

npm start
# OR
yarn start

The server will start on the specified PORT (default: 3000). You should see a message like Server running on http://localhost:3000.

📂 Project Structure
.
├── src/
│   ├── config/             # ⚙️ Database connection setup
│   │   └── db.ts
│   ├── controllers/        # 🎛️ Logic for handling API requests (CRUD operations, auth)
│   │   ├── audit.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── book.controller.ts
│   │   ├── lending.controller.ts
│   │   ├── notification.controller.ts
│   │   └── reader.controller.ts
│   ├── errors/             # 🚨 Custom API error classes for consistent error responses
│   │   └── ApiError.ts
│   ├── middlewares/        # 🛡️ Express middleware (e.g., authentication, error handling)
│   │   └── authenticateToken.ts
│   ├── models/             # 📊 Mongoose schemas and models defining data structures
│   │   ├── AuditLog.ts
│   │   ├── Book.ts
│   │   ├── Lending.ts
│   │   ├── Notification.ts
│   │   ├── Reader.ts
│   │   └── User.ts
│   ├── routes/             # 🛣️ API route definitions and endpoint mapping
│   │   ├── audit.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── book.routes.ts
│   │   ├── lending.routes.ts
│   │   ├── notification.routes.ts
│   │   └── reader.routes.ts
│   ├── services/           # 📧 Utility services (e.g., email sending, external integrations)
│   │   └── emailService.ts
│   └── index.ts            # 🚀 Main application entry point and server setup
├── .env                    # 🔑 Environment variables (sensitive data, configurations)
├── .gitignore              # 🚫 Files/directories to ignore in Git version control
├── package.json            # 📦 Project dependencies and npm scripts
├── tsconfig.json           # 📝 TypeScript compiler configuration
└── README.md               # 📄 This documentation file

🔐 Authentication & Authorization
The backend implements a robust authentication and authorization system using JWTs:

Access Tokens: Short-lived tokens sent in the Authorization header (Bearer <token>) for securing API requests.

Refresh Tokens: Long-lived tokens stored in secure, HTTP-only cookies. These are used to obtain new access tokens when the current one expires, ensuring a seamless user experience without frequent re-logins.

Role-Based Access Control (RBAC): Ensures that only users with the librarian role can access protected routes and perform specific management operations.

📝 Audit Logging
A dedicated AuditLog collection is used to record all significant system actions. This includes events such as:

User logins and logouts

Creation, updates, and deletions of books, readers, and lending records

Password reset requests and successes

This provides a clear, immutable history of operations for accountability and debugging.

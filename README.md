📚 Book Club Library Management - Backend
This repository contains the backend API for the Book Club Library Management web application. It is built with Node.js and Express.js, providing RESTful endpoints for managing books, readers, lending, user authentication, and system audit logs.

✨ Features
User Authentication & Authorization
Secure signup, login, logout, and token refresh for librarian users. Role-based access control ensures only authorized users can perform specific actions.

Password Management
Robust "Forgot Password" and "Reset Password" functionality via email.

User Profile Management
Librarians can securely view and update their profile details (name, email, password).

Book Management
Comprehensive CRUD (Create, Read, Update, Delete) operations for managing library book records.

Reader Management
Full CRUD capabilities for managing library reader profiles.

Lending System
Efficiently manage book lending and return processes.

Overdue Books Tracking
Automated identification and management of overdue books.

Notifications
System for handling and sending various notifications (e.g., overdue reminders, system alerts).

Audit Logging
Detailed and immutable logging of key system actions (e.g., user logins, book additions, lending events) for accountability and tracking.

Centralized Error Handling
Robust and consistent error handling for all API endpoints.

🚀 Technologies Used
Node.js – JavaScript runtime environment

Express.js – Minimalist web framework for Node.js

MongoDB – NoSQL database

Mongoose – Elegant MongoDB object modeling

TypeScript – Strongly typed superset of JavaScript

JWT – JSON Web Tokens for authentication

Bcrypt – Secure password hashing

Nodemailer – Email sending module

Dotenv – Environment variable management

Cors – Cross-Origin Resource Sharing

Cookie-parser – Cookie parsing middleware

Helmet – Sets secure HTTP headers

Morgan – HTTP request logger

⚙️ Setup and Installation
Prerequisites
Node.js (LTS version)

npm or Yarn

MongoDB (local or cloud via MongoDB Atlas)

Installation Steps
Clone the repository:

bash
Copy
Edit
git clone <your-backend-repo-url>
cd <your-backend-repo-directory>
Install dependencies:

bash
Copy
Edit
npm install
# OR
yarn install
Create a .env file in the root directory:

ini
Copy
Edit
DB_URL="mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/book-club-library-management-mongodb"
PORT=3000
CLIENT_ORIGIN="http://localhost:5173"

ACCESS_TOKEN_SECRET="your_strong_access_token_secret_key"
REFRESH_TOKEN_SECRET="your_strong_refresh_token_secret_key"
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM_NAME="Book Club Library"
💡 Notes

Generate secrets using:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Use App Passwords if Gmail has 2FA enabled.

Start the server:

bash
Copy
Edit
npm start
# OR
yarn start
The server will start on http://localhost:3000 (or your configured PORT).

📂 Project Structure
csharp
Copy
Edit
.
├── src/
│   ├── config/             # ⚙️ Database connection
│   ├── controllers/        # 🎛️ API logic (CRUD, auth)
│   ├── errors/             # 🚨 Custom error classes
│   ├── middlewares/        # 🛡️ Auth, error handling
│   ├── models/             # 📊 Mongoose schemas
│   ├── routes/             # 🛣️ API endpoints
│   ├── services/           # 📧 Utility services (email, etc.)
│   └── index.ts            # 🚀 App entry point
├── .env                    # 🔑 Environment variables
├── .gitignore              # 🚫 Git ignored files
├── package.json            # 📦 Dependencies and scripts
├── tsconfig.json           # 📝 TypeScript config
└── README.md               # 📄 Project documentation
🔐 Authentication & Authorization
Access Tokens
Short-lived tokens sent via Authorization: Bearer <token> header.

Refresh Tokens
Long-lived, HTTP-only cookies used to issue new access tokens.

Role-Based Access Control (RBAC)
Only librarian users can access and manage protected endpoints.

📝 Audit Logging
All key system actions are recorded in the AuditLog collection:

User logins/logouts

Book, reader, and lending CRUD operations

Password reset requests and completions

🔍 This log provides traceability and aids debugging and accountability.

📫 Feedback & Contributions
Pull requests, issues, and suggestions are welcome!
Help make this system better for libraries everywhere. 😊

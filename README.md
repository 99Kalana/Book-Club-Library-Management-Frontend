📚 Book Club Library Management - Backend
This repository contains the backend API for the Book Club Library Management web application. It is built with Node.js and Express.js, providing RESTful endpoints for managing books, readers, lending, user authentication, and system audit logs.

## ✨ Features

* **Intuitive Dashboard:** Provides an overview of key library statistics and quick access to main functionalities.
* **Robust User Authentication:**
    * Secure librarian signup and login processes.
    * Comprehensive "Forgot Password" and "Reset Password" flow for account recovery.
    * Seamless session management with automatic token refresh.
* **User Profile Management:** Librarians can view and update their personal profile details (name, email, password).
* **Book Management:** Full CRUD (Create, Read, Update, Delete) capabilities for efficient management of library book records.
* **Reader Management:** Complete CRUD operations for managing library reader profiles.
* **Lending & Returns System:** Streamlined process for lending books to readers and recording their returns.
* **Overdue Books Tracking:** Dedicated section to track and manage books that are currently overdue.
* **Notifications:** System to display important system notifications and alerts to the librarian.
* **Audit Log Viewer:** An interface to browse and review the history of actions performed within the system, enhancing accountability.
* **Fully Responsive Design:** Optimized user experience across various screen sizes, from desktop monitors to tablets and mobile phones.
* **Modern & Engaging UI:** Features a clean, visually appealing design with subtle animations, transitions, and consistent styling using Tailwind CSS.

---

## 💻 Technologies Used

* **React:** A declarative, component-based JavaScript library for building dynamic user interfaces.
* **TypeScript:** A superset of JavaScript that compiles to plain JavaScript, providing static type-checking for improved code quality and maintainability.
* **React Router DOM:** A collection of navigational components that compose declaratively with your application.
* **Axios:** A popular promise-based HTTP client for making requests to the backend API.
* **Tailwind CSS:** A utility-first CSS framework that allows for rapid and custom UI development directly in your markup.
* **React Hot Toast:** A lightweight and highly customizable library for displaying beautiful, accessible toast notifications.
* **React Icons:** A library providing a vast collection of popular SVG icons for React applications.


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

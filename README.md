Book Club Library Management - Frontend
This repository contains the frontend application for the Book Club Library Management system. It provides a modern, responsive user interface for librarians to manage books, readers, lending, and system activities.

✨ Features
Intuitive Dashboard: Overview of library statistics.

User Authentication:

Librarian signup and login.

"Forgot Password" and "Reset Password" flow.

Secure session management with token refresh.

User Profile: View and update librarian's own profile (name, email, password).

Book Management: Add, view, edit, and delete book records.

Reader Management: Add, view, edit, and delete reader records.

Lending & Returns: Manage the lending process of books to readers and their return.

Overdue Books: Track and identify books that are overdue.

Notifications: View system notifications.

Audit Log Viewer: Browse the history of actions performed in the system.

Responsive Design: Optimized for various screen sizes (desktop, tablet, mobile).

Modern UI: Clean and visually appealing design with animations and transitions.

💻 Technologies Used
React: JavaScript library for building user interfaces.

TypeScript: Adds static typing to JavaScript for better code quality and maintainability.

React Router DOM: For declarative routing in the application.

Axios: Promise-based HTTP client for making API requests to the backend.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

React Hot Toast: For beautiful and responsive toast notifications.

React Icons: For a wide range of customizable vector icons.

⚙️ Setup and Installation
Follow these steps to get the frontend application running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm or Yarn

The Book Club Library Management Backend running locally or deployed.

Installation Steps
Clone the repository:

git clone <your-frontend-repo-url>
cd <your-frontend-repo-directory>

Install dependencies:

npm install
# OR
yarn install

Create a .env file:
Create a file named .env in the root of your frontend project and add the following environment variable. This should point to your backend API.

VITE_API_BASE_URL="http://localhost:3000/api" # Ensure this matches your backend's PORT

Run the development server:

npm run dev
# OR
yarn dev

The application will typically open in your browser at http://localhost:5173 (or another port if 5173 is in use).

📂 Project Structure
.
├── public/                 # Public assets
├── src/
│   ├── assets/             # Static assets (e.g., images, fonts)
│   ├── components/         # Reusable UI components
│   │   ├── Layout.tsx
│   │   └── ...
│   ├── context/            # React Context for global state (e.g., AuthContext)
│   │   ├── AuthContext.ts
│   │   └── AuthProvider.tsx
│   ├── pages/              # Application pages/views
│   │   ├── AdminRoutes.tsx
│   │   ├── Auth/           # Authentication related pages
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── BooksPage.tsx
│   │   ├── ReadersPage.tsx
│   │   ├── LendingPage.tsx
│   │   ├── OverduePage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── AuditLogPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/           # API service calls (e.g., authService.ts, apiClient.ts)
│   │   ├── apiClient.ts
│   │   └── authService.ts
│   ├── types/              # TypeScript type definitions
│   │   └── User.ts
│   ├── App.tsx             # Main React component
│   ├── main.tsx            # Entry point for React application
│   └── router.tsx          # React Router configuration
├── .env                    # Environment variables
├── .gitignore              # Files/directories to ignore in Git
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This file

🌐 Authentication Flow
The frontend handles authentication using React Context API for global state management.

Upon successful login, an access token is received and stored.

All authenticated API requests include this access token in the Authorization header.

A refresh token mechanism is implemented to automatically obtain new access tokens when the current one expires, ensuring a seamless user experience.

Protected routes are guarded by the AdminRoutes component, redirecting unauthenticated users to the login page. Public authentication pages (login, signup, forgot/reset password) are accessible without authentication.

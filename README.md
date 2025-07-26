# 💻 Book Club Library Management - Frontend

This repository contains the frontend application for the Book Club Library Management system. It provides a modern, responsive user interface for librarians to manage books, readers, lending, and system activities.


## ✨ Features

- **Intuitive Dashboard**: Provides an overview of key library statistics and quick access to main functionalities.

- **Robust User Authentication**:
  - Secure librarian signup and login processes.
  - Comprehensive "Forgot Password" and "Reset Password" flow for account recovery.
  - Seamless session management with automatic token refresh.

- **User  Profile Management**: Librarians can view and update their personal profile details (name, email, password).

- **Book Management**: Full CRUD (Create, Read, Update, Delete) capabilities for efficient management of library book records.

- **Reader Management**: Complete CRUD operations for managing library reader profiles.

- **Lending & Returns System**: Streamlined process for lending books to readers and recording their returns.

- **Overdue Books Tracking**: Dedicated section to track and manage books that are currently overdue.

- **Notifications**: System to display important system notifications and alerts to the librarian.

- **Audit Log Viewer**: An interface to browse and review the history of actions performed within the system, enhancing accountability.

- **Fully Responsive Design**: Optimized user experience across various screen sizes, from desktop monitors to tablets and mobile phones.

- **Modern & Engaging UI**: Features a clean, visually appealing design with subtle animations, transitions, and consistent styling using Tailwind CSS.


## 💻 Technologies Used

- **React**: A declarative, component-based JavaScript library for building dynamic user interfaces.

- **TypeScript**: A superset of JavaScript that compiles to plain JavaScript, providing static type-checking for improved code quality and maintainability.

- **React Router DOM**: A collection of navigational components that compose declaratively with your application.

- **Axios**: A popular promise-based HTTP client for making requests to the backend API.

- **Tailwind CSS**: A utility-first CSS framework that allows for rapid and custom UI development directly in your markup.

- **React Hot Toast**: A lightweight and highly customizable library for displaying beautiful, accessible toast notifications.

- **React Icons**: A library providing a vast collection of popular SVG icons for React applications.


## ⚙️ Setup and Installation

Follow these steps to get the frontend application running on your local machine.


### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm or Yarn
- The Book Club Library Management Backend running locally or deployed.


### Installation Steps

1. Clone the repository:

   ```bash
   git clone <your-frontend-repo-url>
   cd <your-frontend-repo-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   # OR
   yarn install
   ```

3. Create a `.env` file:
   - Create a file named `.env` in the root of your frontend project. This file will store your environment variables. Copy the content below and ensure the `VITE_API_BASE_URL` matches the URL of your running backend API.

   ```plaintext
   VITE_API_BASE_URL="http://localhost:3000/api" # Ensure this matches your backend's PORT and API prefix
   ```

4. Run the development server:

   ```bash
   npm run dev
   # OR
   yarn dev
   ```

   The application will typically open in your browser at `http://localhost:5173` (or another port if 5173 is in use).


## 📂 Project Structure

```
.
├── public/                 # 🌐 Static assets served directly (e.g., favicon)
├── src/
│   ├── assets/             # 🖼️ Images, fonts, and other static media
│   ├── components/         # 🧩 Reusable UI components (e.g., Navbar, Sidebar)
│   │   ├── Layout.tsx
│   │   └── ...
│   ├── context/            # 🔄 React Context for global state management (e.g., AuthContext)
│   │   ├── AuthContext.ts
│   │   └── AuthProvider.tsx
│   ├── pages/              # 📄 Main application pages/views
│   │   ├── AdminRoutes.tsx # 🔒 Component for protecting routes
│   │   ├── Auth/           # 🔑 Authentication related pages (Login, Signup, Forgot/Reset Password)
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
│   ├── services/           # 📞 API service calls and HTTP client configuration
│   │   ├── apiClient.ts
│   │   └── authService.ts
│   ├── types/              # 📝 TypeScript type definitions for data structures
│   │   └── User.ts
│   ├── App.tsx             # ⚛️ Main React component that orchestrates the application
│   ├── main.tsx            # 🚀 Entry point for the React application (ReactDOM.createRoot)
│   └── router.tsx          # 🗺️ React Router configuration defining application routes
├── .env                    # 🔑 Environment variables specific to the frontend
├── .gitignore              # 🚫 Files/directories to ignore in Git version control
├── index.html              # 📄 Main HTML file serving the React application
├── package.json            # 📦 Project dependencies and npm scripts
├── tailwind.config.js      # 🎨 Tailwind CSS configuration file
├── postcss.config.js       # 🖌️ PostCSS configuration for Tailwind CSS processing
└── README.md               # 📄 This documentation file
```


## 🌐 Authentication Flow

The frontend application integrates seamlessly with the backend's authentication system:

- **React Context API**: Used for managing the global authentication state (isLoggedIn, user data, login/logout functions).

- **JWT Handling**: Upon successful login, the access token is received and stored securely. All subsequent authenticated API requests automatically include this token in the Authorization header.

- **Token Refresh Mechanism**: An Axios interceptor automatically detects expired access tokens (401/403 errors) and attempts to refresh them using the stored refresh token. This ensures continuous user sessions without manual re-login.

- **Route Protection**: The AdminRoutes component acts as a guard, ensuring that only authenticated users with the correct role (librarian) can access protected dashboard routes. Public authentication pages (login, signup, forgot/reset password) are explicitly configured to be accessible without prior authentication.

# Employee Management System

A modern, serverless Employee Management System built with **React**, **Vite**, and **Firebase**. This application provides a clean, responsive user interface for managing employee records, complete with secure authentication and real-time database capabilities.

## 🚀 Features

- **Serverless Architecture**: Powered entirely by Firebase (Authentication & Firestore). No custom backend required.
- **Authentication**: Secure email/password login and registration using Firebase Auth.
- **Role-Based Access**: Distinguishes between `Admin` (full CRUD access) and `User` (read-only access).
- **CRUD Operations**: Complete employee lifecycle management (Create, Read, Update, Delete) stored securely in Firestore.
- **Modern UI**: Built with React and styled with a custom, responsive CSS design system (glassmorphism, CSS variables).
- **Fast Development**: Bootstrapped with Vite for instant server start and lightning-fast HMR (Hot Module Replacement).

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Database & Auth**: Firebase (Firestore & Firebase Authentication)
- **Routing**: React Router v7
- **Icons**: Remix Icons (`react-icons`)
- **Notifications**: React Hot Toast

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- A [Firebase Project](https://console.firebase.google.com/)

### 2. Firebase Setup
1. Create a project in the Firebase Console.
2. Enable **Firestore Database** (start in test mode or configure security rules).
3. Enable **Authentication** and turn on the **Email/Password** sign-in method.
4. Go to Project Settings -> General -> Your Apps, and add a "Web App" to get your Firebase configuration.

### 3. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/khushtaneja/Employment-Management-System.git
cd Employment-Management-System/client
npm install
```

### 4. Configuration

Update the `client/src/config/firebase.js` file with your Firebase project configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Run the Application

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🌐 Deployment (Vercel)

This project is configured for easy deployment on [Vercel](https://vercel.com).

1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Vercel will automatically detect the Vite project and use the `vercel.json` configuration to build and serve the application as a Single Page Application (SPA).
4. No environment variables are required in Vercel since Firebase configuration is bundled with the client application.

## 🔐 Security Note

- **Database Rules**: Ensure you configure your Firestore Security Rules to prevent unauthorized access. A basic rule set should restrict writes to authenticated users, and specifically restrict employee edits to users with the `Admin` role.
- **Firebase Keys**: The Firebase configuration keys located in `firebase.js` are safe to be exposed in the client-side bundle as per Firebase's design. Security is enforced via Firestore Rules, not by hiding the API key.

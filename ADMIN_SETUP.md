# Admin Dashboard Setup Guide

This guide will help you set up the admin dashboard with Firebase authentication for the IDEA website.

## Prerequisites

- Node.js and npm installed
- A Firebase project created

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "idealk-admin")
4. Follow the setup wizard

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### 3. Create Admin User

1. In the Authentication section, go to "Users" tab
2. Click "Add user"
3. Enter admin email and password
4. Click "Add user"

### 4. Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname
6. Copy the configuration object

## Environment Configuration

### 1. Create Environment File

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Update Firebase Config

Replace the placeholder values in `src/lib/firebase.ts` with your actual Firebase configuration.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Usage

### Accessing the Admin Dashboard

1. Navigate to `/login` in your browser
2. Enter the admin credentials you created in Firebase
3. After successful login, you'll be redirected to `/admin`
4. The admin dashboard will show statistics and management options

### Admin Dashboard Features

- **Overview**: Dashboard with statistics and quick actions
- **Projects**: Manage organization projects (add, edit, delete)
- **News & Events**: Manage news articles and events
- **Settings**: Account and application settings

### Navigation

- When logged in, an "Admin" button will appear in the navigation
- Click it to access the admin dashboard
- The dashboard is protected and only accessible to authenticated users

## Security Notes

- The admin dashboard is protected by Firebase Authentication
- Only users with valid credentials can access `/admin`
- Unauthenticated users are redirected to `/login`
- Session state is managed by Firebase Auth

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check your environment variables and Firebase configuration
2. **Login fails**: Verify your admin user credentials in Firebase Console
3. **Environment variables not loading**: Ensure your `.env` file is in the root directory
4. **CORS issues**: Make sure your Firebase project settings allow your domain

### Getting Help

- Check Firebase Console for authentication logs
- Verify your Firebase configuration matches the project settings
- Ensure all environment variables are properly set

## Next Steps

- Add more admin users through Firebase Console
- Implement CRUD operations for projects and news
- Add role-based access control
- Set up Firestore for data storage
- Configure email notifications 
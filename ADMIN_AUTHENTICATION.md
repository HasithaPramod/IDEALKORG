# 🔐 Admin Authentication System

## Overview

The IDEALK admin panel uses Firebase Authentication with both email/password and Google Sign-In methods. The system includes role-based access control, security features, and comprehensive logging.

## 🚀 Features

### Authentication Methods
- ✅ **Email/Password Authentication**
- ✅ **Google Sign-In Integration**
- ✅ **Password Reset Functionality**
- ✅ **Session Management**
- ✅ **Role-Based Access Control**

### Security Features
- ✅ **Rate Limiting** (5 attempts per 5 minutes)
- ✅ **Input Validation & Sanitization**
- ✅ **Security Event Logging**
- ✅ **Admin Email Verification**
- ✅ **Protected Routes**
- ✅ **Session Timeout**

### Admin Management
- ✅ **Admin Email Configuration**
- ✅ **Permission-Based Access**
- ✅ **Unauthorized Access Handling**
- ✅ **User Profile Management**

## 📁 File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── components/
│   └── ProtectedRoute.tsx       # Route protection
├── pages/
│   ├── Login.tsx               # Login page
│   ├── Admin.tsx               # Admin dashboard
│   └── Unauthorized.tsx        # Access denied page
├── config/
│   └── admin.ts                # Admin configuration
└── lib/
    ├── firebase.ts             # Firebase configuration
    └── security.ts             # Security utilities
```

## 🔧 Configuration

### Admin Emails
Configure admin access in `src/config/admin.ts`:

```typescript
export const ADMIN_CONFIG = {
  adminEmails: [
    'admin@idealk.org',
    'info@idealk.org',
    'director@idealk.org',
    'manager@idealk.org',
    // Add more admin emails here
  ],
  // ... other settings
};
```

### Firebase Configuration
Ensure your Firebase project is configured in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
};
```

## 🛠️ Usage

### Login Page
Users can access the admin panel at `/login` with two authentication methods:

1. **Email/Password Login**
   - Enter admin email and password
   - System validates credentials against Firebase
   - Rate limiting prevents brute force attacks

2. **Google Sign-In**
   - Click "Sign in with Google" button
   - Opens Google authentication popup
   - Automatically redirects to admin panel if email is authorized

### Protected Routes
Admin routes are protected using the `ProtectedRoute` component:

```typescript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <Admin />
    </ProtectedRoute>
  } 
/>
```

### Admin Dashboard
Once authenticated, admins can access:
- **Dashboard Overview** - Statistics and quick actions
- **News Management** - Create, edit, delete news articles
- **Project Management** - Manage projects and initiatives
- **File Management** - Upload and manage downloadable files
- **Application Management** - Review join applications
- **System Settings** - Configure admin preferences

## 🔒 Security Implementation

### Rate Limiting
```typescript
// 5 attempts per 5 minutes
if (!rateLimiter.isAllowed(clientIP, 5, 300000)) {
  setError('Too many login attempts. Please try again later.');
  return;
}
```

### Input Validation
```typescript
// Sanitize and validate inputs
const sanitizedEmail = sanitizeInput(email, 254);
const sanitizedPassword = sanitizeInput(password, 128);

if (!validateEmail(sanitizedEmail)) {
  setError('Please enter a valid email address.');
  return;
}
```

### Security Logging
```typescript
// Log security events
logSecurityEvent('Successful login', { email: sanitizedEmail }, 'low');
logSecurityEvent('Failed login attempt', { email, error }, 'medium');
```

## 🚨 Error Handling

### Authentication Errors
- **Invalid Credentials** - "Failed to log in. Please check your credentials."
- **Rate Limited** - "Too many login attempts. Please try again later."
- **Google Sign-In Failed** - "Failed to sign in with Google. Please try again."
- **Unauthorized Access** - Redirects to `/unauthorized` page

### Network Errors
- **Firebase Connection Issues** - Handled gracefully with offline mode
- **CSP Violations** - Fixed with proper Content Security Policy headers

## 📊 Admin Permissions

### Content Management
- ✅ Manage news articles
- ✅ Manage projects
- ✅ Manage downloadable files
- ✅ Review join applications

### System Access
- ✅ View analytics and statistics
- ✅ Export data
- ✅ View system logs
- ✅ Manage admin settings

### User Management
- ❌ Manage other users (super admin only)
- ❌ Modify system settings (super admin only)

## 🔧 Setup Instructions

### 1. Firebase Project Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google Sign-In
3. Configure authorized domains
4. Set up Firestore database
5. Configure Firebase Storage

### 2. Environment Variables
Create `.env` file with Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Admin Email Configuration
Update `src/config/admin.ts` with authorized admin emails:

```typescript
adminEmails: [
  'admin@idealk.org',
  'info@idealk.org',
  // Add your admin emails here
],
```

### 4. Google Sign-In Setup
1. Enable Google Sign-In in Firebase Console
2. Add your domain to authorized domains
3. Configure OAuth consent screen if needed

## 🚀 Deployment

### Production Deployment
1. Set up environment variables on your hosting platform
2. Configure Firebase project for production
3. Update admin email list
4. Test authentication flow
5. Monitor security logs

### Security Checklist
- ✅ Firebase project configured correctly
- ✅ Admin emails updated
- ✅ Environment variables set
- ✅ CSP headers configured
- ✅ Rate limiting enabled
- ✅ Security logging active
- ✅ Error handling implemented

## 📞 Support

For technical support or questions about the admin authentication system:

1. **Check Firebase Console** for authentication logs
2. **Review security logs** in the application
3. **Verify admin email configuration**
4. **Test authentication flow** in different browsers
5. **Contact development team** for assistance

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Firebase Version**: 12.0.0 
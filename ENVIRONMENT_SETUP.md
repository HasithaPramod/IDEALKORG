# Environment Setup Guide

This guide explains how to set up environment variables for the Integrated Development Association website.

## 🔧 Environment Variables

### Required for Production (Optional for Development)

The application includes fallback Firebase configuration values, so environment variables are not strictly required. However, for production deployments, you may want to set your own Firebase configuration.

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Security Settings
VITE_SECURITY_CSP_ENABLED=true
VITE_SECURITY_RATE_LIMIT_ENABLED=true
VITE_DEBUG_ENABLED=false

# File Upload Settings
VITE_SECURITY_MAX_FILE_SIZE=52428800
VITE_SECURITY_MAX_IMAGE_SIZE=5242880

# API Settings
VITE_API_TIMEOUT=30000

# Force Environment Variable Validation (Optional)
VITE_REQUIRE_ENV_VARS=true
```

## 🚀 Current Configuration

The application currently uses these fallback Firebase values:

- **API Key**: `AIzaSyBRtVdPmY2WphBI9dvWXsQqNqlWApsPo4A`
- **Auth Domain**: `idealk-bc413.firebaseapp.com`
- **Project ID**: `idealk-bc413`
- **Storage Bucket**: `idealk-bc413.firebasestorage.app`
- **Messaging Sender ID**: `267781681663`
- **App ID**: `1:267781681663:web:84eb5adc01f39906c1f7ca`
- **Measurement ID**: `G-89VNK6P5FL`

## 🔒 Security Features

### Content Security Policy (CSP)
- Enabled by default in production
- Configured to allow Firebase services
- Blocks inline scripts and unsafe eval by default

### Rate Limiting
- Enabled by default
- 100 requests per minute per IP
- 5 login attempts per 5 minutes

### File Upload Security
- Maximum file size: 50MB
- Maximum image size: 5MB
- Maximum files per upload: 10
- Malware scanning enabled

## 🛠️ Development vs Production

### Development Mode
- Environment validation is disabled
- Debug mode can be enabled
- More permissive security settings

### Production Mode
- Strict environment validation (if `VITE_REQUIRE_ENV_VARS=true`)
- Enhanced security headers
- Optimized performance settings

## 📝 Troubleshooting

### Firebase Configuration Errors
If you see Firebase configuration errors:

1. **Check if `.env` file exists** in the root directory
2. **Verify environment variable names** start with `VITE_`
3. **Restart the development server** after adding environment variables
4. **Check Firebase console** for correct configuration values

### Security Header Warnings
- **X-Frame-Options**: Only set via HTTP headers, not meta tags
- **CSP violations**: Check browser console for blocked resources
- **CORS issues**: Ensure Firebase domains are in CSP allowlist

### Build Errors
- **Missing dependencies**: Run `npm install`
- **TypeScript errors**: Check for missing type definitions
- **Vite configuration**: Verify `vite.config.ts` settings

## 🔄 Updating Configuration

### Adding New Environment Variables
1. Add the variable to your `.env` file
2. Update `src/config/security.ts` if needed
3. Restart the development server
4. Test the configuration

### Changing Firebase Project
1. Create a new Firebase project
2. Update all Firebase configuration values in `.env`
3. Update security rules in Firebase console
4. Test authentication and storage functionality

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

---

**Note**: The application will work without environment variables due to fallback values, but for production use, it's recommended to set up your own Firebase project and configuration. 
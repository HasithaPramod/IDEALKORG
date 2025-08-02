# Manual CSP Fix for Hostinger

If the `fix-csp.php` script doesn't work, follow these manual steps:

## 🔧 **Step 1: Access Your .htaccess File**

1. Log into your Hostinger control panel
2. Go to **File Manager**
3. Navigate to your website's root directory (usually `public_html`)
4. Find the `.htaccess` file (it might be hidden)

## 🔧 **Step 2: Edit the .htaccess File**

1. Right-click on `.htaccess` and select **Edit**
2. Find this line in the file:
   ```apache
   Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';"
   ```

3. **Replace it with this line:**
   ```apache
   Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://firebase.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com; frame-src 'self' https://www.google.com https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self';"
   ```

## 🔧 **Step 3: Save and Test**

1. Click **Save** to update the file
2. Clear your browser cache
3. Refresh your website
4. Check the browser console for any remaining CSP errors

## 🔧 **Alternative: Complete .htaccess Replacement**

If you can't find the specific line, replace your entire `.htaccess` file with this content:

```apache
# Apache Configuration for Integrated Development Association Website
# This file provides SEO optimizations, security headers, and proper routing

# Enable URL rewriting
RewriteEngine On

# Remove trailing slashes
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)/$ /$1 [L,R=301]

# Handle React Router - serve index.html for all routes except files and directories
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Security Headers
<IfModule mod_headers.c>
    Header always append X-Frame-Options SAMEORIGIN
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://firebase.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com; frame-src 'self' https://www.google.com https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self';"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/xml application/xhtml+xml application/rss+xml application/javascript application/x-javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 year"
</IfModule>

# Prevent access to sensitive files
<FilesMatch "\.(htaccess|htpasswd|ini|log|sh|inc|bak)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Custom error pages
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html
```

## 🔧 **Step 4: Verify the Fix**

After making the changes:

1. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)
2. **Check browser console** - should see no CSP errors
3. **Test Firebase functionality** - authentication, database, etc.
4. **Test Google APIs** - any Google services should work

## 🔧 **Troubleshooting**

### If you still see CSP errors:
1. **Check file permissions** - .htaccess should be readable by the web server
2. **Clear server cache** - some hosts cache .htaccess files
3. **Contact Hostinger support** - they might need to clear server-side cache

### If the site breaks:
1. **Restore from backup** - Hostinger usually keeps backups
2. **Check syntax** - make sure there are no typos in the .htaccess file
3. **Test in stages** - try updating just the CSP line first

## 🔧 **What the Fix Does**

The updated CSP allows:
- ✅ **Firebase APIs**: `firebase.googleapis.com`, `securetoken.googleapis.com`
- ✅ **Google APIs**: `apis.google.com`, `www.googleapis.com`
- ✅ **Google Authentication**: `accounts.google.com`
- ✅ **Google Static Resources**: `www.gstatic.com`

This should resolve all the CSP errors you're seeing in the browser console. 
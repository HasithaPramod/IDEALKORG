import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting deployment process...');

try {
  // Step 1: Build the project
  console.log('📦 Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Generate advanced sitemaps
  console.log('🗺️ Generating advanced sitemaps...');
  try {
    // Generate main sitemap
    execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
    
    // Generate specialized sitemaps
    execSync('node scripts/advanced-sitemap-generator.js', { stdio: 'inherit' });
    
    console.log('✅ Advanced sitemaps generated successfully!');
  } catch (error) {
    console.error('❌ Advanced sitemap generation failed:', error.message);
    // Fallback to basic sitemap
    try {
      execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
    } catch (fallbackError) {
      console.error('❌ Fallback sitemap generation failed:', fallbackError.message);
    }
  }
  
  // Step 3: Copy additional files
  console.log('📁 Copying additional files...');
  
  // Ensure downloads directory exists
  const downloadsDir = path.join(__dirname, '..', 'dist', 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }
  
  // Copy upload.php to downloads directory
  const uploadSource = path.join(__dirname, '..', 'upload.php');
  const uploadDest = path.join(__dirname, '..', 'dist', 'downloads', 'upload.php');
  fs.copyFileSync(uploadSource, uploadDest);
  console.log('✅ Copied upload.php to downloads directory');
  
  // Copy favicon files and web manifest
  const faviconFiles = [
    'favicon.ico',
    'favicon.png',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'site.webmanifest'
  ];
  
  faviconFiles.forEach(file => {
    const source = path.join(__dirname, '..', 'public', file);
    const dest = path.join(__dirname, '..', 'dist', file);
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`✅ Copied ${file}`);
    }
  });
  
  // Copy server configuration files
  const configFiles = [
    { source: path.join(__dirname, '..', 'dist', '.htaccess'), dest: path.join(__dirname, '..', 'dist', '.htaccess') },
    { source: path.join(__dirname, '..', 'dist', 'web.config'), dest: path.join(__dirname, '..', 'dist', 'web.config') },
    { source: path.join(__dirname, '..', 'dist', 'nginx.conf'), dest: path.join(__dirname, '..', 'dist', 'nginx.conf') }
  ];
  
  // Create server configuration files if they don't exist
  if (!fs.existsSync(path.join(__dirname, '..', 'dist', '.htaccess'))) {
    const htaccessContent = `# Apache Configuration for Integrated Development Association Website
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
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://www.gstatic.com https://www.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://firebase.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com https://firestore.googleapis.com https://www.google.com https://accounts.google.com; frame-src 'self' https://www.google.com https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self';"
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
<FilesMatch "\\.(htaccess|htpasswd|ini|log|sh|inc|bak)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Custom error pages
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html`;
    
    fs.writeFileSync(path.join(__dirname, '..', 'dist', '.htaccess'), htaccessContent);
  }
  
  if (!fs.existsSync(path.join(__dirname, '..', 'dist', 'web.config'))) {
    const webConfigContent = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Remove trailing slash" stopProcessing="true">
          <match url="(.*)/$" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Redirect" url="{R:1}" redirectType="Permanent" />
        </rule>
        <rule name="React Router" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
    <httpProtocol>
      <customHeaders>
        <add name="X-Frame-Options" value="SAMEORIGIN" />
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-XSS-Protection" value="1; mode=block" />
        <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>`;
    
    fs.writeFileSync(path.join(__dirname, '..', 'dist', 'web.config'), webConfigContent);
  }
  
  if (!fs.existsSync(path.join(__dirname, '..', 'dist', 'nginx.conf'))) {
    const nginxContent = `# Nginx Configuration for Integrated Development Association Website
server {
    listen 80;
    server_name idealk.org www.idealk.org;
    
    root /var/www/idealk.org/dist;
    index index.html;
    
         # Security headers
     add_header X-Frame-Options "SAMEORIGIN" always;
     add_header X-Content-Type-Options "nosniff" always;
     add_header X-XSS-Protection "1; mode=block" always;
     add_header Referrer-Policy "strict-origin-when-cross-origin" always;
     add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://firebase.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com; frame-src 'self' https://www.google.com https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self';" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle PHP files
    location ~ \\.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # Error pages
    error_page 404 /index.html;
    error_page 500 /index.html;
}`;
    
    fs.writeFileSync(path.join(__dirname, '..', 'dist', 'nginx.conf'), nginxContent);
  }
  
  // Copy downloads folder
  const downloadsSource = path.join(__dirname, '..', 'downloads');
  const downloadsDest = path.join(__dirname, '..', 'dist', 'downloads');
  
  if (!fs.existsSync(downloadsDest)) {
    fs.mkdirSync(downloadsDest, { recursive: true });
  }
  
  // Copy downloads content recursively
  const copyRecursive = (src, dest) => {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  copyRecursive(downloadsSource, downloadsDest);
  
  // Create README.md for dist folder
  const readmeContent = `# Integrated Development Association - Distribution Files

This folder contains the production-ready files for the Integrated Development Association website.

## 📁 File Structure

\`\`\`
dist/
├── index.html              # Main application entry point
├── assets/                 # Compiled CSS, JS, and images
├── sitemap.xml            # XML sitemap for SEO
├── robots.txt             # Search engine directives
├── .htaccess              # Apache server configuration
├── web.config             # IIS server configuration
├── nginx.conf             # Nginx server configuration
├── upload.php             # File upload handler
├── downloads/             # Downloadable resources
│   ├── files/            # Uploaded files directory
│   ├── files.json        # Files metadata
│   ├── .htaccess         # Downloads security
│   └── README.md         # Downloads documentation
├── favicon.ico           # Website icon (ICO format)
├── favicon.png           # Website icon (PNG format)
└── README.md             # This deployment guide
\`\`\`

## 🚀 Deployment Instructions

### For Apache Servers:
1. Upload all files to your web server's public directory
2. Ensure \`.htaccess\` is uploaded (may be hidden)
3. Set proper file permissions (755 for directories, 644 for files)
4. Configure your domain to point to this directory

### For IIS Servers:
1. Upload all files to your web server's public directory
2. Ensure \`web.config\` is uploaded
3. Configure URL Rewrite module in IIS
4. Set proper file permissions

### For Nginx Servers:
1. Upload all files to your web server's public directory
2. Use the provided \`nginx.conf\` as a reference
3. Configure Nginx to serve \`index.html\` for all routes

## 🔧 Configuration Files

### \`.htaccess\` (Apache)
- URL rewriting for React Router
- Security headers
- Compression and caching
- SEO optimizations

### \`web.config\` (IIS)
- URL rewriting for React Router
- Security headers
- Compression and caching
- MIME type configurations

### \`nginx.conf\` (Nginx)
- URL rewriting for React Router
- Security headers
- Compression and caching
- PHP handling

### \`robots.txt\`
- Search engine directives
- Sitemap location
- Blocked paths (admin, API)
- Allowed file types

### \`sitemap.xml\`
- XML sitemap for search engines
- All main pages included
- Proper priority and change frequency

## 📂 Downloads System

The \`downloads/\` folder contains:
- **files/**: Directory for uploaded files
- **files.json**: Metadata for uploaded files
- **.htaccess**: Security configuration for downloads
- **README.md**: Documentation for the downloads system

## 🔒 Security Features

- Content Security Policy headers
- XSS protection
- Clickjacking prevention
- MIME type sniffing prevention
- Sensitive file access blocking
- Git directory protection

## 📈 SEO Features

- XML sitemap
- Robots.txt configuration
- Meta tags optimization
- Structured data support
- Image optimization
- Fast loading times

## 🛠️ Maintenance

### Updating the Site:
1. Run \`npm run deploy\` to rebuild and regenerate all files
2. Upload the new \`dist/\` folder contents to your server
3. Clear any server-side caches

### Adding New Pages:
1. Add the new route to your React application
2. Update the sitemap generator in \`scripts/generate-sitemap.js\`
3. Rebuild and redeploy

### File Uploads:
- Files are stored in \`downloads/files/\`
- Metadata is stored in \`downloads/files.json\`
- Access is controlled by \`downloads/.htaccess\`

## 📞 Support

For technical support or questions about deployment, please contact the development team.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Built with**: React, Vite, TypeScript, Tailwind CSS`;

  fs.writeFileSync(path.join(__dirname, '..', 'dist', 'README.md'), readmeContent);
  
  console.log('✅ Deployment completed successfully!');
  console.log('📂 Distribution files are ready in the "dist" folder');
  console.log('');
  console.log('📋 Files included:');
  console.log('  • index.html (main application)');
  console.log('  • assets/ (CSS, JS, images)');
  console.log('  • sitemap.xml (SEO sitemap)');
  console.log('  • robots.txt (search engine directives)');
  console.log('  • .htaccess (Apache configuration)');
  console.log('  • web.config (IIS configuration)');
  console.log('  • nginx.conf (Nginx configuration)');
  console.log('  • upload.php (file upload handler)');
  console.log('  • downloads/ (downloadable resources)');
  console.log('  • favicon.ico & favicon.png');
  console.log('  • README.md (deployment guide)');
  console.log('');
  console.log('🌐 Ready for upload to your web server!');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 
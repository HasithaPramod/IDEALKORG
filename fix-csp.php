<?php
// Temporary script to fix CSP headers on Hostinger
// Upload this file to your server root and run it once, then delete it

$htaccessPath = '.htaccess';

if (file_exists($htaccessPath)) {
    $content = file_get_contents($htaccessPath);
    
    // The old CSP that's causing the issue
    $oldCSP = 'Header always set Content-Security-Policy "default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://www.googletagmanager.com https://www.google-analytics.com; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https:; connect-src \'self\' https://www.google-analytics.com; frame-src \'self\'; object-src \'none\'; base-uri \'self\'; form-action \'self\';"';
    
    // The new CSP that includes all necessary Firebase and Google domains
    $newCSP = 'Header always set Content-Security-Policy "default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://www.gstatic.com https://www.google.com; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https:; connect-src \'self\' https://www.google-analytics.com https://firebase.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com https://firestore.googleapis.com https://www.google.com https://accounts.google.com; frame-src \'self\' https://www.google.com https://accounts.google.com; object-src \'none\'; base-uri \'self\'; form-action \'self\';"';
    
    // Check if the old CSP exists in the file
    if (strpos($content, $oldCSP) !== false) {
        $newContent = str_replace($oldCSP, $newCSP, $content);
        
        if (file_put_contents($htaccessPath, $newContent)) {
            echo "✅ CSP headers updated successfully!<br>";
            echo "The .htaccess file has been updated to allow Firebase and Google API connections.<br>";
            echo "Changes made:<br>";
            echo "- Added https://apis.google.com to script-src<br>";
            echo "- Added https://www.gstatic.com to script-src<br>";
            echo "- Added Firebase domains to connect-src<br>";
            echo "- Added Google domains to frame-src<br>";
            echo "<br>Please delete this fix-csp.php file after confirming the site works.<br>";
        } else {
            echo "❌ Failed to update .htaccess file. Please check file permissions.<br>";
        }
    } else {
        echo "⚠️ The old CSP pattern was not found in .htaccess.<br>";
        echo "The file might already be updated or have a different format.<br>";
        echo "Current CSP in .htaccess:<br>";
        echo "<pre>" . htmlspecialchars($content) . "</pre>";
    }
} else {
    echo "❌ .htaccess file not found. Please make sure this script is in the same directory as your .htaccess file.<br>";
}
?> 
<?php
// Comprehensive CSP Fix for Hostinger
// This script handles multiple CSP patterns and updates them all

$htaccessPath = '.htaccess';

if (file_exists($htaccessPath)) {
    $content = file_get_contents($htaccessPath);
    
    // Multiple old CSP patterns that might exist
    $oldCSPPatterns = [
        // Original restrictive CSP
        'Header always set Content-Security-Policy "default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://www.googletagmanager.com https://www.google-analytics.com; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https:; connect-src \'self\' https://www.google-analytics.com; frame-src \'self\'; object-src \'none\'; base-uri \'self\'; form-action \'self\';"',
        
        // Previous fix attempt
        'Header always set Content-Security-Policy "default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://www.gstatic.com; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https:; connect-src \'self\' https://www.google-analytics.com https://firebase.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com; frame-src \'self\' https://www.google.com https://accounts.google.com; object-src \'none\'; base-uri \'self\'; form-action \'self\';"'
    ];
    
    // The comprehensive new CSP that includes ALL necessary domains
    $newCSP = 'Header always set Content-Security-Policy "default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://www.gstatic.com https://www.google.com; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https:; connect-src \'self\' https://www.google-analytics.com https://firebase.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com https://firestore.googleapis.com https://www.google.com https://accounts.google.com; frame-src \'self\' https://www.google.com https://accounts.google.com; object-src \'none\'; base-uri \'self\'; form-action \'self\';"';
    
    $updated = false;
    $newContent = $content;
    
    // Try to replace each pattern
    foreach ($oldCSPPatterns as $pattern) {
        if (strpos($newContent, $pattern) !== false) {
            $newContent = str_replace($pattern, $newCSP, $newContent);
            $updated = true;
            echo "✅ Found and replaced CSP pattern<br>";
        }
    }
    
    if ($updated) {
        if (file_put_contents($htaccessPath, $newContent)) {
            echo "✅ CSP headers updated successfully!<br>";
            echo "The .htaccess file has been updated to allow ALL Firebase and Google connections.<br>";
            echo "<br><strong>Changes made:</strong><br>";
            echo "- Added https://apis.google.com to script-src<br>";
            echo "- Added https://www.gstatic.com to script-src<br>";
            echo "- Added https://www.google.com to script-src<br>";
            echo "- Added Firebase domains to connect-src<br>";
            echo "- Added https://firestore.googleapis.com to connect-src<br>";
            echo "- Added Google domains to connect-src<br>";
            echo "<br>Please delete this comprehensive-csp-fix.php file after confirming the site works.<br>";
        } else {
            echo "❌ Failed to update .htaccess file. Please check file permissions.<br>";
        }
    } else {
        echo "⚠️ No matching CSP patterns found in .htaccess.<br>";
        echo "The file might already be updated or have a different format.<br>";
        echo "<br><strong>Current CSP in .htaccess:</strong><br>";
        echo "<pre>" . htmlspecialchars($content) . "</pre>";
        
        // Try to add CSP if it doesn't exist
        if (strpos($content, 'Content-Security-Policy') === false) {
            echo "<br><strong>Adding new CSP header...</strong><br>";
            $newContent = $content . "\n\n# Security Headers\n<IfModule mod_headers.c>\n    " . $newCSP . "\n</IfModule>\n";
            
            if (file_put_contents($htaccessPath, $newContent)) {
                echo "✅ Added new CSP header to .htaccess<br>";
            } else {
                echo "❌ Failed to add CSP header<br>";
            }
        }
    }
} else {
    echo "❌ .htaccess file not found. Please make sure this script is in the same directory as your .htaccess file.<br>";
}
?> 
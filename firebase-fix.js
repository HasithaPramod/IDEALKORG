// Firebase Initialization Fix
// Add this to your index.html before the closing </body> tag

(function() {
    'use strict';
    
    // Check if Firebase is properly loaded
    function checkFirebase() {
        if (typeof firebase === 'undefined') {
            console.error('Firebase is not loaded. Check CSP headers.');
            return false;
        }
        
        if (!firebase.apps || firebase.apps.length === 0) {
            console.error('Firebase app not initialized.');
            return false;
        }
        
        return true;
    }
    
    // Wait for DOM and Firebase to be ready
    function waitForFirebase() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max
            
            const check = () => {
                attempts++;
                
                if (checkFirebase()) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Firebase failed to initialize after 5 seconds'));
                } else {
                    setTimeout(check, 100);
                }
            };
            
            check();
        });
    }
    
    // Initialize Firebase with error handling
    async function initializeFirebase() {
        try {
            await waitForFirebase();
            console.log('✅ Firebase initialized successfully');
            
            // Test Firebase services
            if (firebase.auth) {
                console.log('✅ Firebase Auth available');
            }
            
            if (firebase.firestore) {
                console.log('✅ Firebase Firestore available');
            }
            
            if (firebase.storage) {
                console.log('✅ Firebase Storage available');
            }
            
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            
            // Show user-friendly error
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                max-width: 300px;
            `;
            errorDiv.innerHTML = `
                <strong>Connection Error</strong><br>
                Unable to connect to services. Please refresh the page.
            `;
            document.body.appendChild(errorDiv);
            
            // Remove error after 10 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 10000);
        }
    }
    
    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFirebase);
    } else {
        initializeFirebase();
    }
})(); 
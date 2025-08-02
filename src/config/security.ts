// Security configuration for the application
export const SECURITY_SETTINGS = {
  // Environment variables that should be set in production
  REQUIRED_ENV_VARS: [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ],
  
  // Firebase configuration keys
  FIREBASE_CONFIG_KEYS: {
    API_KEY: 'VITE_FIREBASE_API_KEY',
    AUTH_DOMAIN: 'VITE_FIREBASE_AUTH_DOMAIN',
    PROJECT_ID: 'VITE_FIREBASE_PROJECT_ID',
    STORAGE_BUCKET: 'VITE_FIREBASE_STORAGE_BUCKET',
    MESSAGING_SENDER_ID: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
    APP_ID: 'VITE_FIREBASE_APP_ID',
    MEASUREMENT_ID: 'VITE_FIREBASE_MEASUREMENT_ID'
  },
  
  // Security features
  FEATURES: {
    CSP_ENABLED: import.meta.env.VITE_SECURITY_CSP_ENABLED === 'true',
    RATE_LIMIT_ENABLED: import.meta.env.VITE_SECURITY_RATE_LIMIT_ENABLED === 'true',
    DEBUG_ENABLED: import.meta.env.VITE_DEBUG_ENABLED === 'true'
  },
  
  // Rate limiting settings
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 60000, // 1 minute
    LOGIN_MAX_ATTEMPTS: 5,
    LOGIN_WINDOW_MS: 300000 // 5 minutes
  },
  
  // File upload security
  FILE_UPLOAD: {
    MAX_SIZE: parseInt(import.meta.env.VITE_SECURITY_MAX_FILE_SIZE || '52428800'), // 50MB
    MAX_IMAGE_SIZE: parseInt(import.meta.env.VITE_SECURITY_MAX_IMAGE_SIZE || '5242880'), // 5MB
    MAX_FILES_PER_UPLOAD: 10,
    SCAN_FOR_MALWARE: true
  },
  
  // Session security
  SESSION: {
    TIMEOUT_MS: 3600000, // 1 hour
    REFRESH_INTERVAL_MS: 300000, // 5 minutes
    SECURE_COOKIES: import.meta.env.PROD
  },
  
  // API security
  API: {
    TIMEOUT_MS: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000
  }
};

// Validate environment variables
export const validateEnvironment = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Only validate in production and only if environment variables are explicitly required
  if (import.meta.env.PROD && import.meta.env.VITE_REQUIRE_ENV_VARS === 'true') {
    SECURITY_SETTINGS.REQUIRED_ENV_VARS.forEach(varName => {
      if (!import.meta.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Get Firebase config from environment
export const getFirebaseConfig = () => {
  const config: Record<string, string> = {};
  
  Object.entries(SECURITY_SETTINGS.FIREBASE_CONFIG_KEYS).forEach(([key, envVar]) => {
    const value = import.meta.env[envVar];
    if (value) {
      config[key.toLowerCase()] = value;
    }
  });
  
  return config;
}; 
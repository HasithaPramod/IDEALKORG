// Admin Configuration for IDEALK
export const ADMIN_CONFIG = {
  // Admin email addresses (case-insensitive)
  adminEmails: [
    'admin@idealk.org',
    'info@idealk.org',
    'director@idealk.org',
    'manager@idealk.org',
    // Add more admin emails here
  ],

  // Admin permissions
  permissions: {
    // Content management
    canManageNews: true,
    canManageProjects: true,
    canManageDownloads: true,
    canManageApplications: true,
    
    // User management
    canManageUsers: false, // Only super admins
    canViewAnalytics: true,
    canExportData: true,
    
    // System settings
    canModifySettings: false, // Only super admins
    canViewLogs: true,
  },

  // Security settings
  security: {
    // Session timeout (in minutes)
    sessionTimeout: 60,
    
    // Failed login attempts before lockout
    maxLoginAttempts: 5,
    
    // Lockout duration (in minutes)
    lockoutDuration: 15,
    
    // Require 2FA for admin access
    require2FA: false,
    
    // Password requirements
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  },

  // Admin dashboard settings
  dashboard: {
    // Items per page
    itemsPerPage: 10,
    
    // Auto-refresh interval (in seconds)
    autoRefreshInterval: 30,
    
    // Show sensitive data
    showSensitiveData: false,
    
    // Default view
    defaultView: 'overview',
  },

  // File upload settings
  upload: {
    // Maximum file size (in MB)
    maxFileSize: 50,
    
    // Allowed file types
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'audio/mpeg',
      'application/zip',
      'application/x-rar-compressed',
      'text/plain'
    ],
    
    // Storage quota (in MB)
    storageQuota: 1000,
  },

  // Notification settings
  notifications: {
    // Email notifications
    emailNotifications: {
      newApplication: true,
      newDownload: false,
      systemAlerts: true,
      securityEvents: true,
    },
    
    // In-app notifications
    inAppNotifications: {
      newApplication: true,
      newDownload: true,
      systemAlerts: true,
      securityEvents: true,
    },
  },
};

// Helper functions
export const isAdminEmail = (email: string): boolean => {
  if (!email) return false;
  return ADMIN_CONFIG.adminEmails.some(
    adminEmail => adminEmail.toLowerCase() === email.toLowerCase()
  );
};

export const hasPermission = (permission: keyof typeof ADMIN_CONFIG.permissions): boolean => {
  return ADMIN_CONFIG.permissions[permission] || false;
};

export const getAdminConfig = () => ADMIN_CONFIG; 
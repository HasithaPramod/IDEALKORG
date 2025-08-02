import DOMPurify from 'dompurify';

// Security configuration
export const SECURITY_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'audio/mpeg',
    'application/zip',
    'application/x-rar-compressed',
    'text/plain'
  ],
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_UPLOAD: 10,
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 50000,
  MAX_EXCERPT_LENGTH: 500,
  MAX_AUTHOR_LENGTH: 100,
  MAX_CATEGORY_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_LOCATION_LENGTH: 100,
  MAX_BENEFICIARIES_LENGTH: 200,
  MAX_DURATION_LENGTH: 50,
  MAX_BUDGET_LENGTH: 100,
  MAX_PARTNERS_LENGTH: 500,
  MAX_OBJECTIVES_LENGTH: 1000,
  MAX_OUTCOMES_LENGTH: 1000,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 20,
  MAX_ADDRESS_LENGTH: 500,
  MAX_MOTIVATION_LENGTH: 2000,
  MAX_EXPERIENCE_LENGTH: 1000,
  MAX_KEYWORDS_LENGTH: 500,
  MAX_SEO_DESCRIPTION_LENGTH: 160,
  MAX_SEO_TITLE_LENGTH: 60,
  MAX_SEO_URL_LENGTH: 100
};

// Input sanitization functions
export const sanitizeInput = (input: string, maxLength?: number): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Apply length limit if specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// HTML content sanitization using DOMPurify
export const sanitizeHTML = (html: string, allowedTags?: string[]): string => {
  if (!html || typeof html !== 'string') return '';
  
  const config = {
    ALLOWED_TAGS: allowedTags || [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'width', 'height', 'style'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit']
  };
  
  return DOMPurify.sanitize(html, config);
};

// File validation
export const validateFile = (file: File, allowedTypes?: string[], maxSize?: number): { valid: boolean; error?: string } => {
  const types = allowedTypes || SECURITY_CONFIG.ALLOWED_FILE_TYPES;
  const size = maxSize || SECURITY_CONFIG.MAX_FILE_SIZE;
  
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (file.size > size) {
    return { valid: false, error: `File size exceeds ${Math.round(size / 1024 / 1024)}MB limit` };
  }
  
  if (!types.includes(file.type)) {
    return { valid: false, error: `File type not allowed: ${file.type}` };
  }
  
  // Additional security checks for images
  if (file.type.startsWith('image/')) {
    return validateImageFile(file);
  }
  
  return { valid: true };
};

// Image-specific validation
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = SECURITY_CONFIG.ALLOWED_IMAGE_TYPES;
  const maxSize = SECURITY_CONFIG.MAX_IMAGE_SIZE;
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Image type not allowed: ${file.type}` };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `Image size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit` };
  }
  
  return { valid: true };
};

// Multiple file validation
export const validateFiles = (files: File[], maxFiles?: number): { valid: boolean; error?: string } => {
  const max = maxFiles || SECURITY_CONFIG.MAX_IMAGES_PER_UPLOAD;
  
  if (files.length > max) {
    return { valid: false, error: `Maximum ${max} files allowed` };
  }
  
  for (let i = 0; i < files.length; i++) {
    const validation = validateFile(files[i]);
    if (!validation.valid) {
      return { valid: false, error: `File ${i + 1}: ${validation.error}` };
    }
  }
  
  return { valid: true };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Phone number validation (Sri Lankan format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+94|0)?[0-9]{9}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Content Security Policy headers
export const getCSPHeaders = (): Record<string, string> => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://www.googleapis.com https://idealk.org",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
};

// Rate limiting utility (simple in-memory implementation)
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  
  isAllowed(key: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.requests.get(key);
    
    if (!record || now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxRequests) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  clear(): void {
    this.requests.clear();
  }
}

export const rateLimiter = new RateLimiter();

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
};

// Password strength validation
export const validatePasswordStrength = (password: string): { valid: boolean; score: number; feedback: string[] } => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include at least one lowercase letter');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include at least one uppercase letter');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Include at least one number');
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('Include at least one special character');
  
  const valid = score >= 4;
  
  return { valid, score, feedback };
};

// Secure random string generation
export const generateSecureRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomArray[i] % chars.length);
  }
  
  return result;
};

// Input length validation
export const validateInputLength = (input: string, field: keyof typeof SECURITY_CONFIG, minLength?: number): { valid: boolean; error?: string } => {
  const maxLength = SECURITY_CONFIG[field];
  const min = minLength || 1;
  
  if (!input || input.length < min) {
    return { valid: false, error: `Minimum ${min} characters required` };
  }
  
  if (input.length > maxLength) {
    return { valid: false, error: `Maximum ${maxLength} characters allowed` };
  }
  
  return { valid: true };
};

// Log security events
export const logSecurityEvent = (event: string, details: any, severity: 'low' | 'medium' | 'high' = 'low'): void => {
  console.warn(`[SECURITY ${severity.toUpperCase()}] ${event}:`, details);
  
  // In production, you would send this to a security monitoring service
  if (import.meta.env.PROD) {
    // Example: send to security monitoring service
    // securityMonitoringService.log(event, details, severity);
  }
}; 
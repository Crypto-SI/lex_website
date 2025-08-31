/**
 * Security utilities for form validation, CSRF protection, and rate limiting
 */

// CSRF Token Management
export class CSRFManager {
  private static readonly TOKEN_KEY = 'csrf_token';
  private static readonly TOKEN_EXPIRY = 'csrf_token_expiry';
  private static readonly TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour

  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static setToken(): string {
    if (typeof window === 'undefined') return '';
    
    const token = this.generateToken();
    const expiry = Date.now() + this.TOKEN_LIFETIME;
    
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TOKEN_EXPIRY, expiry.toString());
    
    return token;
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY);
    
    if (!token || !expiry) return null;
    
    if (Date.now() > parseInt(expiry)) {
      this.clearToken();
      return null;
    }
    
    return token;
  }

  static clearToken(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY);
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken === token;
  }
}

// Rate Limiting
export class RateLimiter {
  private static readonly RATE_LIMIT_KEY = 'form_submissions';
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  static canSubmit(formId: string): boolean {
    if (typeof window === 'undefined') return true;
    
    const key = `${this.RATE_LIMIT_KEY}_${formId}`;
    const data = localStorage.getItem(key);
    
    if (!data) return true;
    
    try {
      const { attempts, windowStart } = JSON.parse(data);
      const now = Date.now();
      
      // Reset if window has expired
      if (now - windowStart > this.WINDOW_MS) {
        localStorage.removeItem(key);
        return true;
      }
      
      return attempts < this.MAX_ATTEMPTS;
    } catch {
      localStorage.removeItem(key);
      return true;
    }
  }

  static recordAttempt(formId: string): void {
    if (typeof window === 'undefined') return;
    
    const key = `${this.RATE_LIMIT_KEY}_${formId}`;
    const data = localStorage.getItem(key);
    const now = Date.now();
    
    if (!data) {
      localStorage.setItem(key, JSON.stringify({
        attempts: 1,
        windowStart: now
      }));
      return;
    }
    
    try {
      const parsed = JSON.parse(data);
      
      // Reset if window has expired
      if (now - parsed.windowStart > this.WINDOW_MS) {
        localStorage.setItem(key, JSON.stringify({
          attempts: 1,
          windowStart: now
        }));
      } else {
        localStorage.setItem(key, JSON.stringify({
          attempts: parsed.attempts + 1,
          windowStart: parsed.windowStart
        }));
      }
    } catch {
      localStorage.setItem(key, JSON.stringify({
        attempts: 1,
        windowStart: now
      }));
    }
  }

  static getRemainingAttempts(formId: string): number {
    if (typeof window === 'undefined') return this.MAX_ATTEMPTS;
    
    const key = `${this.RATE_LIMIT_KEY}_${formId}`;
    const data = localStorage.getItem(key);
    
    if (!data) return this.MAX_ATTEMPTS;
    
    try {
      const { attempts, windowStart } = JSON.parse(data);
      const now = Date.now();
      
      // Reset if window has expired
      if (now - windowStart > this.WINDOW_MS) {
        return this.MAX_ATTEMPTS;
      }
      
      return Math.max(0, this.MAX_ATTEMPTS - attempts);
    } catch {
      return this.MAX_ATTEMPTS;
    }
  }

  static getTimeUntilReset(formId: string): number {
    if (typeof window === 'undefined') return 0;
    
    const key = `${this.RATE_LIMIT_KEY}_${formId}`;
    const data = localStorage.getItem(key);
    
    if (!data) return 0;
    
    try {
      const { windowStart } = JSON.parse(data);
      const now = Date.now();
      const timeLeft = this.WINDOW_MS - (now - windowStart);
      
      return Math.max(0, timeLeft);
    } catch {
      return 0;
    }
  }
}

// Input Validation and Sanitization
export class InputValidator {
  // Email validation with comprehensive regex
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Name validation (letters, spaces, hyphens, apostrophes)
  static validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s\-'\.]{2,50}$/;
    return nameRegex.test(name.trim());
  }

  // Message validation (prevent XSS and excessive length)
  static validateMessage(message: string): boolean {
    const trimmed = message.trim();
    return trimmed.length >= 10 && trimmed.length <= 2000;
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 2000); // Limit length
  }

  // Check for suspicious patterns
  static containsSuspiciousContent(input: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /data:text\/html/i,
      /vbscript:/i,
      /expression\(/i,
      /url\(/i,
      /@import/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(input));
  }
}

// Form Security Manager
export class FormSecurityManager {
  static validateFormData(data: Record<string, string>): {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData: Record<string, string>;
  } {
    const errors: Record<string, string> = {};
    const sanitizedData: Record<string, string> = {};

    // Validate and sanitize each field
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        errors[key] = 'Invalid input type';
        return;
      }

      // Check for suspicious content
      if (InputValidator.containsSuspiciousContent(value)) {
        errors[key] = 'Invalid characters detected';
        return;
      }

      // Sanitize input
      const sanitized = InputValidator.sanitizeInput(value);
      sanitizedData[key] = sanitized;

      // Field-specific validation
      switch (key) {
        case 'name':
          if (!InputValidator.validateName(sanitized)) {
            errors[key] = 'Please enter a valid name (2-50 characters, letters only)';
          }
          break;
        case 'email':
          if (!InputValidator.validateEmail(sanitized)) {
            errors[key] = 'Please enter a valid email address';
          }
          break;
        case 'message':
          if (!InputValidator.validateMessage(sanitized)) {
            errors[key] = 'Message must be between 10 and 2000 characters';
          }
          break;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }

  static async submitSecureForm(
    formData: Record<string, string>,
    formId: string,
    endpoint: string
  ): Promise<{
    success: boolean;
    message: string;
    errors?: Record<string, string>;
  }> {
    try {
      // Check rate limiting
      if (!RateLimiter.canSubmit(formId)) {
        const timeLeft = RateLimiter.getTimeUntilReset(formId);
        const minutes = Math.ceil(timeLeft / (60 * 1000));
        return {
          success: false,
          message: `Too many attempts. Please try again in ${minutes} minutes.`
        };
      }

      // Validate and sanitize form data
      const validation = this.validateFormData(formData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Please correct the errors below',
          errors: validation.errors
        };
      }

      // Get CSRF token
      const csrfToken = CSRFManager.getToken();
      if (!csrfToken) {
        return {
          success: false,
          message: 'Security token expired. Please refresh the page and try again.'
        };
      }

      // Record attempt for rate limiting
      RateLimiter.recordAttempt(formId);

      // Prepare form data with security headers
      const formDataToSend = new FormData();
      Object.entries(validation.sanitizedData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append('_csrf', csrfToken);

      // Submit form
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Thank you! Your message has been sent successfully.'
      };

    } catch (error) {
      console.error('Form submission error:', error);
      return {
        success: false,
        message: 'Sorry, there was an error sending your message. Please try again later.'
      };
    }
  }
}
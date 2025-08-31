/**
 * Content Security Policy utilities for enhanced security
 */

export interface CSPDirectives {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'connect-src'?: string[];
  'font-src'?: string[];
  'object-src'?: string[];
  'media-src'?: string[];
  'frame-src'?: string[];
  'child-src'?: string[];
  'form-action'?: string[];
  'base-uri'?: string[];
  'manifest-src'?: string[];
  'worker-src'?: string[];
}

export class CSPManager {
  private static readonly TRUSTED_DOMAINS = {
    calendly: [
      'https://calendly.com',
      'https://assets.calendly.com',
      'https://api.calendly.com'
    ],
    formspree: [
      'https://formspree.io',
      'https://api.formspree.io'
    ],
    fonts: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    analytics: [
      // Add analytics domains if needed
    ]
  };

  /**
   * Generate CSP directives for the application
   */
  static generateDirectives(): CSPDirectives {
    return {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for Next.js
        "'unsafe-eval'", // Required for development
        ...this.TRUSTED_DOMAINS.calendly,
        'https://vercel.live' // For Vercel analytics if used
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for Chakra UI
        ...this.TRUSTED_DOMAINS.calendly,
        ...this.TRUSTED_DOMAINS.fonts
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        ...this.TRUSTED_DOMAINS.calendly
      ],
      'connect-src': [
        "'self'",
        ...this.TRUSTED_DOMAINS.calendly,
        ...this.TRUSTED_DOMAINS.formspree,
        'https://vitals.vercel-insights.com' // For Vercel analytics
      ],
      'font-src': [
        "'self'",
        'data:',
        ...this.TRUSTED_DOMAINS.fonts
      ],
      'frame-src': [
        ...this.TRUSTED_DOMAINS.calendly
      ],
      'form-action': [
        "'self'",
        ...this.TRUSTED_DOMAINS.formspree
      ],
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
      'media-src': ["'self'", 'data:', 'blob:']
    };
  }

  /**
   * Convert CSP directives to header string
   */
  static directivesToString(directives: CSPDirectives): string {
    return Object.entries(directives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  /**
   * Get CSP header value for the application
   */
  static getCSPHeader(): string {
    const directives = this.generateDirectives();
    return this.directivesToString(directives);
  }

  /**
   * Validate if a URL is allowed by CSP
   */
  static isUrlAllowed(url: string, directive: keyof CSPDirectives): boolean {
    const directives = this.generateDirectives();
    const allowedSources = directives[directive] || [];
    
    try {
      const urlObj = new URL(url);
      const origin = `${urlObj.protocol}//${urlObj.host}`;
      
      return allowedSources.some(source => {
        if (source === "'self'") return false; // Can't validate self in client
        if (source === "'unsafe-inline'" || source === "'unsafe-eval'") return false;
        if (source === 'data:' || source === 'blob:') {
          return url.startsWith(source);
        }
        return url.startsWith(source) || origin === source;
      });
    } catch {
      return false;
    }
  }

  /**
   * Report CSP violations (for monitoring)
   */
  static reportViolation(violation: {
    blockedURI: string;
    directive: string;
    originalPolicy: string;
    referrer: string;
    sourceFile: string;
    lineNumber: number;
  }): void {
    console.warn('CSP Violation detected:', violation);
    
    // In production, you might want to send this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to monitoring service
      // fetch('/api/csp-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(violation)
      // });
    }
  }
}

/**
 * Client-side CSP violation handler
 */
export const setupCSPViolationReporting = (): void => {
  if (typeof window === 'undefined') return;

  document.addEventListener('securitypolicyviolation', (event) => {
    CSPManager.reportViolation({
      blockedURI: event.blockedURI,
      directive: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      referrer: event.referrer,
      sourceFile: event.sourceFile || '',
      lineNumber: event.lineNumber || 0
    });
  });
};

/**
 * Nonce generator for inline scripts (if needed)
 */
export class NonceManager {
  private static nonce: string | null = null;

  static generateNonce(): string {
    if (typeof window === 'undefined') {
      // Server-side: generate new nonce
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return btoa(String.fromCharCode(...array));
    } else {
      // Client-side: get nonce from meta tag
      const metaTag = document.querySelector('meta[name="csp-nonce"]');
      return metaTag?.getAttribute('content') || '';
    }
  }

  static getNonce(): string {
    if (!this.nonce) {
      this.nonce = this.generateNonce();
    }
    return this.nonce;
  }

  static setNonce(nonce: string): void {
    this.nonce = nonce;
  }
}
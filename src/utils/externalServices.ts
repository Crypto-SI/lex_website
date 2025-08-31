/**
 * Enhanced security for external services with integrity checks and fallbacks
 */

import { CSPManager } from './csp';

export interface ExternalServiceConfig {
  name: string;
  primaryUrl: string;
  fallbackUrls?: string[];
  integrity?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ServiceLoadResult {
  success: boolean;
  url: string;
  error?: Error;
  isFallback: boolean;
  attempts: number;
}

export class ExternalServiceManager {
  private static readonly DEFAULT_TIMEOUT = 15000;
  private static readonly DEFAULT_RETRY_ATTEMPTS = 2;
  private static readonly DEFAULT_RETRY_DELAY = 1000;

  private static loadedServices = new Set<string>();
  private static loadingPromises = new Map<string, Promise<ServiceLoadResult>>();

  /**
   * Known integrity hashes for external services
   * Note: These should be updated when services update their scripts
   */
  private static readonly KNOWN_INTEGRITY_HASHES = {
    'calendly-widget': {
      // These are example hashes - in production, you'd get actual hashes from Calendly
      'https://assets.calendly.com/assets/external/widget.js': 'sha384-example-hash-here',
      'https://assets.calendly.com/assets/external/widget.css': 'sha384-example-css-hash-here'
    }
  };

  /**
   * Validate URL against CSP and known safe domains
   */
  private static validateUrl(url: string, serviceType: 'script' | 'style' = 'script'): boolean {
    // Check against CSP
    const cspDirective = serviceType === 'script' ? 'script-src' : 'style-src';
    if (!CSPManager.isUrlAllowed(url, cspDirective)) {
      console.warn(`URL not allowed by CSP: ${url}`);
      return false;
    }

    // Additional validation for known services
    const trustedDomains = [
      'calendly.com',
      'assets.calendly.com',
      'formspree.io'
    ];

    try {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const isTrustedDomain = trustedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );

      return isHttps && isTrustedDomain;
    } catch {
      return false;
    }
  }

  /**
   * Load external script with integrity checks and fallbacks
   */
  static async loadScript(config: ExternalServiceConfig): Promise<ServiceLoadResult> {
    const { name, primaryUrl, fallbackUrls = [], integrity, crossOrigin = 'anonymous' } = config;

    // Return cached result if already loaded
    if (this.loadedServices.has(name)) {
      return {
        success: true,
        url: primaryUrl,
        isFallback: false,
        attempts: 0
      };
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!;
    }

    const loadPromise = this.attemptScriptLoad(config);
    this.loadingPromises.set(name, loadPromise);

    try {
      const result = await loadPromise;
      if (result.success) {
        this.loadedServices.add(name);
      }
      return result;
    } finally {
      this.loadingPromises.delete(name);
    }
  }

  /**
   * Attempt to load script with retries and fallbacks
   */
  private static async attemptScriptLoad(config: ExternalServiceConfig): Promise<ServiceLoadResult> {
    const { 
      name, 
      primaryUrl, 
      fallbackUrls = [], 
      integrity,
      crossOrigin = 'anonymous',
      timeout = this.DEFAULT_TIMEOUT,
      retryAttempts = this.DEFAULT_RETRY_ATTEMPTS,
      retryDelay = this.DEFAULT_RETRY_DELAY
    } = config;

    const urlsToTry = [primaryUrl, ...fallbackUrls];
    let lastError: Error | undefined;
    let totalAttempts = 0;

    for (let urlIndex = 0; urlIndex < urlsToTry.length; urlIndex++) {
      const url = urlsToTry[urlIndex];
      const isFallback = urlIndex > 0;

      // Validate URL
      if (!this.validateUrl(url, 'script')) {
        console.warn(`Skipping invalid URL: ${url}`);
        continue;
      }

      // Try loading this URL with retries
      for (let attempt = 0; attempt <= retryAttempts; attempt++) {
        totalAttempts++;

        try {
          await this.loadSingleScript({
            url,
            integrity: integrity || this.getKnownIntegrity(url),
            crossOrigin,
            timeout
          });

          console.log(`Successfully loaded ${name} from ${url}${isFallback ? ' (fallback)' : ''}`);
          return {
            success: true,
            url,
            isFallback,
            attempts: totalAttempts
          };

        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          console.warn(`Attempt ${attempt + 1} failed for ${url}:`, lastError.message);

          // Wait before retry (except on last attempt)
          if (attempt < retryAttempts) {
            await this.delay(retryDelay * (attempt + 1)); // Exponential backoff
          }
        }
      }
    }

    // All attempts failed
    return {
      success: false,
      url: primaryUrl,
      error: lastError || new Error(`Failed to load ${name} from all URLs`),
      isFallback: false,
      attempts: totalAttempts
    };
  }

  /**
   * Load a single script with timeout and integrity check
   */
  private static loadSingleScript(options: {
    url: string;
    integrity?: string;
    crossOrigin: 'anonymous' | 'use-credentials';
    timeout: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${options.url}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = options.url;
      script.crossOrigin = options.crossOrigin;
      script.async = true;

      if (options.integrity) {
        script.integrity = options.integrity;
      }

      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error(`Script load timeout: ${options.url}`));
      }, options.timeout);

      const cleanup = () => {
        clearTimeout(timeoutId);
        script.removeEventListener('load', onLoad);
        script.removeEventListener('error', onError);
      };

      const onLoad = () => {
        cleanup();
        resolve();
      };

      const onError = (event: Event) => {
        cleanup();
        script.remove();
        reject(new Error(`Failed to load script: ${options.url}`));
      };

      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);

      document.head.appendChild(script);
    });
  }

  /**
   * Load external stylesheet with fallbacks
   */
  static async loadStylesheet(config: ExternalServiceConfig): Promise<ServiceLoadResult> {
    const { name, primaryUrl, fallbackUrls = [], integrity } = config;

    // Check if already loaded
    if (document.getElementById(`${name}-styles`)) {
      return {
        success: true,
        url: primaryUrl,
        isFallback: false,
        attempts: 0
      };
    }

    const urlsToTry = [primaryUrl, ...fallbackUrls];
    let lastError: Error | undefined;
    let totalAttempts = 0;

    for (let urlIndex = 0; urlIndex < urlsToTry.length; urlIndex++) {
      const url = urlsToTry[urlIndex];
      const isFallback = urlIndex > 0;

      if (!this.validateUrl(url, 'style')) {
        continue;
      }

      totalAttempts++;

      try {
        await this.loadSingleStylesheet({
          id: `${name}-styles`,
          url,
          integrity: integrity || this.getKnownIntegrity(url)
        });

        return {
          success: true,
          url,
          isFallback,
          attempts: totalAttempts
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Failed to load stylesheet from ${url}:`, lastError.message);
      }
    }

    return {
      success: false,
      url: primaryUrl,
      error: lastError || new Error(`Failed to load ${name} stylesheet`),
      isFallback: false,
      attempts: totalAttempts
    };
  }

  /**
   * Load a single stylesheet
   */
  private static loadSingleStylesheet(options: {
    id: string;
    url: string;
    integrity?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.id = options.id;
      link.rel = 'stylesheet';
      link.href = options.url;

      if (options.integrity) {
        link.integrity = options.integrity;
        link.crossOrigin = 'anonymous';
      }

      const onLoad = () => resolve();
      const onError = () => {
        link.remove();
        reject(new Error(`Failed to load stylesheet: ${options.url}`));
      };

      link.addEventListener('load', onLoad);
      link.addEventListener('error', onError);

      document.head.appendChild(link);
    });
  }

  /**
   * Get known integrity hash for a URL
   */
  private static getKnownIntegrity(url: string): string | undefined {
    for (const service of Object.values(this.KNOWN_INTEGRITY_HASHES)) {
      if (service[url]) {
        return service[url];
      }
    }
    return undefined;
  }

  /**
   * Utility delay function
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if a service is loaded
   */
  static isServiceLoaded(name: string): boolean {
    return this.loadedServices.has(name);
  }

  /**
   * Unload a service (remove from DOM and cache)
   */
  static unloadService(name: string): void {
    // Remove scripts
    const scripts = document.querySelectorAll(`script[data-service="${name}"]`);
    scripts.forEach(script => script.remove());

    // Remove stylesheets
    const stylesheets = document.querySelectorAll(`link[id="${name}-styles"]`);
    stylesheets.forEach(link => link.remove());

    this.loadedServices.delete(name);
  }

  /**
   * Get service load status
   */
  static getServiceStatus(name: string): 'not-loaded' | 'loading' | 'loaded' {
    if (this.loadedServices.has(name)) return 'loaded';
    if (this.loadingPromises.has(name)) return 'loading';
    return 'not-loaded';
  }
}

/**
 * Offline detection and fallback management
 */
export class OfflineManager {
  private static isOnline = true;
  private static listeners: Array<(online: boolean) => void> = [];

  static initialize(): void {
    if (typeof window === 'undefined') return;

    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  static getStatus(): boolean {
    return this.isOnline;
  }

  static addListener(callback: (online: boolean) => void): void {
    this.listeners.push(callback);
  }

  static removeListener(callback: (online: boolean) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private static notifyListeners(online: boolean): void {
    this.listeners.forEach(listener => {
      try {
        listener(online);
      } catch (error) {
        console.error('Error in offline status listener:', error);
      }
    });
  }

  /**
   * Create offline fallback for external services
   */
  static createOfflineFallback(serviceName: string, fallbackContent: string): HTMLElement {
    const container = document.createElement('div');
    container.className = 'offline-fallback';
    container.innerHTML = `
      <div style="
        padding: 20px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        text-align: center;
        background-color: #f9f9f9;
        color: #666;
      ">
        <h3>Service Unavailable</h3>
        <p>${fallbackContent}</p>
        <p><small>Please check your internet connection and try again.</small></p>
      </div>
    `;
    return container;
  }
}
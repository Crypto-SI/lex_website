/**
 * Real User Monitoring (RUM) system for collecting performance data from actual users
 */

export interface RUMData {
  sessionId: string;
  userId?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  viewport: {
    width: number;
    height: number;
  };
  performance: {
    navigationTiming?: PerformanceNavigationTiming;
    webVitals?: Record<string, number>;
    resources?: Array<{
      name: string;
      type: string;
      size: number;
      duration: number;
    }>;
  };
  errors?: Array<{
    message: string;
    stack?: string;
    timestamp: number;
  }>;
  interactions?: Array<{
    type: string;
    target: string;
    timestamp: number;
    duration?: number;
  }>;
}

export interface RUMConfig {
  endpoint?: string;
  apiKey?: string;
  sampleRate?: number;
  enableErrorTracking?: boolean;
  enableInteractionTracking?: boolean;
  enableResourceTracking?: boolean;
  batchSize?: number;
  flushInterval?: number;
}

/**
 * Real User Monitoring class
 */
export class RealUserMonitoring {
  private config: Required<RUMConfig>;
  private sessionId: string;
  private dataBuffer: RUMData[] = [];
  private flushTimer?: NodeJS.Timeout;
  private isInitialized = false;

  constructor(config: RUMConfig = {}) {
    this.config = {
      endpoint: config.endpoint || '/api/rum',
      apiKey: config.apiKey || '',
      sampleRate: config.sampleRate || 1.0, // 100% by default
      enableErrorTracking: config.enableErrorTracking ?? true,
      enableInteractionTracking: config.enableInteractionTracking ?? true,
      enableResourceTracking: config.enableResourceTracking ?? true,
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 30000, // 30 seconds
    };

    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize RUM monitoring
   */
  public init(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // Check if we should sample this session
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    this.isInitialized = true;

    // Set up periodic data flushing
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);

    // Collect initial page data
    this.collectPageData();

    // Set up event listeners
    this.setupEventListeners();

    // Flush data when page is about to unload
    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });

    // Flush data when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush(true);
      }
    });
  }

  /**
   * Collect initial page performance data
   */
  private collectPageData(): void {
    const data: RUMData = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      performance: {},
    };

    // Add connection information if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      data.connection = {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
      };
    }

    // Collect navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        data.performance.navigationTiming = navigation;
      }

      // Collect resource timing if enabled
      if (this.config.enableResourceTracking) {
        data.performance.resources = this.collectResourceData();
      }

      this.addToBuffer(data);
    });
  }

  /**
   * Set up event listeners for various monitoring aspects
   */
  private setupEventListeners(): void {
    // Error tracking
    if (this.config.enableErrorTracking) {
      window.addEventListener('error', (event) => {
        this.trackError({
          message: event.message,
          stack: event.error?.stack,
          timestamp: Date.now(),
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.trackError({
          message: `Unhandled Promise Rejection: ${event.reason}`,
          timestamp: Date.now(),
        });
      });
    }

    // Interaction tracking
    if (this.config.enableInteractionTracking) {
      this.setupInteractionTracking();
    }

    // Performance observer for Web Vitals
    this.setupWebVitalsTracking();
  }

  /**
   * Set up interaction tracking
   */
  private setupInteractionTracking(): void {
    const trackInteraction = (type: string, event: Event) => {
      try {
        const target = event.target as HTMLElement;
        
        // Safety check - ensure target is a valid HTMLElement
        if (!target || !target.tagName) {
          return;
        }
        
        const selector = this.getElementSelector(target);

        this.trackInteraction({
          type,
          target: selector,
          timestamp: Date.now(),
        });
      } catch (error) {
        // Silently handle errors to prevent breaking the user experience
        console.warn('RUM interaction tracking error:', error);
      }
    };

    // Track clicks
    document.addEventListener('click', (event) => {
      trackInteraction('click', event);
    }, { passive: true });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      trackInteraction('submit', event);
    }, { passive: true });

    // Track input focus (for form analytics)
    document.addEventListener('focusin', (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        trackInteraction('focus', event);
      }
    }, { passive: true });
  }

  /**
   * Set up Web Vitals tracking using Performance Observer
   */
  private setupWebVitalsTracking(): void {
    if (!('PerformanceObserver' in window)) return;

    const webVitals: Record<string, number> = {};

    // LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          webVitals.lcp = lastEntry.startTime;
          this.updateWebVitals(webVitals);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('Failed to observe LCP:', e);
    }

    // FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          webVitals.fid = entry.processingStart - entry.startTime;
          this.updateWebVitals(webVitals);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('Failed to observe FID:', e);
    }

    // CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        webVitals.cls = clsValue;
        this.updateWebVitals(webVitals);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('Failed to observe CLS:', e);
    }

    // FCP
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          webVitals.fcp = fcpEntry.startTime;
          this.updateWebVitals(webVitals);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('Failed to observe FCP:', e);
    }
  }

  /**
   * Update Web Vitals data in the buffer
   */
  private updateWebVitals(webVitals: Record<string, number>): void {
    // Find the most recent data entry and update it
    const latestData = this.dataBuffer[this.dataBuffer.length - 1];
    if (latestData) {
      latestData.performance.webVitals = { ...webVitals };
    }
  }

  /**
   * Collect resource performance data
   */
  private collectResourceData(): Array<{ name: string; type: string; size: number; duration: number }> {
    const resources = performance.getEntriesByType('resource');
    
    return resources.map((resource: any) => ({
      name: resource.name,
      type: this.getResourceType(resource.name),
      size: resource.transferSize || 0,
      duration: resource.duration,
    }));
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.includes('.css')) return 'css';
    if (url.includes('.js')) return 'javascript';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';
    if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
    return 'other';
  }

  /**
   * Track an error
   */
  private trackError(error: { message: string; stack?: string; timestamp: number }): void {
    const latestData = this.dataBuffer[this.dataBuffer.length - 1];
    if (latestData) {
      if (!latestData.errors) {
        latestData.errors = [];
      }
      latestData.errors.push(error);
    }
  }

  /**
   * Track an interaction
   */
  private trackInteraction(interaction: { type: string; target: string; timestamp: number; duration?: number }): void {
    const latestData = this.dataBuffer[this.dataBuffer.length - 1];
    if (latestData) {
      if (!latestData.interactions) {
        latestData.interactions = [];
      }
      latestData.interactions.push(interaction);
    }
  }

  /**
   * Get a CSS selector for an element
   */
  private getElementSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    // Handle className safely - it might be a string or SVGAnimatedString
    if (element.className) {
      const classNameStr = typeof element.className === 'string' 
        ? element.className 
        : element.className.toString();
      
      if (classNameStr && classNameStr.length > 0) {
        const classes = classNameStr.split(' ').filter(c => c.length > 0);
        if (classes.length > 0) {
          return `.${classes[0]}`;
        }
      }
    }
    
    return element.tagName.toLowerCase();
  }

  /**
   * Add data to buffer
   */
  private addToBuffer(data: RUMData): void {
    this.dataBuffer.push(data);
    
    if (this.dataBuffer.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Flush buffered data to the server
   */
  private flush(immediate = false): void {
    if (this.dataBuffer.length === 0) return;

    const dataToSend = [...this.dataBuffer];
    this.dataBuffer = [];

    const payload = {
      data: dataToSend,
      timestamp: Date.now(),
    };

    if (immediate && 'sendBeacon' in navigator) {
      // Use sendBeacon for immediate sending (e.g., on page unload)
      navigator.sendBeacon(
        this.config.endpoint,
        JSON.stringify(payload)
      );
    } else {
      // Check if we're in static export mode
      const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
      
      if (isStaticExport) {
        // In static export mode, just log the data instead of sending it
        console.log('📊 RUM Data (Static Export Mode):', payload);
        return;
      }

      // Use fetch for regular sending
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify(payload),
      }).catch(error => {
        console.warn('Failed to send RUM data:', error);
        // Re-add data to buffer for retry
        this.dataBuffer.unshift(...dataToSend);
      });
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `rum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Manually track a custom event
   */
  public trackEvent(eventName: string, data: Record<string, any>): void {
    const rumData: RUMData = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      performance: {},
      interactions: [{
        type: 'custom_event',
        target: eventName,
        timestamp: Date.now(),
      }],
    };

    // Add custom data
    (rumData as any).customData = data;

    this.addToBuffer(rumData);
  }

  /**
   * Get current session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Destroy the RUM instance
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flush(true);
    this.isInitialized = false;
  }
}

// Global RUM instance
let globalRUM: RealUserMonitoring | null = null;

/**
 * Initialize Real User Monitoring
 */
export function initRUM(config?: RUMConfig): RealUserMonitoring {
  if (typeof window === 'undefined') {
    return new RealUserMonitoring(config);
  }

  if (!globalRUM) {
    globalRUM = new RealUserMonitoring(config);
    globalRUM.init();
  }

  return globalRUM;
}

/**
 * Get the global RUM instance
 */
export function getRUM(): RealUserMonitoring | null {
  return globalRUM;
}

/**
 * Track a custom event
 */
export function trackRUMEvent(eventName: string, data: Record<string, any> = {}): void {
  if (globalRUM) {
    globalRUM.trackEvent(eventName, data);
  }
}
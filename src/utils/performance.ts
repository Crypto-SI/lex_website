/**
 * Performance monitoring utilities for Core Web Vitals and real-user monitoring
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent?: string;
}

export interface PerformanceBudget {
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte (ms)
  fcp: number; // First Contentful Paint (ms)
  bundleSize: number; // Main bundle size (bytes)
  imageSize: number; // Total image size (bytes)
}

export interface PerformanceAlert {
  metric: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
  timestamp: number;
  url: string;
}

// Default performance budgets based on Core Web Vitals thresholds
export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  lcp: 2500, // 2.5 seconds
  fid: 100,  // 100ms
  cls: 0.1,  // 0.1
  ttfb: 600, // 600ms
  fcp: 1800, // 1.8 seconds
  bundleSize: 500000, // 500KB
  imageSize: 1000000, // 1MB
};

/**
 * Core Web Vitals monitoring class
 */
export class WebVitalsMonitor {
  private metrics: PerformanceMetric[] = [];
  private budget: PerformanceBudget;
  private onAlert?: (alert: PerformanceAlert) => void;

  constructor(budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET, onAlert?: (alert: PerformanceAlert) => void) {
    this.budget = budget;
    this.onAlert = onAlert;
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  public init(): void {
    if (typeof window === 'undefined') return;

    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
  }

  /**
   * Observe Largest Contentful Paint
   */
  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          this.recordMetric('LCP', lastEntry.startTime);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('Failed to observe LCP:', error);
    }
  }

  /**
   * Observe First Input Delay
   */
  private observeFID(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.recordMetric('FID', fid);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('Failed to observe FID:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  private observeCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.recordMetric('CLS', clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Failed to observe CLS:', error);
    }
  }

  /**
   * Observe First Contentful Paint
   */
  private observeFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          this.recordMetric('FCP', fcpEntry.startTime);
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('Failed to observe FCP:', error);
    }
  }

  /**
   * Observe Time to First Byte
   */
  private observeTTFB(): void {
    if (typeof window === 'undefined') return;

    try {
      // Use Navigation Timing API
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart;
          this.recordMetric('TTFB', ttfb);
        }
      });
    } catch (error) {
      console.warn('Failed to observe TTFB:', error);
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(name: string, value: number): void {
    const rating = this.getRating(name, value);
    
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(metric);
    
    // Check if metric exceeds budget
    this.checkBudget(metric);
    
    // Send to analytics if configured
    this.sendToAnalytics(metric);
  }

  /**
   * Get performance rating based on Core Web Vitals thresholds
   */
  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 600, poor: 1500 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Check if metric exceeds performance budget
   */
  private checkBudget(metric: PerformanceMetric): void {
    const budgetValue = this.budget[metric.name.toLowerCase() as keyof PerformanceBudget];
    
    if (budgetValue && metric.value > budgetValue) {
      const alert: PerformanceAlert = {
        metric: metric.name,
        value: metric.value,
        threshold: budgetValue,
        severity: metric.rating === 'poor' ? 'critical' : 'warning',
        timestamp: metric.timestamp,
        url: metric.url,
      };

      if (this.onAlert) {
        this.onAlert(alert);
      }

      console.warn(`Performance budget exceeded for ${metric.name}:`, alert);
    }
  }

  /**
   * Send metric to analytics service
   */
  private sendToAnalytics(metric: PerformanceMetric): void {
    // Send to Google Analytics 4 if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: {
          metric_rating: metric.rating,
        },
      });
    }

    // Send to custom analytics endpoint if configured
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      }).catch(error => {
        console.warn('Failed to send metric to analytics:', error);
      });
    }
  }

  /**
   * Get all recorded metrics
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics summary
   */
  public getSummary(): Record<string, { value: number; rating: string; count: number }> {
    const summary: Record<string, { value: number; rating: string; count: number }> = {};

    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          value: metric.value,
          rating: metric.rating,
          count: 1,
        };
      } else {
        // Keep the latest value
        if (metric.timestamp > summary[metric.name].count) {
          summary[metric.name].value = metric.value;
          summary[metric.name].rating = metric.rating;
        }
        summary[metric.name].count++;
      }
    });

    return summary;
  }

  /**
   * Clear all metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
  }
}

/**
 * Resource performance monitoring
 */
export class ResourceMonitor {
  private resourceMetrics: Array<{
    name: string;
    type: string;
    size: number;
    duration: number;
    timestamp: number;
  }> = [];

  /**
   * Initialize resource monitoring
   */
  public init(): void {
    if (typeof window === 'undefined') return;

    this.observeResources();
    this.observeNavigationTiming();
  }

  /**
   * Observe resource loading performance
   */
  private observeResources(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          this.recordResource({
            name: entry.name,
            type: this.getResourceType(entry.name),
            size: entry.transferSize || 0,
            duration: entry.duration,
            timestamp: Date.now(),
          });
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Failed to observe resources:', error);
    }
  }

  /**
   * Observe navigation timing
   */
  private observeNavigationTiming(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive - navigation.navigationStart,
          domComplete: navigation.domComplete - navigation.navigationStart,
        };

        console.log('Navigation timing metrics:', metrics);
      }
    });
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
   * Record resource metric
   */
  private recordResource(resource: any): void {
    this.resourceMetrics.push(resource);

    // Check for large resources
    if (resource.size > 1000000) { // 1MB
      console.warn(`Large resource detected: ${resource.name} (${(resource.size / 1024 / 1024).toFixed(2)}MB)`);
    }

    // Check for slow loading resources
    if (resource.duration > 3000) { // 3 seconds
      console.warn(`Slow loading resource: ${resource.name} (${resource.duration.toFixed(0)}ms)`);
    }
  }

  /**
   * Get resource metrics summary
   */
  public getResourceSummary(): Record<string, { count: number; totalSize: number; avgDuration: number }> {
    const summary: Record<string, { count: number; totalSize: number; avgDuration: number }> = {};

    this.resourceMetrics.forEach(resource => {
      if (!summary[resource.type]) {
        summary[resource.type] = {
          count: 0,
          totalSize: 0,
          avgDuration: 0,
        };
      }

      summary[resource.type].count++;
      summary[resource.type].totalSize += resource.size;
      summary[resource.type].avgDuration += resource.duration;
    });

    // Calculate averages
    Object.keys(summary).forEach(type => {
      summary[type].avgDuration = summary[type].avgDuration / summary[type].count;
    });

    return summary;
  }

  /**
   * Get all resource metrics
   */
  public getResourceMetrics(): any[] {
    return [...this.resourceMetrics];
  }
}

/**
 * Bundle size monitoring
 */
export class BundleMonitor {
  private budgets: Record<string, number>;

  constructor(budgets: Record<string, number> = {}) {
    this.budgets = {
      'main.js': 500000, // 500KB
      'vendor.js': 800000, // 800KB
      'styles.css': 100000, // 100KB
      ...budgets,
    };
  }

  /**
   * Analyze current bundle sizes
   */
  public async analyzeBundles(): Promise<void> {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource');
    const bundles = resources.filter((resource: any) => 
      resource.name.includes('.js') || resource.name.includes('.css')
    );

    bundles.forEach((bundle: any) => {
      const filename = this.extractFilename(bundle.name);
      const size = bundle.transferSize || 0;
      const budget = this.getBudgetForFile(filename);

      if (budget && size > budget) {
        console.warn(`Bundle size budget exceeded: ${filename} (${(size / 1024).toFixed(1)}KB > ${(budget / 1024).toFixed(1)}KB)`);
      }
    });
  }

  /**
   * Extract filename from URL
   */
  private extractFilename(url: string): string {
    return url.split('/').pop()?.split('?')[0] || '';
  }

  /**
   * Get budget for specific file
   */
  private getBudgetForFile(filename: string): number | undefined {
    // Try exact match first
    if (this.budgets[filename]) {
      return this.budgets[filename];
    }

    // Try pattern matching
    if (filename.includes('main') && filename.includes('.js')) {
      return this.budgets['main.js'];
    }
    if (filename.includes('vendor') && filename.includes('.js')) {
      return this.budgets['vendor.js'];
    }
    if (filename.includes('.css')) {
      return this.budgets['styles.css'];
    }

    return undefined;
  }
}

// Global performance monitor instance
let globalWebVitalsMonitor: WebVitalsMonitor | null = null;
let globalResourceMonitor: ResourceMonitor | null = null;
let globalBundleMonitor: BundleMonitor | null = null;

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(
  budget?: PerformanceBudget,
  onAlert?: (alert: PerformanceAlert) => void
): void {
  if (typeof window === 'undefined') return;

  // Initialize Web Vitals monitoring
  globalWebVitalsMonitor = new WebVitalsMonitor(budget, onAlert);
  globalWebVitalsMonitor.init();

  // Initialize Resource monitoring
  globalResourceMonitor = new ResourceMonitor();
  globalResourceMonitor.init();

  // Initialize Bundle monitoring
  globalBundleMonitor = new BundleMonitor();
  
  // Analyze bundles after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      globalBundleMonitor?.analyzeBundles();
    }, 1000);
  });
}

/**
 * Get global performance monitor instances
 */
export function getPerformanceMonitors() {
  return {
    webVitals: globalWebVitalsMonitor,
    resources: globalResourceMonitor,
    bundles: globalBundleMonitor,
  };
}

/**
 * Report performance summary to console
 */
export function reportPerformanceSummary(): void {
  if (!globalWebVitalsMonitor || !globalResourceMonitor) {
    console.warn('Performance monitoring not initialized');
    return;
  }

  console.group('📊 Performance Summary');
  
  const webVitalsSummary = globalWebVitalsMonitor.getSummary();
  console.table(webVitalsSummary);
  
  const resourceSummary = globalResourceMonitor.getResourceSummary();
  console.table(resourceSummary);
  
  console.groupEnd();
}
import { NextRequest, NextResponse } from 'next/server';

// Configure for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export interface RUMPayload {
  data: Array<{
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
  }>;
  timestamp: number;
}

/**
 * POST /api/rum - Collect Real User Monitoring data
 * Note: This route is disabled in static export mode
 */
export async function POST(request: NextRequest) {
  // Return early for static export builds
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
    return NextResponse.json(
      { error: 'API routes not available in static export mode' },
      { status: 501 }
    );
  }

  try {
    const payload: RUMPayload = await request.json();
    
    // Validate payload
    if (!payload.data || !Array.isArray(payload.data)) {
      return NextResponse.json(
        { error: 'Invalid payload format' },
        { status: 400 }
      );
    }

    // Process each RUM data entry
    const processedData = payload.data.map(entry => {
      // Sanitize and validate data
      const sanitized = {
        sessionId: entry.sessionId?.substring(0, 50) || 'unknown',
        timestamp: entry.timestamp || Date.now(),
        url: sanitizeUrl(entry.url),
        userAgent: entry.userAgent?.substring(0, 200) || 'unknown',
        viewport: {
          width: Math.max(0, Math.min(entry.viewport?.width || 0, 10000)),
          height: Math.max(0, Math.min(entry.viewport?.height || 0, 10000)),
        },
        performance: sanitizePerformanceData(entry.performance),
        errors: sanitizeErrors(entry.errors),
        interactions: sanitizeInteractions(entry.interactions),
      };

      // Add connection info if available
      if (entry.connection) {
        sanitized.connection = {
          effectiveType: entry.connection.effectiveType?.substring(0, 20) || 'unknown',
          downlink: Math.max(0, Math.min(entry.connection.downlink || 0, 1000)),
          rtt: Math.max(0, Math.min(entry.connection.rtt || 0, 10000)),
        };
      }

      return sanitized;
    });

    // In a real application, you would:
    // 1. Store data in a database (e.g., PostgreSQL, MongoDB)
    // 2. Send to analytics service (e.g., Google Analytics, DataDog)
    // 3. Process for real-time monitoring dashboards
    
    // For now, we'll log the data and store it temporarily
    console.log('📊 RUM Data Received:', {
      entriesCount: processedData.length,
      timestamp: new Date().toISOString(),
      sessions: [...new Set(processedData.map(d => d.sessionId))].length,
    });

    // Store data temporarily (in production, use a proper database)
    await storeRUMData(processedData);

    // Analyze for performance alerts
    const alerts = analyzeForAlerts(processedData);
    if (alerts.length > 0) {
      console.warn('⚠️ Performance alerts detected:', alerts);
      // In production, send alerts to monitoring service
    }

    return NextResponse.json({
      success: true,
      processed: processedData.length,
      alerts: alerts.length,
    });

  } catch (error) {
    console.error('❌ Error processing RUM data:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/rum - Retrieve RUM analytics (for dashboard)
 * Note: This route is disabled in static export mode
 */
export async function GET(request: NextRequest) {
  // Return early for static export builds
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
    return NextResponse.json(
      { error: 'API routes not available in static export mode' },
      { status: 501 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const metric = searchParams.get('metric');

    // In production, query from database
    const analytics = await getRUMAnalytics(timeRange, metric);

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('❌ Error retrieving RUM analytics:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Sanitize URL to prevent XSS and limit length
 */
function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return 'unknown';
  
  try {
    const parsed = new URL(url);
    // Only keep pathname and search, remove sensitive data
    return `${parsed.pathname}${parsed.search}`.substring(0, 200);
  } catch {
    return 'invalid-url';
  }
}

/**
 * Sanitize performance data
 */
function sanitizePerformanceData(performance: any): any {
  if (!performance || typeof performance !== 'object') return {};

  const sanitized: any = {};

  // Sanitize Web Vitals
  if (performance.webVitals) {
    sanitized.webVitals = {};
    ['lcp', 'fid', 'cls', 'fcp', 'ttfb'].forEach(metric => {
      const value = performance.webVitals[metric];
      if (typeof value === 'number' && value >= 0 && value < 100000) {
        sanitized.webVitals[metric] = Math.round(value * 1000) / 1000; // Round to 3 decimals
      }
    });
  }

  // Sanitize navigation timing
  if (performance.navigationTiming) {
    const timing = performance.navigationTiming;
    sanitized.navigationTiming = {
      domContentLoaded: sanitizeTimingValue(timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart),
      loadComplete: sanitizeTimingValue(timing.loadEventEnd - timing.loadEventStart),
      domInteractive: sanitizeTimingValue(timing.domInteractive - timing.navigationStart),
    };
  }

  // Sanitize resources (limit to first 50)
  if (performance.resources && Array.isArray(performance.resources)) {
    sanitized.resources = performance.resources
      .slice(0, 50)
      .map((resource: any) => ({
        type: resource.type?.substring(0, 20) || 'unknown',
        size: sanitizeTimingValue(resource.size),
        duration: sanitizeTimingValue(resource.duration),
      }))
      .filter(r => r.size > 0 || r.duration > 0);
  }

  return sanitized;
}

/**
 * Sanitize timing values
 */
function sanitizeTimingValue(value: any): number {
  if (typeof value !== 'number' || isNaN(value)) return 0;
  return Math.max(0, Math.min(value, 300000)); // Cap at 5 minutes
}

/**
 * Sanitize error data
 */
function sanitizeErrors(errors: any): any[] {
  if (!errors || !Array.isArray(errors)) return [];

  return errors
    .slice(0, 10) // Limit to 10 errors
    .map(error => ({
      message: error.message?.substring(0, 500) || 'Unknown error',
      timestamp: sanitizeTimingValue(error.timestamp) || Date.now(),
      // Don't store stack traces for privacy/security
    }));
}

/**
 * Sanitize interaction data
 */
function sanitizeInteractions(interactions: any): any[] {
  if (!interactions || !Array.isArray(interactions)) return [];

  return interactions
    .slice(0, 20) // Limit to 20 interactions
    .map(interaction => ({
      type: interaction.type?.substring(0, 20) || 'unknown',
      target: interaction.target?.substring(0, 100) || 'unknown',
      timestamp: sanitizeTimingValue(interaction.timestamp) || Date.now(),
      duration: interaction.duration ? sanitizeTimingValue(interaction.duration) : undefined,
    }));
}

/**
 * Store RUM data (temporary implementation)
 * In production, use a proper database
 */
async function storeRUMData(data: any[]): Promise<void> {
  // This is a temporary implementation
  // In production, you would store in a database like:
  // - PostgreSQL with time-series extensions
  // - InfluxDB for time-series data
  // - MongoDB for document storage
  // - Or send to analytics services like DataDog, New Relic, etc.
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `rum-data-${timestamp}.json`;
  
  // In a real app, don't write to filesystem in serverless environments
  // This is just for demonstration
  console.log(`📊 Would store ${data.length} RUM entries to ${filename}`);
}

/**
 * Analyze RUM data for performance alerts
 */
function analyzeForAlerts(data: any[]): Array<{ type: string; message: string; severity: string }> {
  const alerts: Array<{ type: string; message: string; severity: string }> = [];

  data.forEach(entry => {
    if (entry.performance?.webVitals) {
      const vitals = entry.performance.webVitals;

      // Check LCP
      if (vitals.lcp && vitals.lcp > 4000) {
        alerts.push({
          type: 'lcp_poor',
          message: `Poor LCP detected: ${vitals.lcp.toFixed(0)}ms on ${entry.url}`,
          severity: 'high',
        });
      }

      // Check FID
      if (vitals.fid && vitals.fid > 300) {
        alerts.push({
          type: 'fid_poor',
          message: `Poor FID detected: ${vitals.fid.toFixed(0)}ms on ${entry.url}`,
          severity: 'high',
        });
      }

      // Check CLS
      if (vitals.cls && vitals.cls > 0.25) {
        alerts.push({
          type: 'cls_poor',
          message: `Poor CLS detected: ${vitals.cls.toFixed(3)} on ${entry.url}`,
          severity: 'medium',
        });
      }
    }

    // Check for errors
    if (entry.errors && entry.errors.length > 0) {
      alerts.push({
        type: 'javascript_errors',
        message: `${entry.errors.length} JavaScript errors detected on ${entry.url}`,
        severity: 'medium',
      });
    }
  });

  return alerts;
}

/**
 * Get RUM analytics data
 */
async function getRUMAnalytics(timeRange: string, metric?: string | null): Promise<any> {
  // In production, query from database
  // This is a mock implementation
  
  return {
    timeRange,
    metric,
    summary: {
      totalSessions: 0,
      avgLCP: 0,
      avgFID: 0,
      avgCLS: 0,
      errorRate: 0,
    },
    trends: [],
    topPages: [],
    deviceBreakdown: {},
    connectionBreakdown: {},
  };
}
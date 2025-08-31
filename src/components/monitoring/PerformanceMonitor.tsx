'use client';

import { useEffect, useState } from 'react';
import { 
  initPerformanceMonitoring, 
  getPerformanceMonitors, 
  PerformanceAlert,
  PerformanceMetric,
  DEFAULT_PERFORMANCE_BUDGET 
} from '@/utils/performance';

interface PerformanceMonitorProps {
  enableAlerts?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function PerformanceMonitor({ 
  enableAlerts = true,
  position = 'bottom-right' 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<Record<string, { value: number; rating: string; count: number }>>({});
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      localStorage.getItem('performance-monitor') === 'true';
    
    setIsVisible(shouldShow);
    
    if (!shouldShow) return;

    // Initialize performance monitoring
    const handleAlert = (alert: PerformanceAlert) => {
      setAlerts(prev => [...prev.slice(-4), alert]); // Keep last 5 alerts
      
      if (enableAlerts) {
        console.warn('Performance Alert:', alert);
      }
    };

    initPerformanceMonitoring(DEFAULT_PERFORMANCE_BUDGET, handleAlert);

    // Update metrics periodically
    const interval = setInterval(() => {
      const monitors = getPerformanceMonitors();
      
      if (monitors.webVitals) {
        const summary = monitors.webVitals.getSummary();
        setMetrics(summary);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [enableAlerts]);

  if (!isVisible) return null;

  const getPositionStyles = () => {
    const base = {
      position: 'fixed' as const,
      zIndex: 9999,
      maxWidth: '300px',
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: '20px', left: '20px' };
      case 'top-right':
        return { ...base, top: '20px', right: '20px' };
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px' };
      case 'bottom-right':
      default:
        return { ...base, bottom: '20px', right: '20px' };
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'green';
      case 'needs-improvement': return 'yellow';
      case 'poor': return 'red';
      default: return 'gray';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return Math.round(value).toString();
  };

  const getUnit = (name: string) => {
    if (name === 'CLS') return '';
    return 'ms';
  };

  return (
    <div
      style={{
        ...getPositionStyles(),
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '12px',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#718096' }}>
          Performance Monitor
        </span>
        <button
          style={{
            background: 'none',
            border: 'none',
            fontSize: '12px',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '3px',
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Core Web Vitals Summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {Object.entries(metrics).map(([name, metric]) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ fontWeight: '500' }}>{name}:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>
                {formatValue(name, metric.value)}{getUnit(name)}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  backgroundColor: getRatingColor(metric.rating) === 'green' ? '#c6f6d5' : 
                                 getRatingColor(metric.rating) === 'yellow' ? '#fef5e7' : '#fed7d7',
                  color: getRatingColor(metric.rating) === 'green' ? '#22543d' : 
                         getRatingColor(metric.rating) === 'yellow' ? '#744210' : '#742a2a',
                }}
              >
                {metric.rating.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f7fafc' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#e53e3e', marginBottom: '4px' }}>
            Recent Alerts ({alerts.length})
          </div>
          {alerts.slice(-2).map((alert, index) => (
            <div key={index} style={{ fontSize: '12px', color: '#e53e3e' }}>
              {alert.metric}: {Math.round(alert.value)} &gt; {alert.threshold}
            </div>
          ))}
        </div>
      )}

      {/* Detailed View */}
      {isExpanded && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f7fafc' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Performance Budget Progress */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Budget Usage
              </div>
              {Object.entries(metrics).map(([name, metric]) => {
                const budget = DEFAULT_PERFORMANCE_BUDGET[name.toLowerCase() as keyof typeof DEFAULT_PERFORMANCE_BUDGET];
                if (!budget) return null;
                
                const percentage = Math.min((metric.value / budget) * 100, 100);
                const color = percentage > 100 ? '#e53e3e' : percentage > 80 ? '#d69e2e' : '#38a169';
                
                return (
                  <div key={name} style={{ marginBottom: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
                      <span>{name}</span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '4px', 
                      backgroundColor: '#e2e8f0', 
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${Math.min(percentage, 100)}%`, 
                        height: '100%', 
                        backgroundColor: color,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
              <button
                style={{
                  padding: '4px 8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
                onClick={() => {
                  const monitors = getPerformanceMonitors();
                  if (monitors.webVitals) {
                    console.log('Performance Metrics:', monitors.webVitals.getMetrics());
                  }
                  if (monitors.resources) {
                    console.log('Resource Summary:', monitors.resources.getResourceSummary());
                  }
                }}
              >
                Log Details
              </button>
              <button
                style={{
                  padding: '4px 8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
                onClick={() => {
                  const monitors = getPerformanceMonitors();
                  if (monitors.webVitals) {
                    monitors.webVitals.clearMetrics();
                  }
                  setMetrics({});
                  setAlerts([]);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Performance monitoring hook for programmatic access
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<Record<string, { value: number; rating: string; count: number }>>({});
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsMonitoring(true);
    
    initPerformanceMonitoring();

    const interval = setInterval(() => {
      const monitors = getPerformanceMonitors();
      
      if (monitors.webVitals) {
        const summary = monitors.webVitals.getSummary();
        setMetrics(summary);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, []);

  const getMonitors = () => getPerformanceMonitors();

  const reportSummary = () => {
    const monitors = getPerformanceMonitors();
    
    if (monitors.webVitals) {
      console.group('📊 Performance Summary');
      console.table(monitors.webVitals.getSummary());
      
      if (monitors.resources) {
        console.table(monitors.resources.getResourceSummary());
      }
      
      console.groupEnd();
    }
  };

  return {
    metrics,
    isMonitoring,
    getMonitors,
    reportSummary,
  };
}
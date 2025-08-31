# Performance Optimization Guide

This document provides comprehensive guidance for maintaining and optimizing the performance of the Lex Consulting website.

## Overview

The website has been optimized for performance with the following key improvements:

- ✅ Core Web Vitals monitoring and optimization
- ✅ Bundle size optimization and code splitting
- ✅ Real User Monitoring (RUM) implementation
- ✅ Performance budgets and automated testing
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Modern image optimization (WebP/AVIF)
- ✅ Lazy loading for non-critical components

## Performance Budgets

The following performance budgets are enforced:

| Metric | Budget | Description |
|--------|--------|-------------|
| LCP | 2.5s | Largest Contentful Paint |
| FID | 100ms | First Input Delay |
| CLS | 0.1 | Cumulative Layout Shift |
| TTFB | 600ms | Time to First Byte |
| FCP | 1.8s | First Contentful Paint |
| Bundle Size | 500KB | Main JavaScript bundle |
| Total Size | 2MB | Total page size |

## Monitoring and Analytics

### Real-Time Performance Monitoring

The application includes built-in performance monitoring that:

- Tracks Core Web Vitals in real-time
- Collects Real User Monitoring (RUM) data
- Provides performance alerts for budget violations
- Generates detailed performance reports

### Performance Dashboard

Access the performance dashboard in development mode:

```bash
npm run dev
# Navigate to any page and check the bottom-right corner for the performance monitor
```

### Performance Scripts

```bash
# Run performance analysis
npm run perf:analyze

# Run performance monitoring tests
npm run perf:monitor

# Generate comprehensive performance report
npm run perf:report

# Run cleanup and optimization
node scripts/cleanup-optimization.js
```

## Core Web Vitals Optimization

### Largest Contentful Paint (LCP)

**Target: < 2.5 seconds**

Optimizations implemented:
- Next.js Image component with proper sizing
- WebP/AVIF image formats
- Lazy loading for non-critical images
- CDN-ready configuration
- Preloading of critical resources

**Monitoring:**
```javascript
// LCP is automatically tracked by the performance monitoring system
// Check the PerformanceMonitor component for real-time data
```

### First Input Delay (FID)

**Target: < 100ms**

Optimizations implemented:
- Code splitting to reduce main thread blocking
- Dynamic imports for non-critical components
- Optimized JavaScript execution
- Deferred loading of third-party scripts

### Cumulative Layout Shift (CLS)

**Target: < 0.1**

Optimizations implemented:
- Explicit dimensions for all images and videos
- Reserved space for dynamic content
- CSS transforms instead of layout-changing properties
- Proper font loading with font-display: swap

## Bundle Optimization

### Current Bundle Analysis

Run bundle analysis to identify optimization opportunities:

```bash
npm run perf:analyze
```

### Code Splitting Strategy

The application uses the following code splitting approach:

1. **Route-based splitting**: Automatic with Next.js App Router
2. **Component-based splitting**: Dynamic imports for heavy components
3. **Vendor splitting**: Separate chunks for React, Chakra UI, and other libraries
4. **Content splitting**: Separate chunks for JSON content files

### Dynamic Imports

Heavy components are dynamically imported:

```javascript
// Example: Contact form lazy loading
const SecureContactForm = dynamic(
  () => import('@/components/forms/SecureContactForm'),
  { 
    ssr: false,
    loading: () => <Box>Loading form...</Box>
  }
);
```

## Image Optimization

### Formats and Compression

- **Primary format**: WebP with AVIF fallback
- **Compression**: Automatic optimization via Next.js Image
- **Responsive images**: Multiple sizes for different viewports
- **Lazy loading**: Implemented for all non-critical images

### Image Guidelines

```javascript
// Use OptimizedImage component for all images
import { OptimizedImage } from '@/components/media';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  priority={false} // Set to true for above-the-fold images
/>
```

## Performance Testing

### Automated Testing

Performance tests run automatically in CI/CD:

```bash
# Run all performance tests
npm run test:performance

# Run Core Web Vitals tests
npm run test -- src/test/performance/core-web-vitals.test.ts

# Run Lighthouse audit
npm run test:lighthouse
```

### Manual Testing

1. **Local Performance Testing:**
   ```bash
   npm run build
   npm run start
   npm run perf:monitor
   ```

2. **Performance Dashboard:**
   - Enable in development: Set `localStorage.setItem('performance-monitor', 'true')`
   - View real-time metrics in the bottom-right corner

3. **Browser DevTools:**
   - Use Lighthouse for comprehensive audits
   - Check Network tab for resource loading
   - Use Performance tab for detailed analysis

## Real User Monitoring (RUM)

### Data Collection

RUM automatically collects:
- Core Web Vitals from real users
- Navigation timing data
- Resource loading performance
- JavaScript errors
- User interactions

### RUM Configuration

```javascript
// RUM is initialized automatically in providers.tsx
initRUM({
  sampleRate: 0.1, // 10% of users in production
  enableErrorTracking: true,
  enableInteractionTracking: true,
  enableResourceTracking: true,
});
```

### RUM API Endpoint

Data is sent to `/api/rum` and can be:
- Stored in a database
- Sent to analytics services
- Used for performance monitoring dashboards

## Accessibility Performance

### WCAG 2.1 AA Compliance

The application maintains accessibility while optimizing performance:

- **Color contrast**: Minimum 4.5:1 ratio
- **Keyboard navigation**: Full support
- **Screen readers**: Proper ARIA labels and semantic HTML
- **Focus management**: Clear visual indicators

### Accessibility Testing

```bash
# Run accessibility tests
npm run test:accessibility

# Manual testing with screen readers
# Use NVDA, JAWS, or VoiceOver for testing
```

## Maintenance Guidelines

### Regular Performance Audits

1. **Weekly**: Check performance dashboard for trends
2. **Monthly**: Run comprehensive performance tests
3. **Quarterly**: Review and update performance budgets
4. **Before releases**: Full performance audit

### Performance Budget Monitoring

Monitor these metrics continuously:

```javascript
// Performance budgets are defined in src/utils/performance.ts
export const DEFAULT_PERFORMANCE_BUDGET = {
  lcp: 2500,      // 2.5 seconds
  fid: 100,       // 100ms
  cls: 0.1,       // 0.1
  ttfb: 600,      // 600ms
  fcp: 1800,      // 1.8 seconds
  bundleSize: 500000, // 500KB
  imageSize: 1000000, // 1MB
};
```

### Code Quality Maintenance

1. **Remove unused dependencies**: Run `npm run perf:analyze` regularly
2. **Optimize imports**: Use tree shaking friendly imports
3. **Update dependencies**: Keep packages up to date for performance improvements
4. **Monitor bundle size**: Set up alerts for bundle size increases

## Troubleshooting

### Common Performance Issues

1. **Large Bundle Size**
   - Check for unused dependencies
   - Implement more dynamic imports
   - Review webpack bundle analyzer output

2. **Poor LCP**
   - Optimize images above the fold
   - Reduce server response time
   - Preload critical resources

3. **High CLS**
   - Set explicit dimensions for images
   - Reserve space for dynamic content
   - Avoid layout-shifting animations

4. **Slow FID**
   - Reduce JavaScript execution time
   - Implement code splitting
   - Defer non-critical scripts

### Performance Debugging

1. **Enable detailed logging:**
   ```javascript
   localStorage.setItem('performance-monitor', 'true');
   localStorage.setItem('debug-performance', 'true');
   ```

2. **Use browser DevTools:**
   - Performance tab for detailed analysis
   - Network tab for resource loading
   - Lighthouse for comprehensive audits

3. **Check RUM data:**
   - Review `/api/rum` endpoint logs
   - Analyze user performance patterns
   - Identify performance regressions

## Deployment Optimization

### Production Build

```bash
# Optimized production build
npm run build

# Analyze production bundle
ANALYZE=true npm run build
```

### CDN Configuration

For optimal performance, configure CDN with:
- Gzip/Brotli compression
- Proper cache headers
- Image optimization
- Global edge locations

### Monitoring in Production

1. **Set up performance monitoring:**
   - Configure RUM endpoint
   - Set up alerting for budget violations
   - Monitor Core Web Vitals trends

2. **Regular audits:**
   - Weekly Lighthouse audits
   - Monthly performance reviews
   - Quarterly optimization sprints

## Resources

### Tools and Services

- **Lighthouse**: Automated performance auditing
- **WebPageTest**: Detailed performance analysis
- **Chrome DevTools**: Real-time performance debugging
- **Next.js Analytics**: Built-in performance monitoring

### Documentation

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Chakra UI Performance](https://chakra-ui.com/docs/styled-system/performance)
- [React Performance](https://react.dev/learn/render-and-commit)

### Performance Checklist

- [ ] Core Web Vitals within budget
- [ ] Bundle size optimized
- [ ] Images properly optimized
- [ ] Accessibility compliance maintained
- [ ] Performance tests passing
- [ ] RUM data being collected
- [ ] Performance monitoring active
- [ ] Documentation up to date

---

**Last Updated**: December 2024
**Next Review**: March 2025
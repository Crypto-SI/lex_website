#!/usr/bin/env node

/**
 * Performance monitoring script for CI/CD pipeline
 * Runs performance tests and generates reports with budget validation
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Performance budgets (in milliseconds unless specified)
const PERFORMANCE_BUDGETS = {
  lcp: 2500,      // Largest Contentful Paint
  fid: 100,       // First Input Delay
  cls: 0.1,       // Cumulative Layout Shift
  fcp: 1800,      // First Contentful Paint
  ttfb: 600,      // Time to First Byte
  bundleSize: 500000, // Main bundle size in bytes
  totalSize: 2000000, // Total page size in bytes
};

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3000',
  pages: [
    '/',
    '/about',
    '/services',
    '/contact',
  ],
  iterations: 3, // Number of test runs per page
  timeout: 30000,
};

/**
 * Collect Core Web Vitals for a page
 */
async function collectWebVitals(page, url) {
  console.log(`📊 Testing ${url}...`);
  
  const metrics = {};
  
  try {
    // Navigate to page
    const response = await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: TEST_CONFIG.timeout 
    });
    
    if (!response || response.status() !== 200) {
      throw new Error(`Failed to load page: ${response?.status()}`);
    }

    // Collect TTFB
    const navigationTiming = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return navigation ? navigation.responseStart - navigation.requestStart : 0;
    });
    metrics.ttfb = navigationTiming;

    // Collect LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        let lcpValue = 0;
        
        if ('PerformanceObserver' in window) {
          try {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              if (lastEntry) {
                lcpValue = lastEntry.startTime;
              }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Wait for LCP or timeout
            setTimeout(() => resolve(lcpValue), 5000);
          } catch (e) {
            resolve(0);
          }
        } else {
          resolve(0);
        }
      });
    });
    metrics.lcp = lcp;

    // Collect FCP
    const fcp = await page.evaluate(() => {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      return fcpEntry ? fcpEntry.startTime : 0;
    });
    metrics.fcp = fcp;

    // Collect CLS
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        
        if ('PerformanceObserver' in window) {
          try {
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value;
                }
              }
            });
            observer.observe({ entryTypes: ['layout-shift'] });
            
            setTimeout(() => resolve(clsValue), 3000);
          } catch (e) {
            resolve(0);
          }
        } else {
          resolve(0);
        }
      });
    });
    metrics.cls = cls;

    // Collect resource sizes
    const resourceSizes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;
      let imageSize = 0;
      
      resources.forEach(resource => {
        const size = resource.transferSize || 0;
        totalSize += size;
        
        if (resource.name.includes('.js')) {
          jsSize += size;
        } else if (resource.name.includes('.css')) {
          cssSize += size;
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
          imageSize += size;
        }
      });
      
      return { totalSize, jsSize, cssSize, imageSize };
    });
    
    metrics.totalSize = resourceSizes.totalSize;
    metrics.jsSize = resourceSizes.jsSize;
    metrics.cssSize = resourceSizes.cssSize;
    metrics.imageSize = resourceSizes.imageSize;

    // Simulate FID by clicking a button if available
    try {
      const button = await page.locator('button').first();
      if (await button.count() > 0) {
        const fidStart = Date.now();
        await button.click();
        const fidEnd = Date.now();
        metrics.fid = fidEnd - fidStart;
      } else {
        metrics.fid = 0;
      }
    } catch (e) {
      metrics.fid = 0;
    }

    return metrics;
    
  } catch (error) {
    console.error(`❌ Error testing ${url}:`, error.message);
    return null;
  }
}

/**
 * Validate metrics against performance budgets
 */
function validateBudgets(metrics, url) {
  const results = [];
  
  Object.entries(PERFORMANCE_BUDGETS).forEach(([metric, budget]) => {
    const value = metrics[metric];
    if (value !== undefined) {
      const passed = value <= budget;
      const percentage = ((value / budget) * 100).toFixed(1);
      
      results.push({
        metric,
        value,
        budget,
        passed,
        percentage: parseFloat(percentage),
        url,
      });
      
      const status = passed ? '✅' : '❌';
      const unit = metric === 'cls' ? '' : (metric.includes('Size') ? ' bytes' : ' ms');
      console.log(`  ${status} ${metric.toUpperCase()}: ${value}${unit} / ${budget}${unit} (${percentage}%)`);
    }
  });
  
  return results;
}

/**
 * Generate performance report
 */
function generateReport(allResults) {
  const report = {
    timestamp: new Date().toISOString(),
    config: {
      budgets: PERFORMANCE_BUDGETS,
      testConfig: TEST_CONFIG,
    },
    summary: {
      totalTests: allResults.length,
      passedTests: allResults.filter(r => r.passed).length,
      failedTests: allResults.filter(r => !r.passed).length,
    },
    results: allResults,
    recommendations: generateRecommendations(allResults),
  };
  
  // Calculate averages by metric
  const metricAverages = {};
  Object.keys(PERFORMANCE_BUDGETS).forEach(metric => {
    const metricResults = allResults.filter(r => r.metric === metric);
    if (metricResults.length > 0) {
      const average = metricResults.reduce((sum, r) => sum + r.value, 0) / metricResults.length;
      const passRate = (metricResults.filter(r => r.passed).length / metricResults.length) * 100;
      
      metricAverages[metric] = {
        average: parseFloat(average.toFixed(2)),
        passRate: parseFloat(passRate.toFixed(1)),
        budget: PERFORMANCE_BUDGETS[metric],
      };
    }
  });
  
  report.averages = metricAverages;
  
  return report;
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(results) {
  const recommendations = [];
  const failedMetrics = {};
  
  // Group failed tests by metric
  results.filter(r => !r.passed).forEach(result => {
    if (!failedMetrics[result.metric]) {
      failedMetrics[result.metric] = [];
    }
    failedMetrics[result.metric].push(result);
  });
  
  // Generate recommendations based on failed metrics
  Object.entries(failedMetrics).forEach(([metric, failures]) => {
    const avgOverage = failures.reduce((sum, f) => sum + f.percentage, 0) / failures.length;
    
    switch (metric) {
      case 'lcp':
        recommendations.push({
          metric,
          priority: 'high',
          message: `LCP is ${avgOverage.toFixed(1)}% over budget on average`,
          suggestions: [
            'Optimize images with WebP/AVIF formats',
            'Implement lazy loading for non-critical images',
            'Reduce server response times',
            'Use a CDN for static assets',
            'Preload critical resources',
          ],
        });
        break;
        
      case 'fid':
        recommendations.push({
          metric,
          priority: 'high',
          message: `FID is ${avgOverage.toFixed(1)}% over budget on average`,
          suggestions: [
            'Reduce JavaScript execution time',
            'Use code splitting to reduce main thread blocking',
            'Defer non-critical JavaScript',
            'Optimize third-party scripts',
          ],
        });
        break;
        
      case 'cls':
        recommendations.push({
          metric,
          priority: 'medium',
          message: `CLS is ${avgOverage.toFixed(1)}% over budget on average`,
          suggestions: [
            'Set explicit dimensions for images and videos',
            'Reserve space for dynamic content',
            'Avoid inserting content above existing content',
            'Use CSS transforms instead of changing layout properties',
          ],
        });
        break;
        
      case 'bundleSize':
      case 'totalSize':
        recommendations.push({
          metric,
          priority: 'medium',
          message: `Bundle size is ${avgOverage.toFixed(1)}% over budget on average`,
          suggestions: [
            'Enable gzip/brotli compression',
            'Remove unused dependencies',
            'Use tree shaking to eliminate dead code',
            'Implement code splitting',
            'Optimize images and use modern formats',
          ],
        });
        break;
    }
  });
  
  return recommendations;
}

/**
 * Main performance monitoring function
 */
async function runPerformanceMonitoring() {
  console.log('🚀 Starting performance monitoring...\n');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  
  const allResults = [];
  
  try {
    for (const pagePath of TEST_CONFIG.pages) {
      const url = `${TEST_CONFIG.baseUrl}${pagePath}`;
      
      // Run multiple iterations for more reliable results
      const pageResults = [];
      
      for (let i = 0; i < TEST_CONFIG.iterations; i++) {
        const page = await browser.newPage();
        
        // Set up performance monitoring
        await page.addInitScript(() => {
          // Ensure performance observers are available
          window.performanceMetrics = {};
        });
        
        const metrics = await collectWebVitals(page, url);
        
        if (metrics) {
          const validationResults = validateBudgets(metrics, url);
          pageResults.push(...validationResults);
        }
        
        await page.close();
      }
      
      // Calculate averages for this page
      if (pageResults.length > 0) {
        const metricGroups = {};
        pageResults.forEach(result => {
          if (!metricGroups[result.metric]) {
            metricGroups[result.metric] = [];
          }
          metricGroups[result.metric].push(result);
        });
        
        // Add averaged results
        Object.entries(metricGroups).forEach(([metric, results]) => {
          const avgValue = results.reduce((sum, r) => sum + r.value, 0) / results.length;
          const budget = results[0].budget;
          const passed = avgValue <= budget;
          
          allResults.push({
            metric,
            value: parseFloat(avgValue.toFixed(2)),
            budget,
            passed,
            percentage: parseFloat(((avgValue / budget) * 100).toFixed(1)),
            url,
          });
        });
      }
      
      console.log(''); // Add spacing between pages
    }
    
    // Generate and save report
    const report = generateReport(allResults);
    
    const reportPath = path.join(process.cwd(), 'performance-monitoring-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Performance Monitoring Summary:');
    console.log('=' .repeat(50));
    console.log(`Total tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.passedTests} (${((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(1)}%)`);
    console.log(`Failed: ${report.summary.failedTests} (${((report.summary.failedTests / report.summary.totalTests) * 100).toFixed(1)}%)`);
    
    console.log('\n📈 Metric Averages:');
    Object.entries(report.averages).forEach(([metric, data]) => {
      const status = data.passRate === 100 ? '✅' : data.passRate >= 80 ? '⚠️ ' : '❌';
      console.log(`${status} ${metric.toUpperCase()}: ${data.average} (${data.passRate}% pass rate)`);
    });
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach((rec, index) => {
        const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`${priority} ${rec.message}`);
        rec.suggestions.slice(0, 2).forEach(suggestion => {
          console.log(`   • ${suggestion}`);
        });
      });
    }
    
    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
    // Exit with error code if critical metrics failed
    const criticalFailures = allResults.filter(r => 
      !r.passed && ['lcp', 'fid', 'cls'].includes(r.metric)
    );
    
    if (criticalFailures.length > 0) {
      console.log('\n❌ Critical performance budgets exceeded!');
      process.exit(1);
    } else {
      console.log('\n✅ All critical performance budgets met!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Performance monitoring failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the monitoring if this script is executed directly
if (require.main === module) {
  runPerformanceMonitoring().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  runPerformanceMonitoring,
  collectWebVitals,
  validateBudgets,
  generateReport,
  PERFORMANCE_BUDGETS,
  TEST_CONFIG,
};
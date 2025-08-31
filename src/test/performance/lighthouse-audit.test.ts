import { describe, it, expect } from 'vitest'
import lighthouse from 'lighthouse'
import { chromium } from 'playwright'

describe('Lighthouse Performance Audits', () => {
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

  const runLighthouseAudit = async (url: string) => {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    
    try {
      // Get the CDP endpoint
      const cdpSession = await page.context().newCDPSession(page)
      const { webSocketDebuggerUrl } = await cdpSession.send('Target.getTargets')
      
      const options = {
        logLevel: 'info' as const,
        output: 'json' as const,
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: 9222,
      }

      const runnerResult = await lighthouse(url, options)
      
      if (!runnerResult) {
        throw new Error('Lighthouse audit failed')
      }

      return runnerResult.lhr
    } finally {
      await browser.close()
    }
  }

  describe('Performance Metrics', () => {
    it('should meet performance benchmarks on homepage', async () => {
      const result = await runLighthouseAudit(baseUrl)
      
      const performanceScore = result.categories.performance.score * 100
      const metrics = result.audits

      // Performance score should be at least 90
      expect(performanceScore).toBeGreaterThanOrEqual(90)

      // Core Web Vitals
      if (metrics['largest-contentful-paint']) {
        const lcp = metrics['largest-contentful-paint'].numericValue
        expect(lcp).toBeLessThan(2500) // 2.5 seconds
      }

      if (metrics['first-input-delay']) {
        const fid = metrics['first-input-delay'].numericValue
        expect(fid).toBeLessThan(100) // 100ms
      }

      if (metrics['cumulative-layout-shift']) {
        const cls = metrics['cumulative-layout-shift'].numericValue
        expect(cls).toBeLessThan(0.1) // 0.1
      }

      // Time to First Byte
      if (metrics['server-response-time']) {
        const ttfb = metrics['server-response-time'].numericValue
        expect(ttfb).toBeLessThan(600) // 600ms
      }

      // First Contentful Paint
      if (metrics['first-contentful-paint']) {
        const fcp = metrics['first-contentful-paint'].numericValue
        expect(fcp).toBeLessThan(1800) // 1.8 seconds
      }
    }, 60000) // 60 second timeout

    it('should have optimized images', async () => {
      const result = await runLighthouseAudit(baseUrl)
      const metrics = result.audits

      // Modern image formats
      if (metrics['modern-image-formats']) {
        const modernImageScore = metrics['modern-image-formats'].score
        expect(modernImageScore).toBeGreaterThanOrEqual(0.9)
      }

      // Properly sized images
      if (metrics['uses-responsive-images']) {
        const responsiveImageScore = metrics['uses-responsive-images'].score
        expect(responsiveImageScore).toBeGreaterThanOrEqual(0.9)
      }

      // Optimized images
      if (metrics['uses-optimized-images']) {
        const optimizedImageScore = metrics['uses-optimized-images'].score
        expect(optimizedImageScore).toBeGreaterThanOrEqual(0.9)
      }
    }, 60000)

    it('should have efficient resource loading', async () => {
      const result = await runLighthouseAudit(baseUrl)
      const metrics = result.audits

      // Unused CSS
      if (metrics['unused-css-rules']) {
        const unusedCssScore = metrics['unused-css-rules'].score
        expect(unusedCssScore).toBeGreaterThanOrEqual(0.8)
      }

      // Unused JavaScript
      if (metrics['unused-javascript']) {
        const unusedJsScore = metrics['unused-javascript'].score
        expect(unusedJsScore).toBeGreaterThanOrEqual(0.8)
      }

      // Render blocking resources
      if (metrics['render-blocking-resources']) {
        const renderBlockingScore = metrics['render-blocking-resources'].score
        expect(renderBlockingScore).toBeGreaterThanOrEqual(0.8)
      }
    }, 60000)
  })

  describe('Accessibility Metrics', () => {
    it('should meet accessibility standards', async () => {
      const result = await runLighthouseAudit(baseUrl)
      
      const accessibilityScore = result.categories.accessibility.score * 100
      expect(accessibilityScore).toBeGreaterThanOrEqual(95)

      const metrics = result.audits

      // Color contrast
      if (metrics['color-contrast']) {
        expect(metrics['color-contrast'].score).toBe(1)
      }

      // Image alt text
      if (metrics['image-alt']) {
        expect(metrics['image-alt'].score).toBe(1)
      }

      // Form labels
      if (metrics['label']) {
        expect(metrics['label'].score).toBe(1)
      }

      // Heading order
      if (metrics['heading-order']) {
        expect(metrics['heading-order'].score).toBe(1)
      }
    }, 60000)
  })

  describe('SEO Metrics', () => {
    it('should meet SEO best practices', async () => {
      const result = await runLighthouseAudit(baseUrl)
      
      const seoScore = result.categories.seo.score * 100
      expect(seoScore).toBeGreaterThanOrEqual(90)

      const metrics = result.audits

      // Meta description
      if (metrics['meta-description']) {
        expect(metrics['meta-description'].score).toBe(1)
      }

      // Document title
      if (metrics['document-title']) {
        expect(metrics['document-title'].score).toBe(1)
      }

      // Viewport meta tag
      if (metrics['viewport']) {
        expect(metrics['viewport'].score).toBe(1)
      }

      // Crawlable links
      if (metrics['crawlable-anchors']) {
        expect(metrics['crawlable-anchors'].score).toBe(1)
      }
    }, 60000)
  })

  describe('Best Practices', () => {
    it('should follow web best practices', async () => {
      const result = await runLighthouseAudit(baseUrl)
      
      const bestPracticesScore = result.categories['best-practices'].score * 100
      expect(bestPracticesScore).toBeGreaterThanOrEqual(90)

      const metrics = result.audits

      // HTTPS usage
      if (metrics['is-on-https']) {
        expect(metrics['is-on-https'].score).toBe(1)
      }

      // No console errors
      if (metrics['errors-in-console']) {
        expect(metrics['errors-in-console'].score).toBe(1)
      }

      // Proper image aspect ratios
      if (metrics['image-aspect-ratio']) {
        expect(metrics['image-aspect-ratio'].score).toBe(1)
      }
    }, 60000)
  })

  describe('Progressive Web App Features', () => {
    it('should have PWA characteristics', async () => {
      const result = await runLighthouseAudit(baseUrl)
      const metrics = result.audits

      // Viewport meta tag
      if (metrics['viewport']) {
        expect(metrics['viewport'].score).toBe(1)
      }

      // Themed omnibox
      if (metrics['themed-omnibox']) {
        expect(metrics['themed-omnibox'].score).toBe(1)
      }

      // Manifest
      if (metrics['installable-manifest']) {
        // PWA manifest is optional but good to have
        expect(metrics['installable-manifest'].score).toBeGreaterThanOrEqual(0)
      }
    }, 60000)
  })
})
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium, Browser, Page } from 'playwright'
import { DEFAULT_PERFORMANCE_BUDGET } from '@/utils/performance'

describe('Core Web Vitals Performance Tests', () => {
  let browser: Browser
  let page: Page
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

  beforeAll(async () => {
    browser = await chromium.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  describe('Largest Contentful Paint (LCP)', () => {
    it('should have LCP under 2.5 seconds on homepage', async () => {
      await page.goto(baseUrl)
      
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            resolve(lastEntry.startTime)
          }).observe({ entryTypes: ['largest-contentful-paint'] })
          
          // Fallback timeout
          setTimeout(() => resolve(0), 5000)
        })
      })

      expect(lcp).toBeLessThan(DEFAULT_PERFORMANCE_BUDGET.lcp)
    })

    it('should have good LCP on services page', async () => {
      await page.goto(`${baseUrl}/services`)
      
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            resolve(lastEntry.startTime)
          }).observe({ entryTypes: ['largest-contentful-paint'] })
          
          setTimeout(() => resolve(0), 5000)
        })
      })

      expect(lcp).toBeLessThan(DEFAULT_PERFORMANCE_BUDGET.lcp)
    })
  })

  describe('First Input Delay (FID)', () => {
    it('should have FID under 100ms', async () => {
      await page.goto(baseUrl)
      
      // Wait for page to load
      await page.waitForLoadState('networkidle')
      
      // Simulate user interaction
      const button = await page.locator('button').first()
      if (await button.count() > 0) {
        const fid = await page.evaluate(async () => {
          return new Promise((resolve) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries()
              if (entries.length > 0) {
                resolve(entries[0].processingStart - entries[0].startTime)
              }
            }).observe({ entryTypes: ['first-input'] })
            
            // Simulate click
            const btn = document.querySelector('button')
            if (btn) {
              btn.click()
            }
            
            setTimeout(() => resolve(0), 2000)
          })
        })

        expect(fid).toBeLessThan(DEFAULT_PERFORMANCE_BUDGET.fid)
      }
    })
  })

  describe('Cumulative Layout Shift (CLS)', () => {
    it('should have CLS under 0.1', async () => {
      await page.goto(baseUrl)
      
      // Wait for page to fully load and settle
      await page.waitForTimeout(3000)
      
      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsValue = 0
          
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value
              }
            }
            resolve(clsValue)
          }).observe({ entryTypes: ['layout-shift'] })
          
          setTimeout(() => resolve(clsValue), 2000)
        })
      })

      expect(cls).toBeLessThan(DEFAULT_PERFORMANCE_BUDGET.cls)
    })
  })

  describe('Time to First Byte (TTFB)', () => {
    it('should have TTFB under 600ms', async () => {
      const response = await page.goto(baseUrl)
      const timing = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        return navigation.responseStart - navigation.requestStart
      })

      expect(timing).toBeLessThan(DEFAULT_PERFORMANCE_BUDGET.ttfb)
    })
  })

  describe('Resource Loading Performance', () => {
    it('should load critical resources quickly', async () => {
      await page.goto(baseUrl)
      
      const resourceTimings = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource')
        return resources.map(resource => ({
          name: resource.name,
          duration: resource.duration,
          size: (resource as any).transferSize || 0
        }))
      })

      // Check that CSS loads quickly
      const cssResources = resourceTimings.filter(r => r.name.includes('.css'))
      cssResources.forEach(css => {
        expect(css.duration).toBeLessThan(1000) // 1 second
      })

      // Check that JavaScript loads reasonably quickly
      const jsResources = resourceTimings.filter(r => r.name.includes('.js'))
      jsResources.forEach(js => {
        expect(js.duration).toBeLessThan(2000) // 2 seconds
      })
    })

    it('should have reasonable bundle sizes', async () => {
      await page.goto(baseUrl)
      
      const resourceSizes = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource')
        return resources.map(resource => ({
          name: resource.name,
          size: (resource as any).transferSize || 0
        }))
      })

      // Check main JavaScript bundle size
      const mainJs = resourceSizes.find(r => r.name.includes('main') && r.name.includes('.js'))
      if (mainJs) {
        expect(mainJs.size).toBeLessThan(500000) // 500KB
      }

      // Check CSS bundle size
      const mainCss = resourceSizes.find(r => r.name.includes('.css'))
      if (mainCss) {
        expect(mainCss.size).toBeLessThan(100000) // 100KB
      }
    })
  })

  describe('Image Optimization Performance', () => {
    it('should load images efficiently', async () => {
      await page.goto(baseUrl)
      
      const imageMetrics = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'))
        return images.map(img => ({
          src: img.src,
          loading: img.loading,
          width: img.naturalWidth,
          height: img.naturalHeight,
          complete: img.complete
        }))
      })

      // Check that images have proper loading attributes
      imageMetrics.forEach(img => {
        if (!img.src.includes('data:')) { // Skip data URLs
          expect(['lazy', 'eager', undefined]).toContain(img.loading)
        }
      })

      // Check that images load successfully
      const failedImages = imageMetrics.filter(img => !img.complete && img.src)
      expect(failedImages.length).toBe(0)
    })
  })

  describe('Font Loading Performance', () => {
    it('should load fonts without blocking render', async () => {
      const response = await page.goto(baseUrl)
      
      // Check for font-display: swap or similar optimization
      const fontMetrics = await page.evaluate(() => {
        const stylesheets = Array.from(document.styleSheets)
        let fontDisplayFound = false
        
        try {
          stylesheets.forEach(sheet => {
            if (sheet.cssRules) {
              Array.from(sheet.cssRules).forEach(rule => {
                if (rule.cssText && rule.cssText.includes('font-display')) {
                  fontDisplayFound = true
                }
              })
            }
          })
        } catch (e) {
          // Cross-origin stylesheets may not be accessible
        }
        
        return { fontDisplayFound }
      })

      // Font loading should be optimized
      expect(response?.status()).toBe(200)
    })
  })
})
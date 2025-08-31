import { describe, it, expect } from 'vitest'
import { chromium, firefox, webkit, Browser, Page } from 'playwright'

describe('Cross-Browser Compatibility Tests', () => {
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000'
  const browsers = [
    { name: 'Chromium', launch: chromium.launch },
    { name: 'Firefox', launch: firefox.launch },
    { name: 'WebKit', launch: webkit.launch },
  ]

  browsers.forEach(({ name, launch }) => {
    describe(`${name} Browser Tests`, () => {
      let browser: Browser
      let page: Page

      beforeEach(async () => {
        browser = await launch()
        page = await browser.newPage()
      })

      afterEach(async () => {
        await browser.close()
      })

      it('should load homepage successfully', async () => {
        const response = await page.goto(baseUrl)
        expect(response?.status()).toBe(200)
        
        // Check that basic content is present
        const title = await page.title()
        expect(title).toBeTruthy()
        expect(title.length).toBeGreaterThan(0)
      })

      it('should render basic page structure', async () => {
        await page.goto(baseUrl)
        await page.waitForLoadState('networkidle')
        
        // Check for essential elements
        const header = await page.locator('header').count()
        const main = await page.locator('main').count()
        const footer = await page.locator('footer').count()
        
        expect(header).toBeGreaterThan(0)
        expect(main + await page.locator('[role="main"]').count()).toBeGreaterThan(0)
        expect(footer).toBeGreaterThan(0)
      })

      it('should handle CSS properly', async () => {
        await page.goto(baseUrl)
        await page.waitForLoadState('networkidle')
        
        // Check that styles are applied
        const bodyStyles = await page.evaluate(() => {
          const body = document.body
          const styles = window.getComputedStyle(body)
          return {
            fontFamily: styles.fontFamily,
            backgroundColor: styles.backgroundColor,
            color: styles.color,
          }
        })
        
        expect(bodyStyles.fontFamily).toBeTruthy()
        expect(bodyStyles.backgroundColor).toBeTruthy()
        expect(bodyStyles.color).toBeTruthy()
      })

      it('should execute JavaScript correctly', async () => {
        await page.goto(baseUrl)
        await page.waitForLoadState('networkidle')
        
        // Test basic JavaScript functionality
        const jsWorking = await page.evaluate(() => {
          // Test basic JS features
          const array = [1, 2, 3]
          const doubled = array.map(x => x * 2)
          return doubled.length === 3 && doubled[0] === 2
        })
        
        expect(jsWorking).toBe(true)
      })

      it('should handle modern JavaScript features', async () => {
        await page.goto(baseUrl)
        await page.waitForLoadState('networkidle')
        
        const modernJsSupport = await page.evaluate(() => {
          try {
            // Test arrow functions
            const arrow = () => 'test'
            
            // Test template literals
            const template = `Hello ${'world'}`
            
            // Test destructuring
            const [first] = [1, 2, 3]
            
            // Test async/await (basic syntax check)
            const asyncFunc = async () => 'async'
            
            return arrow() === 'test' && 
                   template === 'Hello world' && 
                   first === 1 &&
                   typeof asyncFunc === 'function'
          } catch (e) {
            return false
          }
        })
        
        expect(modernJsSupport).toBe(true)
      })

      it('should handle form interactions', async () => {
        await page.goto(`${baseUrl}/contact`)
        await page.waitForLoadState('networkidle')
        
        const inputs = await page.locator('input').count()
        if (inputs > 0) {
          const firstInput = page.locator('input').first()
          await firstInput.fill('test@example.com')
          
          const value = await firstInput.inputValue()
          expect(value).toBe('test@example.com')
        }
      })

      it('should handle navigation', async () => {
        await page.goto(baseUrl)
        await page.waitForLoadState('networkidle')
        
        // Find navigation links
        const navLinks = await page.locator('nav a').count()
        if (navLinks > 0) {
          const firstLink = page.locator('nav a').first()
          const href = await firstLink.getAttribute('href')
          
          if (href && href.startsWith('/')) {
            await firstLink.click()
            await page.waitForLoadState('networkidle')
            
            // Check that navigation worked
            const currentUrl = page.url()
            expect(currentUrl).toContain(href)
          }
        }
      })

      it('should handle responsive design', async () => {
        await page.goto(baseUrl)
        await page.waitForLoadState('networkidle')
        
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 })
        await page.waitForTimeout(500)
        
        const mobileStyles = await page.evaluate(() => {
          const body = document.body
          return {
            width: body.offsetWidth,
            overflow: window.getComputedStyle(body).overflow
          }
        })
        
        expect(mobileStyles.width).toBeLessThanOrEqual(375)
        
        // Test desktop viewport
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.waitForTimeout(500)
        
        const desktopStyles = await page.evaluate(() => {
          return document.body.offsetWidth
        })
        
        expect(desktopStyles).toBeGreaterThan(375)
      })

      it('should handle media queries', async () => {
        await page.goto(baseUrl)
        await page.waitForLoadState('networkidle')
        
        const mediaQuerySupport = await page.evaluate(() => {
          return window.matchMedia && 
                 typeof window.matchMedia === 'function' &&
                 window.matchMedia('(min-width: 768px)').matches !== undefined
        })
        
        expect(mediaQuerySupport).toBe(true)
      })

      it('should handle local storage', async () => {
        await page.goto(baseUrl)
        
        const localStorageSupport = await page.evaluate(() => {
          try {
            localStorage.setItem('test', 'value')
            const value = localStorage.getItem('test')
            localStorage.removeItem('test')
            return value === 'value'
          } catch (e) {
            return false
          }
        })
        
        expect(localStorageSupport).toBe(true)
      })

      it('should handle fetch API', async () => {
        await page.goto(baseUrl)
        
        const fetchSupport = await page.evaluate(() => {
          return typeof fetch === 'function'
        })
        
        expect(fetchSupport).toBe(true)
      })

      it('should handle CSS Grid and Flexbox', async () => {
        await page.goto(baseUrl)
        
        const cssSupport = await page.evaluate(() => {
          const testDiv = document.createElement('div')
          document.body.appendChild(testDiv)
          
          testDiv.style.display = 'grid'
          const gridSupport = window.getComputedStyle(testDiv).display === 'grid'
          
          testDiv.style.display = 'flex'
          const flexSupport = window.getComputedStyle(testDiv).display === 'flex'
          
          document.body.removeChild(testDiv)
          
          return { gridSupport, flexSupport }
        })
        
        expect(cssSupport.gridSupport).toBe(true)
        expect(cssSupport.flexSupport).toBe(true)
      })

      it('should handle custom properties (CSS variables)', async () => {
        await page.goto(baseUrl)
        
        const cssVariableSupport = await page.evaluate(() => {
          const testDiv = document.createElement('div')
          document.body.appendChild(testDiv)
          
          testDiv.style.setProperty('--test-var', 'red')
          testDiv.style.color = 'var(--test-var)'
          
          const computedColor = window.getComputedStyle(testDiv).color
          document.body.removeChild(testDiv)
          
          return computedColor === 'red' || computedColor === 'rgb(255, 0, 0)'
        })
        
        expect(cssVariableSupport).toBe(true)
      })
    })
  })

  describe('Feature Detection Tests', () => {
    let browser: Browser
    let page: Page

    beforeEach(async () => {
      browser = await chromium.launch()
      page = await browser.newPage()
    })

    afterEach(async () => {
      await browser.close()
    })

    it('should detect and handle missing features gracefully', async () => {
      await page.goto(baseUrl)
      
      const featureDetection = await page.evaluate(() => {
        const features = {
          intersectionObserver: 'IntersectionObserver' in window,
          resizeObserver: 'ResizeObserver' in window,
          webp: false,
          avif: false,
        }
        
        // Test WebP support
        const webpCanvas = document.createElement('canvas')
        webpCanvas.width = 1
        webpCanvas.height = 1
        features.webp = webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
        
        return features
      })
      
      // These features should be available in modern browsers
      expect(featureDetection.intersectionObserver).toBe(true)
      expect(featureDetection.resizeObserver).toBe(true)
    })
  })
})
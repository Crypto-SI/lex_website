import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium, Browser, Page } from 'playwright'

describe('Visual Regression Tests', () => {
  let browser: Browser
  let page: Page
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

  beforeAll(async () => {
    browser = await chromium.launch()
    page = await browser.newPage({
      viewport: { width: 1280, height: 720 }
    })
  })

  afterAll(async () => {
    await browser.close()
  })

  describe('Homepage Visual Tests', () => {
    it('should render homepage correctly on desktop', async () => {
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      // Wait for any animations to complete
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('homepage-desktop.png')
    })

    it('should render homepage correctly on mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('homepage-mobile.png')
    })

    it('should render homepage correctly on tablet', async () => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('homepage-tablet.png')
    })
  })

  describe('Component Visual Tests', () => {
    beforeEach(async () => {
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    it('should render header component consistently', async () => {
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      const header = page.locator('header')
      await expect(header).toHaveScreenshot('header-component.png')
    })

    it('should render footer component consistently', async () => {
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      const footer = page.locator('footer')
      await expect(footer).toHaveScreenshot('footer-component.png')
    })

    it('should render navigation menu correctly', async () => {
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      const nav = page.locator('nav')
      await expect(nav).toHaveScreenshot('navigation-menu.png')
    })

    it('should render hero section consistently', async () => {
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      // Look for hero section (adjust selector based on actual implementation)
      const hero = page.locator('[data-testid="hero-section"]').or(page.locator('section').first())
      await expect(hero).toHaveScreenshot('hero-section.png')
    })
  })

  describe('Page Visual Tests', () => {
    beforeEach(async () => {
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    it('should render about page consistently', async () => {
      await page.goto(`${baseUrl}/about`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('about-page.png')
    })

    it('should render services page consistently', async () => {
      await page.goto(`${baseUrl}/services`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('services-page.png')
    })

    it('should render contact page consistently', async () => {
      await page.goto(`${baseUrl}/contact`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('contact-page.png')
    })
  })

  describe('Interactive State Visual Tests', () => {
    beforeEach(async () => {
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    it('should render button hover states correctly', async () => {
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      const button = page.locator('button').first()
      if (await button.count() > 0) {
        await button.hover()
        await expect(button).toHaveScreenshot('button-hover-state.png')
      }
    })

    it('should render form focus states correctly', async () => {
      await page.goto(`${baseUrl}/contact`)
      await page.waitForLoadState('networkidle')
      
      const input = page.locator('input[type="text"]').first()
      if (await input.count() > 0) {
        await input.focus()
        await expect(input).toHaveScreenshot('input-focus-state.png')
      }
    })

    it('should render navigation active states correctly', async () => {
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      const navLink = page.locator('nav a').first()
      if (await navLink.count() > 0) {
        await navLink.hover()
        await expect(navLink).toHaveScreenshot('nav-link-hover.png')
      }
    })
  })

  describe('Dark Mode Visual Tests', () => {
    it('should render correctly in dark mode', async () => {
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('homepage-dark-mode.png')
    })

    it('should render components correctly in dark mode', async () => {
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      const header = page.locator('header')
      await expect(header).toHaveScreenshot('header-dark-mode.png')
    })
  })

  describe('Responsive Design Visual Tests', () => {
    const viewports = [
      { name: 'mobile-small', width: 320, height: 568 },
      { name: 'mobile-large', width: 414, height: 896 },
      { name: 'tablet-portrait', width: 768, height: 1024 },
      { name: 'tablet-landscape', width: 1024, height: 768 },
      { name: 'desktop-small', width: 1280, height: 720 },
      { name: 'desktop-large', width: 1920, height: 1080 },
    ]

    viewports.forEach(viewport => {
      it(`should render correctly on ${viewport.name}`, async () => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto(baseUrl)
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(1000)
        
        await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`)
      })
    })
  })

  describe('Animation Visual Tests', () => {
    it('should handle animations consistently', async () => {
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      // Disable animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `
      })
      
      await page.waitForTimeout(500)
      await expect(page).toHaveScreenshot('homepage-no-animations.png')
    })
  })

  describe('Error State Visual Tests', () => {
    it('should render 404 page correctly', async () => {
      const response = await page.goto(`${baseUrl}/non-existent-page`)
      
      if (response?.status() === 404) {
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot('404-page.png')
      }
    })

    it('should handle broken images gracefully', async () => {
      await page.goto(baseUrl)
      await page.waitForLoadState('networkidle')
      
      // Replace image sources with broken URLs
      await page.evaluate(() => {
        const images = document.querySelectorAll('img')
        images.forEach(img => {
          if (img.src && !img.src.includes('data:')) {
            img.src = '/broken-image.jpg'
          }
        })
      })
      
      await page.waitForTimeout(2000)
      await expect(page).toHaveScreenshot('broken-images-fallback.png')
    })
  })
})
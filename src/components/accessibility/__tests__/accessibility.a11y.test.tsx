import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@/test/utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import { AccessibleImage } from '../AccessibleImage'
import { FocusManager } from '../FocusManager'
import { AriaManagerProvider, useAriaManager, AccessibleButton } from '../AriaManager'

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations)

describe('Accessibility Compliance Tests', () => {
  describe('AccessibleImage', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AccessibleImage
          src="/test-image.jpg"
          alt="Descriptive alt text for screen readers"
          width={800}
          height={600}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle decorative images correctly', async () => {
      const { container } = render(
        <AccessibleImage
          src="/decorative-image.jpg"
          alt=""
          width={800}
          height={600}
          decorative
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should provide proper ARIA attributes', async () => {
      const { container } = render(
        <AccessibleImage
          src="/complex-image.jpg"
          alt="Chart showing quarterly sales data"
          width={800}
          height={600}
          ariaDescribedBy="chart-description"
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('FocusManager', () => {
    it('should have no accessibility violations with focus trap', async () => {
      const { container } = render(
        <FocusManager trapFocus>
          <button>First Button</button>
          <input type="text" placeholder="Text input" />
          <button>Last Button</button>
        </FocusManager>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should maintain proper focus order', async () => {
      const { container } = render(
        <FocusManager>
          <nav>
            <a href="#section1">Section 1</a>
            <a href="#section2">Section 2</a>
            <a href="#section3">Section 3</a>
          </nav>
        </FocusManager>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('AriaManager', () => {
    it('should provide proper ARIA labels', async () => {
      const { container } = render(
        <AriaManagerProvider>
          <div role="main">
            <h1>Main Content</h1>
            <p>This is the main content area</p>
          </div>
        </AriaManagerProvider>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle complex ARIA relationships', async () => {
      const { container } = render(
        <AriaManagerProvider>
          <div role="tablist">
            <button role="tab" aria-selected="true" aria-controls="panel1">
              Tab 1
            </button>
            <button role="tab" aria-selected="false" aria-controls="panel2">
              Tab 2
            </button>
          </div>
          <div id="panel1" role="tabpanel" aria-labelledby="tab1">
            Panel 1 Content
          </div>
          <div id="panel2" role="tabpanel" aria-labelledby="tab2" hidden>
            Panel 2 Content
          </div>
        </AriaManagerProvider>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Form Accessibility', () => {
    it('should have accessible form elements', async () => {
      const { container } = render(
        <form>
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              required
              aria-describedby="name-help"
            />
            <div id="name-help">Enter your full legal name</div>
          </div>
          
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              aria-describedby="email-help"
            />
            <div id="email-help">We'll never share your email</div>
          </div>
          
          <fieldset>
            <legend>Preferred Contact Method</legend>
            <div>
              <input type="radio" id="contact-email" name="contact" value="email" />
              <label htmlFor="contact-email">Email</label>
            </div>
            <div>
              <input type="radio" id="contact-phone" name="contact" value="phone" />
              <label htmlFor="contact-phone">Phone</label>
            </div>
          </fieldset>
          
          <button type="submit">Submit Form</button>
        </form>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Navigation Accessibility', () => {
    it('should have accessible navigation structure', async () => {
      const { container } = render(
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/" aria-current="page">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle breadcrumb navigation', async () => {
      const { container } = render(
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li aria-current="page">Web Development</li>
          </ol>
        </nav>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Content Structure Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      const { container } = render(
        <main>
          <h1>Main Page Title</h1>
          <section>
            <h2>Section Title</h2>
            <h3>Subsection Title</h3>
            <p>Content paragraph</p>
            <h3>Another Subsection</h3>
            <p>More content</p>
          </section>
          <section>
            <h2>Another Section</h2>
            <p>Section content</p>
          </section>
        </main>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle lists properly', async () => {
      const { container } = render(
        <div>
          <h2>Our Services</h2>
          <ul>
            <li>Web Development</li>
            <li>Mobile Applications</li>
            <li>Consulting Services</li>
          </ul>
          
          <h2>Process Steps</h2>
          <ol>
            <li>Initial Consultation</li>
            <li>Project Planning</li>
            <li>Development Phase</li>
            <li>Testing and Launch</li>
          </ol>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Interactive Elements Accessibility', () => {
    it('should have accessible buttons', async () => {
      const { container } = render(
        <div>
          <button type="button">Standard Button</button>
          <button type="button" aria-label="Close dialog">×</button>
          <button type="button" aria-expanded="false" aria-controls="menu">
            Menu
          </button>
          <button type="submit">Submit Form</button>
          <button type="button" disabled>Disabled Button</button>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle modal dialogs correctly', async () => {
      const { container } = render(
        <div>
          <button type="button" aria-haspopup="dialog">
            Open Modal
          </button>
          <div
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            aria-modal="true"
          >
            <h2 id="modal-title">Modal Title</h2>
            <p id="modal-description">Modal description content</p>
            <button type="button">Close</button>
          </div>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
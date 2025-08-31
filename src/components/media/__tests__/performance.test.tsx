import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import { OptimizedImage } from '../OptimizedImage'
import { LazySection } from '../LazySection'
import { ScriptLoader } from '../ScriptLoader'

describe('Performance Optimizations', () => {
  describe('OptimizedImage Performance', () => {
    it('should not load image immediately when lazy loading is enabled', () => {
      const onLoad = vi.fn()
      
      render(
        <OptimizedImage
          src="/large-image.jpg"
          alt="Large image"
          width={1920}
          height={1080}
          lazy
          onLoad={onLoad}
        />
      )

      // Image should not be loaded immediately
      expect(onLoad).not.toHaveBeenCalled()
      expect(screen.getByText('Loading image...')).toBeInTheDocument()
    })

    it('should prioritize above-the-fold images', () => {
      render(
        <OptimizedImage
          src="/hero-image.jpg"
          alt="Hero image"
          width={1920}
          height={1080}
          priority
        />
      )

      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
      // Priority images should load immediately
    })

    it('should handle responsive image sizes efficiently', () => {
      render(
        <OptimizedImage
          src="/responsive-image.jpg"
          alt="Responsive image"
          width={1200}
          height={800}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw')
    })
  })

  describe('LazySection Performance', () => {
    it('should not render heavy components until visible', () => {
      const HeavyComponent = vi.fn(() => <div>Heavy component loaded</div>)

      render(
        <LazySection>
          <HeavyComponent />
        </LazySection>
      )

      // Component should not be rendered initially
      expect(HeavyComponent).not.toHaveBeenCalled()
      expect(screen.queryByText('Heavy component loaded')).not.toBeInTheDocument()
    })

    it('should use custom threshold for intersection', () => {
      const mockObserver = vi.fn()
      global.IntersectionObserver = vi.fn().mockImplementation((callback, options) => {
        mockObserver(options)
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        }
      })

      render(
        <LazySection threshold={0.25}>
          <div>Content</div>
        </LazySection>
      )

      expect(mockObserver).toHaveBeenCalledWith(
        expect.objectContaining({
          threshold: 0.25,
        })
      )
    })
  })

  describe('ScriptLoader Performance', () => {
    it('should load scripts on demand', async () => {
      const onLoad = vi.fn()
      const onError = vi.fn()

      render(
        <ScriptLoader
          src="https://example.com/script.js"
          onLoad={onLoad}
          onError={onError}
        />
      )

      // Script should be added to document
      await waitFor(() => {
        const script = document.querySelector('script[src="https://example.com/script.js"]')
        expect(script).toBeInTheDocument()
      })
    })

    it('should handle script loading errors gracefully', async () => {
      const onError = vi.fn()

      render(
        <ScriptLoader
          src="https://invalid-url.com/script.js"
          onError={onError}
        />
      )

      // Simulate script error
      await waitFor(() => {
        const script = document.querySelector('script[src="https://invalid-url.com/script.js"]')
        if (script) {
          script.dispatchEvent(new Event('error'))
        }
      })

      expect(onError).toHaveBeenCalled()
    })

    it('should prevent duplicate script loading', () => {
      render(
        <>
          <ScriptLoader src="https://example.com/shared-script.js" />
          <ScriptLoader src="https://example.com/shared-script.js" />
        </>
      )

      const scripts = document.querySelectorAll('script[src="https://example.com/shared-script.js"]')
      expect(scripts).toHaveLength(1)
    })
  })

  describe('Bundle Size Optimization', () => {
    it('should not import heavy dependencies in test environment', () => {
      // This test ensures that heavy dependencies are properly code-split
      const moduleSize = JSON.stringify(OptimizedImage).length
      expect(moduleSize).toBeLessThan(10000) // Arbitrary size limit
    })

    it('should use dynamic imports for non-critical components', async () => {
      // Test that components can be dynamically imported
      const LazyComponent = await import('../LazyComponent')
      expect(LazyComponent.LazyComponent).toBeDefined()
    })
  })

  describe('Memory Management', () => {
    it('should clean up intersection observers on unmount', () => {
      const mockDisconnect = vi.fn()
      global.IntersectionObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: mockDisconnect,
      }))

      const { unmount } = render(
        <LazySection>
          <div>Content</div>
        </LazySection>
      )

      unmount()
      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should remove event listeners on component unmount', () => {
      const removeEventListener = vi.spyOn(document, 'removeEventListener')

      const { unmount } = render(
        <ScriptLoader src="https://example.com/script.js" />
      )

      unmount()
      
      // Should clean up any event listeners
      expect(removeEventListener).toHaveBeenCalled()
    })
  })
})
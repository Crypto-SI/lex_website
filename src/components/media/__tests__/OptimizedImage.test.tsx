import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import { OptimizedImage } from '../OptimizedImage'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, onLoad, onError, ...props }: any) => {
    const handleLoad = () => {
      if (onLoad) onLoad()
    }
    
    const handleError = () => {
      if (onError) onError()
    }

    return (
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    )
  },
}))

describe('OptimizedImage', () => {
  it('should render image with correct props', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
      />
    )

    const image = screen.getByRole('img', { name: 'Test image' })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Test image')
  })

  it('should show loading state initially when lazy loading', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        lazy
      />
    )

    expect(screen.getByText('Loading image...')).toBeInTheDocument()
  })

  it('should show fallback when image fails to load', async () => {
    const FallbackComponent = () => <div>Image failed to load</div>

    render(
      <OptimizedImage
        src="/invalid-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        fallback={<FallbackComponent />}
      />
    )

    // Simulate image load error
    const image = screen.getByRole('img')
    image.dispatchEvent(new Event('error'))

    await waitFor(() => {
      expect(screen.getByText('Image failed to load')).toBeInTheDocument()
    })
  })

  it('should handle successful image load', async () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        lazy
      />
    )

    // Initially shows loading
    expect(screen.getByText('Loading image...')).toBeInTheDocument()

    // Simulate image load success
    const image = screen.getByRole('img')
    image.dispatchEvent(new Event('load'))

    await waitFor(() => {
      expect(screen.queryByText('Loading image...')).not.toBeInTheDocument()
    })
  })

  it('should apply priority prop correctly', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        priority
      />
    )

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('should handle responsive sizes', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={800}
        height={600}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    )

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw')
  })

  it('should provide proper accessibility attributes', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Descriptive alt text for screen readers"
        width={800}
        height={600}
      />
    )

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Descriptive alt text for screen readers')
  })

  it('should handle empty alt text for decorative images', () => {
    render(
      <OptimizedImage
        src="/decorative-image.jpg"
        alt=""
        width={800}
        height={600}
      />
    )

    const image = screen.getByRole('img', { hidden: true })
    expect(image).toHaveAttribute('alt', '')
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils'
import { LazySection } from '../LazySection'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
    root: null,
    rootMargin: '',
    thresholds: [],
  }))

  global.IntersectionObserver = mockIntersectionObserver
})

describe('LazySection', () => {
  it('should render placeholder initially', () => {
    render(
      <LazySection>
        <div>Lazy loaded content</div>
      </LazySection>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Lazy loaded content')).not.toBeInTheDocument()
  })

  it('should render custom placeholder', () => {
    const CustomPlaceholder = () => <div>Custom loading message</div>

    render(
      <LazySection placeholder={<CustomPlaceholder />}>
        <div>Lazy loaded content</div>
      </LazySection>
    )

    expect(screen.getByText('Custom loading message')).toBeInTheDocument()
    expect(screen.queryByText('Lazy loaded content')).not.toBeInTheDocument()
  })

  it('should observe element on mount', () => {
    render(
      <LazySection>
        <div>Lazy loaded content</div>
      </LazySection>
    )

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
    expect(mockObserve).toHaveBeenCalledTimes(1)
  })

  it('should load content when intersecting', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        root: null,
        rootMargin: '',
        thresholds: [],
      }
    })

    render(
      <LazySection>
        <div>Lazy loaded content</div>
      </LazySection>
    )

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    } as IntersectionObserverEntry

    intersectionCallback!([mockEntry])

    expect(screen.getByText('Lazy loaded content')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('should not load content when not intersecting', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        root: null,
        rootMargin: '',
        thresholds: [],
      }
    })

    render(
      <LazySection>
        <div>Lazy loaded content</div>
      </LazySection>
    )

    // Simulate no intersection
    const mockEntry = {
      isIntersecting: false,
      target: document.createElement('div'),
    } as IntersectionObserverEntry

    intersectionCallback!([mockEntry])

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Lazy loaded content')).not.toBeInTheDocument()
  })

  it('should disconnect observer on unmount', () => {
    const { unmount } = render(
      <LazySection>
        <div>Lazy loaded content</div>
      </LazySection>
    )

    unmount()

    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })

  it('should handle custom root margin', () => {
    render(
      <LazySection rootMargin="100px">
        <div>Lazy loaded content</div>
      </LazySection>
    )

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '100px',
      })
    )
  })

  it('should handle custom threshold', () => {
    render(
      <LazySection threshold={0.5}>
        <div>Lazy loaded content</div>
      </LazySection>
    )

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
      })
    )
  })
})
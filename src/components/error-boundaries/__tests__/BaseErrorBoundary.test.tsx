import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { BaseErrorBoundary } from '../BaseErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('BaseErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalError
  })

  it('should render children when there is no error', () => {
    render(
      <BaseErrorBoundary>
        <ThrowError shouldThrow={false} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should render default error UI when error occurs', () => {
    render(
      <BaseErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('should render custom fallback when provided', () => {
    const CustomFallback = ({ error, resetError }: any) => (
      <div>
        <h2>Custom Error: {error.message}</h2>
        <button onClick={resetError}>Reset</button>
      </div>
    )

    render(
      <BaseErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('Custom Error: Test error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn()

    render(
      <BaseErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </BaseErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )
  })

  it('should reset error state when retry button is clicked', () => {
    const { rerender } = render(
      <BaseErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    const retryButton = screen.getByRole('button', { name: 'Try again' })
    retryButton.click()

    // Re-render with no error
    rerender(
      <BaseErrorBoundary>
        <ThrowError shouldThrow={false} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should handle multiple error resets', () => {
    const { rerender } = render(
      <BaseErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BaseErrorBoundary>
    )

    // First error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    const retryButton = screen.getByRole('button', { name: 'Try again' })
    retryButton.click()

    // Reset and render without error
    rerender(
      <BaseErrorBoundary>
        <ThrowError shouldThrow={false} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()

    // Cause another error
    rerender(
      <BaseErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should provide error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <BaseErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    // In development, error details should be visible
    expect(screen.getByText(/Test error/)).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })
})
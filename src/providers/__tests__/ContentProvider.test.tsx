import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import { ContentProvider, useContent } from '../ContentProvider'
import { mockPageContent, mockAssets } from '@/test/utils'

// Mock the content loader
vi.mock('@/utils/contentLoader', () => ({
  loadPageContent: vi.fn(),
  loadGlobalContent: vi.fn(),
  loadAssets: vi.fn(),
}))

// Test component that uses the content context
const TestComponent = () => {
  const { pageContent, assets, globalContent, loading, error } = useContent()

  if (loading) return <div>Loading content...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>{pageContent?.metadata.title}</h1>
      <p>{pageContent?.metadata.description}</p>
      <div data-testid="sections-count">{pageContent?.sections.length}</div>
      <div data-testid="assets-count">{Object.keys(assets).length}</div>
      <div data-testid="site-name">{globalContent?.site?.name}</div>
    </div>
  )
}

describe('ContentProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide content context to children', async () => {
    const { loadPageContent, loadGlobalContent, loadAssets } = await import('@/utils/contentLoader')
    
    vi.mocked(loadPageContent).mockResolvedValue(mockPageContent)
    vi.mocked(loadGlobalContent).mockResolvedValue({
      site: { name: 'Test Site', url: 'https://test.com' },
      navigation: { main: [] },
    })
    vi.mocked(loadAssets).mockResolvedValue(mockAssets)

    render(
      <ContentProvider>
        <TestComponent />
      </ContentProvider>
    )

    // Initially shows loading
    expect(screen.getByText('Loading content...')).toBeInTheDocument()

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Test Page')).toBeInTheDocument()
    })

    expect(screen.getByText('Test page description')).toBeInTheDocument()
    expect(screen.getByTestId('sections-count')).toHaveTextContent('1')
    expect(screen.getByTestId('assets-count')).toHaveTextContent('1')
    expect(screen.getByTestId('site-name')).toHaveTextContent('Test Site')
  })

  it('should handle loading errors', async () => {
    const { loadPageContent, loadGlobalContent, loadAssets } = await import('@/utils/contentLoader')
    
    vi.mocked(loadPageContent).mockRejectedValue(new Error('Failed to load content'))
    vi.mocked(loadGlobalContent).mockResolvedValue({
      site: { name: 'Test Site', url: 'https://test.com' },
      navigation: { main: [] },
    })
    vi.mocked(loadAssets).mockResolvedValue({})

    render(
      <ContentProvider>
        <TestComponent />
      </ContentProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to load content')).toBeInTheDocument()
    })
  })

  it('should update content when slug changes', async () => {
    const { loadPageContent, loadGlobalContent, loadAssets } = await import('@/utils/contentLoader')
    
    const aboutContent = {
      slug: 'about',
      sections: [
        {
          id: 'hero',
          type: 'hero' as const,
          content: { title: 'About Us' },
        },
      ],
      metadata: {
        title: 'About - Test Site',
        description: 'About page description',
      },
    }

    vi.mocked(loadPageContent).mockImplementation((slug) => {
      if (slug === 'home') return Promise.resolve(mockPageContent)
      if (slug === 'about') return Promise.resolve(aboutContent)
      return Promise.reject(new Error('Page not found'))
    })
    vi.mocked(loadGlobalContent).mockResolvedValue({
      site: { name: 'Test Site', url: 'https://test.com' },
      navigation: { main: [] },
    })
    vi.mocked(loadAssets).mockResolvedValue(mockAssets)

    const { rerender } = render(
      <ContentProvider slug="home">
        <TestComponent />
      </ContentProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Page')).toBeInTheDocument()
    })

    // Change slug
    rerender(
      <ContentProvider slug="about">
        <TestComponent />
      </ContentProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('About - Test Site')).toBeInTheDocument()
    })
  })

  it('should provide default values when no content is loaded', () => {
    const TestEmptyComponent = () => {
      const { pageContent, assets, globalContent } = useContent()
      
      return (
        <div>
          <div data-testid="page-content">{pageContent ? 'has-content' : 'no-content'}</div>
          <div data-testid="assets">{Object.keys(assets).length}</div>
          <div data-testid="global-content">{globalContent ? 'has-global' : 'no-global'}</div>
        </div>
      )
    }

    render(
      <ContentProvider>
        <TestEmptyComponent />
      </ContentProvider>
    )

    expect(screen.getByTestId('page-content')).toHaveTextContent('no-content')
    expect(screen.getByTestId('assets')).toHaveTextContent('0')
    expect(screen.getByTestId('global-content')).toHaveTextContent('no-global')
  })

  it('should throw error when useContent is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = vi.fn()

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useContent must be used within a ContentProvider')

    console.error = originalError
  })
})
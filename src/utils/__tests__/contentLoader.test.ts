import { describe, it, expect, vi } from 'vitest'
import {
  loadPageContent,
  loadGlobalContent,
  loadAssets,
  validateContentStructure,
  getContentBySlug,
} from '../contentLoader'

// Mock the content files
vi.mock('@/content/pages/home.json', () => ({
  default: {
    slug: 'home',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        content: {
          title: 'Welcome to Lex Consulting',
          subtitle: 'Professional Services',
        },
      },
    ],
    metadata: {
      title: 'Home - Lex Consulting',
      description: 'Professional consulting services',
    },
  },
}))

vi.mock('@/content/global.json', () => ({
  default: {
    site: {
      name: 'Lex Consulting',
      url: 'https://lexconsulting.com',
    },
    navigation: {
      main: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ],
    },
  },
}))

vi.mock('@/content/assets.json', () => ({
  default: {
    'hero-image': {
      src: '/images/hero.jpg',
      alt: 'Hero image',
      width: 1200,
      height: 600,
    },
    'logo': {
      src: '/images/logo.png',
      alt: 'Lex Consulting Logo',
      width: 200,
      height: 100,
    },
  },
}))

describe('contentLoader', () => {
  describe('loadPageContent', () => {
    it('should load page content successfully', async () => {
      const content = await loadPageContent('home')
      
      expect(content).toBeDefined()
      expect(content.slug).toBe('home')
      expect(content.sections).toHaveLength(1)
      expect(content.sections[0].type).toBe('hero')
      expect(content.metadata.title).toBe('Home - Lex Consulting')
    })

    it('should throw error for non-existent page', async () => {
      await expect(loadPageContent('non-existent')).rejects.toThrow()
    })

    it('should handle page content with multiple sections', async () => {
      // Mock a page with multiple sections
      vi.doMock('@/content/pages/about.json', () => ({
        default: {
          slug: 'about',
          sections: [
            { id: 'hero', type: 'hero', content: { title: 'About Us' } },
            { id: 'team', type: 'team', content: { members: [] } },
          ],
          metadata: { title: 'About Us', description: 'Learn about our team' },
        },
      }))

      const content = await loadPageContent('about')
      expect(content.sections).toHaveLength(2)
    })
  })

  describe('loadGlobalContent', () => {
    it('should load global content successfully', async () => {
      const content = await loadGlobalContent()
      
      expect(content).toBeDefined()
      expect(content.site.name).toBe('Lex Consulting')
      expect(content.navigation.main).toHaveLength(2)
    })

    it('should include site configuration', async () => {
      const content = await loadGlobalContent()
      
      expect(content.site.url).toBe('https://lexconsulting.com')
    })
  })

  describe('loadAssets', () => {
    it('should load assets successfully', async () => {
      const assets = await loadAssets()
      
      expect(assets).toBeDefined()
      expect(assets['hero-image']).toBeDefined()
      expect(assets['hero-image'].src).toBe('/images/hero.jpg')
      expect(assets['logo']).toBeDefined()
    })

    it('should include asset metadata', async () => {
      const assets = await loadAssets()
      
      expect(assets['hero-image'].width).toBe(1200)
      expect(assets['hero-image'].height).toBe(600)
      expect(assets['hero-image'].alt).toBe('Hero image')
    })
  })

  describe('validateContentStructure', () => {
    it('should validate correct content structure', () => {
      const validContent = {
        slug: 'test',
        sections: [
          {
            id: 'section1',
            type: 'hero',
            content: { title: 'Test' },
          },
        ],
        metadata: {
          title: 'Test Page',
          description: 'Test description',
        },
      }

      expect(() => validateContentStructure(validContent)).not.toThrow()
    })

    it('should throw error for missing required fields', () => {
      const invalidContent = {
        sections: [],
        metadata: { title: 'Test' },
      }

      expect(() => validateContentStructure(invalidContent)).toThrow()
    })

    it('should validate section structure', () => {
      const invalidSectionContent = {
        slug: 'test',
        sections: [
          {
            id: 'section1',
            // Missing type
            content: { title: 'Test' },
          },
        ],
        metadata: { title: 'Test', description: 'Test' },
      }

      expect(() => validateContentStructure(invalidSectionContent)).toThrow()
    })
  })

  describe('getContentBySlug', () => {
    it('should return content for existing slug', async () => {
      const content = await getContentBySlug('home')
      
      expect(content).toBeDefined()
      expect(content.slug).toBe('home')
    })

    it('should return null for non-existent slug', async () => {
      const content = await getContentBySlug('non-existent')
      
      expect(content).toBeNull()
    })

    it('should handle slug normalization', async () => {
      const content = await getContentBySlug('HOME')
      
      expect(content).toBeDefined()
      expect(content.slug).toBe('home')
    })
  })
})
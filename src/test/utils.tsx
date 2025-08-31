import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { lexSystem } from '../theme'

// Custom render function that includes Chakra UI provider
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider value={lexSystem}>
      {children}
    </ChakraProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data for testing
export const mockPageContent = {
  slug: 'test-page',
  sections: [
    {
      id: 'hero',
      type: 'hero' as const,
      content: {
        title: 'Test Title',
        subtitle: 'Test Subtitle',
        description: 'Test Description',
      },
    },
  ],
  metadata: {
    title: 'Test Page',
    description: 'Test page description',
  },
}

export const mockAssets = {
  'test-image': {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600,
  },
}

export const mockTranslations = {
  en: {
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
  },
  es: {
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.services': 'Servicios',
    'nav.contact': 'Contacto',
  },
}

// Accessibility testing helper
export const axeMatchers = {
  toHaveNoViolations: expect.extend({
    async toHaveNoViolations(received: any) {
      const { axe, toHaveNoViolations } = await import('jest-axe')
      expect.extend(toHaveNoViolations)
      
      const results = await axe(received)
      return {
        pass: results.violations.length === 0,
        message: () => {
          if (results.violations.length === 0) {
            return 'Expected element to have accessibility violations, but none were found'
          }
          return `Expected no accessibility violations, but found ${results.violations.length}:\n${
            results.violations.map(v => `- ${v.description}`).join('\n')
          }`
        },
      }
    },
  }),
}
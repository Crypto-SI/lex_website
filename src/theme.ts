/**
 * Lex Consulting Brand Theme
 * Chakra UI v3 Theme System Configuration
 * Based on brand guidelines
 */

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

// Brand color palette
const colors = {
  brand: {
    // Primary Palette
    900: '#0A2342', // Lex Deep Blue (Used for primary typography)
    800: '#0d2a4f', // Slightly lighter variant
    700: '#0f3260', // Slightly lighter variant
    600: '#133c76', // Slightly lighter variant
    500: '#708090', // Lex Slate Grey
    400: '#8a98a6', // Slightly lighter variant
    300: '#a3afba', // Slightly lighter variant
    200: '#bdc6ce', // Slightly lighter variant
    100: '#d6dce1', // Slightly lighter variant
    50: '#eef0f3',  // Slightly lighter variant
    
    // Accent Color
    accent: '#007BFF', // Lex Insight Blue
  },
  
  // Secondary Palette
  gray: {
    50: '#F8F8F8',  // Lex Off-White (Preferred background)
    100: '#EAEAEA', // Lex Light Grey (Alternative background)
    200: '#D1D5DB',
    300: '#9CA3AF',
    400: '#6B7280',
    500: '#4B5563',
    600: '#374151',
    700: '#1F2937',
    800: '#111827',
    900: '#0F172A',
  }
}

// Typography configuration
const fonts = {
  heading: "'Cinzel', serif", // Primary Typeface for headings
  body: "'EB Garamond', serif", // Secondary Typeface for body
  mono: "'Lato', sans-serif", // UI Typeface
}

// Create the theme configuration with proper Chakra UI v3 structure
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: colors.brand[50] },
          100: { value: colors.brand[100] },
          200: { value: colors.brand[200] },
          300: { value: colors.brand[300] },
          400: { value: colors.brand[400] },
          500: { value: colors.brand[500] },
          600: { value: colors.brand[600] },
          700: { value: colors.brand[700] },
          800: { value: colors.brand[800] },
          900: { value: colors.brand[900] },
          accent: { value: colors.brand.accent },
        },
        gray: {
          50: { value: colors.gray[50] },
          100: { value: colors.gray[100] },
          200: { value: colors.gray[200] },
          300: { value: colors.gray[300] },
          400: { value: colors.gray[400] },
          500: { value: colors.gray[500] },
          600: { value: colors.gray[600] },
          700: { value: colors.gray[700] },
          800: { value: colors.gray[800] },
          900: { value: colors.gray[900] },
        }
      },
      fonts: {
        heading: { value: fonts.heading },
        body: { value: fonts.body },
        mono: { value: fonts.mono },
      },
    },
    semanticTokens: {
      colors: {
        'bg.canvas': {
          value: { base: '{colors.gray.50}', _dark: '{colors.gray.900}' }
        },
        'bg.surface': {
          value: { base: 'white', _dark: '{colors.gray.800}' }
        },
        'bg.muted': {
          value: { base: '{colors.gray.100}', _dark: '{colors.gray.700}' }
        },
        'text.primary': {
          value: { base: '{colors.brand.900}', _dark: '{colors.gray.50}' }
        },
        'text.secondary': {
          value: { base: '{colors.brand.500}', _dark: '{colors.gray.300}' }
        },
        'text.muted': {
          value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' }
        },
        'brand.primary': {
          value: { base: '{colors.brand.900}', _dark: '{colors.brand.100}' }
        },
        'brand.secondary': {
          value: { base: '{colors.brand.500}', _dark: '{colors.brand.300}' }
        },
        'brand.accent': {
          value: { base: '{colors.brand.accent}', _dark: '{colors.brand.accent}' }
        },
        'interactive.primary': {
          value: { base: '{colors.brand.900}', _dark: '{colors.brand.200}' }
        },
        'interactive.hover': {
          value: { base: '{colors.brand.800}', _dark: '{colors.brand.300}' }
        },
        'interactive.active': {
          value: { base: '{colors.brand.700}', _dark: '{colors.brand.400}' }
        }
      }
    }
  },
  globalCss: {
    body: {
      bg: 'bg.canvas',
      color: 'text.primary',
      fontFamily: 'body',
    },
  },
})

// Create and export the custom system
export const lexSystem = createSystem(defaultConfig, config)

// Export individual theme parts for backward compatibility
export { colors, fonts }

// Default export for backward compatibility
export default lexSystem 
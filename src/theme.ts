/**
 * Lex Consulting Brand Theme
 * Based on brand guidelines
 */

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
  }
}

const fonts = {
  heading: "'Cinzel', serif", // Primary Typeface for headings
  body: "'EB Garamond', serif", // Secondary Typeface for body
  mono: "'Lato', sans-serif", // UI Typeface
}

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      fontFamily: 'mono',
    },
    variants: {
      solid: {
        bg: 'brand.900',
        color: 'white',
        _hover: {
          bg: 'brand.800',
        },
      },
      outline: {
        borderColor: 'brand.900',
        color: 'brand.900',
        _hover: {
          bg: 'brand.50',
        },
      },
      ghost: {
        color: 'brand.900',
        _hover: {
          bg: 'brand.50',
        },
      },
      link: {
        color: 'brand.accent',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
    defaultProps: {
      variant: 'solid',
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
      color: 'brand.900',
      fontFamily: 'heading',
    },
  },
  Text: {
    baseStyle: {
      fontFamily: 'body',
      fontSize: '18px',
    },
  },
}

const theme = {
  colors,
  fonts,
  components,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'brand.900',
      },
    },
  },
}

export default theme 
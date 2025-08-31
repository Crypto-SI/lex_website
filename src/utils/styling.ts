/**
 * Styling Utilities
 * Provides consistent styling patterns and replaces CSS variables with Chakra tokens
 */

// Color mappings from CSS variables to Chakra semantic tokens
export const colorTokens = {
  // Primary colors
  'var(--lex-deep-blue)': 'brand.primary',
  'var(--lex-insight-blue)': 'brand.accent',
  'var(--lex-slate-grey)': 'text.secondary',
  
  // Background colors
  'var(--lex-off-white)': 'bg.canvas',
  'var(--lex-light-grey)': 'bg.muted',
  
  // Text colors
  'text.primary': 'text.primary',
  'text.secondary': 'text.secondary',
  'text.muted': 'text.muted',
} as const;

// CSS Variable replacement patterns for bulk replacement
export const cssVariableReplacements = {
  'var(--lex-deep-blue)': 'brand.primary',
  'var(--lex-insight-blue)': 'brand.accent',
  'var(--lex-slate-grey)': 'text.secondary',
  'var(--lex-off-white)': 'bg.canvas',
  'var(--lex-light-grey)': 'bg.muted',
  'var(--font-heading)': 'var(--chakra-fonts-heading)',
  'var(--font-body)': 'var(--chakra-fonts-body)',
  'var(--font-ui)': 'var(--chakra-fonts-mono)',
} as const;

// Common style patterns
export const stylePatterns = {
  // Button styles
  primaryButton: {
    bg: 'brand.accent',
    color: 'white',
    _hover: {
      bg: 'interactive.hover',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 123, 255, 0.4)',
    },
    _active: {
      bg: 'interactive.active',
      transform: 'translateY(0)',
      boxShadow: '0 2px 10px rgba(0, 123, 255, 0.3)',
    },
    _focus: {
      outline: '2px solid',
      outlineColor: 'brand.accent',
      outlineOffset: '2px',
    },
    transition: 'all 0.2s ease',
  },
  
  secondaryButton: {
    variant: 'outline',
    borderColor: 'brand.accent',
    color: 'brand.accent',
    _hover: {
      bg: 'brand.accent',
      color: 'white',
    },
    _focus: {
      outline: '2px solid',
      outlineColor: 'brand.accent',
      outlineOffset: '2px',
    },
    transition: 'all 0.2s ease',
  },
  
  // Link styles
  navLink: {
    textDecoration: 'none',
    color: 'text.primary',
    fontWeight: 'medium',
    _hover: {
      color: 'brand.accent',
      textDecoration: 'none',
    },
    _focus: {
      outline: '2px solid',
      outlineColor: 'brand.accent',
      outlineOffset: '2px',
    },
    transition: 'all 0.2s ease',
  },
  
  activeNavLink: {
    color: 'brand.accent',
    fontWeight: 'bold',
    position: 'relative',
    _after: {
      content: '""',
      position: 'absolute',
      bottom: '-4px',
      left: 0,
      right: 0,
      height: '2px',
      bg: 'brand.accent',
    },
  },
  
  // Card styles
  card: {
    bg: 'bg.surface',
    borderRadius: 'lg',
    boxShadow: 'base',
    border: '1px solid',
    borderColor: 'gray.200',
    p: 6,
    transition: 'all 0.2s ease',
    _hover: {
      boxShadow: 'lg',
      transform: 'translateY(-2px)',
    },
  },
  
  // Container styles
  pageContainer: {
    maxW: 'container.xl',
    mx: 'auto',
    px: { base: 4, md: 6 },
    py: { base: 8, md: 12 },
  },
  
  sectionContainer: {
    py: { base: 12, md: 16 },
  },
  
  // Text styles
  headingPrimary: {
    fontSize: { base: 'xl', md: '2xl' },
    fontWeight: 'bold',
    color: 'text.primary',
    className: 'heading-text',
    letterSpacing: 'wide',
  },
  
  headingSecondary: {
    fontSize: { base: 'lg', md: 'xl' },
    fontWeight: 'semibold',
    color: 'text.primary',
    className: 'heading-text',
  },
  
  bodyText: {
    fontSize: { base: 'md', md: 'lg' },
    color: 'text.secondary',
    className: 'body-text',
    lineHeight: '1.6',
  },
  
  // Layout styles
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Animation styles
  fadeIn: {
    opacity: 0,
    animation: 'fadeIn 0.6s ease-in-out forwards',
  },
  
  slideUp: {
    transform: 'translateY(20px)',
    opacity: 0,
    animation: 'slideUp 0.6s ease-out forwards',
  },
} as const;

// Animation keyframes for CSS-in-JS
export const animations = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { 
        transform: translateY(20px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  fadeInScale: `
    @keyframes fadeInScale {
      0% { 
        opacity: 0; 
        transform: scale(0.95); 
      }
      100% { 
        opacity: 1; 
        transform: scale(1); 
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { 
        transform: scale(1);
        opacity: 1;
      }
      50% { 
        transform: scale(1.05);
        opacity: 0.8;
      }
    }
  `,
};

// Utility function to convert CSS variables to Chakra tokens
export const convertCSSVar = (cssVar: string): string => {
  return colorTokens[cssVar as keyof typeof colorTokens] || cssVar;
};

// Helper function to replace CSS variables in component props
export const replaceColorTokens = (props: Record<string, any>): Record<string, any> => {
  const newProps = { ...props };
  
  // Common color props to convert
  const colorProps = ['color', 'bg', 'backgroundColor', 'borderColor', 'outlineColor'];
  
  colorProps.forEach(prop => {
    if (newProps[prop] && typeof newProps[prop] === 'string') {
      newProps[prop] = convertCSSVar(newProps[prop]);
    }
  });
  
  // Handle nested objects like _hover, _focus, etc.
  Object.keys(newProps).forEach(key => {
    if (key.startsWith('_') && typeof newProps[key] === 'object') {
      newProps[key] = replaceColorTokens(newProps[key]);
    }
  });
  
  return newProps;
};

// Utility function to create responsive spacing
export const responsiveSpacing = (base: number, md?: number, lg?: number) => ({
  base: `${base * 0.25}rem`,
  ...(md && { md: `${md * 0.25}rem` }),
  ...(lg && { lg: `${lg * 0.25}rem` }),
});

// Utility function to create consistent gradients
export const gradients = {
  primary: 'linear-gradient(135deg, brand.accent, brand.primary)',
  secondary: 'linear-gradient(90deg, brand.accent, brand.primary)',
  subtle: 'linear-gradient(135deg, bg.surface, bg.muted)',
};

// Utility function for consistent shadows
export const shadows = {
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  button: '0 4px 15px rgba(0, 123, 255, 0.3)',
  buttonHover: '0 6px 20px rgba(0, 123, 255, 0.4)',
};
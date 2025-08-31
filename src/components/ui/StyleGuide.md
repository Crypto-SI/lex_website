# Lex Consulting Style Guide

## Design System Overview

This style guide documents the consistent design system for the Lex Consulting website, built on Chakra UI v3 with custom brand tokens.

## Color System

### Brand Colors
- **Deep Blue** (`brand.900`): `#0A2342` - Primary text and headings
- **Insight Blue** (`brand.accent`): `#007BFF` - Interactive elements and CTAs
- **Slate Grey** (`brand.500`): `#708090` - Secondary text and subtle elements
- **Light Grey** (`gray.200`): `#EAEAEA` - Borders and dividers
- **Off White** (`gray.50`): `#F8F8F8` - Background surfaces

### Semantic Color Tokens
```typescript
// Text colors
'text.primary': 'brand.900'    // Deep Blue for headings
'text.secondary': 'brand.500'  // Slate Grey for body text
'text.muted': 'gray.600'       // Muted text
'text.inverse': 'white'        // White text on dark backgrounds

// Background colors
'bg.canvas': 'gray.50'         // Page background
'bg.surface': 'white'          // Card/component backgrounds
'bg.muted': 'gray.100'         // Subtle background areas

// Interactive colors
'brand.accent': '#007BFF'      // Primary interactive color
'interactive.hover': 'blue.600' // Hover states
'interactive.active': 'blue.700' // Active states
```

## Typography

### Font Families
- **Heading Font**: `'Cinzel', serif` - Elegant serif for headings
- **Body Font**: `'EB Garamond', serif` - Readable serif for body text
- **UI Font**: `'Lato', sans-serif` - Clean sans-serif for UI elements

### Typography Scale
```typescript
fontSize: {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  md: '1rem',       // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
}
```

### Usage Guidelines
- Use `fontFamily="heading"` for all headings (h1-h6)
- Use `fontFamily="body"` for paragraphs and body text
- Use `fontFamily="mono"` for buttons and UI elements
- Always include responsive font sizes: `fontSize={{ base: 'md', md: 'lg' }}`

## Spacing System

### Spacing Scale
```typescript
spacing: {
  xs: 1,    // 0.25rem (4px)
  sm: 2,    // 0.5rem (8px)
  md: 4,    // 1rem (16px)
  lg: 6,    // 1.5rem (24px)
  xl: 8,    // 2rem (32px)
  '2xl': 12, // 3rem (48px)
  '3xl': 16, // 4rem (64px)
  '4xl': 20, // 5rem (80px)
  '5xl': 24, // 6rem (96px)
}
```

### Responsive Spacing
Always use responsive spacing for consistent layouts:
```typescript
// Section padding
py={{ base: 12, md: 16, lg: 20 }}

// Container padding
px={{ base: 4, md: 6, lg: 8 }}

// Component spacing
mb={{ base: 4, md: 6 }}
gap={{ base: 4, md: 6, lg: 8 }}
```

## Component Patterns

### Buttons
```typescript
// Primary Button
<Button 
  bg="brand.accent"
  color="white"
  fontFamily="mono"
  _hover={{ bg: "blue.600", transform: "translateY(-2px)" }}
  _focus={{ outline: "2px solid", outlineColor: "brand.accent" }}
  transition="all 0.2s ease"
>

// Secondary Button
<Button 
  variant="outline"
  borderColor="brand.accent"
  color="brand.accent"
  fontFamily="mono"
  _hover={{ bg: "brand.accent", color: "white" }}
>
```

### Cards
```typescript
<Box
  bg="white"
  borderRadius="xl"
  shadow="md"
  p={{ base: 4, md: 6 }}
  transition="all 0.2s"
  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
>
```

### Headings
```typescript
<Heading
  as="h2"
  fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
  fontFamily="heading"
  color="brand.900"
  mb={{ base: 4, md: 6 }}
>
```

### Body Text
```typescript
<Text
  fontSize={{ base: 'md', md: 'lg' }}
  fontFamily="body"
  color="gray.600"
  lineHeight="relaxed"
>
```

## Layout Patterns

### Container
```typescript
<Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
```

### Section
```typescript
<Box py={{ base: 12, md: 16, lg: 20 }}>
  <Container maxW="container.xl">
    {/* Section content */}
  </Container>
</Box>
```

### Grid Layouts
```typescript
<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
```

## Animation Guidelines

### Hover Effects
- Use `transform: translateY(-2px)` for lift effects
- Combine with shadow changes: `shadow: 'md'` → `shadow: 'lg'`
- Always include `transition="all 0.2s ease"`

### Focus States
- Use `outline: "2px solid"` with `outlineColor: "brand.accent"`
- Include `outlineOffset: "2px"` for better visibility

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Interactive elements have sufficient contrast in all states

### Focus Management
- All interactive elements have visible focus indicators
- Focus order follows logical tab sequence
- Skip links provided for keyboard navigation

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Include ARIA labels for complex interactions
- Provide alternative text for images

## Responsive Design

### Breakpoints
```typescript
breakpoints: {
  base: '0px',     // Mobile first
  sm: '480px',     // Small mobile
  md: '768px',     // Tablet
  lg: '992px',     // Desktop
  xl: '1280px',    // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Mobile-First Approach
Always start with mobile styles and enhance for larger screens:
```typescript
fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
py={{ base: 8, md: 12, lg: 16 }}
direction={{ base: 'column', md: 'row' }}
```

## Performance Considerations

### Image Optimization
- Use Next.js Image component for automatic optimization
- Provide appropriate alt text for accessibility
- Use lazy loading for non-critical images

### Bundle Size
- Import only needed Chakra UI components
- Use tree-shaking friendly imports
- Minimize custom CSS in favor of Chakra tokens

### Animation Performance
- Use CSS transforms instead of changing layout properties
- Prefer `transform` and `opacity` for smooth animations
- Use `will-change` sparingly and remove after animation

## Best Practices

### Component Structure
1. Import statements (React, Chakra UI, custom components)
2. Type definitions
3. Component logic
4. Return JSX with proper semantic structure

### Styling Approach
1. Use Chakra UI system props over custom CSS
2. Leverage semantic tokens for consistent theming
3. Implement responsive design with mobile-first approach
4. Include proper focus and hover states

### Code Organization
1. Keep components focused and single-purpose
2. Extract reusable patterns into custom components
3. Use TypeScript for type safety
4. Document complex interactions and accessibility features
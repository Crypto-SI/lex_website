# Testing Documentation

This document outlines the comprehensive testing strategy for the Lex Consulting website modernization project.

## Testing Overview

Our testing suite covers multiple aspects of the application to ensure quality, performance, accessibility, and cross-browser compatibility.

### Test Categories

1. **Unit & Integration Tests** - Component and utility function testing
2. **Accessibility Tests** - WCAG 2.1 AA compliance validation
3. **Performance Tests** - Core Web Vitals and optimization metrics
4. **Visual Regression Tests** - UI consistency across viewports and browsers
5. **Cross-Browser Compatibility** - Testing across Chrome, Firefox, and Safari
6. **Lighthouse Audits** - Comprehensive performance and best practices analysis

## Running Tests

### Quick Start

```bash
# Run all unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run comprehensive test suite
npm run test:comprehensive
```

### Specific Test Types

```bash
# Accessibility tests
npm run test:accessibility

# Performance tests
npm run test:performance

# Visual regression tests
npm run test:visual

# Cross-browser compatibility
npm run test:cross-browser

# Lighthouse performance audit
npm run test:lighthouse

# End-to-end tests
npm run test:e2e
```

## Test Structure

### Unit & Integration Tests

Located in `src/**/__tests__/` directories:

- **Component Tests**: Testing React components with proper rendering and interactions
- **Utility Tests**: Testing helper functions and business logic
- **Theme Tests**: Validating Chakra UI v3 theme configuration
- **Content Management Tests**: Testing content loading and management systems
- **Error Boundary Tests**: Ensuring proper error handling

### Accessibility Tests

Located in `src/**/*.a11y.test.*`:

- **WCAG Compliance**: Automated accessibility testing with axe-core
- **Keyboard Navigation**: Testing focus management and keyboard interactions
- **Screen Reader Support**: Validating ARIA labels and semantic HTML
- **Color Contrast**: Ensuring proper contrast ratios
- **Form Accessibility**: Testing form labels and validation

### Performance Tests

Located in `src/test/performance/`:

- **Core Web Vitals**: LCP, FID, CLS measurements
- **Resource Loading**: Bundle size and loading performance
- **Image Optimization**: Testing lazy loading and format optimization
- **Font Loading**: Validating font display strategies
- **Memory Management**: Testing for memory leaks and cleanup

### Visual Regression Tests

Located in `src/test/visual/`:

- **Component Consistency**: Screenshot comparison of UI components
- **Responsive Design**: Testing across multiple viewport sizes
- **Dark Mode**: Validating theme switching
- **Interactive States**: Testing hover, focus, and active states
- **Animation Handling**: Ensuring consistent animation rendering

### Cross-Browser Tests

Located in `src/test/compatibility/`:

- **Feature Detection**: Testing modern web API support
- **CSS Compatibility**: Validating Grid, Flexbox, and custom properties
- **JavaScript Support**: Testing ES6+ features and polyfills
- **Form Interactions**: Cross-browser form handling
- **Navigation**: Testing routing and link behavior

## Test Configuration

### Vitest Configuration

The main test runner uses Vitest with the following setup:

- **Environment**: jsdom for DOM testing
- **Setup Files**: `src/test/setup.ts` for global mocks and utilities
- **Coverage**: v8 provider with HTML and JSON reports
- **Mocks**: Next.js router, Image component, and framer-motion

### Playwright Configuration

End-to-end and visual tests use Playwright:

- **Browsers**: Chromium, Firefox, WebKit
- **Devices**: Desktop and mobile viewports
- **Screenshots**: Automatic on failure
- **Traces**: Enabled for debugging

### Test Utilities

Custom testing utilities in `src/test/utils.tsx`:

- **Custom Render**: Wraps components with Chakra UI provider
- **Mock Data**: Predefined content and asset mocks
- **Accessibility Helpers**: axe-core integration

## Performance Benchmarks

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to First Byte (TTFB)**: < 600 milliseconds

### Lighthouse Scores

- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Bundle Size Limits

- **Main JavaScript Bundle**: < 500KB
- **CSS Bundle**: < 100KB
- **Individual Images**: Optimized with WebP/AVIF support

## Accessibility Standards

### WCAG 2.1 AA Compliance

- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order

### Testing Tools

- **axe-core**: Automated accessibility testing
- **jest-axe**: Integration with test framework
- **Manual Testing**: Keyboard navigation and screen reader testing

## Continuous Integration

### GitHub Actions Workflow

The CI pipeline runs:

1. **Unit Tests**: Fast feedback on code changes
2. **Build Tests**: Ensuring successful compilation across Node.js versions
3. **Performance Tests**: Validating Core Web Vitals
4. **Visual Tests**: Screenshot comparison
5. **Cross-Browser Tests**: Multi-browser compatibility
6. **Security Scan**: Dependency vulnerability checks
7. **Deployment Tests**: Production build validation

### Test Reports

- **Coverage Reports**: Uploaded to Codecov
- **Visual Test Results**: Stored as artifacts
- **Lighthouse Results**: Performance audit reports
- **Test Summary**: JSON report with detailed metrics

## Local Development

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests During Development

```bash
# Watch mode for unit tests
npm run test:watch

# Run accessibility tests after component changes
npm run test:accessibility

# Visual regression after UI changes
npm run test:visual

# Performance check after optimization
npm run test:performance
```

### Debugging Tests

```bash
# Run tests with UI
npm run test:ui

# Debug Playwright tests
npx playwright test --debug

# Generate test coverage
npm run test:coverage
```

## Best Practices

### Writing Tests

1. **Test Behavior, Not Implementation**: Focus on user interactions and outcomes
2. **Use Descriptive Names**: Clear test descriptions that explain the expected behavior
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
4. **Mock External Dependencies**: Isolate units under test
5. **Test Edge Cases**: Include error conditions and boundary values

### Accessibility Testing

1. **Automated + Manual**: Combine automated tools with manual testing
2. **Real Devices**: Test with actual assistive technologies
3. **User Scenarios**: Test complete user workflows
4. **Progressive Enhancement**: Ensure functionality without JavaScript

### Performance Testing

1. **Real Conditions**: Test with throttled networks and devices
2. **Continuous Monitoring**: Track performance over time
3. **User-Centric Metrics**: Focus on user experience metrics
4. **Optimization Validation**: Verify that optimizations work as expected

## Troubleshooting

### Common Issues

1. **Test Timeouts**: Increase timeout for slow operations
2. **Flaky Visual Tests**: Ensure animations are disabled
3. **Cross-Browser Failures**: Check for browser-specific features
4. **Performance Variations**: Account for system load differences

### Getting Help

- Check test logs for detailed error messages
- Review GitHub Actions workflow results
- Use Playwright trace viewer for debugging
- Consult team documentation and best practices

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Keep testing tools current
2. **Review Test Coverage**: Ensure adequate coverage of new features
3. **Update Baselines**: Refresh visual regression baselines when UI changes
4. **Performance Monitoring**: Track performance trends over time

### Test Data Management

- Keep mock data synchronized with real data structures
- Update test fixtures when APIs change
- Maintain realistic test scenarios
- Clean up test artifacts regularly
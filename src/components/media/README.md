# Optimized Media Components

This directory contains optimized media components that implement performance best practices for images and videos in the Lex Consulting website, including a comprehensive lazy loading system.

## Components

### OptimizedImage

A wrapper around Next.js Image component with enhanced features:

- **WebP/AVIF Support**: Automatic modern format conversion
- **Lazy Loading**: Intersection Observer-based lazy loading by default
- **Fallback Handling**: Graceful error handling with custom fallback components
- **Loading States**: Skeleton loading indicators
- **Responsive Sizing**: Automatic responsive image sizing
- **Quality Optimization**: Configurable quality settings (default: 85%)

```tsx
import { OptimizedImage } from '@/components/media'

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  lazy={true}
  fallback={<CustomFallback />}
  showErrorDetails={false}
/>
```

### OptimizedVideo

A comprehensive video component with performance optimizations:

- **Lazy Loading**: Intersection Observer for viewport-based loading
- **Custom Controls**: Overlay controls with play/pause and mute functionality
- **Fallback Mechanisms**: Error handling for failed video loads
- **Responsive Design**: Configurable aspect ratios
- **Loading States**: Skeleton components during load
- **Poster Images**: Optimized poster image support

```tsx
import { OptimizedVideo } from '@/components/media'

<OptimizedVideo
  src="/path/to/video.mp4"
  poster="/path/to/poster.jpg"
  aspectRatio={16/9}
  lazy={true}
  controls={true}
  muted={true}
  loop={false}
/>
```

### OptimizedYouTubePlayer

Specialized YouTube video player with optimized thumbnail loading:

- **Optimized Thumbnails**: Multiple quality options with fallbacks
- **Lazy Loading**: Deferred iframe loading until user interaction
- **Custom Styling**: Maintains existing design system
- **Responsive Design**: Configurable aspect ratios and max widths
- **Performance**: Reduces initial page load by avoiding iframe until needed

```tsx
import { OptimizedYouTubePlayer } from '@/components/media'

<OptimizedYouTubePlayer
  videoId="796cT8bt1P8"
  title="Video Title"
  maxWidth="500px"
  aspectRatio={16/9}
  thumbnailQuality="maxres"
  showTitle={true}
  autoPlay={true}
/>
```

## Script Loading System

### ScriptLoader

Utility for loading external scripts with security and performance optimizations:

```tsx
import { ScriptLoader, loadScript, useScriptLoader } from '@/components/media'

// Component approach
<ScriptLoader
  src="https://example.com/script.js"
  integrity="sha384-..."
  crossOrigin="anonymous"
  fallback={<Spinner />}
  errorFallback={<Text>Failed to load</Text>}
>
  {({ isLoaded, isLoading, hasError }) => (
    <div>Script status: {isLoaded ? 'Ready' : 'Loading'}</div>
  )}
</ScriptLoader>

// Hook approach
const { isLoaded, isLoading, hasError } = useScriptLoader({
  src: 'https://example.com/script.js',
  integrity: 'sha384-...',
  onLoad: () => console.log('Script loaded'),
  onError: (error) => console.error('Script error:', error)
})

// Programmatic approach
await loadScript({
  src: 'https://example.com/script.js',
  integrity: 'sha384-...',
  timeout: 10000
})
```

### CalendlyLoader

Specialized Calendly integration with on-demand loading:

```tsx
import { CalendlyPopup, CalendlyInline, useCalendly } from '@/components/media'

// Popup integration
<CalendlyPopup 
  url="https://calendly.com/your-link"
  onError={(error) => console.error(error)}
>
  {({ onClick, isLoading }) => (
    <Button onClick={onClick} isLoading={isLoading}>
      Schedule Call
    </Button>
  )}
</CalendlyPopup>

// Inline widget
<CalendlyInline 
  url="https://calendly.com/your-link"
  height="600px"
  fallback={<div>Loading calendar...</div>}
/>

// Hook for custom implementations
const { openPopup, openInline, state } = useCalendly()
```

## Lazy Loading System

### LazySection

A wrapper component that uses Intersection Observer to lazy load content:

```tsx
import { LazySection } from '@/components/media'

<LazySection
  fallback={<SkeletonCard />}
  threshold={0.1}
  rootMargin="50px"
  triggerOnce={true}
>
  <ExpensiveComponent />
</LazySection>
```

### LazyComponent

Advanced lazy loading with loading states and error handling:

```tsx
import { LazyComponent } from '@/components/media'

<LazyComponent
  fallback={<Skeleton />}
  loadingFallback={<Spinner />}
  errorFallback={<ErrorMessage />}
  onLoad={() => console.log('Loaded')}
>
  {() => <DynamicContent />}
</LazyComponent>
```

### ProgressiveImage

Enhanced image loading with low-quality placeholder:

```tsx
import { ProgressiveImage } from '@/components/media'

<ProgressiveImage
  src="/high-quality.jpg"
  lowQualitySrc="/low-quality.jpg"
  alt="Progressive loading example"
  progressiveLoading={true}
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Skeleton Components

Pre-built skeleton components for consistent loading states:

```tsx
import { 
  SkeletonCard, 
  SkeletonGrid, 
  SkeletonHero,
  SkeletonList,
  SkeletonNavbar,
  SkeletonFooter,
  SkeletonVideo
} from '@/components/media'

// Card skeleton
<SkeletonCard hasImage hasAvatar lines={3} />

// Grid skeleton
<SkeletonGrid columns={3} items={6} hasImage />

// Hero section skeleton
<SkeletonHero hasImage hasButton />
```

### Lazy Loading Hooks

Custom hooks for advanced lazy loading scenarios:

```tsx
import { useLazyLoading, useProgressiveImage, useBatchLazyLoading } from '@/components/media'

// Basic lazy loading
const { ref, isInView, hasBeenInView } = useLazyLoading({
  threshold: 0.2,
  rootMargin: '100px',
  triggerOnce: true
})

// Progressive image loading
const { 
  ref, 
  lowQualityLoaded, 
  highQualityLoaded, 
  isLoading 
} = useProgressiveImage({
  lowQualitySrc: '/low-quality.jpg',
  highQualitySrc: '/high-quality.jpg'
})

// Batch loading for lists
const { 
  ref, 
  isItemLoaded, 
  getLoadedCount 
} = useBatchLazyLoading(100, {
  batchSize: 10,
  delay: 100
})
```

## Utilities

### Media Utilities (`utils.ts`)

Helper functions for media optimization:

- `generateResponsiveSizes()`: Create responsive sizes strings
- `getOptimizedImageUrl()`: Format optimization for different image types
- `checkImageFormatSupport()`: Browser format support detection
- `generateSrcSet()`: Create srcSet for responsive images
- `getVideoSources()`: Generate fallback video sources
- `preloadImage()`: Preload critical images
- `createImageObserver()`: Intersection Observer factory

## Performance Benefits

### Image Optimization
- **Format Conversion**: Automatic WebP/AVIF when supported
- **Size Reduction**: Responsive sizing reduces bandwidth
- **Lazy Loading**: Reduces initial page load time
- **Quality Control**: Balanced quality vs. file size

### Video Optimization
- **Deferred Loading**: Videos load only when in viewport
- **Poster Images**: Fast initial render with poster frames
- **Custom Controls**: Reduced JavaScript overhead
- **Error Handling**: Prevents broken media from breaking UX

### YouTube Integration
- **Thumbnail Optimization**: High-quality thumbnails with fallbacks
- **Lazy Iframe**: YouTube iframe loads only on user interaction
- **Bandwidth Savings**: Significant reduction in initial page weight
- **User Experience**: Maintains visual consistency while optimizing performance

## Implementation Notes

### Requirements Addressed

This implementation addresses the following requirements from the website modernization spec:

- **Requirement 2.1**: Next.js Image optimization with proper sizing and formats
- **Requirement 2.2**: WebP/AVIF format support for images  
- **Requirement 2.3**: Lazy loading for non-critical components throughout the application
- **Requirement 2.4**: Progressive loading for images and videos
- **Requirement 2.5**: Fallback mechanisms for failed media loads
- **Requirement 7.1**: External script integrity checks and on-demand loading

### Browser Support

- **Modern Browsers**: Full WebP/AVIF support
- **Legacy Browsers**: Automatic fallback to JPEG/PNG
- **Progressive Enhancement**: Features degrade gracefully

### Performance Metrics

Expected improvements:
- **Image Load Time**: 30-50% reduction with modern formats
- **Initial Page Load**: 20-40% faster with lazy loading
- **Bandwidth Usage**: 25-60% reduction depending on content
- **Core Web Vitals**: Improved LCP and CLS scores
- **Memory Usage**: Reduced by loading content only when needed
- **User Experience**: Smooth loading with skeleton states
- **Security**: Script integrity verification and error handling
- **Network Efficiency**: Reduced initial payload with on-demand loading

## Usage Examples

### Lazy Loading Section
```tsx
<LazySection
  fallback={<SkeletonHero />}
  threshold={0.1}
  rootMargin="100px"
>
  <HeroSection />
</LazySection>
```

### Progressive Image Loading
```tsx
<ProgressiveImage
  src="/hero-4k.jpg"
  lowQualitySrc="/hero-thumbnail.jpg"
  alt="Hero Image"
  width={1200}
  height={600}
  progressiveLoading={true}
/>
```

### On-Demand Script Loading
```tsx
// Calendly integration
<CalendlyPopup url="https://calendly.com/your-link">
  {({ onClick, isLoading }) => (
    <Button onClick={onClick} isLoading={isLoading}>
      Schedule Call
    </Button>
  )}
</CalendlyPopup>

// Generic script loading
<ScriptLoader
  src="https://cdn.example.com/library.js"
  integrity="sha384-..."
  fallback={<Spinner />}
>
  {({ isLoaded }) => (
    isLoaded ? <LibraryComponent /> : <Placeholder />
  )}
</ScriptLoader>
```

### Lazy Grid with Skeletons
```tsx
<LazySection fallback={<SkeletonGrid columns={3} items={9} />}>
  <SimpleGrid columns={3} spacing={4}>
    {items.map((item, index) => (
      <LazyComponent
        key={item.id}
        fallback={<SkeletonCard hasImage />}
        threshold={0.2}
      >
        <ProductCard product={item} />
      </LazyComponent>
    ))}
  </SimpleGrid>
</LazySection>
```

### Basic Image with Fallback
```tsx
<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero Image"
  width={1200}
  height={600}
  priority={true} // For above-the-fold images
  fallback={
    <Box bg="gray.200" width="100%" height="400px" />
  }
/>
```

### Video with Custom Poster
```tsx
<OptimizedVideo
  src="/intro-video.mp4"
  poster="/intro-poster.jpg"
  aspectRatio={16/9}
  controls={true}
  onError={(error) => console.log('Video error:', error)}
  onLoad={() => console.log('Video loaded')}
/>
```

### YouTube Player with Custom Styling
```tsx
<OptimizedYouTubePlayer
  videoId="dQw4w9WgXcQ"
  title="Custom Video Title"
  maxWidth="800px"
  thumbnailQuality="high"
  containerProps={{
    boxShadow: "lg",
    borderRadius: "xl"
  }}
/>
```

## Testing

To test the components:

1. **Visual Testing**: Check loading states and fallbacks
2. **Performance Testing**: Measure Core Web Vitals improvements
3. **Error Testing**: Test with invalid URLs to verify fallback behavior
4. **Responsive Testing**: Verify behavior across different screen sizes
5. **Browser Testing**: Test format support across different browsers

## Future Enhancements

Potential improvements for future iterations:

- **Progressive Loading**: Blur-up technique for images
- **Video Streaming**: Adaptive bitrate streaming support
- **Analytics Integration**: Performance metrics tracking
- **A11y Enhancements**: Enhanced screen reader support
- **Preloading Strategies**: Intelligent preloading based on user behavior
/**
 * Utility functions for optimized media components
 */

export interface ResponsiveImageSizes {
  mobile: string
  tablet: string
  desktop: string
  default: string
}

export interface ImageFormatConfig {
  webp: boolean
  avif: boolean
  quality: number
  fallbackFormat: 'jpg' | 'png'
}

/**
 * Generate responsive sizes string for Next.js Image component
 */
export const generateResponsiveSizes = (config: Partial<ResponsiveImageSizes> = {}): string => {
  const defaultSizes: ResponsiveImageSizes = {
    mobile: '100vw',
    tablet: '50vw', 
    desktop: '33vw',
    default: '100vw',
    ...config
  }

  return `(max-width: 768px) ${defaultSizes.mobile}, (max-width: 1024px) ${defaultSizes.tablet}, ${defaultSizes.desktop}`
}

/**
 * Get optimized image URL with format support
 */
export const getOptimizedImageUrl = (
  src: string, 
  format: 'webp' | 'avif' | 'original' = 'original'
): string => {
  // For external URLs, return as-is since Next.js will handle optimization
  if (src.startsWith('http') || src.startsWith('//')) {
    return src
  }

  // For local images, Next.js Image component will handle format optimization
  return src
}

/**
 * Check if browser supports modern image formats
 */
export const checkImageFormatSupport = (): Promise<{
  webp: boolean
  avif: boolean
}> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    
    const webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    
    // AVIF support check
    const avifImage = new Image()
    avifImage.onload = () => resolve({ webp: webpSupport, avif: true })
    avifImage.onerror = () => resolve({ webp: webpSupport, avif: false })
    avifImage.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
  })
}

/**
 * Generate srcSet for responsive images
 */
export const generateSrcSet = (
  baseSrc: string,
  widths: number[] = [640, 768, 1024, 1280, 1920]
): string => {
  return widths
    .map(width => `${baseSrc}?w=${width} ${width}w`)
    .join(', ')
}

/**
 * Calculate aspect ratio from dimensions
 */
export const calculateAspectRatio = (width: number, height: number): number => {
  return width / height
}

/**
 * Video compression settings
 */
export interface VideoCompressionConfig {
  quality: 'low' | 'medium' | 'high'
  format: 'mp4' | 'webm' | 'auto'
  maxBitrate?: number
}

/**
 * Get video MIME type based on format and browser support
 */
export const getVideoMimeType = (format: string): string => {
  const mimeTypes: Record<string, string> = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'avi': 'video/avi',
    'mov': 'video/quicktime'
  }
  
  return mimeTypes[format.toLowerCase()] || 'video/mp4'
}

/**
 * Check if video format is supported by browser
 */
export const isVideoFormatSupported = (format: string): boolean => {
  const video = document.createElement('video')
  const mimeType = getVideoMimeType(format)
  
  return video.canPlayType(mimeType) !== ''
}

/**
 * Get fallback video sources based on browser support
 */
export const getVideoSources = (baseSrc: string): Array<{ src: string; type: string }> => {
  const extension = baseSrc.split('.').pop()?.toLowerCase() || 'mp4'
  const baseName = baseSrc.replace(/\.[^/.]+$/, '')
  
  const sources = []
  
  // Add WebM if supported (better compression)
  if (typeof window !== 'undefined' && isVideoFormatSupported('webm')) {
    sources.push({
      src: `${baseName}.webm`,
      type: 'video/webm'
    })
  }
  
  // Add original format as fallback
  sources.push({
    src: baseSrc,
    type: getVideoMimeType(extension)
  })
  
  return sources
}

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Lazy load images with Intersection Observer
 */
export const createImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}
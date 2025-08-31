'use client'

import { useState, useRef, useEffect, forwardRef } from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { Box, Skeleton } from '@chakra-ui/react'

export interface ProgressiveImageProps extends Omit<NextImageProps, 'onError' | 'onLoad'> {
  lowQualitySrc?: string
  fallback?: React.ReactNode
  lazy?: boolean
  showErrorDetails?: boolean
  containerProps?: Record<string, any>
  onLoad?: () => void
  onError?: (error: Error) => void
  progressiveLoading?: boolean
  blurDataURL?: string
}

export const ProgressiveImage = forwardRef<HTMLImageElement, ProgressiveImageProps>(
  ({ 
    lowQualitySrc,
    fallback, 
    lazy = true, 
    showErrorDetails = false, 
    containerProps = {},
    onLoad,
    onError,
    progressiveLoading = true,
    blurDataURL,
    alt,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [lowQualityLoaded, setLowQualityLoaded] = useState(false)
    const [highQualityLoaded, setHighQualityLoaded] = useState(false)
    const [isInView, setIsInView] = useState(!lazy)
    
    const containerRef = useRef<HTMLDivElement>(null)
    const lowQualityRef = useRef<HTMLImageElement>(null)

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (!lazy || isInView) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      return () => observer.disconnect()
    }, [lazy, isInView])

    // Load low quality image first if progressive loading is enabled
    useEffect(() => {
      if (!isInView || !progressiveLoading || !lowQualitySrc) return

      const img = new Image()
      img.onload = () => {
        setLowQualityLoaded(true)
      }
      img.onerror = () => {
        // If low quality fails, skip to high quality
        setLowQualityLoaded(false)
      }
      img.src = lowQualitySrc
    }, [isInView, progressiveLoading, lowQualitySrc])

    const handleHighQualityLoad = () => {
      setIsLoading(false)
      setHasError(false)
      setHighQualityLoaded(true)
      onLoad?.()
    }

    const handleError = (error: any) => {
      setIsLoading(false)
      setHasError(true)
      const errorMsg = error?.message || 'Failed to load image'
      setErrorMessage(errorMsg)
      console.warn('ProgressiveImage: Failed to load image', { src: props.src, error })
      onError?.(new Error(errorMsg))
    }

    // Default fallback component
    const defaultFallback = (
      <Box 
        bg="gray.100" 
        borderRadius="md" 
        p={4} 
        textAlign="center"
        border="1px solid"
        borderColor="gray.200"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
      >
        <Box>
          <Box fontSize="sm" color="gray.600" fontWeight="medium">
            Image unavailable
          </Box>
          {showErrorDetails && errorMessage && (
            <Box fontSize="xs" color="gray.500" mt={1}>
              {errorMessage}
            </Box>
          )}
        </Box>
      </Box>
    )

    // Show fallback if there's an error
    if (hasError) {
      return <Box {...containerProps}>{fallback || defaultFallback}</Box>
    }

    // Show skeleton while not in view (lazy loading)
    if (!isInView) {
      return (
        <Box ref={containerRef} {...containerProps}>
          <Skeleton borderRadius="md" height="200px" />
        </Box>
      )
    }

    return (
      <Box 
        ref={containerRef}
        position="relative" 
        overflow="hidden"
        {...containerProps}
      >
        {/* Loading skeleton */}
        {isLoading && !lowQualityLoaded && (
          <Skeleton
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            borderRadius="inherit"
            zIndex={1}
          />
        )}

        {/* Low quality image (progressive loading) */}
        {progressiveLoading && lowQualitySrc && lowQualityLoaded && !highQualityLoaded && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            zIndex={2}
          >
            <NextImage
              ref={lowQualityRef}
              src={lowQualitySrc}
              alt={alt}
              fill
              unoptimized={true}
              style={{
                objectFit: props.style?.objectFit || 'cover',
                filter: 'blur(5px)',
                transform: 'scale(1.1)', // Slightly scale to hide blur edges
                transition: 'opacity 0.3s ease-in-out'
              }}
              quality={20}
              priority={false}
            />
          </Box>
        )}
        
        {/* High quality image */}
        <NextImage
          ref={ref}
          {...props}
          alt={alt}
          unoptimized={true}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleHighQualityLoad}
          onError={handleError}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          style={{
            opacity: highQualityLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            zIndex: 3,
            position: 'relative',
            ...props.style
          }}
          quality={props.quality || 85}
        />
      </Box>
    )
  }
)

ProgressiveImage.displayName = 'ProgressiveImage'
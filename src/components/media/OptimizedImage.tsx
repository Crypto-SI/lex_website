'use client'

import { useState, forwardRef } from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { Box, Skeleton, Text } from '@chakra-ui/react'

export interface OptimizedImageProps extends Omit<NextImageProps, 'onError' | 'onLoad'> {
  fallback?: React.ReactNode
  lazy?: boolean
  showErrorDetails?: boolean
  containerProps?: Record<string, any>
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ 
    fallback, 
    lazy = true, 
    showErrorDetails = false, 
    containerProps = {},
    alt,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const { unoptimized = true, ...imageProps } = props

    const handleLoad = () => {
      setIsLoading(false)
      setHasError(false)
    }

    const handleError = (error: any) => {
      setIsLoading(false)
      setHasError(true)
      setErrorMessage(error?.message || 'Failed to load image')
      console.warn('OptimizedImage: Failed to load image', { src: props.src, error })
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
        {...containerProps}
      >
        <Text fontSize="sm" color="gray.600" fontWeight="medium">
          Image unavailable
        </Text>
        {showErrorDetails && errorMessage && (
          <Text fontSize="xs" color="gray.500" mt={1}>
            {errorMessage}
          </Text>
        )}
      </Box>
    )

    // Show fallback if there's an error
    if (hasError) {
      return <>{fallback || defaultFallback}</>
    }

    return (
      <Box position="relative" {...containerProps}>
        {/* Loading skeleton */}
        {isLoading && (
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
        
        {/* Optimized Next.js Image */}
        <NextImage
          ref={ref}
          {...imageProps}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
            ...imageProps.style
          }}
          // Default to unoptimized to preserve static export compatibility
          unoptimized={unoptimized}
          // Add quality optimization (only applies when optimization is enabled)
          quality={imageProps.quality || 85}
        />
      </Box>
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

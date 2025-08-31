'use client'

import { useState, useRef, useEffect, ReactNode, ComponentType, Suspense } from 'react'
import { Box, Skeleton, Spinner, Text } from '@chakra-ui/react'

export interface LazyComponentProps {
  children: ReactNode | (() => ReactNode)
  fallback?: ReactNode
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  disabled?: boolean
  onIntersect?: (isIntersecting: boolean) => void
  onLoad?: () => void
  onError?: (error: Error) => void
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback,
  loadingFallback,
  errorFallback,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  disabled = false,
  onIntersect,
  onLoad,
  onError
}) => {
  const [isInView, setIsInView] = useState(disabled)
  const [hasBeenInView, setHasBeenInView] = useState(disabled)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled || (triggerOnce && hasBeenInView)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        setIsInView(isIntersecting)
        
        if (isIntersecting) {
          if (triggerOnce) {
            setHasBeenInView(true)
          }
          setIsLoading(true)
          
          // Simulate async loading if children is a function
          if (typeof children === 'function') {
            try {
              Promise.resolve().then(() => {
                setIsLoading(false)
                onLoad?.()
              })
            } catch (err) {
              const error = err instanceof Error ? err : new Error('Failed to load component')
              setError(error)
              setHasError(true)
              setIsLoading(false)
              onError?.(error)
            }
          } else {
            setIsLoading(false)
            onLoad?.()
          }
        }
        
        onIntersect?.(isIntersecting)
      },
      {
        threshold,
        rootMargin
      }
    )

    const element = elementRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [disabled, hasBeenInView, threshold, rootMargin, triggerOnce, onIntersect, children, onLoad, onError])

  // Default fallbacks
  const defaultFallback = (
    <Skeleton
      height="200px"
      borderRadius="md"
    />
  )

  const defaultLoadingFallback = (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="200px"
      borderRadius="md"
      bg="gray.50"
    >
      <Spinner size="lg" color="blue.500" />
    </Box>
  )

  const defaultErrorFallback = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="200px"
      borderRadius="md"
      bg="red.50"
      border="1px solid"
      borderColor="red.200"
      p={4}
    >
      <Text color="red.600" fontWeight="medium" mb={2}>
        Failed to load content
      </Text>
      {error && (
        <Text color="red.500" fontSize="sm" textAlign="center">
          {error.message}
        </Text>
      )}
    </Box>
  )

  const shouldShowContent = disabled || isInView || (triggerOnce && hasBeenInView)

  return (
    <Box ref={elementRef}>
      {!shouldShowContent && (fallback || defaultFallback)}
      
      {shouldShowContent && hasError && (errorFallback || defaultErrorFallback)}
      
      {shouldShowContent && !hasError && isLoading && (loadingFallback || defaultLoadingFallback)}
      
      {shouldShowContent && !hasError && !isLoading && (
        <Suspense fallback={loadingFallback || defaultLoadingFallback}>
          {typeof children === 'function' ? children() : children}
        </Suspense>
      )}
    </Box>
  )
}

LazyComponent.displayName = 'LazyComponent'
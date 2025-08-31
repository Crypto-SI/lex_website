'use client'

import { useState, useRef, useEffect, ReactNode, forwardRef } from 'react'
import { Box, Skeleton, BoxProps } from '@chakra-ui/react'

export interface LazySectionProps extends BoxProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  disabled?: boolean
  onIntersect?: (isIntersecting: boolean) => void
  skeletonProps?: Record<string, any>
}

export const LazySection = forwardRef<HTMLDivElement, LazySectionProps>(
  ({
    children,
    fallback,
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    disabled = false,
    onIntersect,
    skeletonProps = {},
    ...boxProps
  }, ref) => {
    const [isInView, setIsInView] = useState(disabled)
    const [hasBeenInView, setHasBeenInView] = useState(disabled)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (disabled || (triggerOnce && hasBeenInView)) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          const isIntersecting = entry.isIntersecting
          setIsInView(isIntersecting)
          
          if (isIntersecting && triggerOnce) {
            setHasBeenInView(true)
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
    }, [disabled, hasBeenInView, threshold, rootMargin, triggerOnce, onIntersect])

    // Default skeleton fallback
    const defaultFallback = (
      <Skeleton
        height="200px"
        borderRadius="md"
        {...skeletonProps}
      />
    )

    const shouldShowContent = disabled || isInView || (triggerOnce && hasBeenInView)

    return (
      <Box
        ref={(node) => {
          elementRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        {...boxProps}
      >
        {shouldShowContent ? children : (fallback || defaultFallback)}
      </Box>
    )
  }
)

LazySection.displayName = 'LazySection'
'use client'

import { useState, useRef, useEffect, RefObject } from 'react'

export interface UseLazyLoadingOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  disabled?: boolean
  onIntersect?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void
}

export interface UseLazyLoadingReturn {
  ref: RefObject<HTMLElement>
  isInView: boolean
  hasBeenInView: boolean
}

/**
 * Custom hook for lazy loading using Intersection Observer
 */
export const useLazyLoading = (options: UseLazyLoadingOptions = {}): UseLazyLoadingReturn => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    disabled = false,
    onIntersect
  } = options

  const [isInView, setIsInView] = useState(disabled)
  const [hasBeenInView, setHasBeenInView] = useState(disabled)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (disabled || (triggerOnce && hasBeenInView)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        setIsInView(isIntersecting)
        
        if (isIntersecting && triggerOnce) {
          setHasBeenInView(true)
        }
        
        onIntersect?.(isIntersecting, entry)
      },
      {
        threshold,
        rootMargin
      }
    )

    const element = ref.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [disabled, hasBeenInView, threshold, rootMargin, triggerOnce, onIntersect])

  return {
    ref,
    isInView,
    hasBeenInView: triggerOnce ? hasBeenInView : isInView
  }
}

/**
 * Hook for progressive image loading
 */
export interface UseProgressiveImageOptions {
  lowQualitySrc?: string
  highQualitySrc: string
  lazy?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
}

export interface UseProgressiveImageReturn {
  ref: RefObject<HTMLElement>
  isInView: boolean
  lowQualityLoaded: boolean
  highQualityLoaded: boolean
  isLoading: boolean
  hasError: boolean
  error: Error | null
}

export const useProgressiveImage = (options: UseProgressiveImageOptions): UseProgressiveImageReturn => {
  const { lowQualitySrc, highQualitySrc, lazy = true, onLoad, onError } = options
  
  const [lowQualityLoaded, setLowQualityLoaded] = useState(false)
  const [highQualityLoaded, setHighQualityLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const { ref, isInView } = useLazyLoading({
    disabled: !lazy,
    triggerOnce: true
  })

  // Load low quality image first
  useEffect(() => {
    if (!isInView || !lowQualitySrc) return

    const img = new Image()
    img.onload = () => setLowQualityLoaded(true)
    img.onerror = () => setLowQualityLoaded(false)
    img.src = lowQualitySrc
  }, [isInView, lowQualitySrc])

  // Load high quality image
  useEffect(() => {
    if (!isInView) return

    const img = new Image()
    img.onload = () => {
      setHighQualityLoaded(true)
      setIsLoading(false)
      setHasError(false)
      onLoad?.()
    }
    img.onerror = (event) => {
      const err = new Error('Failed to load high quality image')
      setError(err)
      setHasError(true)
      setIsLoading(false)
      onError?.(err)
    }
    img.src = highQualitySrc
  }, [isInView, highQualitySrc, onLoad, onError])

  return {
    ref,
    isInView,
    lowQualityLoaded,
    highQualityLoaded,
    isLoading,
    hasError,
    error
  }
}

/**
 * Hook for batch lazy loading multiple elements
 */
export interface UseBatchLazyLoadingOptions extends UseLazyLoadingOptions {
  batchSize?: number
  delay?: number
}

export const useBatchLazyLoading = (
  count: number, 
  options: UseBatchLazyLoadingOptions = {}
) => {
  const { batchSize = 3, delay = 100, ...lazyOptions } = options
  const [loadedItems, setLoadedItems] = useState<Set<number>>(new Set())
  const [currentBatch, setCurrentBatch] = useState(0)
  
  const { ref, isInView } = useLazyLoading(lazyOptions)

  useEffect(() => {
    if (!isInView) return

    const loadBatch = (batchIndex: number) => {
      const startIndex = batchIndex * batchSize
      const endIndex = Math.min(startIndex + batchSize, count)
      
      for (let i = startIndex; i < endIndex; i++) {
        setTimeout(() => {
          setLoadedItems(prev => new Set([...prev, i]))
        }, (i - startIndex) * delay)
      }
      
      if (endIndex < count) {
        setTimeout(() => {
          setCurrentBatch(batchIndex + 1)
        }, batchSize * delay + 200)
      }
    }

    loadBatch(currentBatch)
  }, [isInView, currentBatch, batchSize, delay, count])

  const isItemLoaded = (index: number) => loadedItems.has(index)
  const getLoadedCount = () => loadedItems.size

  return {
    ref,
    isInView,
    isItemLoaded,
    getLoadedCount,
    loadedItems: Array.from(loadedItems)
  }
}
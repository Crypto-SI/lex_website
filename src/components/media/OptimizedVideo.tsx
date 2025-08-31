'use client'

import { useState, useRef, useEffect, forwardRef } from 'react'
import { Box, Button, Icon, Text, Skeleton, AspectRatio } from '@chakra-ui/react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { OptimizedImage } from './OptimizedImage'

export interface OptimizedVideoProps {
  src: string
  poster?: string
  lazy?: boolean
  fallback?: React.ReactNode
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  width?: number | string
  height?: number | string
  aspectRatio?: number
  onError?: (error: Error) => void
  onLoad?: () => void
  className?: string
  containerProps?: Record<string, any>
  preload?: 'none' | 'metadata' | 'auto'
}

export const OptimizedVideo = forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  ({
    src,
    poster,
    lazy = true,
    fallback,
    autoPlay = false,
    muted = true,
    loop = false,
    controls = true,
    width = '100%',
    height = 'auto',
    aspectRatio = 16 / 9,
    onError,
    onLoad,
    className,
    containerProps = {},
    preload = 'metadata',
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(muted)
    const [showControls, setShowControls] = useState(false)
    const [isInView, setIsInView] = useState(!lazy)
    
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

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
        { threshold: 0.1 }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      return () => observer.disconnect()
    }, [lazy, isInView])

    const handleLoad = () => {
      setIsLoading(false)
      setHasError(false)
      onLoad?.()
    }

    const handleError = (error: any) => {
      setIsLoading(false)
      setHasError(true)
      const errorMsg = error?.message || 'Failed to load video'
      setErrorMessage(errorMsg)
      console.warn('OptimizedVideo: Failed to load video', { src, error })
      onError?.(new Error(errorMsg))
    }

    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
      }
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
      >
        <Text fontSize="sm" color="gray.600" fontWeight="medium">
          Video unavailable
        </Text>
        {errorMessage && (
          <Text fontSize="xs" color="gray.500" mt={1}>
            {errorMessage}
          </Text>
        )}
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
          <AspectRatio ratio={aspectRatio}>
            <Skeleton borderRadius="md" />
          </AspectRatio>
        </Box>
      )
    }

    return (
      <Box
        ref={containerRef}
        position="relative"
        width={width}
        height={height}
        className={className}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        {...containerProps}
      >
        <AspectRatio ratio={aspectRatio}>
          <Box position="relative" width="100%" height="100%">
            {/* Loading skeleton */}
            {isLoading && (
              <Skeleton
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                borderRadius="inherit"
                zIndex={2}
              />
            )}

            {/* Video element */}
            <Box
              as="video"
              ref={(node: HTMLVideoElement) => {
                if (typeof ref === 'function') {
                  ref(node)
                } else if (ref) {
                  ref.current = node
                }
                videoRef.current = node
              }}
              src={src}
              poster={poster}
              autoPlay={autoPlay}
              muted={isMuted}
              loop={loop}
              controls={false} // We'll use custom controls
              preload={preload}
              width="100%"
              height="100%"
              style={{
                objectFit: 'cover',
                borderRadius: 'inherit',
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out'
              }}
              onLoadedData={handleLoad}
              onError={handleError}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              {...props}
            />

            {/* Custom Controls Overlay */}
            {controls && (
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bg="linear-gradient(transparent, rgba(0,0,0,0.7))"
                p={4}
                opacity={showControls || !isPlaying ? 1 : 0}
                transition="opacity 0.3s ease"
                zIndex={3}
              >
                <Box display="flex" alignItems="center" gap={3}>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    onClick={togglePlay}
                    _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                  >
                    <Icon as={isPlaying ? FaPause : FaPlay} />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    onClick={toggleMute}
                    _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                  >
                    <Icon as={isMuted ? FaVolumeMute : FaVolumeUp} />
                  </Button>
                </Box>
              </Box>
            )}

            {/* Play button overlay for when video is paused */}
            {!isPlaying && !isLoading && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                zIndex={3}
              >
                <Button
                  size="lg"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.9)"
                  color="gray.800"
                  onClick={togglePlay}
                  _hover={{
                    bg: 'white',
                    transform: 'scale(1.1)'
                  }}
                  transition="all 0.2s ease"
                >
                  <Icon as={FaPlay} boxSize={6} ml={1} />
                </Button>
              </Box>
            )}
          </Box>
        </AspectRatio>
      </Box>
    )
  }
)

OptimizedVideo.displayName = 'OptimizedVideo'
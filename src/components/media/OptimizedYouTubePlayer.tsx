'use client'

import { useState } from 'react'
import { Box, Icon, Text } from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'
import { OptimizedImage } from './OptimizedImage'
import { ScreenReaderOnly } from '@/components/accessibility'

export interface OptimizedYouTubePlayerProps {
  videoId: string
  title?: string
  maxWidth?: string | number | Record<string, any>
  aspectRatio?: number
  autoPlay?: boolean
  showTitle?: boolean
  thumbnailQuality?: 'default' | 'medium' | 'high' | 'standard' | 'maxres'
  containerProps?: Record<string, any>
}

export const OptimizedYouTubePlayer = ({
  videoId,
  title = 'Video',
  maxWidth = '100%',
  aspectRatio = 16 / 9,
  autoPlay = true,
  showTitle = true,
  thumbnailQuality = 'medium',
  containerProps = {}
}: OptimizedYouTubePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  
  // YouTube thumbnail URL with fallback options
  const getThumbnailUrl = (quality: string) => {
    const qualityMap = {
      'default': 'default.jpg',
      'medium': 'mqdefault.jpg', 
      'high': 'hqdefault.jpg',
      'standard': 'sddefault.jpg',
      'maxres': 'maxresdefault.jpg'
    }
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality as keyof typeof qualityMap] || qualityMap.maxres}`
  }

  const thumbnailUrl = getThumbnailUrl(thumbnailQuality)
  const fallbackThumbnailUrl = getThumbnailUrl('high') // Fallback to high quality

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handlePlay()
    }
  }

  // YouTube embed URL with optimized parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoPlay ? '1' : '0',
    rel: '0', // Don't show related videos
    modestbranding: '1', // Minimal YouTube branding
    showinfo: '0', // Don't show video info
    controls: '1', // Show controls
    iv_load_policy: '3', // Don't show annotations
    color: 'white',
    theme: 'light'
  }).toString()}`

  if (isPlaying) {
    return (
      <Box
        position="relative"
        width="100%"
        maxW={maxWidth}
        p="3px"
        borderRadius="xl"
        background="linear-gradient(135deg, var(--lex-insight-blue), rgba(255, 255, 255, 0.4), var(--lex-deep-blue))"
        transition="all 0.3s ease"
        {...containerProps}
      >
        <Box
          position="relative"
          width="100%"
          bg="rgba(255, 255, 255, 0.08)"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          backdropFilter="blur(15px)"
          aspectRatio={`${aspectRatio}`}
        >
          <Box
            as="iframe"
            src={embedUrl}
            title={title}
            width="100%"
            height="100%"
            border="none"
            borderRadius="lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            aria-label={`${title} - YouTube video player`}
          />
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height="4px"
            bg="linear-gradient(90deg, var(--lex-insight-blue), var(--lex-deep-blue))"
            borderBottomRadius="lg"
          />
        </Box>
      </Box>
    )
  }

  return (
    <Box
      position="relative"
      width="100%"
      maxW={maxWidth}
      p="3px"
      borderRadius="xl"
      background="linear-gradient(135deg, var(--lex-insight-blue), rgba(255, 255, 255, 0.4), var(--lex-deep-blue))"
      transition="all 0.3s ease"
      cursor="pointer"
      onClick={handlePlay}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Play video: ${title}`}
      _hover={{
        transform: "translateY(-5px)",
        background: "linear-gradient(135deg, #0069d9, rgba(255, 255, 255, 0.6), #133c76)"
      }}
      _focus={{
        outline: "2px solid white",
        outlineOffset: "2px"
      }}
      {...containerProps}
    >
      <Box
        position="relative"
        width="100%"
        bg="rgba(255, 255, 255, 0.08)"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
        backdropFilter="blur(15px)"
        aspectRatio={`${aspectRatio}`}
      >
        {/* Optimized Video Thumbnail */}
        <OptimizedImage
          src={thumbnailUrl}
          alt={`${title} - Video Thumbnail`}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 500px"
          quality={85}
          priority={false} // Not critical for initial page load
          fallback={
            <OptimizedImage
              src={fallbackThumbnailUrl}
              alt={`${title} - Video Thumbnail`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 500px"
              quality={75}
            />
          }
          containerProps={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
        
        {/* Custom Play Button Overlay */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={2}
        >
          <Box
            width="80px"
            height="80px"
            borderRadius="50%"
            bg="rgba(255, 255, 255, 0.15)"
            backdropFilter="blur(10px)"
            border="2px solid rgba(255, 255, 255, 0.3)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.3s ease"
            _hover={{
              bg: "rgba(255, 255, 255, 0.25)",
              transform: "scale(1.1)",
              border: "2px solid rgba(255, 255, 255, 0.5)"
            }}
          >
            <Icon 
              as={FaPlay} 
              color="white" 
              boxSize={8}
              ml={1} // Slight offset to center the triangle visually
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              aria-hidden="true"
            />
            <ScreenReaderOnly>
              Play video: {title}
            </ScreenReaderOnly>
          </Box>
        </Box>

        {/* Gradient Overlay for better text contrast */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="60%"
          background="linear-gradient(to top, rgba(0,0,0,0.4), transparent)"
          borderRadius="lg"
        />

        {/* Video Title Overlay */}
        {showTitle && (
          <Box
            position="absolute"
            bottom={4}
            left={4}
            right={4}
            zIndex={1}
          >
            <Text
              color="white"
              fontSize="sm"
              fontWeight="600"
              className="ui-text"
              textShadow="0 1px 3px rgba(0,0,0,0.8)"
              noOfLines={2}
            >
              {title}
            </Text>
          </Box>
        )}

        {/* Accent Bar */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="4px"
          bg="linear-gradient(90deg, var(--lex-insight-blue), var(--lex-deep-blue))"
          borderBottomRadius="lg"
        />
      </Box>
    </Box>
  )
}

OptimizedYouTubePlayer.displayName = 'OptimizedYouTubePlayer'

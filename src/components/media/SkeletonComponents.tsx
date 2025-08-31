'use client'

import { Box, Skeleton, SkeletonText, SkeletonCircle, VStack, HStack } from '@chakra-ui/react'

export interface SkeletonCardProps {
  hasImage?: boolean
  hasAvatar?: boolean
  lines?: number
  spacing?: string | number
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  hasImage = true,
  hasAvatar = false,
  lines = 3,
  spacing = 4
}) => {
  return (
    <Box p={spacing} borderRadius="md" bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
      <VStack align="stretch" spacing={spacing}>
        {hasImage && (
          <Skeleton height="200px" borderRadius="md" />
        )}
        
        {hasAvatar && (
          <HStack spacing={3}>
            <SkeletonCircle size="12" />
            <VStack align="start" flex={1} spacing={2}>
              <Skeleton height="4" width="40%" />
              <Skeleton height="3" width="60%" />
            </VStack>
          </HStack>
        )}
        
        <SkeletonText noOfLines={lines} spacing={2} skeletonHeight="4" />
      </VStack>
    </Box>
  )
}

export interface SkeletonListProps {
  items?: number
  hasAvatar?: boolean
  spacing?: string | number
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  items = 5,
  hasAvatar = false,
  spacing = 4
}) => {
  return (
    <VStack spacing={spacing} align="stretch">
      {Array.from({ length: items }).map((_, index) => (
        <Box key={index} p={4} borderRadius="md" bg="white" shadow="sm">
          <HStack spacing={3}>
            {hasAvatar && <SkeletonCircle size="10" />}
            <VStack align="start" flex={1} spacing={2}>
              <Skeleton height="4" width="70%" />
              <Skeleton height="3" width="50%" />
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}

export interface SkeletonGridProps {
  columns?: number
  items?: number
  hasImage?: boolean
  spacing?: string | number
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  columns = 3,
  items = 6,
  hasImage = true,
  spacing = 4
}) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${columns}, 1fr)`}
      gap={spacing}
    >
      {Array.from({ length: items }).map((_, index) => (
        <Box key={index} p={4} borderRadius="md" bg="white" shadow="sm">
          <VStack spacing={3}>
            {hasImage && <Skeleton height="150px" borderRadius="md" />}
            <SkeletonText noOfLines={2} spacing={2} skeletonHeight="4" />
          </VStack>
        </Box>
      ))}
    </Box>
  )
}

export interface SkeletonHeroProps {
  hasImage?: boolean
  hasButton?: boolean
}

export const SkeletonHero: React.FC<SkeletonHeroProps> = ({
  hasImage = true,
  hasButton = true
}) => {
  return (
    <Box p={8} textAlign="center">
      <VStack spacing={6}>
        <VStack spacing={4}>
          <Skeleton height="8" width="60%" />
          <Skeleton height="6" width="80%" />
          <SkeletonText noOfLines={3} spacing={2} skeletonHeight="4" />
        </VStack>
        
        {hasButton && (
          <HStack spacing={4}>
            <Skeleton height="12" width="32" borderRadius="md" />
            <Skeleton height="12" width="32" borderRadius="md" />
          </HStack>
        )}
        
        {hasImage && (
          <Skeleton height="400px" width="100%" borderRadius="lg" />
        )}
      </VStack>
    </Box>
  )
}

export interface SkeletonNavbarProps {
  hasLogo?: boolean
  menuItems?: number
}

export const SkeletonNavbar: React.FC<SkeletonNavbarProps> = ({
  hasLogo = true,
  menuItems = 5
}) => {
  return (
    <Box p={4} bg="white" shadow="sm" borderBottom="1px solid" borderColor="gray.200">
      <HStack justify="space-between">
        {hasLogo && <Skeleton height="8" width="32" />}
        
        <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
          {Array.from({ length: menuItems }).map((_, index) => (
            <Skeleton key={index} height="4" width="16" />
          ))}
        </HStack>
        
        <Skeleton height="8" width="8" borderRadius="md" display={{ base: 'block', md: 'none' }} />
      </HStack>
    </Box>
  )
}

export interface SkeletonFooterProps {
  columns?: number
}

export const SkeletonFooter: React.FC<SkeletonFooterProps> = ({
  columns = 4
}) => {
  return (
    <Box p={8} bg="gray.50" borderTop="1px solid" borderColor="gray.200">
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', md: `repeat(${columns}, 1fr)` }}
        gap={8}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <VStack key={index} align="start" spacing={3}>
            <Skeleton height="5" width="24" />
            <VStack align="start" spacing={2}>
              {Array.from({ length: 4 }).map((_, linkIndex) => (
                <Skeleton key={linkIndex} height="4" width="20" />
              ))}
            </VStack>
          </VStack>
        ))}
      </Box>
      
      <Box mt={8} pt={4} borderTop="1px solid" borderColor="gray.300">
        <HStack justify="space-between">
          <Skeleton height="4" width="40" />
          <HStack spacing={4}>
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCircle key={index} size="8" />
            ))}
          </HStack>
        </HStack>
      </Box>
    </Box>
  )
}

export interface SkeletonVideoProps {
  aspectRatio?: number
  hasControls?: boolean
}

export const SkeletonVideo: React.FC<SkeletonVideoProps> = ({
  aspectRatio = 16 / 9,
  hasControls = true
}) => {
  return (
    <Box position="relative" borderRadius="md" overflow="hidden">
      <Box
        width="100%"
        height={0}
        paddingBottom={`${(1 / aspectRatio) * 100}%`}
        position="relative"
      >
        <Skeleton
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
        />
        
        {/* Play button overlay */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={2}
        >
          <SkeletonCircle size="16" />
        </Box>
        
        {/* Controls overlay */}
        {hasControls && (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={4}
            bg="linear-gradient(transparent, rgba(0,0,0,0.7))"
          >
            <HStack spacing={3}>
              <SkeletonCircle size="8" />
              <SkeletonCircle size="8" />
              <Skeleton height="2" flex={1} borderRadius="full" />
              <SkeletonCircle size="8" />
            </HStack>
          </Box>
        )}
      </Box>
    </Box>
  )
}
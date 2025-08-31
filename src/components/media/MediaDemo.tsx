'use client'

import { Box, Heading, Text, VStack, SimpleGrid, Code, Button, HStack } from '@chakra-ui/react'
import { 
  OptimizedImage, 
  OptimizedVideo, 
  OptimizedYouTubePlayer,
  LazySection,
  LazyComponent,
  ProgressiveImage,
  SkeletonCard,
  SkeletonGrid,
  SkeletonHero,
  useLazyLoading,
  CalendlyPopup,
  ScriptLoader
} from './index'

/**
 * Demo component to showcase the optimized media components
 * This demonstrates all the features implemented in task 2.1
 */
export const MediaDemo = () => {
  return (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={12} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Optimized Media Components Demo
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Showcasing OptimizedImage, OptimizedVideo, and OptimizedYouTubePlayer components
          </Text>
        </Box>

        {/* OptimizedImage Demo */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            OptimizedImage Component
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
              <Text fontWeight="bold" mb={4}>Features:</Text>
              <VStack align="start" spacing={2}>
                <Text>• Next.js Image optimization with WebP/AVIF support</Text>
                <Text>• Lazy loading by default</Text>
                <Text>• Automatic fallback handling</Text>
                <Text>• Loading skeleton</Text>
                <Text>• Responsive sizing</Text>
                <Text>• Error boundaries with custom fallbacks</Text>
              </VStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={4}>Example:</Text>
              <OptimizedImage
                src="/lexlogo.png"
                alt="Lex Consulting Logo"
                width={300}
                height={100}
                style={{ objectFit: 'contain' }}
                containerProps={{
                  border: '1px solid',
                  borderColor: 'gray.200',
                  borderRadius: 'md',
                  p: 4
                }}
              />
              <Code mt={2} p={2} display="block" fontSize="sm">
                {`<OptimizedImage
  src="/lexlogo.png"
  alt="Lex Consulting Logo"
  width={300}
  height={100}
  lazy={true}
  fallback={<CustomFallback />}
/>`}
              </Code>
            </Box>
          </SimpleGrid>
        </Box>

        {/* OptimizedVideo Demo */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            OptimizedVideo Component
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
              <Text fontWeight="bold" mb={4}>Features:</Text>
              <VStack align="start" spacing={2}>
                <Text>• Lazy loading with Intersection Observer</Text>
                <Text>• Custom controls overlay</Text>
                <Text>• Fallback mechanisms for failed loads</Text>
                <Text>• Responsive aspect ratios</Text>
                <Text>• Loading states and skeletons</Text>
                <Text>• Play/pause and mute controls</Text>
              </VStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={4}>Example:</Text>
              <OptimizedVideo
                src="/loop.mp4"
                poster="/lexhero.png"
                width="100%"
                aspectRatio={16/9}
                muted={true}
                loop={true}
                controls={true}
                lazy={true}
                containerProps={{
                  border: '1px solid',
                  borderColor: 'gray.200',
                  borderRadius: 'md'
                }}
              />
              <Code mt={2} p={2} display="block" fontSize="sm">
                {`<OptimizedVideo
  src="/loop.mp4"
  poster="/lexhero.png"
  aspectRatio={16/9}
  lazy={true}
  controls={true}
/>`}
              </Code>
            </Box>
          </SimpleGrid>
        </Box>

        {/* OptimizedYouTubePlayer Demo */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            OptimizedYouTubePlayer Component
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
              <Text fontWeight="bold" mb={4}>Features:</Text>
              <VStack align="start" spacing={2}>
                <Text>• Optimized YouTube thumbnail loading</Text>
                <Text>• Multiple thumbnail quality options</Text>
                <Text>• Fallback thumbnail support</Text>
                <Text>• Custom play button overlay</Text>
                <Text>• Responsive design</Text>
                <Text>• Lazy iframe loading</Text>
              </VStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={4}>Example:</Text>
              <OptimizedYouTubePlayer
                videoId="796cT8bt1P8"
                title="Lex Consulting Introduction"
                maxWidth="400px"
                aspectRatio={16/9}
                thumbnailQuality="high"
                showTitle={true}
                containerProps={{
                  border: '1px solid',
                  borderColor: 'gray.200',
                  borderRadius: 'md'
                }}
              />
              <Code mt={2} p={2} display="block" fontSize="sm">
                {`<OptimizedYouTubePlayer
  videoId="796cT8bt1P8"
  title="Lex Consulting Introduction"
  thumbnailQuality="high"
  showTitle={true}
/>`}
              </Code>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Lazy Loading Demo */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            Lazy Loading System
          </Heading>
          
          {/* LazySection Demo */}
          <Box mb={8}>
            <Text fontWeight="bold" mb={4}>LazySection Component:</Text>
            <LazySection
              fallback={<SkeletonHero hasImage hasButton />}
              threshold={0.1}
            >
              <Box textAlign="center" p={8} bg="green.50" borderRadius="md">
                <Heading size="md" mb={4}>This content loaded lazily!</Heading>
                <Text mb={4}>
                  This section only renders when it comes into view, improving initial page load performance.
                </Text>
                <HStack justify="center">
                  <Button colorScheme="green" size="sm">Action 1</Button>
                  <Button variant="outline" size="sm">Action 2</Button>
                </HStack>
              </Box>
            </LazySection>
          </Box>

          {/* Progressive Image Demo */}
          <Box mb={8}>
            <Text fontWeight="bold" mb={4}>Progressive Image Loading:</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <Box>
                <Text fontSize="sm" mb={2}>Standard OptimizedImage:</Text>
                <OptimizedImage
                  src="/lexlogo.png"
                  alt="Standard loading"
                  width={200}
                  height={100}
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <Box>
                <Text fontSize="sm" mb={2}>Progressive Loading:</Text>
                <ProgressiveImage
                  src="/lexlogo.png"
                  lowQualitySrc="/lexlogo.png?w=50&q=20"
                  alt="Progressive loading"
                  width={200}
                  height={100}
                  progressiveLoading
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </SimpleGrid>
          </Box>

          {/* Lazy Grid Demo */}
          <Box mb={8}>
            <Text fontWeight="bold" mb={4}>Lazy Loaded Grid:</Text>
            <LazySection
              fallback={<SkeletonGrid columns={3} items={6} />}
              threshold={0.1}
            >
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <LazyComponent
                    key={index}
                    fallback={<SkeletonCard hasImage lines={2} />}
                    threshold={0.2}
                  >
                    <Box p={4} bg="white" borderRadius="md" shadow="sm" border="1px solid" borderColor="gray.200">
                      <OptimizedImage
                        src={`/${(index % 10) + 1}.png`}
                        alt={`Demo image ${index + 1}`}
                        width={200}
                        height={120}
                        lazy
                        style={{ objectFit: 'cover' }}
                      />
                      <Text mt={3} fontWeight="bold">Card {index + 1}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Lazy loaded content
                      </Text>
                    </Box>
                  </LazyComponent>
                ))}
              </SimpleGrid>
            </LazySection>
          </Box>
        </Box>

        {/* Script Loading Demo */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            On-Demand Script Loading
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            <Box>
              <Text fontWeight="bold" mb={4}>Calendly Integration:</Text>
              <Text fontSize="sm" mb={4}>
                Scripts load only when needed, improving initial page performance.
              </Text>
              <CalendlyPopup 
                url="https://calendly.com/d/cq4j-vcb-th4"
                onError={(error) => {
                  console.error('Demo Calendly error:', error)
                }}
              >
                {({ onClick, isLoading, hasError }) => (
                  <Button 
                    colorScheme="blue" 
                    onClick={onClick}
                    isLoading={isLoading}
                    loadingText="Loading Calendly..."
                    isDisabled={hasError}
                  >
                    {hasError ? 'Calendly Unavailable' : 'Schedule Demo Call'}
                  </Button>
                )}
              </CalendlyPopup>
            </Box>
            
            <Box>
              <Text fontWeight="bold" mb={4}>Custom Script Loader:</Text>
              <Text fontSize="sm" mb={4}>
                Generic script loader with integrity checks and error handling.
              </Text>
              <ScriptLoader
                src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
                crossOrigin="anonymous"
                fallback={<Text fontSize="sm">Loading external library...</Text>}
                errorFallback={<Text fontSize="sm" color="red.500">Failed to load library</Text>}
              >
                {({ isLoaded, isLoading, hasError }) => (
                  <Box p={3} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm">
                      Status: {isLoading ? 'Loading...' : isLoaded ? 'Loaded ✓' : hasError ? 'Error ✗' : 'Not loaded'}
                    </Text>
                    {isLoaded && (
                      <Text fontSize="xs" color="green.600">
                        Lodash library ready for use
                      </Text>
                    )}
                  </Box>
                )}
              </ScriptLoader>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Performance Benefits */}
        <Box bg="blue.50" p={6} borderRadius="md">
          <Heading as="h3" size="md" mb={4} color="blue.800">
            Performance Benefits
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <VStack align="start">
              <Text fontWeight="bold" color="blue.700">Image Optimization:</Text>
              <Text fontSize="sm">• Automatic WebP/AVIF format conversion</Text>
              <Text fontSize="sm">• Responsive image sizing</Text>
              <Text fontSize="sm">• Lazy loading reduces initial bundle</Text>
              <Text fontSize="sm">• Quality optimization (85% default)</Text>
              <Text fontSize="sm">• Progressive loading for better UX</Text>
            </VStack>
            <VStack align="start">
              <Text fontWeight="bold" color="blue.700">Lazy Loading System:</Text>
              <Text fontSize="sm">• Intersection Observer API</Text>
              <Text fontSize="sm">• Configurable thresholds and margins</Text>
              <Text fontSize="sm">• Skeleton loading states</Text>
              <Text fontSize="sm">• Batch loading for performance</Text>
              <Text fontSize="sm">• Custom fallback components</Text>
            </VStack>
            <VStack align="start">
              <Text fontWeight="bold" color="blue.700">Script Loading:</Text>
              <Text fontSize="sm">• On-demand external script loading</Text>
              <Text fontSize="sm">• Integrity checks for security</Text>
              <Text fontSize="sm">• Error handling and fallbacks</Text>
              <Text fontSize="sm">• Prevents blocking initial page load</Text>
              <Text fontSize="sm">• Caching to prevent duplicate loads</Text>
            </VStack>
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  )
}
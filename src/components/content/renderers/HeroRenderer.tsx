'use client';

import React from 'react';
import { Box, Container, Flex, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FaArrowRight, FaPhoneAlt } from 'react-icons/fa';
import Link from 'next/link';
import { ContentRenderProps } from '@/types/content';
import { useAsset } from '@/providers/ContentProvider';
import { OptimizedImage, OptimizedYouTubePlayer } from '@/components/media';

interface HeroContent {
  backgroundImage?: string;
  video?: string;
  ctas?: Array<{
    id: string;
    text: string;
    href: string;
    variant: 'primary' | 'secondary' | 'outline';
    icon?: string;
    ariaLabel?: string;
  }>;
  overlay?: {
    gradient: string;
    opacity: number;
  };
  capacityStatus?: {
    status: string;
    message: string;
  };
}

const iconMap = {
  FaArrowRight,
  FaPhoneAlt,
};

export function HeroRenderer({ content, title, subtitle }: ContentRenderProps & { content: HeroContent }) {
  const backgroundAsset = useAsset(content.backgroundImage || '');
  const videoAsset = useAsset(content.video || '');

  const getIcon = (iconName?: string) => {
    if (!iconName || !iconMap[iconName as keyof typeof iconMap]) return null;
    return iconMap[iconName as keyof typeof iconMap];
  };

  return (
    <Box 
      color="white"
      position="relative"
      overflow="hidden"
      minH={{ base: '80vh', md: '85vh', lg: '90vh' }}
      display="flex"
      alignItems="center"
    >
      {backgroundAsset && (
        <Box position="absolute" inset="0" zIndex={0}>
          <OptimizedImage
            src={backgroundAsset.src}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={72}
            lazy={false}
            unoptimized={false}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            containerProps={{ width: '100%', height: '100%' }}
          />
        </Box>
      )}
      {/* Overlay */}
      {content.overlay && (
        <Box 
          position="absolute" 
          top="0" 
          left="0" 
          width="100%" 
          height="100%" 
          bgGradient={content.overlay.gradient}
          opacity={content.overlay.opacity}
          zIndex="1"
        />
      )}

      {/* Hero Content */}
      <Container maxW="container.xl" position="relative" zIndex={2} py={{ base: 8, md: 12 }} w="100%">
        <Flex 
          direction={{ base: 'column', lg: 'row' }} 
          align="center" 
          justify="space-between"
          gap={{ base: 8, lg: 12 }}
          minH={{ base: 'auto', lg: '50vh' }}
          w="100%"
        >
          {/* Left Content - Text and Buttons */}
          <Box 
            flex="1" 
            maxW={{ base: '100%', lg: '55%' }} 
            mb={{ base: 8, lg: 0 }}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            <Box
              display="inline-block"
              position="relative"
              mb={6}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.400"
                backdropFilter="blur(8px)"
                borderRadius="lg"
                zIndex={-1}
                transform="scaleX(1.02) scaleY(1.1)"
              />
              <Heading 
                as="h1" 
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="bold" 
                fontFamily="heading"
                letterSpacing="wide"
                p={3}
                lineHeight="shorter"
              >
                {title}
              </Heading>
            </Box>
            
            <Text 
              fontSize={{ base: 'lg', md: 'xl' }}
              mb={8} 
              color="white" 
              fontFamily="body"
              lineHeight="relaxed"
              textShadow="0 1px 3px rgba(0,0,0,0.9)"
              bg="blackAlpha.200"
              p={4}
              borderRadius="md"
            >
              {subtitle}
            </Text>

            {/* Capacity Status Badge */}
            {content.capacityStatus && (
              <Box mb={6} textAlign="center">
                <Box
                  display="inline-block"
                  bg={content.capacityStatus.status === 'Limited' ? 'orange.500' : 'green.500'}
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="md"
                  fontWeight="600"
                  boxShadow="0 2px 6px rgba(0,0,0,0.2)"
                >
                  {content.capacityStatus.message}
                </Box>
              </Box>
            )}

            {/* CTA Buttons */}
            {content.ctas && (
              <Flex 
                direction={{ base: 'column', sm: 'row' }} 
                gap={{ base: 3, sm: 4 }}
                justify={{ base: 'center', lg: 'flex-start' }}
                align="center"
                width="100%"
                maxW={{ base: '100%', sm: '500px', lg: '100%' }}
                mx={{ base: 'auto', lg: '0' }}
              >
                {content.ctas.map((cta) => {
                  const IconComponent = getIcon(cta.icon);
                  
                  return (
                    <Link key={cta.id} href={cta.href} style={{ textDecoration: 'none', flex: '1' }}>
                      <Button 
                        bg={cta.variant === 'primary' ? 'brand.accent' : 'transparent'}
                        color="white"
                        variant={cta.variant === 'outline' ? 'outline' : 'solid'}
                        borderColor={cta.variant === 'outline' ? 'white' : undefined}
                        borderWidth={cta.variant === 'outline' ? '2px' : undefined}
                        size="lg"
                        fontFamily="mono"
                        fontWeight="600"
                        px={6}
                        borderRadius="full"
                        shadow="lg"
                        width="100%"
                        _hover={{
                          bg: cta.variant === 'primary' ? "blue.600" : "whiteAlpha.200",
                          transform: "translateY(-2px)",
                          shadow: "xl"
                        }}
                        _active={{
                          bg: cta.variant === 'primary' ? "blue.700" : "whiteAlpha.100",
                          transform: "translateY(0)",
                          shadow: "md"
                        }}
                        _focus={{
                          outline: "2px solid white",
                          outlineOffset: "2px"
                        }}
                        transition="all 0.2s ease"
                        aria-label={cta.ariaLabel}
                      >
                        {IconComponent && cta.variant === 'outline' && (
                          <Icon as={IconComponent} mr={2} aria-hidden="true" />
                        )}
                        {cta.text}
                        {IconComponent && cta.variant === 'primary' && (
                          <Icon as={IconComponent} ml={2} aria-hidden="true" />
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </Flex>
            )}
          </Box>
          
          {/* Right Content - Video Player */}
          {videoAsset && (
            <Box 
              flex="1" 
              maxW={{ base: '100%', lg: '45%' }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              w="100%"
            >
              <Box w="100%" maxW={{ base: "400px", md: "450px", lg: "500px" }}>
                <OptimizedYouTubePlayer
                  videoId={videoAsset.videoId || ''}
                  title="Lex Consulting Introduction"
                  maxWidth="100%"
                  aspectRatio={videoAsset.aspectRatio || 16/9}
                  thumbnailQuality="maxres"
                  showTitle={true}
                  autoPlay={true}
                />
              </Box>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
}

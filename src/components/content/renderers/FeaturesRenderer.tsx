'use client';

import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Icon, VStack } from '@chakra-ui/react';
import { FaChartLine, FaChartPie, FaHandshake, FaGraduationCap, FaBalanceScale, FaSearch, FaBook, FaLightbulb } from 'react-icons/fa';
import { ContentRenderProps, FeatureCard } from '@/types/content';
import { useAsset } from '@/providers/ContentProvider';
import { OptimizedImage } from '@/components/media';

interface FeaturesContent {
  features: FeatureCard[];
}

const iconMap = {
  FaChartLine,
  FaChartPie,
  FaHandshake,
  FaGraduationCap,
  FaBalanceScale,
  FaSearch,
  FaBook,
  FaLightbulb,
};

export function FeaturesRenderer({ content, title, subtitle }: ContentRenderProps & { content: FeaturesContent }) {
  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || FaChartLine;
  };

  return (
    <Box py={{ base: 12, md: 16, lg: 20 }}>
      <Container maxW="container.xl">
        <Box textAlign="center" mb={{ base: 8, md: 12 }}>
          {title && (
            <Heading 
              as="h2" 
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontFamily="heading" 
              mb={4}
              color="brand.900"
            >
              {title}
            </Heading>
          )}
          
          {subtitle && (
            <Text 
              maxW="container.md" 
              fontSize={{ base: 'md', md: 'lg' }} 
              color="gray.600" 
              fontFamily="body" 
              mx="auto"
              lineHeight="relaxed"
            >
              {subtitle}
            </Text>
          )}
        </Box>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 6, md: 8, lg: 10 }}>
          {content.features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} getIcon={getIcon} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

interface FeatureCardProps {
  feature: FeatureCard & { image?: string };
  getIcon: (iconName: string) => any;
}

function FeatureCard({ feature, getIcon }: FeatureCardProps) {
  const IconComponent = getIcon(feature.icon);
  const imageAsset = useAsset(feature.image || '');

  return (
    <Box 
      p={{ base: 4, md: 6 }} 
      bg="white" 
      borderRadius="xl" 
      shadow="md" 
      height="100%" 
      display="flex" 
      flexDirection="column" 
      alignItems="center"
      textAlign="center"
      transition="all 0.2s"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
    >
      {imageAsset ? (
        <Box mb={4} position="relative">
          <OptimizedImage
            src={imageAsset.src}
            alt={imageAsset.alt}
            width={imageAsset.width || 180}
            height={imageAsset.height || 180}
          />
        </Box>
      ) : (
        <Icon as={IconComponent} w={10} h={10} color="brand.accent" mb={4} aria-hidden="true" />
      )}
      
      <Heading as="h3" size="md" mb={3} fontFamily="heading" color="brand.900">
        {feature.title}
      </Heading>
      
      <Text color="gray.600" fontFamily="body" lineHeight="relaxed">
        {feature.description}
      </Text>
    </Box>
  );
}
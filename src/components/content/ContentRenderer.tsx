'use client';

import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { ContentSection, ContentRenderers } from '@/types/content';
import { useAsset } from '@/providers/ContentProvider';

// Import section renderers
import { HeroRenderer } from './renderers/HeroRenderer';
import { FeaturesRenderer } from './renderers/FeaturesRenderer';
import { ServicesRenderer } from './renderers/ServicesRenderer';
import { TeamRenderer } from './renderers/TeamRenderer';
import { TestimonialsRenderer } from './renderers/TestimonialsRenderer';
import { FAQRenderer } from './renderers/FAQRenderer';
import { CTARenderer } from './renderers/CTARenderer';
import { TextRenderer } from './renderers/TextRenderer';

interface ContentRendererProps {
  section: ContentSection;
  className?: string;
}

// Registry of content renderers
const renderers: ContentRenderers = {
  hero: HeroRenderer,
  features: FeaturesRenderer,
  services: ServicesRenderer,
  team: TeamRenderer,
  testimonials: TestimonialsRenderer,
  faq: FAQRenderer,
  cta: CTARenderer,
  text: TextRenderer,
};

export function ContentRenderer({ section, className }: ContentRendererProps) {
  const Renderer = renderers[section.type];
  
  if (!Renderer) {
    // Fallback for unknown section types
    return (
      <Box className={className} py={8}>
        <VStack gap={4} textAlign="center">
          <Heading size="md" color="red.500">
            Unknown Section Type: {section.type}
          </Heading>
          <Text color="gray.600">
            Section ID: {section.id}
          </Text>
        </VStack>
      </Box>
    );
  }

  // Apply section background and spacing
  const sectionStyles = {
    ...(section.background?.color && { bg: section.background.color }),
    ...(section.background?.gradient && { bgGradient: section.background.gradient }),
    ...(section.spacing?.paddingTop && { pt: section.spacing.paddingTop }),
    ...(section.spacing?.paddingBottom && { pb: section.spacing.paddingBottom }),
  };

  return (
    <Box className={className} {...sectionStyles}>
      <Renderer content={section.content} title={section.title} subtitle={section.subtitle} />
    </Box>
  );
}

// Helper component for rendering background images
export function SectionBackground({ section }: { section: ContentSection }) {
  const backgroundImage = section.background?.image;
  const asset = useAsset(backgroundImage || '');
  
  if (!asset) return null;
  
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundImage={`url(${asset.src})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      zIndex={-1}
    />
  );
}
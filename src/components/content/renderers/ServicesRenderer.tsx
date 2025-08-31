'use client';

import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { ContentRenderProps, ServicePlan } from '@/types/content';

interface ServicesContent {
  plans: ServicePlan[];
}

export function ServicesRenderer({ content, title, subtitle }: ContentRenderProps & { content: ServicesContent }) {
  return (
    <Box py={{ base: 12, md: 16 }}>
      <Container maxW="container.xl">
        <VStack gap={8} alignItems="center" textAlign="center">
          {title && (
            <Heading 
              as="h2" 
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontFamily="heading" 
              color="brand.900"
            >
              {title}
            </Heading>
          )}
          
          {subtitle && (
            <Text 
              fontSize={{ base: 'md', md: 'lg' }} 
              color="gray.600" 
              fontFamily="body" 
              maxW="container.md"
              lineHeight="relaxed"
            >
              {subtitle}
            </Text>
          )}

          {/* Service plans would be rendered here */}
          <Text color="gray.500" fontStyle="italic">
            Service plans rendering - to be implemented with existing service card logic
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
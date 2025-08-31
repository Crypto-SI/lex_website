'use client';

import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { ContentRenderProps, Testimonial } from '@/types/content';

interface TestimonialsContent {
  testimonials: Testimonial[];
}

export function TestimonialsRenderer({ content, title }: ContentRenderProps & { content: TestimonialsContent }) {
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

          {/* Testimonials would be rendered here */}
          <Text color="gray.500" fontStyle="italic">
            Testimonials rendering - to be implemented with existing testimonial card logic
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
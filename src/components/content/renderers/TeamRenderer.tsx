'use client';

import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { ContentRenderProps, TeamMember } from '@/types/content';

interface TeamContent {
  members: TeamMember[];
}

export function TeamRenderer({ content, title, subtitle }: ContentRenderProps & { content: TeamContent }) {
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

          {/* Team members would be rendered here */}
          <Text color="gray.500" fontStyle="italic">
            Team members rendering - to be implemented with existing team card logic
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
'use client';

import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { ContentRenderProps } from '@/types/content';

interface TextContent {
  paragraphs?: string[];
  content?: string;
}

export function TextRenderer({ content, title, subtitle }: ContentRenderProps & { content: TextContent }) {
  return (
    <Box py={{ base: 12, md: 16, lg: 20 }}>
      <Container maxW="container.xl">
        <VStack gap={8} alignItems="center" textAlign="center" maxW="container.lg" mx="auto">
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
              lineHeight="relaxed"
            >
              {subtitle}
            </Text>
          )}

          {content.paragraphs && (
            <VStack gap={6} alignItems="flex-start" textAlign="left" width="100%">
              {content.paragraphs.map((paragraph, index) => (
                <Text 
                  key={index}
                  fontSize="lg" 
                  color="gray.600" 
                  fontFamily="body" 
                  lineHeight="relaxed"
                  maxW="container.md" 
                  mx="auto"
                >
                  {paragraph}
                </Text>
              ))}
            </VStack>
          )}

          {content.content && (
            <Text 
              fontSize="lg" 
              color="gray.600" 
              fontFamily="body" 
              lineHeight="relaxed"
              maxW="container.md" 
              mx="auto"
              textAlign="left"
            >
              {content.content}
            </Text>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
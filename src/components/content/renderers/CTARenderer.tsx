'use client';

import React from 'react';
import { Box, Container, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { ContentRenderProps, CTAButton } from '@/types/content';

interface CTAContent {
  description: string;
  subdescription?: string;
  cta: CTAButton;
  calendlyUrl?: string;
}

export function CTARenderer({ content, title }: ContentRenderProps & { content: CTAContent }) {
  return (
    <Box py={{ base: 12, md: 16 }}>
      <Container maxW="container.xl">
        <Box 
          py={12} 
          px={{ base: 8, md: 12 }} 
          bg="white" 
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
          position="relative"
          overflow="hidden"
          transition="all 0.3s ease"
          maxW="container.lg"
          mx="auto"
        >
          <VStack gap={8} alignItems="center" textAlign="center" position="relative" zIndex={1}>
            {title && (
              <Heading as="h3" size="xl" fontFamily="heading" color="brand.900">
                {title}
              </Heading>
            )}
            
            <Text fontFamily="body" fontSize="xl" color="gray.600" maxW="container.md" mx="auto">
              {content.description}
            </Text>
            
            {content.subdescription && (
              <Text fontFamily="body" fontSize="lg" color="gray.600" maxW="container.md" mx="auto">
                {content.subdescription}
              </Text>
            )}
            
            <Link href={content.cta.href} style={{ textDecoration: 'none' }}>
              <Button 
                variant={content.cta.variant === 'outline' ? 'outline' : 'solid'}
                borderColor={content.cta.variant === 'outline' ? 'brand.900' : undefined}
                color={content.cta.variant === 'outline' ? 'brand.900' : 'white'}
                bg={content.cta.variant === 'outline' ? 'transparent' : 'brand.900'}
                borderWidth={content.cta.variant === 'outline' ? '2px' : undefined}
                size="lg"
                fontFamily="body"
                fontWeight="600"
                px={8}
                py={6}
                fontSize="lg"
                _hover={{
                  bg: content.cta.variant === 'outline' ? 'brand.50' : 'brand.800',
                  transform: "translateY(-2px)",
                  boxShadow: "lg"
                }}
                _active={{
                  transform: "translateY(0)"
                }}
                transition="all 0.2s ease"
                aria-label={content.cta.ariaLabel}
              >
                {content.cta.text}
                {content.cta.icon && (
                  <Icon as={FaArrowRight} ml={2} aria-hidden="true" />
                )}
              </Button>
            </Link>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
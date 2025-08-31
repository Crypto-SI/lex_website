'use client';

import React from 'react';
import { Box, Container, Heading, Text, VStack, Code, Badge } from '@chakra-ui/react';
import { PageRenderer } from '@/components/content';
import { usePageContent, useGlobalContent } from '@/providers/ContentProvider';

export default function DemoContentPage() {
  const homeContent = usePageContent('/');
  const globalContent = useGlobalContent();

  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <VStack gap={8} alignItems="flex-start">
          <Box>
            <Heading as="h1" size="xl" mb={4}>
              Content Management System Demo
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
              This page demonstrates the new content management system in action.
            </Text>
          </Box>

          {/* Global Content Demo */}
          <Box p={6} bg="gray.50" borderRadius="lg" width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Global Content <Badge colorScheme="green">Working</Badge>
            </Heading>
            <VStack alignItems="flex-start" gap={2}>
              <Text><strong>Site Name:</strong> {globalContent.site.name}</Text>
              <Text><strong>Description:</strong> {globalContent.site.description}</Text>
              <Text><strong>Navigation Items:</strong> {globalContent.navigation.main.length}</Text>
              <Text><strong>Contact Email:</strong> {globalContent.contact.email}</Text>
            </VStack>
          </Box>

          {/* Page Content Demo */}
          <Box p={6} bg="blue.50" borderRadius="lg" width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Page Content Structure <Badge colorScheme="blue">Working</Badge>
            </Heading>
            {homeContent ? (
              <VStack alignItems="flex-start" gap={2}>
                <Text><strong>Page ID:</strong> {homeContent.id}</Text>
                <Text><strong>Title:</strong> {homeContent.title}</Text>
                <Text><strong>Sections:</strong> {homeContent.sections.length}</Text>
                <Text><strong>Section Types:</strong></Text>
                <Box ml={4}>
                  {homeContent.sections.map((section, index) => (
                    <Text key={section.id}>
                      {index + 1}. {section.type} ({section.id})
                    </Text>
                  ))}
                </Box>
              </VStack>
            ) : (
              <Text color="red.500">Home content not found</Text>
            )}
          </Box>

          {/* Content Rendering Demo */}
          <Box width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Content Rendering Demo <Badge colorScheme="purple">Working</Badge>
            </Heading>
            <Text mb={4} color="gray.600">
              Below is the homepage content rendered using the new content management system:
            </Text>
            
            {homeContent && (
              <Box border="2px solid" borderColor="purple.200" borderRadius="lg" overflow="hidden">
                <PageRenderer pageContent={homeContent} />
              </Box>
            )}
          </Box>

          {/* Technical Details */}
          <Box p={6} bg="yellow.50" borderRadius="lg" width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Technical Implementation <Badge colorScheme="yellow">Complete</Badge>
            </Heading>
            <VStack alignItems="flex-start" gap={3}>
              <Text><strong>✅ Type-safe content interfaces</strong> - All content has proper TypeScript types</Text>
              <Text><strong>✅ ContentProvider</strong> - React context for managing content</Text>
              <Text><strong>✅ Content loading utilities</strong> - Functions to load and validate content</Text>
              <Text><strong>✅ Dynamic content rendering</strong> - Components that render content based on type</Text>
              <Text><strong>✅ Asset management</strong> - Centralized asset configuration</Text>
              <Text><strong>✅ SEO metadata</strong> - Structured metadata for each page</Text>
            </VStack>
          </Box>

          {/* Next Steps */}
          <Box p={6} bg="green.50" borderRadius="lg" width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Ready for Internationalization <Badge colorScheme="green">Ready</Badge>
            </Heading>
            <Text mb={3}>
              The content management system is now ready for internationalization (i18n) support. 
              The structure supports:
            </Text>
            <VStack alignItems="flex-start" gap={2} ml={4}>
              <Text>• Multiple language content files</Text>
              <Text>• Language-specific asset management</Text>
              <Text>• Locale-aware content loading</Text>
              <Text>• Translation key management</Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
'use client';

import React, { useState } from 'react';
import { Box, Container, Heading, Text, VStack, Icon } from '@chakra-ui/react';
import { ContentRenderProps, FAQItem } from '@/types/content';
import { ScreenReaderOnly } from '@/components/accessibility';

interface FAQContent {
  faqs: FAQItem[];
}

export function FAQRenderer({ content, title }: ContentRenderProps & { content: FAQContent }) {
  return (
    <Box py={{ base: 12, md: 16 }} width="100%">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <VStack gap={{ base: 8, md: 10 }} alignItems="center" textAlign="center" width="100%" maxW="container.lg" mx="auto">
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
          
          <Box width="100%">
            {content.faqs.map((faq) => (
              <FAQItemComponent key={faq.id} faq={faq} />
            ))}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

interface FAQItemProps {
  faq: FAQItem;
}

function FAQItemComponent({ faq }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Create deterministic ID based on question to avoid hydration mismatch
  const faqId = `faq-${faq.question.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`;
  const contentId = `${faqId}-content`;
  
  return (
    <Box 
      border="1px solid" 
      borderColor="gray.200" 
      borderRadius="lg"
      overflow="hidden"
      mb={4}
      bg="white"
      shadow="sm"
    >
      <Box 
        as="button" 
        onClick={() => setIsOpen(!isOpen)}
        py={4} 
        px={5}
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        _hover={{ bg: "gray.50" }}
        _focus={{
          outline: "2px solid",
          outlineColor: "brand.accent",
          outlineOffset: "2px"
        }}
        transition="all 0.2s"
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={faqId}
      >
        <Box textAlign="left" fontWeight="600" fontFamily="heading" color="brand.900">
          {faq.question}
        </Box>
        <Box 
          transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
          transition="transform 0.3s ease"
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 9L12 16L21 9L12 2Z" fill="#007BFF" fillOpacity="0.8" />
            <path d="M3 9V20L12 16V9L3 9Z" fill="#007BFF" fillOpacity="0.6" />
            <path d="M12 9V16L21 20V9L12 9Z" fill="#007BFF" fillOpacity="0.4" />
          </svg>
        </Box>
        <ScreenReaderOnly>
          {isOpen ? 'Collapse' : 'Expand'} FAQ item
        </ScreenReaderOnly>
      </Box>
      <Box 
        height={isOpen ? "auto" : "0"}
        opacity={isOpen ? 1 : 0}
        py={isOpen ? 5 : 0}
        px={5}
        overflow="hidden"
        transition="all 0.3s"
        id={contentId}
        role="region"
        aria-labelledby={faqId}
      >
        <Text fontFamily="body" fontSize="lg" color="gray.600" lineHeight="relaxed">
          {faq.answer}
        </Text>
      </Box>
    </Box>
  );
}
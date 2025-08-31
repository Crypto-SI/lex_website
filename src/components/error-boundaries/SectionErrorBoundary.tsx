'use client'

import React from 'react';
import BaseErrorBoundary, { ErrorFallbackProps } from './BaseErrorBoundary';
import { Box, Text, Button, Icon, VStack } from '@chakra-ui/react';
import { FaSync, FaExclamationTriangle } from 'react-icons/fa';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
  fallbackHeight?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Custom fallback for section-level errors
const SectionErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  name 
}) => {
  return (
    <Box
      p={6}
      bg="orange.50"
      borderRadius="md"
      border="1px solid"
      borderColor="orange.200"
      my={4}
      textAlign="center"
    >
      <VStack gap={4}>
        <Box
          p={4}
          bg="orange.100"
          borderRadius="md"
          border="1px solid"
          borderColor="orange.200"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Icon as={FaExclamationTriangle} color="orange.500" />
          <Text fontWeight="semibold" color="orange.700">
            Section Error{name && ` - ${name}`}
          </Text>
        </Box>

        <VStack gap={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box as={FaExclamationTriangle} color="brand.accent" />
            <Text 
              fontSize="sm" 
              color="text.secondary"
              className="body-text"
            >
              This section couldn't load properly, but you can continue using the rest of the page.
            </Text>
          </Box>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && error && (
            <Box
              p={3}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="orange.300"
              textAlign="left"
              fontSize="xs"
              fontFamily="mono"
              maxW="100%"
              overflow="auto"
            >
              <Text fontWeight="bold" mb={2} color="orange.600">
                Dev Error:
              </Text>
              <Text color="red.500" mb={1}>
                {error.message}
              </Text>
              {error.stack && (
                <Text color="gray.600" fontSize="xs">
                  {error.stack.split('\n').slice(0, 5).join('\n')}
                  {error.stack.split('\n').length > 5 && '\n...'}
                </Text>
              )}
            </Box>
          )}

          <Button
            onClick={resetError}
            size="sm"
            variant="outline"
            borderColor="brand.accent"
            color="brand.accent"
            _hover={{
              bg: "brand.accent",
              color: "white"
            }}
          >
            <Box as={FaSync} mr={2} />
            Retry Section
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({ 
  children, 
  sectionName, 
  fallbackHeight,
  onError 
}) => {
  return (
    <BaseErrorBoundary
      level="section"
      name={sectionName}
      fallback={SectionErrorFallback}
      onError={onError}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default SectionErrorBoundary;
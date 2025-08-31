'use client'

import React from 'react';
import BaseErrorBoundary, { ErrorFallbackProps } from './BaseErrorBoundary';
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FaSync, FaHome, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  pageName?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Custom fallback for page-level errors
const PageErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError, name }) => {
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Box
      minH="60vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
      bg="bg.canvas"
    >
      <Box
        maxW="600px"
        w="100%"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={8}
        textAlign="center"
      >
        <VStack gap={6}>
          <Box
            p={4}
            bg="red.50"
            borderRadius="md"
            border="1px solid"
            borderColor="red.200"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={FaSync} color="red.500" />
            <Heading as="h2" size="md" color="red.600" className="heading-text">
              Page Error{name && ` - ${name}`}
            </Heading>
          </Box>

          <VStack gap={4}>
            <Heading 
              as="h1" 
              size="lg" 
              color="brand.primary"
              className="heading-text"
            >
              This page encountered an error
            </Heading>
            
            <Text 
              fontSize="md" 
              color="text.secondary"
              className="body-text"
              lineHeight="1.6"
            >
              We're sorry, but this page failed to load properly. This might be a temporary issue. 
              You can try refreshing the page, go back to the previous page, or return to our homepage.
            </Text>
          </VStack>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && error && (
            <Box
              p={4}
              bg="gray.50"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              textAlign="left"
              fontSize="sm"
              fontFamily="mono"
              maxW="100%"
              overflow="auto"
            >
              <Text fontWeight="bold" mb={2} color="red.600">
                Development Error Details:
              </Text>
              <Text color="red.500" mb={2} fontWeight="semibold">
                {error.message}
              </Text>
              {error.stack && (
                <Text color="gray.600" fontSize="xs" whiteSpace="pre-wrap">
                  {error.stack.split('\n').slice(0, 10).join('\n')}
                  {error.stack.split('\n').length > 10 && '\n... (truncated)'}
                </Text>
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <VStack gap={4} w="100%">
            <Button
              onClick={handleRefresh}
              bg="brand.accent"
              color="white"
              size="lg"
              w="100%"
              maxW="300px"
              _hover={{
                bg: "#0069d9",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0, 123, 255, 0.4)"
              }}
              _focus={{
                outline: "2px solid",
                outlineColor: "brand.accent",
                outlineOffset: "2px"
              }}
            >
              <FaSync style={{ marginRight: '8px' }} />
              Refresh Page
            </Button>

            <Box 
              display="flex" 
              gap={3} 
              flexWrap="wrap" 
              justifyContent="center"
              w="100%"
            >
              <Button
                onClick={handleGoBack}
                variant="outline"
                borderColor="brand.accent"
                color="brand.accent"
                _hover={{
                  bg: "brand.accent",
                  color: "white"
                }}
              >
                <FaArrowLeft style={{ marginRight: '8px' }} />
                Go Back
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                borderColor="var(--lex-slate-grey)"
                color="var(--lex-slate-grey)"
                _hover={{
                  bg: "var(--lex-slate-grey)",
                  color: "white"
                }}
              >
                <Box as={FaHome} mr={2} />
                Homepage
              </Button>
            </Box>
          </VStack>

          <Text 
            fontSize="xs" 
            color="gray.500"
            className="body-text"
          >
            If this problem continues, please contact our support team.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({ 
  children, 
  pageName, 
  onError 
}) => {
  return (
    <BaseErrorBoundary
      level="page"
      name={pageName}
      fallback={PageErrorFallback}
      onError={onError}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default PageErrorBoundary;
'use client'

import React from 'react';
import BaseErrorBoundary, { ErrorFallbackProps } from './BaseErrorBoundary';
import { Box, Heading, Text, Button, VStack, Container, Image } from '@chakra-ui/react';
import { FaSync, FaHome, FaEnvelope } from 'react-icons/fa';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Custom fallback for app-level errors
const AppErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleContact = () => {
    window.location.href = '/contact';
  };

  return (
    <Box
      minH="100vh"
      bg="var(--lex-off-white)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="container.md" textAlign="center">
        <VStack gap={8}>
          {/* Logo */}
          <Image
            src="/lexlogo.png"
            alt="Lex Consulting Logo"
            maxW="200px"
            h="auto"
          />

          {/* Error Message */}
          <VStack gap={4}>
            <Heading 
              as="h1" 
              size="xl" 
              color="var(--lex-deep-blue)"
              className="heading-text"
            >
              Oops! Something went wrong
            </Heading>
            
            <Text 
              fontSize="lg" 
              color="var(--lex-slate-grey)"
              className="body-text"
              maxW="500px"
            >
              We apologize for the inconvenience. Our application encountered an unexpected error. 
              Please try refreshing the page or contact us if the problem persists.
            </Text>
          </VStack>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && error && (
            <Box
              p={6}
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="red.200"
              textAlign="left"
              fontSize="sm"
              fontFamily="mono"
              maxW="100%"
              overflow="auto"
              boxShadow="base"
            >
              <Text fontWeight="bold" mb={3} color="red.600" fontSize="md">
                Development Error Details:
              </Text>
              <Text color="red.500" mb={3} fontWeight="semibold">
                {error.message}
              </Text>
              {error.stack && (
                <Text color="gray.600" fontSize="xs" whiteSpace="pre-wrap">
                  {error.stack}
                </Text>
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <VStack gap={4}>
            <Button
              onClick={handleRefresh}
              bg="var(--lex-insight-blue)"
              color="white"
              size="lg"
              _hover={{
                bg: "#0069d9",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0, 123, 255, 0.4)"
              }}
              _focus={{
                outline: "2px solid var(--lex-insight-blue)",
                outlineOffset: "2px"
              }}
            >
              <FaSync style={{ marginRight: '8px' }} />
              Refresh Page
            </Button>

            <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center">
              <Button
                onClick={handleGoHome}
                variant="outline"
                borderColor="var(--lex-insight-blue)"
                color="var(--lex-insight-blue)"
                _hover={{
                  bg: "var(--lex-insight-blue)",
                  color: "white"
                }}
              >
                <FaHome style={{ marginRight: '8px' }} />
                Go Home
              </Button>

              <Button
                onClick={handleContact}
                variant="outline"
                borderColor="var(--lex-slate-grey)"
                color="var(--lex-slate-grey)"
                _hover={{
                  bg: "var(--lex-slate-grey)",
                  color: "white"
                }}
              >
                <FaEnvelope style={{ marginRight: '8px' }} />
                Contact Support
              </Button>
            </Box>
          </VStack>

          {/* Additional Help Text */}
          <Text 
            fontSize="sm" 
            color="var(--lex-slate-grey)"
            className="body-text"
          >
            Error ID: {Date.now().toString(36)} • 
            If this error persists, please include this ID when contacting support.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children, onError }) => {
  return (
    <BaseErrorBoundary
      level="app"
      name="Application"
      fallback={AppErrorFallback}
      onError={onError}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default AppErrorBoundary;
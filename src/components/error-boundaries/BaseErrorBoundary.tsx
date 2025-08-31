'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FaSync, FaHome } from 'react-icons/fa';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface BaseErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level: 'app' | 'page' | 'section' | 'component';
  name?: string;
}

export interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  resetError: () => void;
  level: 'app' | 'page' | 'section' | 'component';
  name?: string;
}

class BaseErrorBoundary extends Component<BaseErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: BaseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for monitoring
    this.logError(error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level: this.props.level,
      name: this.props.name,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary Caught Error:', errorData);
    }

    // In production, you would send this to your error monitoring service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error monitoring service
      // errorMonitoringService.captureException(error, errorData);
    }
  };

  private resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          level={this.props.level}
          name={this.props.name}
        />
      );
    }

    return this.props.children;
  }
}

// Default fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  level, 
  name 
}) => {
  const getLevelConfig = () => {
    switch (level) {
      case 'app':
        return {
          title: 'Application Error',
          description: 'Something went wrong with the application. Please try refreshing the page.',
          showHome: true,
        };
      case 'page':
        return {
          title: 'Page Error',
          description: 'This page encountered an error. Please try refreshing or navigate to another page.',
          showHome: true,
        };
      case 'section':
        return {
          title: 'Section Error',
          description: 'This section of the page encountered an error. You can continue using other parts of the site.',
          showHome: false,
        };
      case 'component':
        return {
          title: 'Component Error',
          description: 'A component failed to load properly. This shouldn\'t affect the rest of the page.',
          showHome: false,
        };
      default:
        return {
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          showHome: false,
        };
    }
  };

  const config = getLevelConfig();
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleRefresh = () => {
    if (level === 'app' || level === 'page') {
      window.location.reload();
    } else {
      resetError();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Box
      p={6}
      textAlign="center"
      bg="white"
      borderRadius="lg"
      boxShadow="base"
      border="1px solid"
      borderColor="red.200"
      maxW="500px"
      mx="auto"
      my={8}
    >
      <VStack gap={4}>
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
          <Heading as="h3" size="md" color="red.600">
            {config.title}
            {name && ` - ${name}`}
          </Heading>
        </Box>

        <Text color="gray.600" fontSize="md">
          {config.description}
        </Text>

        {isDevelopment && error && (
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
              Error Details (Development Only):
            </Text>
            <Text color="red.500" mb={2}>
              {error.message}
            </Text>
            {error.stack && (
              <Text color="gray.600" fontSize="xs" whiteSpace="pre-wrap">
                {error.stack}
              </Text>
            )}
          </Box>
        )}

        <VStack gap={3}>
          <Button
            onClick={handleRefresh}
            colorScheme="blue"
            size="md"
          >
            <FaSync style={{ marginRight: '8px' }} />
            {level === 'app' || level === 'page' ? 'Refresh Page' : 'Try Again'}
          </Button>

          {config.showHome && (
            <Button
              onClick={handleGoHome}
              variant="outline"
              size="md"
            >
              <FaHome style={{ marginRight: '8px' }} />
              Go to Homepage
            </Button>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default BaseErrorBoundary;
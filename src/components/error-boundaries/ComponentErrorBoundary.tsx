'use client'

import React from 'react';
import BaseErrorBoundary, { ErrorFallbackProps } from './BaseErrorBoundary';
import { Box, Text, Button, Icon } from '@chakra-ui/react';
import { FaSync, FaExclamationCircle } from 'react-icons/fa';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
  minimal?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Custom fallback for component-level errors
const ComponentErrorFallback: React.FC<ErrorFallbackProps & { minimal?: boolean }> = ({ 
  error, 
  resetError, 
  name,
  minimal = false
}) => {
  if (minimal) {
    return (
      <Box
        p={2}
        bg="red.50"
        borderRadius="sm"
        border="1px solid"
        borderColor="red.200"
        display="inline-flex"
        alignItems="center"
        gap={2}
      >
        <Icon as={FaExclamationCircle} color="red.500" boxSize={3} />
        <Text fontSize="xs" color="red.600">
          Component failed
        </Text>
        <Button
          onClick={resetError}
          size="xs"
          variant="ghost"
          color="red.600"
          p={1}
          minW="auto"
          h="auto"
          _hover={{ bg: "red.100" }}
        >
          <FaSync size={10} />
        </Button>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      bg="red.50"
      borderRadius="md"
      border="1px dashed"
      borderColor="red.300"
      textAlign="center"
      maxW="300px"
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={3}>
        <Icon as={FaExclamationCircle} color="red.500" />
        <Text fontSize="sm" fontWeight="semibold" color="red.600">
          Component Error{name && ` - ${name}`}
        </Text>
      </Box>

      <Text fontSize="xs" color="red.500" mb={3}>
        This component failed to load properly.
      </Text>

      {/* Development Error Details */}
      {process.env.NODE_ENV === 'development' && error && (
        <Box
          p={2}
          bg="white"
          borderRadius="sm"
          border="1px solid"
          borderColor="red.200"
          textAlign="left"
          fontSize="xs"
          fontFamily="mono"
          mb={3}
          maxH="100px"
          overflow="auto"
        >
          <Text fontWeight="bold" color="red.600" mb={1}>
            {error.message}
          </Text>
          {error.stack && (
            <Text color="gray.600" fontSize="xs">
              {error.stack.split('\n').slice(0, 3).join('\n')}
            </Text>
          )}
        </Box>
      )}

      <Button
        onClick={resetError}
        size="xs"
        variant="outline"
        borderColor="red.400"
        color="red.600"
        _hover={{
          bg: "red.100"
        }}
      >
        <FaSync style={{ marginRight: '4px' }} />
        Retry
      </Button>
    </Box>
  );
};

const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({ 
  children, 
  componentName, 
  minimal = false,
  onError 
}) => {
  const CustomFallback: React.FC<ErrorFallbackProps> = (props) => (
    <ComponentErrorFallback {...props} minimal={minimal} />
  );

  return (
    <BaseErrorBoundary
      level="component"
      name={componentName}
      fallback={CustomFallback}
      onError={onError}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default ComponentErrorBoundary;
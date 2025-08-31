'use client';

import { Image, ImageProps, Box, Text } from '@chakra-ui/react';
import { useState } from 'react';

interface AccessibleImageProps extends Omit<ImageProps, 'alt'> {
  alt: string;
  decorative?: boolean;
  longDescription?: string;
  fallbackText?: string;
  onError?: () => void;
}

export const AccessibleImage: React.FC<AccessibleImageProps> = ({
  alt,
  decorative = false,
  longDescription,
  fallbackText = 'Image failed to load',
  onError,
  ...imageProps
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // For decorative images, use empty alt text
  const altText = decorative ? '' : alt;
  
  // Generate unique ID for aria-describedby if long description exists
  const descriptionId = longDescription ? `img-desc-${Math.random().toString(36).substr(2, 9)}` : undefined;

  if (hasError) {
    return (
      <Box
        role="img"
        aria-label={decorative ? undefined : alt}
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100px"
        p={4}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
      >
        <Text fontSize="sm" color="gray.600" textAlign="center">
          {fallbackText}
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Image
        {...imageProps}
        alt={altText}
        aria-describedby={descriptionId}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
      {longDescription && (
        <Text
          id={descriptionId}
          sr-only
          fontSize="sm"
        >
          {longDescription}
        </Text>
      )}
    </>
  );
};
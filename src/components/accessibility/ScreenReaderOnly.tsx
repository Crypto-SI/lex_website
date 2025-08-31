'use client';

import { Box, BoxProps } from '@chakra-ui/react';

interface ScreenReaderOnlyProps extends BoxProps {
  children: React.ReactNode;
}

/**
 * Component that renders content only for screen readers
 * Content is visually hidden but accessible to assistive technologies
 */
export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <Box
      position="absolute"
      width="1px"
      height="1px"
      padding="0"
      margin="-1px"
      overflow="hidden"
      clip="rect(0, 0, 0, 0)"
      whiteSpace="nowrap"
      border="0"
      {...props}
    >
      {children}
    </Box>
  );
};
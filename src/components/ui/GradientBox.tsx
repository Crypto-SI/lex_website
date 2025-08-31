import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface GradientBoxProps extends BoxProps {
  gradient?: 'primary' | 'secondary' | 'accent' | 'warm' | 'cool';
  direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
  children: React.ReactNode;
}

const GradientBox: React.FC<GradientBoxProps> = ({
  gradient = 'primary',
  direction = 'to-r',
  children,
  ...props
}) => {
  const gradients = {
    primary: `linear(${direction}, brand.500, brand.600)`,
    secondary: `linear(${direction}, gray.500, gray.600)`,
    accent: `linear(${direction}, blue.500, purple.600)`,
    warm: `linear(${direction}, orange.400, red.500)`,
    cool: `linear(${direction}, blue.400, teal.500)`,
  };

  return (
    <Box
      bgGradient={gradients[gradient]}
      {...props}
    >
      {children}
    </Box>
  );
};

export default GradientBox;
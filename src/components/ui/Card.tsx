import React from 'react';
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

interface CardProps extends BoxProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  variant = 'elevated', 
  children, 
  ...props 
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const filledBg = useColorModeValue('gray.50', 'gray.700');

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          bg,
          border: '1px solid',
          borderColor,
          shadow: 'none',
        };
      case 'filled':
        return {
          bg: filledBg,
          border: 'none',
          shadow: 'none',
        };
      case 'elevated':
      default:
        return {
          bg,
          border: 'none',
          shadow: 'md',
        };
    }
  };

  return (
    <Box
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      transition="all 0.2s ease-in-out"
      _hover={{
        shadow: variant === 'elevated' ? 'lg' : 'md',
        transform: 'translateY(-2px)',
      }}
      {...getVariantStyles()}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Card;
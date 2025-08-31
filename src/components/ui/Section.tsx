import React from 'react';
import { Box, Container, ContainerProps } from '@chakra-ui/react';

interface SectionProps extends Omit<ContainerProps, 'children'> {
  children: React.ReactNode;
  bg?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const Section: React.FC<SectionProps> = ({
  children,
  bg,
  fullWidth = false,
  noPadding = false,
  ...props
}) => {
  const content = fullWidth ? (
    <Box w="full">{children}</Box>
  ) : (
    <Container maxW="container.xl" {...props}>
      {children}
    </Container>
  );

  return (
    <Box
      as="section"
      bg={bg}
      py={noPadding ? 0 : { base: 12, md: 16, lg: 20 }}
    >
      {content}
    </Box>
  );
};

export default Section;
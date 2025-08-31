'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import { PageContent } from '@/types/content';
import { ContentRenderer } from './ContentRenderer';

interface PageRendererProps {
  pageContent: PageContent;
  className?: string;
}

export function PageRenderer({ pageContent, className }: PageRendererProps) {
  if (!pageContent) {
    return (
      <Box className={className} py={20} textAlign="center">
        <Box color="red.500" fontSize="xl">
          Page content not found
        </Box>
      </Box>
    );
  }

  return (
    <Box className={className}>
      {pageContent.sections.map((section) => (
        <ContentRenderer 
          key={section.id} 
          section={section}
        />
      ))}
    </Box>
  );
}
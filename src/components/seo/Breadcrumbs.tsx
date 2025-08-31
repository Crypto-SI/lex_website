'use client'

import { Box, Flex, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { StructuredData } from './StructuredData'
import { generateBreadcrumbStructuredData } from '@/app/metadata'

interface BreadcrumbItemData {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItemData[];
  showHome?: boolean;
}

/**
 * Breadcrumb navigation component with structured data support
 * Automatically generates breadcrumbs based on current path or uses provided items
 */
export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname, showHome);

  // Don't show breadcrumbs on home page or if only one item
  if (pathname === '/' || breadcrumbItems.length <= 1) {
    return null;
  }

  // Generate structured data for breadcrumbs
  const structuredData = generateBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({
      name: item.label,
      url: `https://lexconsulting.com${item.href}`
    }))
  );

  return (
    <>
      <StructuredData data={structuredData} id="breadcrumb-structured-data" />
      <Box 
        as="nav" 
        aria-label="Breadcrumb navigation"
        py={4}
        px={{ base: 4, md: 6 }}
        bg="gray.50"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <HStack 
          fontSize="sm"
          color="gray.600"
          divider={<Box color="gray.500" mx={2}>›</Box>}
        >
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            
            return (
              <Box key={item.href}>
                {isLast ? (
                  <Box 
                    color="gray.900" 
                    fontWeight="medium"
                    aria-current="page"
                  >
                    {item.label}
                  </Box>
                ) : (
                  <Link href={item.href}>
                    <Box
                      color="gray.600"
                      _hover={{ 
                        color: 'brand.accent',
                        textDecoration: 'underline' 
                      }}
                      _focus={{
                        outline: '2px solid',
                        outlineColor: 'brand.accent',
                        outlineOffset: '2px',
                        borderRadius: 'sm'
                      }}
                      cursor="pointer"
                    >
                      {item.label}
                    </Box>
                  </Link>
                )}
              </Box>
            );
          })}
        </HStack>
      </Box>
    </>
  );
}

/**
 * Generate breadcrumb items from current pathname
 */
function generateBreadcrumbsFromPath(pathname: string, showHome: boolean): BreadcrumbItemData[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItemData[] = [];

  if (showHome) {
    breadcrumbs.push({ label: 'Home', href: '/' });
  }

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = formatSegmentLabel(segment);
    breadcrumbs.push({ label, href: currentPath });
  });

  return breadcrumbs;
}

/**
 * Format URL segment into readable label
 */
function formatSegmentLabel(segment: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    'demo-content': 'Content Demo',
    'demo-i18n': 'i18n Demo',
  };

  if (specialCases[segment]) {
    return specialCases[segment];
  }

  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
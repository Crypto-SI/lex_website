'use client';

import { useEffect, useState } from 'react';
import { Box, Text, VStack, HStack, Badge, Button } from '@chakra-ui/react';
import { validateComponentContrast, getContrastRatio } from './colorContrast';

interface AccessibilityIssue {
  type: 'contrast' | 'alt-text' | 'focus' | 'aria' | 'heading' | 'keyboard';
  severity: 'error' | 'warning' | 'info';
  element: string;
  description: string;
  suggestion: string;
  location?: string;
}

interface AccessibilityAuditProps {
  enabled?: boolean;
  showResults?: boolean;
}

export const AccessibilityAudit: React.FC<AccessibilityAuditProps> = ({
  enabled = false,
  showResults = false
}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  const auditPage = async () => {
    if (!enabled) return;
    
    setIsAuditing(true);
    const foundIssues: AccessibilityIssue[] = [];

    try {
      // Check for missing alt text
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.alt || img.alt.trim() === '') {
          foundIssues.push({
            type: 'alt-text',
            severity: 'error',
            element: `img[${index}]`,
            description: 'Image missing alt text',
            suggestion: 'Add descriptive alt text for screen readers',
            location: img.src || 'Unknown source'
          });
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          foundIssues.push({
            type: 'heading',
            severity: 'warning',
            element: `${heading.tagName.toLowerCase()}[${index}]`,
            description: `Heading level skipped from h${lastLevel} to h${level}`,
            suggestion: 'Use proper heading hierarchy (h1 → h2 → h3, etc.)',
            location: heading.textContent?.substring(0, 50) || 'Unknown heading'
          });
        }
        lastLevel = level;
      });

      // Check for focusable elements without focus indicators
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      focusableElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        const outline = computedStyle.outline;
        const outlineWidth = computedStyle.outlineWidth;
        
        // This is a simplified check - in a real audit you'd need more sophisticated detection
        if (outline === 'none' || outlineWidth === '0px') {
          // Check if element has custom focus styles
          const hasCustomFocus = element.getAttribute('class')?.includes('focus') ||
                                element.getAttribute('style')?.includes('focus');
          
          if (!hasCustomFocus) {
            foundIssues.push({
              type: 'focus',
              severity: 'warning',
              element: `${element.tagName.toLowerCase()}[${index}]`,
              description: 'Interactive element may lack focus indicator',
              suggestion: 'Add visible focus indicators for keyboard navigation',
              location: element.textContent?.substring(0, 30) || element.tagName
            });
          }
        }
      });

      // Check for buttons without accessible names
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button, index) => {
        const hasAccessibleName = button.textContent?.trim() ||
                                 button.getAttribute('aria-label') ||
                                 button.getAttribute('aria-labelledby') ||
                                 button.getAttribute('title');
        
        if (!hasAccessibleName) {
          foundIssues.push({
            type: 'aria',
            severity: 'error',
            element: `button[${index}]`,
            description: 'Button without accessible name',
            suggestion: 'Add aria-label, text content, or aria-labelledby',
            location: button.className || 'Unknown button'
          });
        }
      });

      // Check for color contrast issues (simplified)
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
      textElements.forEach((element, index) => {
        try {
          const result = validateComponentContrast(element as HTMLElement);
          if (!result.isValid) {
            foundIssues.push({
              type: 'contrast',
              severity: result.level === 'Fail' ? 'error' : 'warning',
              element: `${element.tagName.toLowerCase()}[${index}]`,
              description: `Color contrast ratio ${result.ratio.toFixed(2)}:1 is below WCAG standards`,
              suggestion: result.suggestions?.[0] || 'Improve color contrast',
              location: element.textContent?.substring(0, 30) || element.className
            });
          }
        } catch (error) {
          // Skip elements where contrast can't be determined
        }
      });

    } catch (error) {
      console.error('Accessibility audit error:', error);
    }

    setIssues(foundIssues);
    setIsAuditing(false);
  };

  useEffect(() => {
    if (enabled) {
      // Run audit after a short delay to ensure page is fully rendered
      const timer = setTimeout(auditPage, 1000);
      return () => clearTimeout(timer);
    }
  }, [enabled]);

  if (!enabled || !showResults) {
    return null;
  }

  const errorCount = issues.filter(issue => issue.severity === 'error').length;
  const warningCount = issues.filter(issue => issue.severity === 'warning').length;
  const infoCount = issues.filter(issue => issue.severity === 'info').length;

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="lg"
      p={4}
      maxW="400px"
      zIndex={1000}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="sm">
            Accessibility Audit
          </Text>
          <Button
            size="xs"
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
          >
            {isExpanded ? 'Hide' : 'Show'} Details
          </Button>
        </HStack>

        <HStack spacing={2}>
          {errorCount > 0 && (
            <Badge colorScheme="red" variant="solid">
              {errorCount} Errors
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge colorScheme="yellow" variant="solid">
              {warningCount} Warnings
            </Badge>
          )}
          {infoCount > 0 && (
            <Badge colorScheme="blue" variant="solid">
              {infoCount} Info
            </Badge>
          )}
          {issues.length === 0 && !isAuditing && (
            <Badge colorScheme="green" variant="solid">
              No Issues Found
            </Badge>
          )}
          {isAuditing && (
            <Badge colorScheme="gray" variant="solid">
              Auditing...
            </Badge>
          )}
        </HStack>

        <Button
          size="sm"
          onClick={auditPage}
          isLoading={isAuditing}
          loadingText="Auditing..."
        >
          Re-run Audit
        </Button>

        {isExpanded && (
          <VStack align="stretch" spacing={2} maxH="300px" overflowY="auto">
            {issues.map((issue, index) => (
              <Box
                key={index}
                p={3}
                bg="gray.50"
                borderRadius="sm"
                borderLeft="4px solid"
                borderLeftColor={
                  issue.severity === 'error' ? 'red.500' :
                  issue.severity === 'warning' ? 'yellow.500' : 'blue.500'
                }
              >
                <VStack align="stretch" spacing={1}>
                  <HStack justify="space-between">
                    <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
                      {issue.type}
                    </Text>
                    <Badge
                      size="sm"
                      colorScheme={
                        issue.severity === 'error' ? 'red' :
                        issue.severity === 'warning' ? 'yellow' : 'blue'
                      }
                    >
                      {issue.severity}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium">
                    {issue.description}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Element: {issue.element}
                  </Text>
                  {issue.location && (
                    <Text fontSize="xs" color="gray.600">
                      Location: {issue.location}
                    </Text>
                  )}
                  <Text fontSize="xs" color="blue.600" fontStyle="italic">
                    💡 {issue.suggestion}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

// Hook for using accessibility audit in development
export const useAccessibilityAudit = (enabled: boolean = process.env.NODE_ENV === 'development') => {
  const [showAudit, setShowAudit] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle audit with Ctrl+Shift+A (or Cmd+Shift+A on Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setShowAudit(prev => !prev);
      }
    };

    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled]);

  return { showAudit, setShowAudit };
};
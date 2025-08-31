'use client';

import { useEffect, useRef, RefObject } from 'react';
import { Box } from '@chakra-ui/react';

interface FocusManagerProps {
  children: React.ReactNode;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  initialFocus?: RefObject<HTMLElement>;
  onEscape?: () => void;
}

export const FocusManager: React.FC<FocusManagerProps> = ({
  children,
  trapFocus = false,
  restoreFocus = false,
  initialFocus,
  onEscape,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    // Set initial focus
    if (initialFocus?.current) {
      initialFocus.current.focus();
    }

    return () => {
      // Restore focus when component unmounts
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [initialFocus, restoreFocus]);

  useEffect(() => {
    if (!trapFocus) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trapFocus, onEscape]);

  return (
    <Box ref={containerRef} outline="none" tabIndex={-1}>
      {children}
    </Box>
  );
};

// Hook for managing focus programmatically
export const useFocusManager = () => {
  const focusElement = (element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  };

  const focusById = (id: string) => {
    const element = document.getElementById(id);
    focusElement(element);
  };

  const focusFirst = (container: HTMLElement | null) => {
    if (!container) return;
    
    const focusableElement = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    focusElement(focusableElement);
  };

  const moveFocusToNext = () => {
    const currentElement = document.activeElement as HTMLElement;
    if (!currentElement) return;

    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  };

  const moveFocusToPrevious = () => {
    const currentElement = document.activeElement as HTMLElement;
    if (!currentElement) return;

    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(currentElement);
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[previousIndex]?.focus();
  };

  return {
    focusElement,
    focusById,
    focusFirst,
    moveFocusToNext,
    moveFocusToPrevious,
  };
};
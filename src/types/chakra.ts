/**
 * Chakra UI v3 Type Definitions and Helpers
 * This file provides proper type definitions for Chakra UI v3 components
 */

import { ReactNode } from 'react';

// Stack component props for Chakra UI v3
export interface StackProps {
  children?: ReactNode;
  gap?: string | number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  direction?: 'row' | 'column';
  wrap?: boolean;
  className?: string;
  [key: string]: any;
}

// Button component props for Chakra UI v3
export interface ButtonProps {
  children?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  colorScheme?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  [key: string]: any;
}

// Alert component props for Chakra UI v3
export interface AlertProps {
  children?: ReactNode;
  status?: 'info' | 'warning' | 'success' | 'error';
  variant?: 'subtle' | 'solid' | 'left-accent' | 'top-accent';
  className?: string;
  [key: string]: any;
}

// Text component props for Chakra UI v3
export interface TextProps {
  children?: ReactNode;
  truncate?: boolean;
  lineClamp?: number;
  className?: string;
  [key: string]: any;
}

// Grid component props for Chakra UI v3
export interface GridProps {
  children?: ReactNode;
  columns?: number | { [key: string]: number };
  gap?: string | number;
  className?: string;
  [key: string]: any;
}

// Helper function to convert spacing to gap
export const convertSpacingToGap = (spacing: number | string): string => {
  if (typeof spacing === 'number') {
    return `${spacing * 0.25}rem`; // Convert Chakra spacing units to rem
  }
  return spacing;
};

// Helper function for button icons in Chakra UI v3
export const createButtonWithIcon = (
  icon: ReactNode,
  position: 'start' | 'end' = 'start'
) => {
  return { icon, position };
};
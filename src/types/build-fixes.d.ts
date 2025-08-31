
// Build-time type declarations
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module '@chakra-ui/react' {
  export interface StackProps {
    spacing?: number | string;
  }
  
  export interface SimpleGridProps {
    spacing?: number | string;
  }
  
  export interface ButtonProps {
    isLoading?: boolean;
    loadingText?: string;
    rightIcon?: React.ReactElement;
    leftIcon?: React.ReactElement;
  }
  
  export interface TextProps {
    htmlFor?: string;
    noOfLines?: number;
  }
  
  export interface SkeletonTextProps {
    spacing?: number | string;
  }
  
  export interface BreadcrumbItemProps {
    isCurrentPage?: boolean;
  }
  
  export const useColorModeValue: (light: any, dark: any) => any;
  export const useDisclosure: () => {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  
  export const Popover: React.ComponentType<any>;
  export const PopoverContent: React.ComponentType<any>;
  export const Breadcrumb: React.ComponentType<any>;
}

declare global {
  interface Window {
    Calendly?: any;
  }
}

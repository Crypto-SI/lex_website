'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AriaLabel {
  id: string;
  label: string;
  description?: string;
}

interface AriaManagerContextType {
  labels: Record<string, AriaLabel>;
  addLabel: (id: string, label: string, description?: string) => void;
  removeLabel: (id: string) => void;
  getLabel: (id: string) => AriaLabel | undefined;
  generateId: (prefix?: string) => string;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AriaManagerContext = createContext<AriaManagerContextType | undefined>(undefined);

interface AriaManagerProviderProps {
  children: ReactNode;
}

export const AriaManagerProvider: React.FC<AriaManagerProviderProps> = ({ children }) => {
  const [labels, setLabels] = useState<Record<string, AriaLabel>>({});
  const [idCounter, setIdCounter] = useState(0);

  const addLabel = useCallback((id: string, label: string, description?: string) => {
    setLabels(prev => ({
      ...prev,
      [id]: { id, label, description }
    }));
  }, []);

  const removeLabel = useCallback((id: string) => {
    setLabels(prev => {
      const newLabels = { ...prev };
      delete newLabels[id];
      return newLabels;
    });
  }, []);

  const getLabel = useCallback((id: string) => {
    return labels[id];
  }, [labels]);

  const generateId = useCallback((prefix = 'aria') => {
    const newId = `${prefix}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [idCounter]);

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Create a temporary element to announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const value: AriaManagerContextType = {
    labels,
    addLabel,
    removeLabel,
    getLabel,
    generateId,
    announceToScreenReader,
  };

  return (
    <AriaManagerContext.Provider value={value}>
      {children}
    </AriaManagerContext.Provider>
  );
};

export const useAriaManager = (): AriaManagerContextType => {
  const context = useContext(AriaManagerContext);
  if (!context) {
    throw new Error('useAriaManager must be used within an AriaManagerProvider');
  }
  return context;
};

// Hook for managing ARIA attributes on components
export const useAriaAttributes = (
  initialLabel?: string,
  initialDescription?: string
) => {
  const { addLabel, removeLabel, generateId, announceToScreenReader } = useAriaManager();
  const [id] = useState(() => generateId());

  const setLabel = useCallback((label: string, description?: string) => {
    addLabel(id, label, description);
  }, [addLabel, id]);

  const clearLabel = useCallback(() => {
    removeLabel(id);
  }, [removeLabel, id]);

  // Initialize label if provided
  useState(() => {
    if (initialLabel) {
      setLabel(initialLabel, initialDescription);
    }
  });

  return {
    id,
    setLabel,
    clearLabel,
    announceToScreenReader,
    ariaProps: {
      'aria-labelledby': id,
      'aria-describedby': initialDescription ? `${id}-desc` : undefined,
    },
  };
};

// Component for creating accessible headings with proper hierarchy
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  id?: string;
  className?: string;
}

export const AccessibleHeading: React.FC<AccessibleHeadingProps> = ({
  level,
  children,
  id,
  className,
}) => {
  const { generateId } = useAriaManager();
  const headingId = id || generateId('heading');
  
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <HeadingTag id={headingId} className={className}>
      {children}
    </HeadingTag>
  );
};

// Component for creating accessible buttons with proper ARIA attributes
interface AccessibleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  type = 'button',
  className,
}) => {
  const { announceToScreenReader } = useAriaManager();

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
      
      // Announce state changes to screen readers
      if (ariaPressed !== undefined) {
        const state = !ariaPressed ? 'pressed' : 'not pressed';
        announceToScreenReader(`Button ${state}`, 'assertive');
      }
      
      if (ariaExpanded !== undefined) {
        const state = !ariaExpanded ? 'expanded' : 'collapsed';
        announceToScreenReader(`Menu ${state}`, 'assertive');
      }
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      className={className}
    >
      {children}
    </button>
  );
};

// Component for creating accessible links
interface AccessibleLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
}

export const AccessibleLink: React.FC<AccessibleLinkProps> = ({
  href,
  children,
  external = false,
  ariaLabel,
  className,
}) => {
  const linkProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': ariaLabel || `${children} (opens in new tab)`,
      }
    : {
        'aria-label': ariaLabel,
      };

  return (
    <a href={href} className={className} {...linkProps}>
      {children}
      {external && <span className="sr-only"> (opens in new tab)</span>}
    </a>
  );
};
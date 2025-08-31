'use client'

import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
  id?: string;
}

/**
 * Component for injecting structured data (JSON-LD) into the page head
 * This helps search engines understand the content and context of the page
 */
export function StructuredData({ data, id = 'structured-data' }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data script if it exists
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element with structured data
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    
    // Append to document head
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Hook for managing structured data in components
 */
export function useStructuredData(data: Record<string, any> | Array<Record<string, any>>, id?: string) {
  useEffect(() => {
    const scriptId = id || 'structured-data';
    
    // Remove existing script
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Add new script
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);
}
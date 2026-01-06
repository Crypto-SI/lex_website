'use client'

import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
  id?: string;
}

/**
 * Component for injecting structured data (JSON-LD) into the page markup.
 * Rendering the script directly ensures crawlers can read it from initial HTML.
 */
export function StructuredData({ data, id = 'structured-data' }: StructuredDataProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
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

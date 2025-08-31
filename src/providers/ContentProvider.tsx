'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { SiteContent, PageContent, ContentSection, LocalizedSiteContent } from '@/types/content';
import { Locale } from '@/types/i18n';

interface ContentContextType {
  siteContent: SiteContent;
  getPageContent: (slug: string, locale?: Locale) => PageContent | null;
  getSectionContent: (pageSlug: string, sectionId: string, locale?: Locale) => ContentSection | null;
  getAsset: (assetId: string) => any;
  updateContent: (path: string, content: any) => void;
  currentLocale?: Locale;
  setLocale?: (locale: Locale) => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

interface ContentProviderProps {
  children: ReactNode;
  content: SiteContent | LocalizedSiteContent;
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
}

export function ContentProvider({ children, content, currentLocale, onLocaleChange }: ContentProviderProps) {
  // Helper to get localized content
  const getLocalizedContent = (locale?: Locale): SiteContent => {
    if (!locale || !isLocalizedContent(content)) {
      return content as SiteContent;
    }
    return content[locale] || content['en'] || Object.values(content)[0];
  };

  const isLocalizedContent = (content: any): content is LocalizedSiteContent => {
    return typeof content === 'object' && 
           content !== null && 
           !content.pages && 
           Object.keys(content).some(key => key.length === 2); // Locale codes are 2 chars
  };

  const getPageContent = (slug: string, locale?: Locale): PageContent | null => {
    const localizedContent = getLocalizedContent(locale || currentLocale);
    return localizedContent.pages[slug] || null;
  };

  const getSectionContent = (pageSlug: string, sectionId: string, locale?: Locale): ContentSection | null => {
    const page = getPageContent(pageSlug, locale);
    if (!page) return null;
    
    return page.sections.find(section => section.id === sectionId) || null;
  };

  const getAsset = (assetId: string) => {
    const localizedContent = getLocalizedContent(currentLocale);
    return localizedContent.assets[assetId] || null;
  };

  const updateContent = (path: string, newContent: any) => {
    // In a real implementation, this would update the content store
    // For now, this is a placeholder for future dynamic content updates
    console.log('Content update requested:', path, newContent);
  };

  const contextValue: ContentContextType = {
    siteContent: getLocalizedContent(currentLocale),
    getPageContent,
    getSectionContent,
    getAsset,
    updateContent,
    currentLocale,
    setLocale: onLocaleChange,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextType {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

// Convenience hooks for specific content types
export function usePageContent(slug: string): PageContent | null {
  const { getPageContent } = useContent();
  return getPageContent(slug);
}

export function useSectionContent(pageSlug: string, sectionId: string): ContentSection | null {
  const { getSectionContent } = useContent();
  return getSectionContent(pageSlug, sectionId);
}

export function useAsset(assetId: string) {
  const { getAsset } = useContent();
  return getAsset(assetId);
}

export function useGlobalContent() {
  const { siteContent } = useContent();
  return siteContent.global;
}
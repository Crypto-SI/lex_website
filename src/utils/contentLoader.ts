import { SiteContent, PageContent } from '@/types/content';

// Content cache to reduce re-loading and webpack serialization
const contentCache = new Map<string, any>();
const loadingPromises = new Map<string, Promise<any>>();

/**
 * Dynamically load content file to reduce initial bundle size
 */
async function loadContentFile(path: string): Promise<any> {
  if (contentCache.has(path)) {
    return contentCache.get(path);
  }

  if (loadingPromises.has(path)) {
    return loadingPromises.get(path);
  }

  const loadingPromise = (async () => {
    try {
      const content = await import(`@/content/${path}.json`);
      const data = content.default;
      contentCache.set(path, data);
      return data;
    } catch (error) {
      console.error(`Failed to load content: ${path}`, error);
      return null;
    }
  })();

  loadingPromises.set(path, loadingPromise);
  
  try {
    return await loadingPromise;
  } finally {
    loadingPromises.delete(path);
  }
}

/**
 * Load all site content from JSON files with dynamic imports
 * In a production environment, this could be replaced with API calls or CMS integration
 */
export async function loadSiteContent(): Promise<SiteContent> {
  const [globalContent, assetsContent, homeContent, aboutContent, servicesContent, contactContent] = await Promise.all([
    loadContentFile('global'),
    loadContentFile('assets'),
    loadContentFile('pages/home'),
    loadContentFile('pages/about'),
    loadContentFile('pages/services'),
    loadContentFile('pages/contact'),
  ]);

  const pages: Record<string, PageContent> = {
    '/': homeContent as PageContent,
    '/about': aboutContent as PageContent,
    '/services': servicesContent as PageContent,
    '/contact': contactContent as PageContent,
  };

  return {
    pages,
    global: globalContent,
    assets: assetsContent,
  };
}

/**
 * Get content for a specific page by slug
 */
export async function getPageContent(slug: string): Promise<PageContent | null> {
  const siteContent = await loadSiteContent();
  return siteContent.pages[slug] || null;
}

/**
 * Load content for a specific page directly (optimized)
 */
export async function loadPageContent(pageId: string): Promise<PageContent | null> {
  try {
    const content = await loadContentFile(`pages/${pageId}`);
    return content as PageContent;
  } catch (error) {
    console.error(`Failed to load page content: ${pageId}`, error);
    return null;
  }
}

/**
 * Get all available page slugs
 */
export async function getAvailablePages(): Promise<string[]> {
  const siteContent = await loadSiteContent();
  return Object.keys(siteContent.pages);
}

/**
 * Get asset by ID
 */
export async function getAsset(assetId: string) {
  const assetsContent = await loadContentFile('assets');
  return assetsContent[assetId] || null;
}

/**
 * Get global site configuration
 */
export async function getGlobalContent() {
  return await loadContentFile('global');
}

/**
 * Validate content structure
 * Useful for development and debugging
 */
export async function validateContent(): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  try {
    const siteContent = await loadSiteContent();
    
    // Validate pages
    Object.entries(siteContent.pages).forEach(([slug, page]) => {
      if (!page.id) errors.push(`Page ${slug} missing id`);
      if (!page.title) errors.push(`Page ${slug} missing title`);
      if (!page.seo) errors.push(`Page ${slug} missing SEO metadata`);
      if (!page.sections || page.sections.length === 0) {
        errors.push(`Page ${slug} has no sections`);
      }
    });
    
    // Validate global content
    if (!siteContent.global.site) errors.push('Missing global site configuration');
    if (!siteContent.global.navigation) errors.push('Missing navigation configuration');
    
    // Validate assets
    if (!siteContent.assets || Object.keys(siteContent.assets).length === 0) {
      errors.push('No assets defined');
    }
    
  } catch (error) {
    errors.push(`Content loading error: ${error}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Development helper to log content validation
 */
export async function logContentValidation() {
  if (process.env.NODE_ENV === 'development') {
    const validation = await validateContent();
    if (!validation.valid) {
      console.warn('Content validation errors:', validation.errors);
    } else {
      console.log('✅ Content validation passed');
    }
  }
}

/**
 * Clear content cache (useful for development)
 */
export function clearContentCache(): void {
  contentCache.clear();
  loadingPromises.clear();
}

/**
 * Preload content for better performance
 */
export function preloadContent(paths: string[]): void {
  paths.forEach(path => {
    if (!contentCache.has(path) && !loadingPromises.has(path)) {
      loadContentFile(path).catch(error => {
        console.warn(`Failed to preload content: ${path}`, error);
      });
    }
  });
}
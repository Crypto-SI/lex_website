import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Content Management Demo | Dynamic Content System',
  description: 'Demonstration of our content management system showcasing dynamic content rendering and structured data capabilities.',
  pagePath: '/demo-content',
  keywords: ['Content Management', 'Demo', 'Dynamic Content', 'CMS'],
  type: 'website',
  noIndex: true, // Demo pages should not be indexed
});
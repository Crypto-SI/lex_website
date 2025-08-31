import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Internationalization Demo | Multi-language Support',
  description: 'Demonstration of our internationalization system showcasing multi-language support and localization features.',
  pagePath: '/demo-i18n',
  keywords: ['Internationalization', 'i18n', 'Demo', 'Multi-language', 'Localization'],
  type: 'website',
  noIndex: true, // Demo pages should not be indexed
});
import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service | Service Agreement and Legal Terms',
  description: 'Review the terms and conditions for using Lex Consulting services, including our educational consulting agreements and legal obligations.',
  pagePath: '/terms',
  keywords: ['Terms of Service', 'Service Agreement', 'Legal Terms', 'Educational Services', 'Consulting Agreement'],
  type: 'website',
  noIndex: false, // Terms should be indexed for transparency
});
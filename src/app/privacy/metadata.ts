import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy | Data Protection and Privacy Rights',
  description: 'Learn about how Lex Consulting protects your personal data, our privacy practices, and your rights regarding data collection and usage.',
  pagePath: '/privacy',
  keywords: ['Privacy Policy', 'Data Protection', 'Personal Data', 'Privacy Rights', 'GDPR', 'Data Security'],
  type: 'website',
  noIndex: false, // Privacy policies should be indexed for transparency
});
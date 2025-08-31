import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Onboarding Process | Getting Started',
  description: 'Learn about our simple onboarding process and the client journey at Lex Consulting, from your first discovery call to ongoing structured education sessions.',
  pagePath: '/onboarding',
  keywords: ['Onboarding', 'Getting Started', 'Client Journey', 'Process', 'Discovery Call'],
  type: 'website',
}); 
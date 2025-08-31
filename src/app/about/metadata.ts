import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Us | Our Team and Philosophy',
  description: 'Learn about Lex Consulting, our founding team, and our approach to structured financial education for high-net-worth individuals and financial advisors.',
  pagePath: '/about',
  keywords: ['About Us', 'Team', 'Philosophy', 'Company', 'Financial Education', 'Investment Consulting'],
  type: 'website',
}); 
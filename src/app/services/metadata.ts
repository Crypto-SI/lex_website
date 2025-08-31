import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Services | Consulting Plans and Solutions',
  description: 'Explore our structured financial education consulting plans designed for high-net-worth individuals and financial advisors, from quarterly options to customized solutions.',
  pagePath: '/services',
  keywords: ['Services', 'Consulting Plans', 'Financial Education', 'Investment Strategy', 'Wealth Management', 'Crypto Education'],
  type: 'website',
}); 
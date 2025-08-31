import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us | Get in Touch',
  description: 'Reach out to Lex Consulting to schedule a discovery call, discuss our services, or inquire about personalized financial education solutions.',
  pagePath: '/contact',
  keywords: ['Contact', 'Get in Touch', 'Discovery Call', 'Consultation', 'Financial Education'],
  type: 'website',
}); 
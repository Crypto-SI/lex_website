import type { Metadata } from 'next';

// Base metadata configuration for the entire site
export const baseMetadata: Metadata = {
  title: {
    template: '%s | Lex Consulting',
    default: 'Lex Consulting | Empowering Strategic Investors',
  },
  description: 'Structured educational consulting for high-net-worth individuals and financial advisors, bridging traditional finance and digital assets.',
  keywords: ['Investment Education', 'Financial Consulting', 'Wealth Management', 'Digital Assets', 'Traditional Finance'],
  authors: [{ name: 'Lex Consulting Team' }],
  colorScheme: 'light',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lexconsulting.com',
    siteName: 'Lex Consulting',
    title: 'Lex Consulting | Empowering Strategic Investors',
    description: 'Structured educational consulting for high-net-worth individuals and financial advisors.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lex Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lex Consulting | Empowering Strategic Investors',
    description: 'Structured educational consulting for high-net-worth individuals and financial advisors.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'verification_token',
  },
  category: 'Finance',
};

// Generate metadata for individual pages
export function generatePageMetadata(
  title: string,
  description: string,
  pagePath: string
): Metadata {
  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: `https://lexconsulting.com${pagePath}`,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
    },
  };
} 
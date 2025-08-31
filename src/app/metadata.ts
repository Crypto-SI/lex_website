import type { Metadata, Viewport } from 'next';

// Business information for structured data
export const businessInfo = {
  name: 'Lex Consulting',
  legalName: 'Lex Consulting LLC',
  description: 'Structured educational consulting for high-net-worth individuals and financial advisors, bridging traditional finance and digital assets.',
  url: 'https://lexconsulting.com',
  logo: 'https://lexconsulting.com/lexlogo.png',
  image: 'https://lexconsulting.com/og-image.jpg',
  telephone: '+1-555-LEX-CONS',
  email: 'info@lexconsulting.com',
  address: {
    streetAddress: '123 Financial District',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10004',
    addressCountry: 'US'
  },
  sameAs: [
    'https://linkedin.com/company/lex-consulting',
    'https://twitter.com/lexconsulting'
  ],
  foundingDate: '2020',
  numberOfEmployees: '10-50',
  industry: 'Financial Services',
  serviceArea: 'United States'
};

// Base viewport configuration for the entire site
export const baseViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

// Generate structured data for business
export function generateBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: businessInfo.name,
    legalName: businessInfo.legalName,
    description: businessInfo.description,
    url: businessInfo.url,
    logo: businessInfo.logo,
    image: businessInfo.image,
    telephone: businessInfo.telephone,
    email: businessInfo.email,
    address: {
      '@type': 'PostalAddress',
      ...businessInfo.address
    },
    sameAs: businessInfo.sameAs,
    foundingDate: businessInfo.foundingDate,
    numberOfEmployees: businessInfo.numberOfEmployees,
    knowsAbout: [
      'Investment Education',
      'Financial Consulting', 
      'Wealth Management',
      'Digital Assets',
      'Cryptocurrency',
      'Alternative Investments',
      'Portfolio Management',
      'Financial Planning'
    ],
    serviceType: [
      'Investment Education',
      'Financial Consulting',
      'Wealth Management Advisory',
      'Digital Asset Education'
    ],
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    }
  };
}

// Base metadata configuration for the entire site
export const baseMetadata: Metadata = {
  metadataBase: new URL('https://lexconsulting.com'),
  title: {
    template: '%s | Lex Consulting',
    default: 'Lex Consulting | Empowering Strategic Investors',
  },
  description: businessInfo.description,
  keywords: [
    'Investment Education', 
    'Financial Consulting', 
    'Wealth Management', 
    'Digital Assets', 
    'Traditional Finance',
    'Cryptocurrency Education',
    'Alternative Investments',
    'High Net Worth',
    'Financial Advisors',
    'Portfolio Strategy'
  ],
  authors: [{ name: 'Lex Consulting Team', url: 'https://lexconsulting.com/about' }],
  creator: 'Lex Consulting',
  publisher: 'Lex Consulting',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    url: businessInfo.url,
    siteName: businessInfo.name,
    title: 'Lex Consulting | Empowering Strategic Investors',
    description: businessInfo.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lex Consulting - Financial Education and Investment Strategy',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Lex Consulting Logo',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lexconsulting',
    creator: '@lexconsulting',
    title: 'Lex Consulting | Empowering Strategic Investors',
    description: businessInfo.description,
    images: [
      {
        url: '/twitter-image.jpg',
        alt: 'Lex Consulting - Financial Education and Investment Strategy',
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#0a2342',
      },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'verification_token_here',
    yandex: 'verification_token_here',
    yahoo: 'verification_token_here',
  },
  category: 'Finance',
  classification: 'Financial Services',
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: 'https://lexconsulting.com',
    languages: {
      'en-US': 'https://lexconsulting.com',
      'es-US': 'https://lexconsulting.com/es',
    },
  },
  other: {
    'msapplication-TileColor': '#0a2342',
    'theme-color': '#0a2342',
  },
};

// Page-specific metadata options
export interface PageMetadataOptions {
  title: string;
  description: string;
  pagePath: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

// Generate comprehensive metadata for individual pages
export function generatePageMetadata(
  titleOrOptions: string | PageMetadataOptions,
  description?: string,
  pagePath?: string
): Metadata {
  // Handle both old and new function signatures for backward compatibility
  const options: PageMetadataOptions = typeof titleOrOptions === 'string' 
    ? { title: titleOrOptions, description: description!, pagePath: pagePath! }
    : titleOrOptions;

  const {
    title,
    description: desc,
    pagePath: path,
    keywords = [],
    image,
    imageAlt,
    type = 'website',
    publishedTime,
    modifiedTime,
    section,
    tags = [],
    noIndex = false,
  } = options;

  const fullUrl = `https://lexconsulting.com${path}`;
  const pageImage = image || '/og-image.jpg';
  const pageImageAlt = imageAlt || `${title} - Lex Consulting`;

  const metadata: Metadata = {
    ...baseMetadata,
    title,
    description: desc,
    keywords: [...(baseMetadata.keywords as string[]), ...keywords],
    alternates: {
      ...baseMetadata.alternates,
      canonical: fullUrl,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description: desc,
      url: fullUrl,
      type: type as any,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageImageAlt,
          type: 'image/jpeg',
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description: desc,
      images: [
        {
          url: pageImage,
          alt: pageImageAlt,
        }
      ],
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : baseMetadata.robots,
  };

  return metadata;
}

// Generate structured data for service pages
export function generateServiceStructuredData(
  serviceName: string,
  serviceDescription: string,
  serviceUrl: string,
  price?: string,
  currency: string = 'USD'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    url: serviceUrl,
    provider: {
      '@type': 'FinancialService',
      name: businessInfo.name,
      url: businessInfo.url,
      logo: businessInfo.logo,
      address: {
        '@type': 'PostalAddress',
        ...businessInfo.address
      },
      telephone: businessInfo.telephone,
      email: businessInfo.email
    },
    serviceType: 'Financial Education',
    category: 'Financial Services',
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    },
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price,
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString(),
      }
    })
  };
}

// Generate structured data for FAQ sections
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
} 
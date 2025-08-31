// Content Management System Types

export interface ContentMetadata {
  id: string;
  title: string;
  description?: string;
  lastModified: string;
  version: string;
  tags?: string[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
}

export interface MediaAsset {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  placeholder?: string;
  caption?: string;
}

export interface VideoAsset extends MediaAsset {
  poster?: string;
  duration?: number;
  videoId?: string; // For YouTube videos
  aspectRatio?: number;
}

export interface CTAButton {
  id: string;
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  icon?: string;
  ariaLabel?: string;
  external?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ServicePlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  badge?: {
    text: string;
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  };
  cta: CTAButton;
  popular?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: MediaAsset;
  socialLinks: {
    platform: 'linkedin' | 'twitter' | 'github' | 'instagram';
    url: string;
  }[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  location?: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage?: MediaAsset;
  video?: VideoAsset;
  ctas: CTAButton[];
  overlay?: {
    gradient: string;
    opacity: number;
  };
}

export interface ContentSection {
  id: string;
  type: 'hero' | 'features' | 'services' | 'team' | 'testimonials' | 'faq' | 'cta' | 'text' | 'custom';
  title?: string;
  subtitle?: string;
  content?: any; // Flexible content based on section type
  background?: {
    color?: string;
    gradient?: string;
    image?: MediaAsset;
  };
  spacing?: {
    paddingTop?: number;
    paddingBottom?: number;
  };
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  seo: SEOMetadata;
  sections: ContentSection[];
  metadata: ContentMetadata;
}

export interface SiteContent {
  pages: Record<string, PageContent>;
  global: {
    site: {
      name: string;
      description: string;
      url: string;
      logo: MediaAsset;
    };
    navigation: {
      main: {
        label: string;
        href: string;
        external?: boolean;
      }[];
      footer: {
        label: string;
        href: string;
        external?: boolean;
      }[];
    };
    contact: {
      email: string;
      phone?: string;
      address?: string;
      calendlyUrl: string;
    };
    social: {
      platform: string;
      url: string;
      icon: string;
    }[];
  };
  assets: Record<string, MediaAsset | VideoAsset>;
}

// Localized content support
export interface LocalizedSiteContent {
  [locale: string]: SiteContent;
}

export interface LocalizedPageContent {
  [locale: string]: PageContent;
}

// Content rendering utilities
export interface ContentRenderProps {
  content: any;
  className?: string;
  [key: string]: any;
}

export type ContentRenderer<T = any> = (props: ContentRenderProps & { content: T }) => JSX.Element;

export interface ContentRenderers {
  hero: ContentRenderer<HeroSection>;
  features: ContentRenderer<FeatureCard[]>;
  services: ContentRenderer<ServicePlan[]>;
  team: ContentRenderer<TeamMember[]>;
  testimonials: ContentRenderer<Testimonial[]>;
  faq: ContentRenderer<FAQItem[]>;
  cta: ContentRenderer<CTAButton>;
  text: ContentRenderer<{ title?: string; content: string }>;
  [key: string]: ContentRenderer;
}
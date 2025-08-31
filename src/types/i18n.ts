// Internationalization Types

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export interface TranslationKey {
  key: string;
  defaultValue: string;
  description?: string;
  context?: string;
}

export interface TranslationSet {
  locale: Locale;
  translations: Record<string, string>;
  metadata: {
    version: string;
    lastModified: string;
    completeness: number; // 0-100 percentage
    translator?: string;
  };
}

export interface LocalizedContent<T = any> {
  [locale: string]: T;
}

export interface I18nPageContent {
  [locale: string]: {
    title: string;
    seo: {
      title: string;
      description: string;
      keywords?: string[];
    };
    sections: LocalizedContent[];
  };
}

export interface I18nConfig {
  defaultLocale: Locale;
  supportedLocales: Locale[];
  fallbackLocale: Locale;
  localeConfigs: Record<Locale, LocaleConfig>;
  dateFormat: Record<Locale, string>;
  numberFormat: Record<Locale, Intl.NumberFormatOptions>;
  currencyFormat: Record<Locale, { currency: string; format: Intl.NumberFormatOptions }>;
}

export interface I18nContextType {
  currentLocale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number) => string;
  isRTL: boolean;
  availableLocales: LocaleConfig[];
}

// Translation function parameters
export interface TranslationParams {
  [key: string]: string | number;
}

// Pluralization rules
export interface PluralRule {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

export interface PluralTranslation {
  key: string;
  count: number;
  rules: PluralRule;
}

// Namespace support for organizing translations
export interface TranslationNamespace {
  namespace: string;
  translations: Record<string, string | PluralRule>;
}

// Content localization
export interface LocalizedAsset {
  id: string;
  locale: Locale;
  src: string;
  alt: string;
  caption?: string;
}

export interface LocalizedPageMeta {
  locale: Locale;
  title: string;
  description: string;
  slug: string;
  alternateUrls: Record<Locale, string>;
}
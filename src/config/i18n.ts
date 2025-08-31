import { I18nConfig, LocaleConfig, Locale } from '@/types/i18n';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'es', 'fr', 'de'];
export const DEFAULT_LOCALE: Locale = 'en';
export const FALLBACK_LOCALE: Locale = 'en';

export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false,
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
  },
};

export const I18N_CONFIG: I18nConfig = {
  defaultLocale: DEFAULT_LOCALE,
  supportedLocales: SUPPORTED_LOCALES,
  fallbackLocale: FALLBACK_LOCALE,
  localeConfigs: LOCALE_CONFIGS,
  dateFormat: {
    en: 'MM/dd/yyyy',
    es: 'dd/MM/yyyy',
    fr: 'dd/MM/yyyy',
    de: 'dd.MM.yyyy',
    zh: 'yyyy/MM/dd',
    ja: 'yyyy/MM/dd',
  },
  numberFormat: {
    en: { locale: 'en-US' },
    es: { locale: 'es-ES' },
    fr: { locale: 'fr-FR' },
    de: { locale: 'de-DE' },
    zh: { locale: 'zh-CN' },
    ja: { locale: 'ja-JP' },
  },
  currencyFormat: {
    en: { 
      currency: 'USD', 
      format: { style: 'currency', currency: 'USD', locale: 'en-US' }
    },
    es: { 
      currency: 'EUR', 
      format: { style: 'currency', currency: 'EUR', locale: 'es-ES' }
    },
    fr: { 
      currency: 'EUR', 
      format: { style: 'currency', currency: 'EUR', locale: 'fr-FR' }
    },
    de: { 
      currency: 'EUR', 
      format: { style: 'currency', currency: 'EUR', locale: 'de-DE' }
    },
    zh: { 
      currency: 'CNY', 
      format: { style: 'currency', currency: 'CNY', locale: 'zh-CN' }
    },
    ja: { 
      currency: 'JPY', 
      format: { style: 'currency', currency: 'JPY', locale: 'ja-JP' }
    },
  },
};

// URL patterns for different locales
export const LOCALE_URL_PATTERNS = {
  en: '', // Default locale has no prefix
  es: '/es',
  fr: '/fr',
  de: '/de',
};

// Detect locale from various sources
export function detectLocale(
  urlLocale?: string,
  browserLocale?: string,
  cookieLocale?: string
): Locale {
  // Priority: URL > Cookie > Browser > Default
  if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale as Locale)) {
    return urlLocale as Locale;
  }
  
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }
  
  if (browserLocale) {
    // Extract language code from browser locale (e.g., 'en-US' -> 'en')
    const langCode = browserLocale.split('-')[0] as Locale;
    if (SUPPORTED_LOCALES.includes(langCode)) {
      return langCode;
    }
  }
  
  return DEFAULT_LOCALE;
}

// Generate alternate URLs for different locales
export function generateAlternateUrls(basePath: string): Record<Locale, string> {
  const alternates: Record<string, string> = {};
  
  SUPPORTED_LOCALES.forEach(locale => {
    const prefix = LOCALE_URL_PATTERNS[locale as keyof typeof LOCALE_URL_PATTERNS] || '';
    alternates[locale] = `${prefix}${basePath}`;
  });
  
  return alternates;
}
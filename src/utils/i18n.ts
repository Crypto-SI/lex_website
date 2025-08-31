import { Locale, TranslationParams, TranslationSet } from '@/types/i18n';
import { I18N_CONFIG } from '@/config/i18n';

// Translation loading
export async function loadTranslations(locale: Locale): Promise<Record<string, string>> {
  try {
    // Dynamic import of translation files
    const translations = await import(`@/translations/${locale}.json`);
    return flattenTranslations(translations.default);
  } catch (error) {
    console.error(`Failed to load translations for locale ${locale}:`, error);
    
    // Fallback to default locale
    if (locale !== I18N_CONFIG.fallbackLocale) {
      return loadTranslations(I18N_CONFIG.fallbackLocale);
    }
    
    return {};
  }
}

// Flatten nested translation object to dot notation
export function flattenTranslations(
  obj: any, 
  prefix: string = '', 
  result: Record<string, string> = {}
): Record<string, string> {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Skip metadata object
        if (key === 'metadata') continue;
        flattenTranslations(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

// Translation function with parameter substitution
export function translateKey(
  key: string, 
  translations: Record<string, string>, 
  params?: TranslationParams,
  fallbackLocale?: Locale
): string {
  let translation = translations[key];
  
  // If translation not found, try fallback
  if (!translation && fallbackLocale) {
    // In a real implementation, you might want to load fallback translations
    // For now, return the key as fallback
    translation = key;
  }
  
  if (!translation) {
    // Return key if no translation found (useful for development)
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  
  // Parameter substitution
  if (params) {
    return Object.entries(params).reduce((result, [paramKey, value]) => {
      const placeholder = `{{${paramKey}}}`;
      return result.replace(new RegExp(placeholder, 'g'), String(value));
    }, translation);
  }
  
  return translation;
}

// Pluralization support
export function pluralize(
  key: string, 
  count: number, 
  translations: Record<string, string>
): string {
  const rules = ['zero', 'one', 'two', 'few', 'many', 'other'];
  
  // Simple English pluralization rules
  let rule = 'other';
  if (count === 0) rule = 'zero';
  else if (count === 1) rule = 'one';
  else if (count === 2) rule = 'two';
  
  const pluralKey = `${key}.${rule}`;
  const translation = translations[pluralKey] || translations[`${key}.other`] || translations[key];
  
  return translateKey(pluralKey, translations, { count });
}

// Date formatting
export function formatDate(date: Date, locale: Locale): string {
  const format = I18N_CONFIG.dateFormat[locale] || I18N_CONFIG.dateFormat[I18N_CONFIG.defaultLocale];
  
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (error) {
    console.error(`Date formatting error for locale ${locale}:`, error);
    return date.toLocaleDateString();
  }
}

// Number formatting
export function formatNumber(number: number, locale: Locale): string {
  const options = I18N_CONFIG.numberFormat[locale] || I18N_CONFIG.numberFormat[I18N_CONFIG.defaultLocale];
  
  try {
    return new Intl.NumberFormat(locale, options).format(number);
  } catch (error) {
    console.error(`Number formatting error for locale ${locale}:`, error);
    return number.toString();
  }
}

// Currency formatting
export function formatCurrency(amount: number, locale: Locale): string {
  const config = I18N_CONFIG.currencyFormat[locale] || I18N_CONFIG.currencyFormat[I18N_CONFIG.defaultLocale];
  
  try {
    return new Intl.NumberFormat(locale, config.format).format(amount);
  } catch (error) {
    console.error(`Currency formatting error for locale ${locale}:`, error);
    return `${config.currency} ${amount}`;
  }
}

// Relative time formatting (e.g., "2 hours ago")
export function formatRelativeTime(date: Date, locale: Locale): string {
  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
    
    const intervals = [
      { unit: 'year' as const, seconds: 31536000 },
      { unit: 'month' as const, seconds: 2592000 },
      { unit: 'day' as const, seconds: 86400 },
      { unit: 'hour' as const, seconds: 3600 },
      { unit: 'minute' as const, seconds: 60 },
      { unit: 'second' as const, seconds: 1 }
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
      if (count >= 1) {
        return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit);
      }
    }
    
    return rtf.format(0, 'second');
  } catch (error) {
    console.error(`Relative time formatting error for locale ${locale}:`, error);
    return date.toLocaleDateString();
  }
}

// URL localization
export function localizeUrl(path: string, locale: Locale): string {
  // Remove existing locale prefix if any
  const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
  
  // Add locale prefix for non-default locales
  if (locale !== I18N_CONFIG.defaultLocale) {
    return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
  }
  
  return cleanPath;
}

// Extract locale from URL
export function getLocaleFromUrl(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && I18N_CONFIG.supportedLocales.includes(firstSegment as Locale)) {
    return {
      locale: firstSegment as Locale,
      path: '/' + segments.slice(1).join('/')
    };
  }
  
  return {
    locale: I18N_CONFIG.defaultLocale,
    path: pathname
  };
}

// Validation helpers
export function validateTranslations(translations: TranslationSet): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!translations.locale) {
    errors.push('Missing locale');
  }
  
  if (!translations.translations || Object.keys(translations.translations).length === 0) {
    errors.push('No translations provided');
  }
  
  if (!translations.metadata) {
    errors.push('Missing metadata');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Development helper to find missing translations
export function findMissingTranslations(
  baseTranslations: Record<string, string>,
  targetTranslations: Record<string, string>
): string[] {
  const missing: string[] = [];
  
  for (const key in baseTranslations) {
    if (!targetTranslations[key]) {
      missing.push(key);
    }
  }
  
  return missing;
}
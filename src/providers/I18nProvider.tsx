'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, I18nContextType, TranslationParams, LocaleConfig } from '@/types/i18n';
import { I18N_CONFIG, detectLocale, LOCALE_CONFIGS } from '@/config/i18n';
import { loadTranslations, translateKey, formatDate, formatNumber, formatCurrency } from '@/utils/i18n';

const I18nContext = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(
    initialLocale || I18N_CONFIG.defaultLocale
  );
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations when locale changes
  useEffect(() => {
    const loadLocaleTranslations = async () => {
      setIsLoading(true);
      try {
        const localeTranslations = await loadTranslations(currentLocale);
        setTranslations(localeTranslations);
      } catch (error) {
        console.error(`Failed to load translations for locale ${currentLocale}:`, error);
        // Fallback to default locale if current locale fails
        if (currentLocale !== I18N_CONFIG.fallbackLocale) {
          const fallbackTranslations = await loadTranslations(I18N_CONFIG.fallbackLocale);
          setTranslations(fallbackTranslations);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLocaleTranslations();
  }, [currentLocale]);

  // Detect initial locale from browser/URL/cookie
  useEffect(() => {
    if (!initialLocale) {
      const browserLocale = typeof window !== 'undefined' ? navigator.language : undefined;
      const cookieLocale = typeof document !== 'undefined' 
        ? document.cookie
            .split('; ')
            .find(row => row.startsWith('locale='))
            ?.split('=')[1]
        : undefined;
      
      const detectedLocale = detectLocale(undefined, browserLocale, cookieLocale);
      setCurrentLocale(detectedLocale);
    }
  }, [initialLocale]);

  const setLocale = (locale: Locale) => {
    setCurrentLocale(locale);
    
    // Save to cookie
    if (typeof document !== 'undefined') {
      document.cookie = `locale=${locale}; path=/; max-age=31536000`; // 1 year
    }
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  };

  const t = (key: string, params?: TranslationParams): string => {
    return translateKey(key, translations, params, I18N_CONFIG.fallbackLocale);
  };

  const formatDateForLocale = (date: Date): string => {
    return formatDate(date, currentLocale);
  };

  const formatNumberForLocale = (number: number): string => {
    return formatNumber(number, currentLocale);
  };

  const formatCurrencyForLocale = (amount: number): string => {
    return formatCurrency(amount, currentLocale);
  };

  const isRTL = LOCALE_CONFIGS[currentLocale]?.rtl || false;
  
  const availableLocales: LocaleConfig[] = I18N_CONFIG.supportedLocales.map(
    locale => LOCALE_CONFIGS[locale]
  );

  const contextValue: I18nContextType = {
    currentLocale,
    setLocale,
    t,
    formatDate: formatDateForLocale,
    formatNumber: formatNumberForLocale,
    formatCurrency: formatCurrencyForLocale,
    isRTL,
    availableLocales,
  };

  // Show loading state while translations are loading
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Convenience hooks
export function useTranslation() {
  const { t } = useI18n();
  return { t };
}

export function useLocale() {
  const { currentLocale, setLocale, availableLocales } = useI18n();
  return { currentLocale, setLocale, availableLocales };
}

export function useFormatting() {
  const { formatDate, formatNumber, formatCurrency } = useI18n();
  return { formatDate, formatNumber, formatCurrency };
}
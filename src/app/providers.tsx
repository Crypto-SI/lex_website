'use client'

import { ChakraProvider } from "@chakra-ui/react"
import { lexSystem } from "@/theme"
import { ContentProvider } from "@/providers/ContentProvider"
import { I18nProvider } from "@/providers/I18nProvider"
import { loadSiteContent } from "@/utils/contentLoader"
import { useState, useEffect } from "react"
import { Locale } from "@/types/i18n"
import { I18N_CONFIG } from "@/config/i18n"
import { initPerformanceMonitoring } from "@/utils/performance"
import { initRUM } from "@/utils/rum"
import dynamic from 'next/dynamic'

// Dynamically import PerformanceMonitor to reduce initial bundle size
const PerformanceMonitor = dynamic(
  () => import("@/components/monitoring/PerformanceMonitor").then(mod => ({ default: mod.PerformanceMonitor })),
  { 
    ssr: false,
    loading: () => null
  }
)

export function Providers({ children }: { children: React.ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(I18N_CONFIG.defaultLocale);
  const siteContent = loadSiteContent();
  
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Initialize Real User Monitoring
    initRUM({
      sampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1, // 100% in dev, 10% in prod
      enableErrorTracking: true,
      enableInteractionTracking: true,
      enableResourceTracking: true,
    });
  }, []);
  
  return (
    <ChakraProvider value={lexSystem}>
      <I18nProvider initialLocale={currentLocale}>
        <ContentProvider 
          content={siteContent} 
          currentLocale={currentLocale}
          onLocaleChange={setCurrentLocale}
        >
          {children}
          <PerformanceMonitor 
            showDetails={process.env.NODE_ENV === 'development'}
            enableAlerts={true}
            position="bottom-right"
          />
        </ContentProvider>
      </I18nProvider>
    </ChakraProvider>
  )
} 
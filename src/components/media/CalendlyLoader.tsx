'use client'

import { useState, useCallback, useEffect } from 'react'
import { loadScript, ScriptLoaderState } from './ScriptLoader'
import { ExternalServiceManager, OfflineManager } from '@/utils/externalServices'

// Calendly configuration with enhanced security
const CALENDLY_CONFIG = {
  script: {
    name: 'calendly-widget',
    primaryUrl: 'https://assets.calendly.com/assets/external/widget.js',
    fallbackUrls: ['https://calendly.com/assets/external/widget.js'],
    crossOrigin: 'anonymous' as const,
    timeout: 15000,
    retryAttempts: 2
  },
  style: {
    name: 'calendly-styles',
    primaryUrl: 'https://assets.calendly.com/assets/external/widget.css',
    fallbackUrls: ['https://calendly.com/assets/external/widget.css'],
    timeout: 10000,
    retryAttempts: 1
  }
}

// Global Calendly interface
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void
      closePopupWidget: () => void
      showPopupWidget: (url: string) => void
    }
  }
}

export interface CalendlyLoaderState extends ScriptLoaderState {
  stylesLoaded: boolean
}

export interface CalendlyOptions {
  url: string
  prefill?: Record<string, any>
  utm?: Record<string, any>
}

/**
 * Load Calendly with enhanced security and fallbacks
 */
export const loadCalendly = async (): Promise<void> => {
  try {
    // Check if offline
    if (!OfflineManager.getStatus()) {
      throw new Error('Cannot load Calendly: Device is offline');
    }

    // Load styles and script in parallel with enhanced security
    const [styleResult, scriptResult] = await Promise.all([
      ExternalServiceManager.loadStylesheet(CALENDLY_CONFIG.style),
      ExternalServiceManager.loadScript(CALENDLY_CONFIG.script)
    ]);

    // Log results for monitoring
    if (styleResult.isFallback) {
      console.warn('Calendly styles loaded from fallback URL');
    }
    if (scriptResult.isFallback) {
      console.warn('Calendly script loaded from fallback URL');
    }

    // Verify script loaded successfully
    if (!scriptResult.success) {
      throw scriptResult.error || new Error('Failed to load Calendly script');
    }

    // Verify Calendly is available
    if (!window.Calendly) {
      throw new Error('Calendly object not available after script load');
    }

    console.log('Calendly loaded successfully with enhanced security');
  } catch (error) {
    console.error('Failed to load Calendly with enhanced security:', error);
    throw error;
  }
}

/**
 * Hook for managing Calendly loading and interactions
 */
export const useCalendly = () => {
  const [state, setState] = useState<CalendlyLoaderState>({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    error: null,
    stylesLoaded: false
  })

  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize offline manager and check if Calendly is already loaded
  useEffect(() => {
    OfflineManager.initialize();

    if (window.Calendly && ExternalServiceManager.isServiceLoaded('calendly-widget')) {
      setState({
        isLoading: false,
        isLoaded: true,
        hasError: false,
        error: null,
        stylesLoaded: true
      })
      setIsInitialized(true)
    }

    // Listen for offline/online status changes
    const handleOfflineStatus = (online: boolean) => {
      if (!online && state.isLoading) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasError: true,
          error: new Error('Device went offline during Calendly load')
        }));
      }
    };

    OfflineManager.addListener(handleOfflineStatus);

    return () => {
      OfflineManager.removeListener(handleOfflineStatus);
    };
  }, [])

  const initializeCalendly = useCallback(async () => {
    if (isInitialized) return

    setState(prev => ({ ...prev, isLoading: true, hasError: false, error: null }))

    try {
      await loadCalendly()
      setState({
        isLoading: false,
        isLoaded: true,
        hasError: false,
        error: null,
        stylesLoaded: true
      })
      setIsInitialized(true)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error loading Calendly')
      setState({
        isLoading: false,
        isLoaded: false,
        hasError: true,
        error: err,
        stylesLoaded: false
      })
    }
  }, [isInitialized])

  const openPopup = useCallback(async (options: CalendlyOptions) => {
    try {
      // Check if offline
      if (!OfflineManager.getStatus()) {
        throw new Error('Cannot open Calendly: Device is offline');
      }

      if (!isInitialized) {
        await initializeCalendly()
      }

      if (window.Calendly) {
        window.Calendly.initPopupWidget(options)
      } else {
        throw new Error('Calendly not available')
      }
    } catch (error) {
      console.warn('Calendly popup failed, using secure fallback:', error)
      
      // Enhanced fallback with security checks
      try {
        const url = new URL(options.url);
        if (url.hostname !== 'calendly.com') {
          throw new Error('Invalid Calendly URL');
        }

        const popup = window.open(
          options.url, 
          'calendly-popup', 
          'width=800,height=700,scrollbars=yes,resizable=yes,centerscreen=yes,noopener=yes,noreferrer=yes'
        )
        
        if (!popup) {
          // If popup blocked, show offline fallback
          const fallback = OfflineManager.createOfflineFallback(
            'Calendly',
            `Please visit <a href="${options.url}" target="_blank" rel="noopener noreferrer">this link</a> to schedule your appointment.`
          );
          document.body.appendChild(fallback);
          
          // Remove fallback after 10 seconds
          setTimeout(() => {
            if (fallback.parentNode) {
              fallback.parentNode.removeChild(fallback);
            }
          }, 10000);
        }
      } catch (urlError) {
        console.error('Invalid Calendly URL provided:', urlError);
      }
    }
  }, [isInitialized, initializeCalendly])

  const openInline = useCallback(async (element: HTMLElement, options: CalendlyOptions) => {
    try {
      // Check if offline
      if (!OfflineManager.getStatus()) {
        throw new Error('Cannot load Calendly: Device is offline');
      }

      if (!isInitialized) {
        await initializeCalendly()
      }

      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: options.url,
          parentElement: element
        })
      } else {
        throw new Error('Calendly not available')
      }
    } catch (error) {
      console.error('Failed to open Calendly inline:', error)
      
      // Enhanced fallback with security validation
      try {
        const url = new URL(options.url);
        if (url.hostname !== 'calendly.com') {
          throw new Error('Invalid Calendly URL');
        }

        // Create secure fallback content
        element.innerHTML = `
          <div style="
            padding: 20px;
            border: 2px solid #0069ff;
            border-radius: 8px;
            text-align: center;
            background-color: #f8f9fa;
          ">
            <h3>Schedule a Meeting</h3>
            <p>Click the link below to schedule your appointment:</p>
            <a href="${options.url}" 
               target="_blank" 
               rel="noopener noreferrer"
               style="
                 display: inline-block;
                 padding: 12px 24px;
                 background-color: #0069ff;
                 color: white;
                 text-decoration: none;
                 border-radius: 6px;
                 font-weight: bold;
               ">
              Schedule Now
            </a>
          </div>
        `;
      } catch (urlError) {
        console.error('Invalid Calendly URL provided:', urlError);
        element.innerHTML = '<p>Unable to load scheduling widget. Please contact us directly.</p>';
      }
    }
  }, [isInitialized, initializeCalendly])

  const closePopup = useCallback(() => {
    if (window.Calendly) {
      window.Calendly.closePopupWidget()
    }
  }, [])

  return {
    state,
    isInitialized,
    initializeCalendly,
    openPopup,
    openInline,
    closePopup
  }
}

/**
 * Component for Calendly popup trigger
 */
export interface CalendlyPopupProps {
  url: string
  children: (props: { onClick: () => void; isLoading: boolean; hasError: boolean }) => React.ReactNode
  prefill?: Record<string, any>
  utm?: Record<string, any>
  onError?: (error: Error) => void
}

export const CalendlyPopup: React.FC<CalendlyPopupProps> = ({
  url,
  children,
  prefill,
  utm,
  onError
}) => {
  const { state, openPopup } = useCalendly()

  const handleClick = useCallback(async () => {
    try {
      await openPopup({ url, prefill, utm })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to open Calendly')
      console.warn('CalendlyPopup error, using direct link fallback:', err)
      onError?.(err)
      
      // Always provide fallback - open Calendly page directly
      const popup = window.open(
        url, 
        'calendly-fallback', 
        'width=800,height=700,scrollbars=yes,resizable=yes'
      )
      
      if (!popup) {
        // If popup is blocked, navigate directly
        window.location.href = url
      }
    }
  }, [url, prefill, utm, openPopup, onError])

  return (
    <>
      {children({
        onClick: handleClick,
        isLoading: state.isLoading,
        hasError: state.hasError
      })}
    </>
  )
}

/**
 * Component for Calendly inline widget
 */
export interface CalendlyInlineProps {
  url: string
  height?: string
  prefill?: Record<string, any>
  utm?: Record<string, any>
  onError?: (error: Error) => void
  fallback?: React.ReactNode
}

export const CalendlyInline: React.FC<CalendlyInlineProps> = ({
  url,
  height = '600px',
  prefill,
  utm,
  onError,
  fallback
}) => {
  const { state, openInline } = useCalendly()
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef && state.isLoaded) {
      openInline(containerRef, { url, prefill, utm }).catch((error) => {
        onError?.(error)
      })
    }
  }, [containerRef, state.isLoaded, url, prefill, utm, openInline, onError])

  if (state.hasError && fallback) {
    return <>{fallback}</>
  }

  return (
    <div
      ref={setContainerRef}
      h={height}
      minH={height}
      data-calendly-inline-widget
    />
  )
}
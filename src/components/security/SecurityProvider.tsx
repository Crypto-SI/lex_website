'use client'

import { useEffect } from 'react'
import { setupCSPViolationReporting } from '@/utils/csp'
import { OfflineManager } from '@/utils/externalServices'

interface SecurityProviderProps {
  children: React.ReactNode
}

/**
 * Security provider that initializes security features
 */
export function SecurityProvider({ children }: SecurityProviderProps) {
  useEffect(() => {
    // Initialize CSP violation reporting
    setupCSPViolationReporting()

    // Initialize offline manager
    OfflineManager.initialize()

    // Log security initialization
    console.log('Security features initialized:', {
      cspReporting: true,
      offlineDetection: true,
      timestamp: new Date().toISOString()
    })

    // Add security event listeners
    const handleSecurityEvent = (event: Event) => {
      console.warn('Security event detected:', event.type, event)
    }

    // Listen for various security-related events
    window.addEventListener('securitypolicyviolation', handleSecurityEvent)
    window.addEventListener('unhandledrejection', (event) => {
      // Log unhandled promise rejections that might indicate security issues
      if (event.reason?.message?.includes('CSP') || 
          event.reason?.message?.includes('integrity') ||
          event.reason?.message?.includes('CORS')) {
        console.warn('Security-related unhandled rejection:', event.reason)
      }
    })

    return () => {
      window.removeEventListener('securitypolicyviolation', handleSecurityEvent)
    }
  }, [])

  return <>{children}</>
}

/**
 * Hook to check if security features are available
 */
export function useSecurityStatus() {
  useEffect(() => {
    const checkSecurityFeatures = () => {
      const features = {
        csp: 'securitypolicyviolation' in window,
        crypto: 'crypto' in window && 'getRandomValues' in window.crypto,
        fetch: 'fetch' in window,
        localStorage: (() => {
          try {
            const test = '__security_test__'
            localStorage.setItem(test, test)
            localStorage.removeItem(test)
            return true
          } catch {
            return false
          }
        })(),
        onlineStatus: 'onLine' in navigator
      }

      console.log('Security features availability:', features)
      return features
    }

    checkSecurityFeatures()
  }, [])
}
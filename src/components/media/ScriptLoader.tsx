'use client'

import { useState, useEffect, useCallback } from 'react'

export interface ScriptConfig {
  src: string
  integrity?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  async?: boolean
  defer?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
  timeout?: number
}

export interface ScriptLoaderState {
  isLoading: boolean
  isLoaded: boolean
  hasError: boolean
  error: Error | null
}

// Global script cache to prevent duplicate loads
const scriptCache = new Map<string, Promise<void>>()
const loadedScripts = new Set<string>()

/**
 * Utility function to load external scripts with integrity checks and error handling
 */
export const loadScript = (config: ScriptConfig): Promise<void> => {
  const { src, integrity, crossOrigin, async = true, defer = false, timeout = 10000 } = config

  // Return cached promise if script is already loading
  if (scriptCache.has(src)) {
    return scriptCache.get(src)!
  }

  // Return resolved promise if script is already loaded
  if (loadedScripts.has(src)) {
    return Promise.resolve()
  }

  const promise = new Promise<void>((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      loadedScripts.add(src)
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = async
    script.defer = defer

    if (integrity) {
      script.integrity = integrity
    }

    if (crossOrigin) {
      script.crossOrigin = crossOrigin
    }

    // Set up timeout
    const timeoutId = setTimeout(() => {
      cleanup()
      reject(new Error(`Script load timeout: ${src}`))
    }, timeout)

    const cleanup = () => {
      clearTimeout(timeoutId)
      script.removeEventListener('load', onLoad)
      script.removeEventListener('error', onError)
    }

    const onLoad = () => {
      cleanup()
      loadedScripts.add(src)
      config.onLoad?.()
      resolve()
    }

    const onError = (event: Event | string) => {
      cleanup()
      script.remove()
      const errorDetails = event instanceof Event ? 
        `Network error or CORS issue` : 
        `Error: ${event}`
      const error = new Error(`Failed to load script: ${src} - ${errorDetails}`)
      console.error('Script load error details:', {
        src,
        event,
        scriptElement: script,
        readyState: document.readyState
      })
      config.onError?.(error)
      reject(error)
    }

    script.addEventListener('load', onLoad)
    script.addEventListener('error', onError)

    document.head.appendChild(script)
  })

  scriptCache.set(src, promise)
  return promise
}

/**
 * React hook for loading external scripts
 */
export const useScriptLoader = (config: ScriptConfig | null): ScriptLoaderState => {
  const [state, setState] = useState<ScriptLoaderState>({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    error: null
  })

  useEffect(() => {
    if (!config) return

    const { src } = config

    // Check if already loaded
    if (loadedScripts.has(src)) {
      setState({
        isLoading: false,
        isLoaded: true,
        hasError: false,
        error: null
      })
      return
    }

    setState(prev => ({ ...prev, isLoading: true, hasError: false, error: null }))

    loadScript(config)
      .then(() => {
        setState({
          isLoading: false,
          isLoaded: true,
          hasError: false,
          error: null
        })
      })
      .catch((error) => {
        setState({
          isLoading: false,
          isLoaded: false,
          hasError: true,
          error
        })
      })
  }, [config])

  return state
}

/**
 * Component for loading scripts with render props pattern
 */
export interface ScriptLoaderProps extends ScriptConfig {
  children: (state: ScriptLoaderState) => React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
}

export const ScriptLoader: React.FC<ScriptLoaderProps> = ({
  children,
  fallback,
  errorFallback,
  ...config
}) => {
  const state = useScriptLoader(config)

  if (state.hasError && errorFallback) {
    return <>{errorFallback}</>
  }

  if (state.isLoading && fallback) {
    return <>{fallback}</>
  }

  return <>{children(state)}</>
}

/**
 * Preload scripts without executing them
 */
export const preloadScript = (src: string, integrity?: string): void => {
  // Check if already preloaded
  if (document.querySelector(`link[href="${src}"][rel="preload"]`)) {
    return
  }

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'script'
  link.href = src

  if (integrity) {
    link.integrity = integrity
  }

  document.head.appendChild(link)
}

/**
 * Remove loaded script from cache and DOM
 */
export const unloadScript = (src: string): void => {
  const script = document.querySelector(`script[src="${src}"]`)
  if (script) {
    script.remove()
  }
  
  scriptCache.delete(src)
  loadedScripts.delete(src)
}

/**
 * Get loading state of a script
 */
export const getScriptState = (src: string): 'not-loaded' | 'loading' | 'loaded' => {
  if (loadedScripts.has(src)) return 'loaded'
  if (scriptCache.has(src)) return 'loading'
  return 'not-loaded'
}
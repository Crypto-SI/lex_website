/**
 * State Management Utilities
 * Provides consistent patterns for client-side state management with proper SSR handling
 */

import { useState, useEffect } from 'react';

/**
 * Hook for safely accessing localStorage with SSR support
 * @param key - localStorage key
 * @param defaultValue - default value if key doesn't exist
 * @returns [value, setValue, isLoaded]
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
      setIsLoaded(true);
    }
  }, [key]);

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue, isLoaded];
}

/**
 * Hook for safely accessing sessionStorage with SSR support
 * @param key - sessionStorage key
 * @param defaultValue - default value if key doesn't exist
 * @returns [value, setValue, isLoaded]
 */
export function useSessionStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      try {
        const item = sessionStorage.getItem(key);
        if (item) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading sessionStorage key "${key}":`, error);
      }
      setIsLoaded(true);
    }
  }, [key]);

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue, isLoaded];
}

/**
 * Hook for client-side only state that doesn't render until hydrated
 * Useful for preventing hydration mismatches
 * @param initialValue - initial state value
 * @returns [value, setValue, isClient]
 */
export function useClientState<T>(
  initialValue: T
): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return [value, setValue, isClient];
}

/**
 * Hook for managing loading states with proper error handling
 * @param asyncFunction - async function to execute
 * @returns { execute, loading, error, data, reset }
 */
export function useAsyncState<T, P extends any[] = []>(
  asyncFunction: (...args: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (...args: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    execute,
    loading,
    error,
    data,
    reset,
  };
}

/**
 * Hook for managing form state with validation
 * @param initialValues - initial form values
 * @param validate - validation function
 * @returns form state and handlers
 */
export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const setFieldTouched = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    if (!validate) return true;
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (onSubmit: (values: T) => Promise<void> | void) => {
    setIsSubmitting(true);
    
    try {
      const isValid = validateForm();
      if (!isValid) return;
      
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setTouched: setFieldTouched,
    handleSubmit,
    validateForm,
    reset,
  };
}

/**
 * Type guard for checking if code is running on client side
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Type guard for checking if code is running on server side
 */
export const isServer = (): boolean => {
  return typeof window === 'undefined';
};
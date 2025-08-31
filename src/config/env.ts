/**
 * Environment Configuration
 * Centralized environment variable management with validation
 */

// Environment variable schema
interface EnvironmentConfig {
  // Application
  APP_NAME: string;
  APP_URL: string;
  APP_DESCRIPTION: string;
  
  // Build
  NODE_ENV: 'development' | 'production' | 'test';
  BUILD_ID?: string;
  VERSION: string;
  BUILD_TIME?: string;
  
  // Security
  CSP_NONCE?: string;
  CSRF_SECRET?: string;
  
  // External Services
  CALENDLY_URL?: string;
  CALENDLY_API_KEY?: string;
  
  // Analytics
  GA_ID?: string;
  GTM_ID?: string;
}

// Default values
const defaultConfig: Partial<EnvironmentConfig> = {
  APP_NAME: 'Lex Consulting',
  APP_URL: 'https://lexconsulting.com',
  APP_DESCRIPTION: 'Professional consulting services',
  NODE_ENV: 'production',
  VERSION: '1.0.0',
};

// Get environment variable with fallback
function getEnvVar(key: string, fallback?: string): string {
  const publicKey = `NEXT_PUBLIC_${key}`;
  
  // Check public env var first (client-side accessible)
  if (typeof window !== 'undefined') {
    return process.env[publicKey] || fallback || '';
  }
  
  // Server-side: check both public and private
  return process.env[publicKey] || process.env[key] || fallback || '';
}

// Validate required environment variables
function validateEnvironment(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    APP_NAME: getEnvVar('APP_NAME', defaultConfig.APP_NAME!),
    APP_URL: getEnvVar('APP_URL', defaultConfig.APP_URL!),
    APP_DESCRIPTION: getEnvVar('APP_DESCRIPTION', defaultConfig.APP_DESCRIPTION!),
    NODE_ENV: (getEnvVar('NODE_ENV', defaultConfig.NODE_ENV!) as EnvironmentConfig['NODE_ENV']),
    BUILD_ID: getEnvVar('BUILD_ID'),
    VERSION: getEnvVar('VERSION', defaultConfig.VERSION!),
    BUILD_TIME: getEnvVar('BUILD_TIME'),
    CSP_NONCE: getEnvVar('CSP_NONCE'),
    CSRF_SECRET: getEnvVar('CSRF_SECRET'),
    CALENDLY_URL: getEnvVar('CALENDLY_URL'),
    CALENDLY_API_KEY: getEnvVar('CALENDLY_API_KEY'),
    GA_ID: getEnvVar('GA_ID'),
    GTM_ID: getEnvVar('GTM_ID'),
  };

  // Validate required fields
  const requiredFields: (keyof EnvironmentConfig)[] = [
    'APP_NAME',
    'APP_URL',
    'NODE_ENV',
    'VERSION'
  ];

  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required environment variable: ${field}`);
    }
  }

  return config;
}

// Export validated configuration
export const env = validateEnvironment();

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Build information
export const buildInfo = {
  version: env.VERSION,
  buildId: env.BUILD_ID,
  buildTime: env.BUILD_TIME,
  nodeEnv: env.NODE_ENV,
};

// Feature flags based on environment
export const features = {
  analytics: isProduction && (env.GA_ID || env.GTM_ID),
  calendly: Boolean(env.CALENDLY_URL),
  csp: Boolean(env.CSP_NONCE),
  csrf: Boolean(env.CSRF_SECRET),
};

// Export types
export type { EnvironmentConfig };
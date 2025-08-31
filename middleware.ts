import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next()

    // Environment-aware configuration
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    // Basic security headers (always applied)
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-DNS-Prefetch-Control', 'on')

    // Production-only security headers
    if (!isDevelopment) {
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
      
      // HSTS for HTTPS
      if (request.nextUrl.protocol === 'https:') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
      }
    }

    // Content Security Policy
    let cspHeader: string
    
    if (isDevelopment) {
      // Development: More permissive CSP
      cspHeader = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self' data:",
        "img-src 'self' data: blob: https: http:",
        "media-src 'self' data: blob:",
        "connect-src 'self' ws: wss:",
        "frame-src 'self'",
        "object-src 'none'"
      ].join('; ')
    } else {
      // Production: Strict CSP with external services
      try {
        // Try to use CSPManager if available (synchronous fallback)
        const cspModule = require('./src/utils/csp')
        cspHeader = cspModule.CSPManager.getCSPHeader()
      } catch {
        // Fallback CSP if CSPManager fails
        cspHeader = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://www.googletagmanager.com https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline' https://assets.calendly.com https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com https://assets.calendly.com",
          "img-src 'self' data: blob: https: http:",
          "media-src 'self' data: blob:",
          "connect-src 'self' https://assets.calendly.com https://api.calendly.com https://www.google-analytics.com",
          "frame-src 'self' https://calendly.com https://assets.calendly.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "upgrade-insecure-requests"
        ].join('; ')
      }
    }

    response.headers.set('Content-Security-Policy', cspHeader)

    // Add build information header (development only)
    if (isDevelopment) {
      response.headers.set('X-Build-Time', process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString())
      response.headers.set('X-Environment', 'development')
    }

    return response
  } catch (error) {
    // Fallback: return basic response if middleware fails
    console.error('Middleware error:', error)
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
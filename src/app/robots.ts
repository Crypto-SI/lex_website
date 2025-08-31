import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lexconsulting.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/demo-*', // Disallow demo pages
          '/api/', // Disallow API routes if any
          '/_next/', // Disallow Next.js internal files
          '/admin/', // Disallow admin areas if any
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI's web crawler
        disallow: '/', // Disallow AI training on content
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawl bot
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
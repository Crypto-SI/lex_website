/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables are handled in webpack DefinePlugin below

  // Simplified webpack configuration to avoid cache issues
  webpack: (config, { dev, isServer, webpack }) => {
    // Disable problematic filesystem caching in development
    if (dev) {
      config.cache = false;
    }

    // Reduce webpack warnings
    config.stats = {
      preset: 'errors-warnings',
      chunks: false,
      modules: false,
      children: false,
      warningsFilter: [
        /Serializing big strings/,
        /webpack\.cache\.PackFileCacheStrategy/,
      ],
    };

    // Optimize bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        maxSize: 200000, // 200kb max chunk size
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          content: {
            test: /[\\/]content[\\/].*\.json$/,
            name: 'content',
            chunks: 'all',
            priority: 20,
            maxSize: 100000,
          },
          utils: {
            test: /[\\/]utils[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 15,
            maxSize: 150000,
          },
          security: {
            test: /[\\/]utils[\\/](security|csp|externalServices)\.ts$/,
            name: 'security',
            chunks: 'all',
            priority: 25,
          },
        },
      },
    };

    // Add environment definitions
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_BUILD_TIME': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      })
    );

    return config;
  },

  // Build configuration
  experimental: {
    optimizeCss: false,
    webpackBuildWorker: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Output configuration
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,

  // Build error handling
  eslint: {
    ignoreDuringBuilds: process.env.ESLINT_NO_DEV_ERRORS === 'true',
    dirs: ['src'],
  },

  typescript: {
    ignoreBuildErrors: process.env.TYPESCRIPT_NO_BUILD_ERRORS === 'true',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

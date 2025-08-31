// Webpack optimization configuration to reduce serialization warnings
const path = require('path');

module.exports = {
  // Optimize cache configuration
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    // Use compression to reduce serialization size
    compression: 'gzip',
    // Reduce cache size
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    // Store cache in a specific directory
    cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
  },

  // Optimize module resolution
  resolve: {
    // Reduce the number of files webpack needs to process
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    // Use aliases to reduce path resolution
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // Optimize build performance
  optimization: {
    // Split chunks to reduce individual bundle sizes
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Separate vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // Separate content files
        content: {
          test: /[\\/]content[\\/].*\.json$/,
          name: 'content',
          chunks: 'all',
          priority: 20,
        },
        // Separate utilities
        utils: {
          test: /[\\/]utils[\\/]/,
          name: 'utils',
          chunks: 'all',
          priority: 15,
        },
        // Separate components
        components: {
          test: /[\\/]components[\\/]/,
          name: 'components',
          chunks: 'all',
          priority: 5,
        },
      },
    },
    // Minimize bundle size
    minimize: true,
  },

  // Module rules for better handling of large files
  module: {
    rules: [
      {
        test: /\.json$/,
        type: 'json',
        // Use webpack's built-in JSON loader for better performance
        parser: {
          parse: JSON.parse,
        },
      },
    ],
  },

  // Performance optimizations
  performance: {
    // Increase the size limits to reduce warnings
    maxAssetSize: 500000, // 500kb
    maxEntrypointSize: 500000, // 500kb
    // Only show warnings for assets that are actually problematic
    assetFilter: function(assetFilename) {
      return !assetFilename.endsWith('.map');
    },
  },

  // Reduce the amount of information webpack outputs
  stats: {
    // Reduce verbose output
    chunks: false,
    modules: false,
    children: false,
    // Only show errors and warnings
    preset: 'errors-warnings',
  },
};
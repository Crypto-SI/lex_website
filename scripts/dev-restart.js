#!/usr/bin/env node

/**
 * Development server restart script
 * Cleans cache and restarts the development server
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning development cache...');

// Clean Next.js cache
const nextCacheDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextCacheDir)) {
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
  console.log('✅ Cleaned .next directory');
}

// Clean TypeScript build info
const tsBuildFiles = [
  'tsconfig.tsbuildinfo',
  'tsconfig.build.tsbuildinfo'
];

tsBuildFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ Cleaned ${file}`);
  }
});

console.log('🚀 Starting development server...');

try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start development server:', error.message);
  process.exit(1);
}
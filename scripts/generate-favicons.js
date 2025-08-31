#!/usr/bin/env node

/**
 * Favicon Generation Helper Script
 * 
 * This script provides instructions and utilities for generating
 * all required favicon formats from the SVG source.
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Lex Consulting Favicon Generator');
console.log('=====================================\n');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

// Check if SVG exists
if (!fs.existsSync(svgPath)) {
  console.error('❌ favicon.svg not found in public directory');
  process.exit(1);
}

console.log('✅ SVG favicon found at:', svgPath);
console.log('\n📋 Required favicon formats for your website:');
console.log('');
console.log('1. favicon.ico (16x16, 32x32) - Traditional favicon');
console.log('2. favicon-16x16.png - Small browser tabs');
console.log('3. favicon-32x32.png - Standard browser tabs');
console.log('4. apple-touch-icon.png (180x180) - iOS home screen');
console.log('5. android-chrome-192x192.png - Android home screen');
console.log('6. android-chrome-512x512.png - Android splash screen');
console.log('');

console.log('🛠️  Recommended generation methods:');
console.log('');
console.log('Option 1: Online Generator (Easiest)');
console.log('- Visit: https://favicon.io/favicon-converter/');
console.log('- Upload: public/favicon.svg');
console.log('- Download all generated files to public/ directory');
console.log('');

console.log('Option 2: Using ImageMagick (Command line)');
console.log('- Install ImageMagick: brew install imagemagick (macOS)');
console.log('- Run these commands from the public/ directory:');
console.log('');
console.log('  # Generate PNG versions');
console.log('  convert favicon.svg -resize 16x16 favicon-16x16.png');
console.log('  convert favicon.svg -resize 32x32 favicon-32x32.png');
console.log('  convert favicon.svg -resize 180x180 apple-touch-icon.png');
console.log('  convert favicon.svg -resize 192x192 android-chrome-192x192.png');
console.log('  convert favicon.svg -resize 512x512 android-chrome-512x512.png');
console.log('');
console.log('  # Generate ICO file');
console.log('  convert favicon.svg -resize 16x16 favicon-16.png');
console.log('  convert favicon.svg -resize 32x32 favicon-32.png');
console.log('  convert favicon-16.png favicon-32.png favicon.ico');
console.log('  rm favicon-16.png favicon-32.png');
console.log('');

console.log('Option 3: Using Sharp (Node.js)');
console.log('- npm install sharp');
console.log('- Use the sharp library to convert SVG to various PNG sizes');
console.log('');

console.log('🎯 Design Features of your new favicon:');
console.log('- Professional gradient background (Lex Deep Blue to Insight Blue)');
console.log('- Modern stylized "L" with rounded corners');
console.log('- Accent element for brand recognition');
console.log('- Optimized for small sizes (16x16 and 32x32)');
console.log('- Matches your brand color palette');
console.log('');

console.log('📱 Preview your favicon:');
console.log('- Open: http://localhost:3000/favicon-generator.html');
console.log('- View different sizes and formats');
console.log('');

console.log('✨ Once generated, your favicon will be automatically used by:');
console.log('- Browser tabs and bookmarks');
console.log('- iOS home screen (when saved as web app)');
console.log('- Android home screen (when saved as web app)');
console.log('- PWA app icon');
console.log('- Search engine results');
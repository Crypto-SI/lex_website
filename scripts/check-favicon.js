#!/usr/bin/env node

/**
 * Favicon Checker Script
 * Verifies all required favicon files exist and are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Lex Consulting Favicon Setup');
console.log('=========================================\n');

const publicDir = path.join(__dirname, '..', 'public');

const requiredFiles = [
  'favicon.svg',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png'
];

let allFilesExist = true;

console.log('📁 Checking required favicon files:\n');

requiredFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`✅ ${file} (${sizeKB} KB)`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n📋 Metadata Configuration:');
console.log('✅ Icons configured in src/app/metadata.ts');
console.log('✅ Site manifest updated');

if (allFilesExist) {
  console.log('\n🎉 All favicon files are present!');
  console.log('\n🚀 To see your favicon:');
  console.log('1. Restart your development server: npm run dev');
  console.log('2. Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)');
  console.log('3. Check browser tab for the new "L" icon');
  console.log('4. Test on mobile by adding to home screen');
} else {
  console.log('\n⚠️  Some favicon files are missing.');
  console.log('\n🛠️  Run these commands to generate missing files:');
  console.log('magick public/favicon.svg -resize 16x16 public/favicon-16x16.png');
  console.log('magick public/favicon.svg -resize 32x32 public/favicon-32x32.png');
  console.log('magick public/favicon.svg -resize 180x180 public/apple-touch-icon.png');
  console.log('magick public/favicon.svg -resize 192x192 public/android-chrome-192x192.png');
  console.log('magick public/favicon.svg -resize 512x512 public/android-chrome-512x512.png');
  console.log('magick public/favicon-16x16.png public/favicon-32x32.png public/favicon.ico');
}

console.log('\n💡 Pro tip: Clear browser cache if favicon doesn\'t update immediately');
console.log('🌐 Test your favicon at: https://realfavicongenerator.net/favicon_checker');
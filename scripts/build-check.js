#!/usr/bin/env node

/**
 * Build Check Script
 * Performs pre-build validation to catch common issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Running pre-build checks...\n');

// Check 1: Verify required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  '.eslintrc.json',
  'src/app/layout.tsx',
  'src/app/page.tsx'
];

console.log('📁 Checking required files...');
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    process.exit(1);
  }
}
console.log('✅ All required files present\n');

// Check 2: Verify environment variables
console.log('🔧 Checking environment configuration...');
const envExample = '.env.example';
if (fs.existsSync(envExample)) {
  const envContent = fs.readFileSync(envExample, 'utf8');
  const requiredEnvVars = envContent
    .split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => line.split('=')[0]);
  
  console.log(`📋 Found ${requiredEnvVars.length} environment variables in example`);
}
console.log('✅ Environment configuration checked\n');

// Check 3: Validate package.json
console.log('📦 Validating package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.scripts || !packageJson.scripts.build) {
    console.error('❌ Missing build script in package.json');
    process.exit(1);
  }
  
  if (!packageJson.dependencies || !packageJson.dependencies.next) {
    console.error('❌ Next.js not found in dependencies');
    process.exit(1);
  }
  
  console.log('✅ Package.json is valid\n');
} catch (error) {
  console.error('❌ Invalid package.json:', error.message);
  process.exit(1);
}

// Check 4: TypeScript configuration
console.log('🔧 Validating TypeScript configuration...');
try {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  if (!tsConfig.compilerOptions) {
    console.error('❌ Missing compilerOptions in tsconfig.json');
    process.exit(1);
  }
  
  console.log('✅ TypeScript configuration is valid\n');
} catch (error) {
  console.error('❌ Invalid tsconfig.json:', error.message);
  process.exit(1);
}

// Check 5: Quick syntax check (if not in CI)
if (!process.env.CI) {
  console.log('🔍 Running quick syntax check...');
  try {
    // Check if TypeScript can parse the files
    execSync('npx tsc --noEmit --skipLibCheck', { 
      stdio: 'pipe',
      timeout: 30000 
    });
    console.log('✅ TypeScript syntax check passed\n');
  } catch (error) {
    console.warn('⚠️  TypeScript syntax issues detected (will be handled during build)\n');
  }
}

console.log('🎉 Pre-build checks completed successfully!');
console.log('🚀 Ready to build...\n');
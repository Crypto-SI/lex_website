#!/usr/bin/env node

/**
 * Cleanup and optimization script for final performance improvements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Starting cleanup and optimization...\n');

/**
 * Check for unused dependencies
 */
function checkUnusedDependencies() {
  console.log('📦 Checking for unused dependencies...');
  
  try {
    // This would require depcheck package, but we'll do a basic check
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    
    console.log(`Found ${dependencies.length} dependencies and ${devDependencies.length} dev dependencies`);
    
    // Check for potentially unused dependencies
    const potentiallyUnused = [];
    
    // Dependencies that might not be directly imported
    const checkDeps = ['next-themes', 'web-vitals'];
    
    checkDeps.forEach(dep => {
      if (dependencies.includes(dep)) {
        // Simple grep check (not perfect but gives an idea)
        try {
          execSync(`grep -r "${dep}" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"`, { stdio: 'pipe' });
        } catch (e) {
          potentiallyUnused.push(dep);
        }
      }
    });
    
    if (potentiallyUnused.length > 0) {
      console.log('⚠️  Potentially unused dependencies:');
      potentiallyUnused.forEach(dep => console.log(`   - ${dep}`));
    } else {
      console.log('✅ No obviously unused dependencies found');
    }
    
  } catch (error) {
    console.warn('❌ Error checking dependencies:', error.message);
  }
}

/**
 * Find and report large files
 */
function findLargeFiles() {
  console.log('\n📊 Finding large files...');
  
  const largeFiles = [];
  const maxSize = 50000; // 50KB
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(itemPath);
      } else if (stats.isFile() && ['.ts', '.tsx', '.js', '.jsx'].includes(path.extname(item))) {
        if (stats.size > maxSize) {
          largeFiles.push({
            path: path.relative(process.cwd(), itemPath),
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(1)
          });
        }
      }
    });
  }
  
  scanDirectory('src');
  
  if (largeFiles.length > 0) {
    console.log('📁 Large files found:');
    largeFiles
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        console.log(`   ${file.sizeKB}KB - ${file.path}`);
      });
  } else {
    console.log('✅ No large files found');
  }
  
  return largeFiles;
}

/**
 * Check for duplicate code patterns
 */
function checkDuplicateCode() {
  console.log('\n🔍 Checking for potential code duplication...');
  
  // Simple check for common patterns that might indicate duplication
  const patterns = [
    'useState\\(',
    'useEffect\\(',
    'interface.*Props',
    'export.*function',
  ];
  
  const duplicates = {};
  
  patterns.forEach(pattern => {
    try {
      const result = execSync(`grep -r "${pattern}" src/ --include="*.ts" --include="*.tsx" | wc -l`, { encoding: 'utf8' });
      const count = parseInt(result.trim());
      if (count > 20) { // Arbitrary threshold
        duplicates[pattern] = count;
      }
    } catch (e) {
      // Ignore errors
    }
  });
  
  if (Object.keys(duplicates).length > 0) {
    console.log('⚠️  High usage patterns (potential for abstraction):');
    Object.entries(duplicates).forEach(([pattern, count]) => {
      console.log(`   ${pattern}: ${count} occurrences`);
    });
  } else {
    console.log('✅ No obvious duplication patterns found');
  }
}

/**
 * Check TypeScript configuration for optimization
 */
function checkTypeScriptConfig() {
  console.log('\n⚙️  Checking TypeScript configuration...');
  
  try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    const compilerOptions = tsConfig.compilerOptions || {};
    
    const optimizations = [];
    
    // Check for optimization settings
    if (!compilerOptions.strict) {
      optimizations.push('Enable strict mode for better type checking');
    }
    
    if (compilerOptions.target !== 'ES2020' && compilerOptions.target !== 'ES2022') {
      optimizations.push('Consider using ES2020+ target for better performance');
    }
    
    if (!compilerOptions.moduleResolution || compilerOptions.moduleResolution !== 'node') {
      optimizations.push('Use node module resolution for better compatibility');
    }
    
    if (optimizations.length > 0) {
      console.log('💡 TypeScript optimization suggestions:');
      optimizations.forEach(opt => console.log(`   • ${opt}`));
    } else {
      console.log('✅ TypeScript configuration looks good');
    }
    
  } catch (error) {
    console.warn('❌ Error checking TypeScript config:', error.message);
  }
}

/**
 * Generate optimization report
 */
function generateOptimizationReport(largeFiles) {
  console.log('\n📄 Generating optimization report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      largeFilesCount: largeFiles.length,
      totalLargeFilesSize: largeFiles.reduce((sum, file) => sum + file.size, 0),
    },
    recommendations: [
      {
        category: 'Bundle Size',
        items: [
          'Implement dynamic imports for non-critical components',
          'Use tree shaking to eliminate unused code',
          'Consider code splitting for route-based chunks',
          'Optimize images and use modern formats (WebP, AVIF)',
        ]
      },
      {
        category: 'Performance',
        items: [
          'Enable compression (gzip/brotli) in production',
          'Use CDN for static assets',
          'Implement service worker for caching',
          'Optimize font loading with font-display: swap',
        ]
      },
      {
        category: 'Code Quality',
        items: [
          'Remove console.log statements in production',
          'Use React.memo for expensive components',
          'Implement proper error boundaries',
          'Use TypeScript strict mode',
        ]
      },
      {
        category: 'Accessibility',
        items: [
          'Ensure all images have alt text',
          'Maintain proper color contrast ratios',
          'Implement keyboard navigation',
          'Add ARIA labels where needed',
        ]
      }
    ],
    largeFiles: largeFiles.map(file => ({
      path: file.path,
      sizeKB: file.sizeKB,
      suggestions: getSuggestionsForFile(file.path)
    }))
  };
  
  const reportPath = path.join(process.cwd(), 'optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📊 Optimization report saved to: ${reportPath}`);
  
  return report;
}

/**
 * Get optimization suggestions for specific files
 */
function getSuggestionsForFile(filePath) {
  const suggestions = [];
  
  if (filePath.includes('components/')) {
    suggestions.push('Consider using React.memo if component re-renders frequently');
    suggestions.push('Use dynamic imports if component is not critical for initial load');
  }
  
  if (filePath.includes('utils/')) {
    suggestions.push('Consider splitting utility functions into smaller modules');
    suggestions.push('Use tree shaking friendly exports');
  }
  
  if (filePath.includes('content/')) {
    suggestions.push('Consider lazy loading content data');
    suggestions.push('Split large JSON files into smaller chunks');
  }
  
  return suggestions;
}

/**
 * Clean up temporary files
 */
function cleanupTempFiles() {
  console.log('\n🗑️  Cleaning up temporary files...');
  
  const tempPatterns = [
    '.next',
    'out',
    'dist',
    '*.tsbuildinfo',
    'node_modules/.cache',
  ];
  
  tempPatterns.forEach(pattern => {
    try {
      if (fs.existsSync(pattern)) {
        execSync(`rm -rf ${pattern}`);
        console.log(`   ✅ Removed ${pattern}`);
      }
    } catch (error) {
      console.warn(`   ⚠️  Could not remove ${pattern}:`, error.message);
    }
  });
}

/**
 * Run ESLint with auto-fix
 */
function runESLintFix() {
  console.log('\n🔧 Running ESLint auto-fix...');
  
  try {
    execSync('npm run lint:fix', { stdio: 'inherit' });
    console.log('✅ ESLint auto-fix completed');
  } catch (error) {
    console.warn('⚠️  ESLint auto-fix had issues (this is normal)');
  }
}

/**
 * Main cleanup function
 */
async function runCleanupOptimization() {
  try {
    checkUnusedDependencies();
    const largeFiles = findLargeFiles();
    checkDuplicateCode();
    checkTypeScriptConfig();
    
    const report = generateOptimizationReport(largeFiles);
    
    cleanupTempFiles();
    runESLintFix();
    
    console.log('\n🎉 Cleanup and optimization completed!');
    console.log('\n📋 Summary:');
    console.log(`   • ${largeFiles.length} large files identified`);
    console.log(`   • ${report.recommendations.length} optimization categories`);
    console.log(`   • Report saved with detailed recommendations`);
    
    if (largeFiles.length > 0) {
      console.log('\n💡 Next steps:');
      console.log('   1. Review large files for optimization opportunities');
      console.log('   2. Implement dynamic imports for non-critical components');
      console.log('   3. Consider code splitting for better performance');
      console.log('   4. Run performance tests to validate improvements');
    }
    
  } catch (error) {
    console.error('❌ Cleanup optimization failed:', error);
    process.exit(1);
  }
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  runCleanupOptimization();
}

module.exports = {
  runCleanupOptimization,
  checkUnusedDependencies,
  findLargeFiles,
  checkDuplicateCode,
  generateOptimizationReport,
};
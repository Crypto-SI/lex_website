#!/usr/bin/env node

/**
 * Enhanced bundle analysis script with performance budgets and monitoring
 */

const fs = require('fs');
const path = require('path');

// Performance budgets (in bytes)
const PERFORMANCE_BUDGETS = {
  totalJavaScript: 500000, // 500KB
  totalCSS: 100000, // 100KB
  totalImages: 2000000, // 2MB
  singleFile: 200000, // 200KB per file
  contentFiles: 150000, // 150KB for content
};

// Function to get file size in a human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Function to analyze directory recursively
function analyzeDirectory(dirPath, extensions = ['.json', '.ts', '.tsx', '.js', '.jsx']) {
  const results = [];
  
  function scanDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const itemPath = path.join(currentPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDir(itemPath);
      } else if (stats.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          results.push({
            path: path.relative(process.cwd(), itemPath),
            size: stats.size,
            formattedSize: formatBytes(stats.size),
            extension: ext
          });
        }
      }
    });
  }
  
  scanDir(dirPath);
  return results;
}

// Performance budget checker
function checkPerformanceBudgets(files) {
  console.log('🎯 Performance Budget Analysis:');
  console.log('=' .repeat(50));
  
  const budgetResults = [];
  
  // Check total JavaScript size
  const jsFiles = files.filter(file => ['.js', '.jsx', '.ts', '.tsx'].includes(file.extension));
  const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
  budgetResults.push({
    category: 'Total JavaScript',
    current: totalJsSize,
    budget: PERFORMANCE_BUDGETS.totalJavaScript,
    status: totalJsSize <= PERFORMANCE_BUDGETS.totalJavaScript ? '✅' : '❌',
    percentage: ((totalJsSize / PERFORMANCE_BUDGETS.totalJavaScript) * 100).toFixed(1)
  });
  
  // Check total CSS size
  const cssFiles = files.filter(file => file.extension === '.css');
  const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
  budgetResults.push({
    category: 'Total CSS',
    current: totalCssSize,
    budget: PERFORMANCE_BUDGETS.totalCSS,
    status: totalCssSize <= PERFORMANCE_BUDGETS.totalCSS ? '✅' : '❌',
    percentage: ((totalCssSize / PERFORMANCE_BUDGETS.totalCSS) * 100).toFixed(1)
  });
  
  // Check content files
  const contentFiles = files.filter(file => file.path.includes('content/'));
  const totalContentSize = contentFiles.reduce((sum, file) => sum + file.size, 0);
  budgetResults.push({
    category: 'Content Files',
    current: totalContentSize,
    budget: PERFORMANCE_BUDGETS.contentFiles,
    status: totalContentSize <= PERFORMANCE_BUDGETS.contentFiles ? '✅' : '❌',
    percentage: ((totalContentSize / PERFORMANCE_BUDGETS.contentFiles) * 100).toFixed(1)
  });
  
  // Display budget results
  budgetResults.forEach(result => {
    console.log(`${result.status} ${result.category}: ${formatBytes(result.current)} / ${formatBytes(result.budget)} (${result.percentage}%)`);
  });
  
  // Check individual file sizes
  const oversizedFiles = files.filter(file => file.size > PERFORMANCE_BUDGETS.singleFile);
  if (oversizedFiles.length > 0) {
    console.log('\n⚠️  Files exceeding single file budget:');
    oversizedFiles.forEach(file => {
      console.log(`   ${file.formattedSize} - ${file.path}`);
    });
  }
  
  return budgetResults;
}

// Generate performance report
function generatePerformanceReport(files, budgetResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      budgetsPassed: budgetResults.filter(r => r.status === '✅').length,
      budgetsTotal: budgetResults.length
    },
    budgets: budgetResults,
    largestFiles: files
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .map(file => ({
        path: file.path,
        size: file.size,
        formattedSize: file.formattedSize
      })),
    recommendations: generateRecommendations(files, budgetResults)
  };
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Performance report saved to: ${reportPath}`);
  
  return report;
}

// Generate optimization recommendations
function generateRecommendations(files, budgetResults) {
  const recommendations = [];
  
  // Check for budget violations
  budgetResults.forEach(result => {
    if (result.status === '❌') {
      recommendations.push({
        type: 'budget_violation',
        category: result.category,
        message: `${result.category} exceeds budget by ${(parseFloat(result.percentage) - 100).toFixed(1)}%`,
        priority: 'high'
      });
    }
  });
  
  // Check for large individual files
  const largeFiles = files.filter(file => file.size > PERFORMANCE_BUDGETS.singleFile);
  if (largeFiles.length > 0) {
    recommendations.push({
      type: 'large_files',
      message: `${largeFiles.length} files exceed single file budget`,
      files: largeFiles.map(f => f.path),
      priority: 'medium'
    });
  }
  
  // Check for content optimization opportunities
  const contentFiles = files.filter(file => file.path.includes('content/'));
  const largeContentFiles = contentFiles.filter(file => file.size > 50000);
  if (largeContentFiles.length > 0) {
    recommendations.push({
      type: 'content_optimization',
      message: 'Large content files detected - consider splitting or lazy loading',
      files: largeContentFiles.map(f => f.path),
      priority: 'medium'
    });
  }
  
  // Check for duplicate or similar files
  const duplicateCheck = checkForDuplicates(files);
  if (duplicateCheck.length > 0) {
    recommendations.push({
      type: 'duplicate_files',
      message: 'Potential duplicate files detected',
      files: duplicateCheck,
      priority: 'low'
    });
  }
  
  return recommendations;
}

// Check for potential duplicate files
function checkForDuplicates(files) {
  const sizeGroups = {};
  
  files.forEach(file => {
    if (!sizeGroups[file.size]) {
      sizeGroups[file.size] = [];
    }
    sizeGroups[file.size].push(file.path);
  });
  
  return Object.entries(sizeGroups)
    .filter(([size, paths]) => paths.length > 1 && parseInt(size) > 10000) // Only check files > 10KB
    .map(([size, paths]) => ({ size: parseInt(size), paths }));
}

// Main analysis function
function analyzeBundleSize() {
  console.log('🔍 Analyzing bundle sizes with performance monitoring...\n');
  
  const srcPath = path.join(process.cwd(), 'src');
  const files = analyzeDirectory(srcPath);
  
  // Sort by size (largest first)
  files.sort((a, b) => b.size - a.size);
  
  // Performance budget analysis
  const budgetResults = checkPerformanceBudgets(files);
  
  // Show largest files
  console.log('\n📊 Largest files:');
  console.log('=' .repeat(80));
  
  const largeFiles = files.filter(file => file.size > 50000); // Files larger than 50KB
  
  if (largeFiles.length === 0) {
    console.log('✅ No files larger than 50KB found.');
  } else {
    largeFiles.slice(0, 20).forEach((file, index) => {
      const budgetStatus = file.size > PERFORMANCE_BUDGETS.singleFile ? '⚠️ ' : '  ';
      console.log(`${budgetStatus}${(index + 1).toString().padStart(2)}. ${file.formattedSize.padStart(8)} - ${file.path}`);
    });
  }
  
  console.log('\n📈 File type breakdown:');
  console.log('=' .repeat(40));
  
  const typeBreakdown = {};
  files.forEach(file => {
    if (!typeBreakdown[file.extension]) {
      typeBreakdown[file.extension] = { count: 0, totalSize: 0 };
    }
    typeBreakdown[file.extension].count++;
    typeBreakdown[file.extension].totalSize += file.size;
  });
  
  Object.entries(typeBreakdown)
    .sort(([,a], [,b]) => b.totalSize - a.totalSize)
    .forEach(([ext, data]) => {
      console.log(`${ext.padEnd(6)} - ${data.count.toString().padStart(3)} files - ${formatBytes(data.totalSize)}`);
    });
  
  // Analyze content files specifically
  console.log('\n📄 Content files analysis:');
  console.log('=' .repeat(40));
  
  const contentFiles = files.filter(file => file.path.includes('content/'));
  if (contentFiles.length > 0) {
    contentFiles.forEach(file => {
      console.log(`${file.formattedSize.padStart(8)} - ${file.path}`);
    });
    
    const totalContentSize = contentFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`\nTotal content size: ${formatBytes(totalContentSize)}`);
    
    if (totalContentSize > 200000) { // 200KB
      console.log('⚠️  Large content files detected. Consider:');
      console.log('   - Using dynamic imports for content');
      console.log('   - Splitting large JSON files');
      console.log('   - Implementing lazy loading');
    }
  } else {
    console.log('No content files found.');
  }
  
  // Generate comprehensive report
  const report = generatePerformanceReport(files, budgetResults);
  
  // Recommendations
  console.log('\n💡 Optimization recommendations:');
  console.log('=' .repeat(50));
  
  if (report.recommendations.length === 0) {
    console.log('✅ No critical optimization recommendations at this time.');
  } else {
    report.recommendations.forEach((rec, index) => {
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`${priority} ${rec.message}`);
      if (rec.files && rec.files.length <= 3) {
        rec.files.forEach(file => console.log(`   - ${file}`));
      } else if (rec.files && rec.files.length > 3) {
        console.log(`   - ${rec.files.length} files affected`);
      }
    });
  }
  
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  console.log(`\nTotal analyzed size: ${formatBytes(totalSize)}`);
  
  // Always show general recommendations
  console.log('\nGeneral optimization tips:');
  console.log('• Enable webpack compression in production');
  console.log('• Use tree shaking to eliminate unused code');
  console.log('• Consider using a CDN for static assets');
  console.log('• Implement code splitting for route-based chunks');
  console.log('• Use dynamic imports for non-critical code');
}

// Run the analysis
if (require.main === module) {
  try {
    analyzeBundleSize();
  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);
    process.exit(1);
  }
}

module.exports = { analyzeBundleSize, analyzeDirectory, formatBytes };
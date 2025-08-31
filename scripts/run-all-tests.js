#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🧪 Running comprehensive test suite for Lex Consulting website...\n')

const testSuites = [
  {
    name: 'Unit & Integration Tests',
    command: 'npm run test',
    description: 'Testing components, utilities, and business logic'
  },
  {
    name: 'Accessibility Tests',
    command: 'npm run test:accessibility',
    description: 'Ensuring WCAG 2.1 AA compliance'
  },
  {
    name: 'Performance Tests',
    command: 'npm run test:performance',
    description: 'Validating Core Web Vitals and optimization'
  },
  {
    name: 'Visual Regression Tests',
    command: 'npm run test:visual',
    description: 'Checking UI consistency across viewports'
  },
  {
    name: 'Cross-Browser Compatibility',
    command: 'npm run test:cross-browser',
    description: 'Testing across Chrome, Firefox, and Safari'
  }
]

const results = []
let totalTests = 0
let passedTests = 0
let failedTests = 0

function runTestSuite(suite) {
  console.log(`\n📋 ${suite.name}`)
  console.log(`   ${suite.description}`)
  console.log('   ' + '─'.repeat(50))
  
  try {
    const startTime = Date.now()
    const output = execSync(suite.command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    })
    const duration = Date.now() - startTime
    
    // Parse test results (basic parsing)
    const lines = output.split('\n')
    let suiteTests = 0
    let suitePassed = 0
    let suiteFailed = 0
    
    lines.forEach(line => {
      if (line.includes('passed') || line.includes('failed')) {
        const passedMatch = line.match(/(\d+)\s+passed/)
        const failedMatch = line.match(/(\d+)\s+failed/)
        
        if (passedMatch) suitePassed += parseInt(passedMatch[1])
        if (failedMatch) suiteFailed += parseInt(failedMatch[1])
      }
    })
    
    suiteTests = suitePassed + suiteFailed
    totalTests += suiteTests
    passedTests += suitePassed
    failedTests += suiteFailed
    
    results.push({
      name: suite.name,
      status: 'PASSED',
      tests: suiteTests,
      passed: suitePassed,
      failed: suiteFailed,
      duration: duration
    })
    
    console.log(`   ✅ PASSED (${suitePassed}/${suiteTests} tests, ${duration}ms)`)
    
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || error.message
    
    // Try to extract test counts from error output
    let suiteTests = 0
    let suitePassed = 0
    let suiteFailed = 0
    
    if (errorOutput) {
      const lines = errorOutput.split('\n')
      lines.forEach(line => {
        const passedMatch = line.match(/(\d+)\s+passed/)
        const failedMatch = line.match(/(\d+)\s+failed/)
        
        if (passedMatch) suitePassed += parseInt(passedMatch[1])
        if (failedMatch) suiteFailed += parseInt(failedMatch[1])
      })
    }
    
    suiteTests = suitePassed + suiteFailed
    totalTests += suiteTests
    passedTests += suitePassed
    failedTests += suiteFailed
    
    results.push({
      name: suite.name,
      status: 'FAILED',
      tests: suiteTests,
      passed: suitePassed,
      failed: suiteFailed,
      error: errorOutput.slice(0, 200) + '...'
    })
    
    console.log(`   ❌ FAILED (${suitePassed}/${suiteTests} tests)`)
    if (errorOutput) {
      console.log(`   Error: ${errorOutput.slice(0, 100)}...`)
    }
  }
}

// Run all test suites
testSuites.forEach(runTestSuite)

// Generate summary report
console.log('\n' + '='.repeat(60))
console.log('📊 TEST SUMMARY REPORT')
console.log('='.repeat(60))

results.forEach(result => {
  const status = result.status === 'PASSED' ? '✅' : '❌'
  const testInfo = result.tests > 0 ? `${result.passed}/${result.tests}` : 'N/A'
  console.log(`${status} ${result.name.padEnd(30)} ${testInfo.padStart(10)}`)
})

console.log('─'.repeat(60))
console.log(`Total Tests: ${totalTests}`)
console.log(`Passed: ${passedTests}`)
console.log(`Failed: ${failedTests}`)
console.log(`Success Rate: ${totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%`)

// Generate detailed report file
const reportData = {
  timestamp: new Date().toISOString(),
  summary: {
    totalTests,
    passedTests,
    failedTests,
    successRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
  },
  suites: results
}

const reportPath = path.join(__dirname, '..', 'test-results.json')
fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2))
console.log(`\n📄 Detailed report saved to: ${reportPath}`)

// Exit with appropriate code
const overallSuccess = results.every(r => r.status === 'PASSED')
if (overallSuccess) {
  console.log('\n🎉 All test suites passed!')
  process.exit(0)
} else {
  console.log('\n⚠️  Some test suites failed. Check the details above.')
  process.exit(1)
}
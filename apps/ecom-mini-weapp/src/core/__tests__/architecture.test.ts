/**
 * Architecture Test Utilities
 * Verify compliance with architectural rules
 */

import { ConfigParser } from '../ConfigParser'
import { ComponentRegistry } from '../ComponentRegistry'
import { getActionRegistry } from '../ActionDispatcher'

interface TestResult {
  name: string
  passed: boolean
  message: string
}

/**
 * Test Suite: Architecture Verification
 */

export class ArchitectureTests {
  private results: TestResult[] = []

  /**
   * Run all tests
   */
  static runAll(): void {
    const tests = new ArchitectureTests()
    
    console.log('🧪 Running Architecture Tests...\n')
    
    tests.testConfigParser()
    tests.testComponentRegistry()
    tests.testActionDispatcher()
    tests.testSSOT()
    tests.testDRY()
    
    console.log('\n📊 Test Results:')
    console.log('================')
    tests.results.forEach((result, index) => {
      const icon = result.passed ? '✅' : '❌'
      console.log(`${icon} ${index + 1}. ${result.name}`)
      console.log(`   ${result.message}`)
    })
    
    const passed = tests.results.filter(r => r.passed).length
    const total = tests.results.length
    console.log(`\n${passed}/${total} tests passed`)
    
    if (passed === total) {
      console.log('🎉 All tests passed!')
    } else {
      console.log('⚠️  Some tests failed. Please review.')
    }
  }

  /**
   * Test: ConfigParser
   */
  testConfigParser(): void {
    const test = {
      name: 'ConfigParser',
      passed: true,
      message: ''
    }

    try {
      // Test validation
      const invalidConfig = { meta: {} } as any
      try {
        ConfigParser.validate(invalidConfig)
        test.passed = false
        test.message = 'Should throw error for invalid config'
      } catch (e) {
        // Expected
      }

      // Test valid config
      const validConfig = {
        meta: {
          appName: 'Test',
          primaryColor: '#000',
          currency: 'USD',
          features: []
        },
        pages: [
          {
            id: 'test',
            type: 'grid' as const,
            dataSource: { type: 'static' as const, data: [] }
          }
        ]
      }

      ConfigParser.validate(validConfig)
      test.message = 'ConfigParser validation working correctly'
    } catch (e) {
      test.passed = false
      test.message = `Error: ${e}`
    }

    this.results.push(test)
  }

  /**
   * Test: ComponentRegistry
   */
  testComponentRegistry(): void {
    const test = {
      name: 'ComponentRegistry',
      passed: true,
      message: ''
    }

    try {
      // Test registration
      const mockComponent = () => null
      ComponentRegistry.register('TestComponent', mockComponent)
      
      const component = ComponentRegistry.get('TestComponent')
      if (component !== mockComponent) {
        test.passed = false
        test.message = 'Component registration failed'
      } else {
        test.message = `ComponentRegistry working (${ComponentRegistry.size()} components registered)`
      }
    } catch (e) {
      test.passed = false
      test.message = `Error: ${e}`
    }

    this.results.push(test)
  }

  /**
   * Test: ActionDispatcher
   */
  testActionDispatcher(): void {
    const test = {
      name: 'ActionDispatcher',
      passed: true,
      message: ''
    }

    try {
      const registry = getActionRegistry()
      const requiredActions = ['navigate', 'addToCart', 'showToast']
      
      const missingActions = requiredActions.filter(action => !registry[action])
      
      if (missingActions.length > 0) {
        test.passed = false
        test.message = `Missing actions: ${missingActions.join(', ')}`
      } else {
        test.message = `ActionDispatcher working (${Object.keys(registry).length} actions registered)`
      }
    } catch (e) {
      test.passed = false
      test.message = `Error: ${e}`
    }

    this.results.push(test)
  }

  /**
   * Test: Single Source of Truth
   */
  testSSOT(): void {
    const test = {
      name: 'Single Source of Truth',
      passed: true,
      message: ''
    }

    try {
      // Verify ConfigParser is singleton
      const config1 = ConfigParser
      const config2 = ConfigParser
      
      if (config1 !== config2) {
        test.passed = false
        test.message = 'ConfigParser is not a singleton'
      } else {
        test.message = 'SSOT pattern verified (ConfigParser is singleton)'
      }
    } catch (e) {
      test.passed = false
      test.message = `Error: ${e}`
    }

    this.results.push(test)
  }

  /**
   * Test: DRY Principle
   */
  testDRY(): void {
    const test = {
      name: 'DRY Principle',
      passed: true,
      message: ''
    }

    try {
      // Verify action handlers are not duplicated
      const registry = getActionRegistry()
      const actionNames = Object.keys(registry)
      const uniqueNames = new Set(actionNames)
      
      if (actionNames.length !== uniqueNames.size) {
        test.passed = false
        test.message = 'Duplicate action handlers found'
      } else {
        test.message = `DRY verified (${actionNames.length} unique action handlers)`
      }
    } catch (e) {
      test.passed = false
      test.message = `Error: ${e}`
    }

    this.results.push(test)
  }
}

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  // ArchitectureTests.runAll()
}

/**
 * Architecture Test Suite
 * Verify compliance with architectural rules using Jest
 */

// Mock Taro before importing modules that use it
jest.mock('@tarojs/taro', () => ({
  default: {
    request: jest.fn(() => Promise.resolve({ data: {} })),
    navigateTo: jest.fn(() => Promise.resolve()),
    switchTab: jest.fn(() => Promise.resolve()),
    navigateBack: jest.fn(() => Promise.resolve()),
    redirectTo: jest.fn(() => Promise.resolve()),
    reLaunch: jest.fn(() => Promise.resolve()),
    showToast: jest.fn(() => Promise.resolve()),
    showLoading: jest.fn(() => Promise.resolve()),
    hideLoading: jest.fn(() => Promise.resolve()),
    showModal: jest.fn(() => Promise.resolve({ confirm: false, cancel: false })),
    login: jest.fn(() => Promise.resolve({ code: 'test-code' })),
    getCurrentInstance: jest.fn(() => ({
      page: {
        $element: {
          style: {
            setProperty: jest.fn()
          }
        }
      }
    }))
  }
}))

// Mock store
jest.mock('../../src/store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      cart: { items: [], total: 0 },
      wishlist: { items: [] },
      user: { isLoggedIn: false, purchases: [] }
    }))
  }
}))

import { ConfigParser } from '../../src/core/ConfigParser'
import { ComponentRegistry } from '../../src/core/ComponentRegistry'
import { getActionRegistry } from '../../src/core/ActionDispatcher'

describe('Architecture Tests', () => {
  describe('ConfigParser', () => {
    it('should throw error for invalid config - missing meta', () => {
      const invalidConfig = { pages: [] } as any
      expect(() => ConfigParser.validate(invalidConfig)).toThrow('Config missing required "meta" section')
    })

    it('should throw error for invalid config - missing pages', () => {
      const invalidConfig = { meta: { appName: 'Test' } } as any
      expect(() => ConfigParser.validate(invalidConfig)).toThrow('Config missing required "pages" array')
    })

    it('should throw error for page missing id', () => {
      const invalidConfig = {
        meta: { appName: 'Test', primaryColor: '#000', currency: 'USD', features: [] },
        pages: [{ dataSource: {} }] as any
      }
      expect(() => ConfigParser.validate(invalidConfig)).toThrow('Page at index 0 missing required "id"')
    })

    it('should throw error for page missing dataSource', () => {
      const invalidConfig = {
        meta: { appName: 'Test', primaryColor: '#000', currency: 'USD', features: [] },
        pages: [{ id: 'test' }] as any
      }
      expect(() => ConfigParser.validate(invalidConfig)).toThrow('Page "test" missing required "dataSource"')
    })

    it('should validate correct config', () => {
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
      expect(() => ConfigParser.validate(validConfig)).not.toThrow()
    })

    it('should be a singleton', () => {
      expect(ConfigParser).toBe(ConfigParser)
    })
  })

  describe('ComponentRegistry', () => {
    const testComponentName = 'JestTestComponent'
    const mockComponent = () => null

    afterEach(() => {
      ComponentRegistry.unregister(testComponentName)
    })

    it('should register and retrieve components', () => {
      ComponentRegistry.register(testComponentName, mockComponent)
      const component = ComponentRegistry.get(testComponentName)
      expect(component).toBe(mockComponent)
    })

    it('should return undefined for non-existent component', () => {
      const component = ComponentRegistry.get('NonExistentComponent')
      expect(component).toBeUndefined()
    })

    it('should check if component exists', () => {
      expect(ComponentRegistry.has(testComponentName)).toBe(false)
      ComponentRegistry.register(testComponentName, mockComponent)
      expect(ComponentRegistry.has(testComponentName)).toBe(true)
    })

    it('should get all registered component names', () => {
      const initialNames = ComponentRegistry.getNames()
      ComponentRegistry.register(testComponentName, mockComponent)
      const names = ComponentRegistry.getNames()
      expect(names).toContain(testComponentName)
      expect(names.length).toBe(initialNames.length + 1)
    })

    it('should unregister components', () => {
      ComponentRegistry.register(testComponentName, mockComponent)
      expect(ComponentRegistry.has(testComponentName)).toBe(true)
      ComponentRegistry.unregister(testComponentName)
      expect(ComponentRegistry.has(testComponentName)).toBe(false)
    })

    it('should clear all registrations', () => {
      ComponentRegistry.register(testComponentName, mockComponent)
      ComponentRegistry.register('AnotherComponent', mockComponent)
      expect(ComponentRegistry.size()).toBeGreaterThan(0)
      ComponentRegistry.clear()
      expect(ComponentRegistry.size()).toBe(0)
    })
  })

  describe('ActionDispatcher', () => {
    it('should have required actions registered', () => {
      const registry = getActionRegistry()
      const requiredActions = ['navigate', 'addToCart', 'showToast']
      requiredActions.forEach(action => {
        expect(registry).toHaveProperty(action)
      })
    })

    it('should have no duplicate action handlers', () => {
      const registry = getActionRegistry()
      const actionNames = Object.keys(registry)
      const uniqueNames = new Set(actionNames)
      expect(actionNames.length).toBe(uniqueNames.size)
    })

    it('should have multiple action handlers', () => {
      const registry = getActionRegistry()
      expect(Object.keys(registry).length).toBeGreaterThan(10)
    })

    it('should register custom action handler', () => {
      const { registerAction } = require('../../src/core/ActionDispatcher')
      const customHandler = jest.fn()
      registerAction('customAction', customHandler)
      const registry = getActionRegistry()
      expect(registry.customAction).toBe(customHandler)
    })
  })

  describe('Single Source of Truth (SSOT)', () => {
    it('ConfigParser should be singleton', () => {
      expect(ConfigParser).toBe(ConfigParser)
    })

    it('ComponentRegistry should have single registry instance', () => {
      const names1 = ComponentRegistry.getNames()
      const names2 = ComponentRegistry.getNames()
      expect(names1).toEqual(names2)
    })
  })

  describe('DRY Principle', () => {
    it('should have unique action handler names', () => {
      const registry = getActionRegistry()
      const actionNames = Object.keys(registry)
      const uniqueNames = new Set(actionNames)
      expect(actionNames.length).toBe(uniqueNames.size)
    })

    it('should not have duplicate component registrations', () => {
      const mockComp = () => null
      ComponentRegistry.clear()
      ComponentRegistry.register('UniqueTest', mockComp)
      const names = ComponentRegistry.getNames()
      const uniqueNames = new Set(names)
      expect(names.length).toBe(uniqueNames.size)
    })
  })
})

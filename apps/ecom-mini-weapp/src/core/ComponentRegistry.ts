import { ComponentType, ComponentRegistryItem, ComponentConfig } from './types'

/**
 * ComponentRegistry - Central registry for whitelabel components
 * All reusable components must be registered here
 */

const registry: Map<string, ComponentRegistryItem> = new Map()

export class ComponentRegistry {
  /**
   * Register a component
   */
  static register(
    name: string, 
    component: ComponentType, 
    config?: ComponentConfig
  ): void {
    if (registry.has(name)) {
      console.warn(`Component "${name}" already registered, overwriting`)
    }

    registry.set(name, {
      name,
      component,
      config
    })
  }

  /**
   * Register multiple components at once
   */
  static registerMany(components: Array<{ name: string; component: ComponentType; config?: ComponentConfig }>): void {
    components.forEach(({ name, component, config }) => {
      this.register(name, component, config)
    })
  }

  /**
   * Get a component by name
   */
  static get(name: string): ComponentType | undefined {
    const item = registry.get(name)
    
    if (!item) {
      console.warn(`Component "${name}" not found in registry`)
      return undefined
    }

    return item.component
  }

  /**
   * Get component config
   */
  static getConfig(name: string): ComponentConfig | undefined {
    const item = registry.get(name)
    return item?.config
  }

  /**
   * Check if component is registered
   */
  static has(name: string): boolean {
    return registry.has(name)
  }

  /**
   * Get all registered component names
   */
  static getNames(): string[] {
    return Array.from(registry.keys())
  }

  /**
   * Get all registered components
   */
  static getAll(): ComponentRegistryItem[] {
    return Array.from(registry.values())
  }

  /**
   * Unregister a component
   */
  static unregister(name: string): void {
    registry.delete(name)
  }

  /**
   * Clear all registrations (for testing)
   */
  static clear(): void {
    registry.clear()
  }

  /**
   * Get registry size
   */
  static size(): number {
    return registry.size
  }
}

/**
 * Higher-order component to auto-register components
 */
export function withRegistration(name: string, config?: ComponentConfig) {
  return function <T extends ComponentType>(WrappedComponent: T): T {
    ComponentRegistry.register(name, WrappedComponent, config)
    return WrappedComponent
  }
}

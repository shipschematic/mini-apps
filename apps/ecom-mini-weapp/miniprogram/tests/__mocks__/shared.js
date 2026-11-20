// Mock for @tarojs/shared
export const noop = () => {}
export const hooks = {}
export const Events = class {
  on() {}
  off() {}
  trigger() {}
}
export const EMPTY_OBJ = {}
export const isNumber = (val) => typeof val === 'number'
export const isString = (val) => typeof val === 'string'
export const isArray = Array.isArray
export const isUndefined = (val) => val === undefined
export const isNull = (val) => val === null
export const isFunction = (val) => typeof val === 'function'
export const isObject = (val) => typeof val === 'object' && val !== null
export const warn = console.warn
export const ensure = (condition, msg) => {
  if (!condition) throw new Error(msg)
}
export const toCamelCase = (str) => str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
export const toDashed = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase()
export const isEnableTTDom = false
export const PLATFORM_TYPE = 'h5'
export const controlledComponent = (props) => props
export const DEFAULT_COMPONENTS = {}
export const TT_SPECIFIC_COMPONENTS = {}
export const getComponentsAlias = () => ({})
export const internalComponents = {}

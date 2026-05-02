import Taro from '@tarojs/taro'

let initialized = false

export function ensureCloudInit(): boolean {
  if (initialized) return true
  try {
    if (typeof Taro.cloud !== 'undefined') {
      Taro.cloud.init({ env: 'cloud1-d4gc2e7w9638ce590', traceUser: false })
      initialized = true
    }
    return true
  } catch (_) {
    return false
  }
}

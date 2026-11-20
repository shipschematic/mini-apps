import Taro from '@tarojs/taro';
import { CACHE_KEYS } from '@/constants';

export const getStorage = <T>(key: keyof typeof CACHE_KEYS, defaultValue?: T): T | null => {
  try {
    const value = Taro.getStorageSync(key);
    return value ? JSON.parse(value) : defaultValue || null;
  } catch {
    return defaultValue || null;
  }
};

export const setStorage = <T>(key: keyof typeof CACHE_KEYS, value: T): void => {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (error) {
    console.error('[Cache] setStorage error:', error);
  }
};

export const removeStorage = (key: keyof typeof CACHE_KEYS): void => {
  try {
    Taro.removeStorageSync(key);
  } catch (error) {
    console.error('[Cache] removeStorage error:', error);
  }
};

export const clearStorage = (): void => {
  try {
    Taro.clearStorageSync();
  } catch (error) {
    console.error('[Cache] clearStorage error:', error);
  }
};

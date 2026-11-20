import Taro from '@tarojs/taro'

/**
 * @deprecated This file is kept for reference only.
 * 
 * DO NOT import from this file - it causes webpack to create a common.js chunk
 * which breaks WeChat Mini Program page navigation (blank screens on redirectTo).
 * 
 * Instead, copy the favorites functions inline into each page that needs them.
 * See any page file for the inline implementation pattern.
 */

const STORAGE_KEY = 'favorite_recipes'

export function getFavoriteIds(): string[] {
  return Taro.getStorageSync(STORAGE_KEY) || []
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id)
}

export function toggleFavorite(id: string): boolean {
  const favorites = getFavoriteIds()
  const index = favorites.indexOf(id)
  const updated = index > -1
    ? favorites.filter((fid) => fid !== id)
    : [...favorites, id]
  Taro.setStorageSync(STORAGE_KEY, updated)
  return index === -1
}

export function addFavorite(id: string): void {
  const favorites = getFavoriteIds()
  if (!favorites.includes(id)) {
    Taro.setStorageSync(STORAGE_KEY, [...favorites, id])
  }
}

export function removeFavorite(id: string): void {
  const favorites = getFavoriteIds()
  Taro.setStorageSync(STORAGE_KEY, favorites.filter((fid) => fid !== id))
}

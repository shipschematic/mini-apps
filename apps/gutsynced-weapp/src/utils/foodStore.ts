import Taro from '@tarojs/taro'
import foodData from '../data/food_data.json'
import ssrdData from '../data/ssrd_data.json'
import bileData from '../data/bile_data.json'
import sixFedlrData from '../data/6fedlr_data.json'
import { DIET_PROFILES } from '../models/food'
import type {
  DietId,
  DietProfile,
  FoodCategory,
  FoodDataFile,
  FoodItem,
  FoodStatus
} from '../models/food'
import type { Language } from '../config/i18n'

const RAW_DATA: Record<DietId, FoodDataFile> = {
  sibo: foodData as FoodDataFile,
  ssrd: ssrdData as FoodDataFile,
  bile_reflux: bileData as FoodDataFile,
  '6fedlr': sixFedlrData as FoodDataFile
}

const DIET_STORAGE_KEY = 'gutsynced_active_diet'
const LANGUAGE_STORAGE_KEY = 'gutsynced_language'
const FAVORITES_PREFIX = 'gutsynced_favorites_'

type Listener = () => void

class FoodStore {
  private dietId: DietId = 'sibo'
  private categories: FoodCategory[] = []
  private listeners: Set<Listener> = new Set()
  private searchQuery = ''
  private statusFilter: FoodStatus | null = null
  private favoritesOnly = false
  private language: Language = 'en'
  private loaded = false

  constructor() {
    const savedDiet = Taro.getStorageSync(DIET_STORAGE_KEY) as DietId
    if (RAW_DATA[savedDiet]) {
      this.dietId = savedDiet
    }
    const savedLanguage = Taro.getStorageSync(LANGUAGE_STORAGE_KEY) as Language
    if (savedLanguage === 'en' || savedLanguage === 'zh') {
      this.language = savedLanguage
    }
    this.loadDiet(this.dietId)
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener())
  }

  private favoritesKey(dietId: DietId = this.dietId): string {
    return `${FAVORITES_PREFIX}${dietId}`
  }

  private loadDiet(dietId: DietId): void {
    this.dietId = dietId
    const favorites = new Set<string>(Taro.getStorageSync(this.favoritesKey(dietId)) || [])
    this.categories = RAW_DATA[dietId].categories.map((category) => ({
      name: category.name,
      items: category.items.map((item) => ({
        name: item.name,
        status: item.status,
        sidenote: item.sidenote,
        category: category.name,
        isFavorite: favorites.has(item.name)
      }))
    }))
    this.loaded = true
  }

  private saveFavorites(): void {
    const names = this.getAllItems()
      .filter((item) => item.isFavorite)
      .map((item) => item.name)
    Taro.setStorageSync(this.favoritesKey(), names)
  }

  get activeDiet(): DietProfile {
    return DIET_PROFILES.find((diet) => diet.id === this.dietId) || DIET_PROFILES[0]
  }

  get diets(): DietProfile[] {
    return DIET_PROFILES
  }

  get currentLanguage(): Language {
    return this.language
  }

  get isLoaded(): boolean {
    return this.loaded
  }

  get query(): string {
    return this.searchQuery
  }

  get filter(): FoodStatus | null {
    return this.statusFilter
  }

  get showFavoritesOnly(): boolean {
    return this.favoritesOnly
  }

  getAllItems(): FoodItem[] {
    return this.categories.reduce<FoodItem[]>((items, category) => items.concat(category.items), [])
  }

  get favoriteCount(): number {
    return this.getAllItems().filter((item) => item.isFavorite).length
  }

  get hasFavorites(): boolean {
    return this.favoriteCount > 0
  }

  getFilteredCategories(): FoodCategory[] {
    const query = this.searchQuery.trim().toLowerCase()
    return this.categories
      .map((category) => {
        let items = category.items
        if (query) {
          items = items.filter((item) => item.name.toLowerCase().includes(query))
        }
        if (this.statusFilter) {
          items = items.filter((item) => item.status === this.statusFilter)
        }
        if (this.favoritesOnly) {
          items = items.filter((item) => item.isFavorite)
        }
        return { name: category.name, items }
      })
      .filter((category) => category.items.length > 0)
  }

  getFavoriteItems(): FoodItem[] {
    return this.getAllItems().filter((item) => item.isFavorite)
  }

  findByName(name: string): FoodItem | undefined {
    return this.getAllItems().find((item) => item.name === name)
  }

  switchDiet(dietId: DietId): void {
    if (dietId === this.dietId) return
    this.loadDiet(dietId)
    Taro.setStorageSync(DIET_STORAGE_KEY, dietId)
    this.notify()
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query
    this.notify()
  }

  setStatusFilter(status: FoodStatus | null): void {
    this.statusFilter = status
    this.notify()
  }

  setFavoritesOnly(value: boolean): void {
    this.favoritesOnly = value
    this.notify()
  }

  toggleFavorite(item: FoodItem): void {
    item.isFavorite = !item.isFavorite
    this.saveFavorites()
    this.notify()
  }

  clearFavorites(): void {
    this.getAllItems().forEach((item) => {
      item.isFavorite = false
    })
    this.saveFavorites()
    this.notify()
  }

  setLanguage(language: Language): void {
    this.language = language
    Taro.setStorageSync(LANGUAGE_STORAGE_KEY, language)
    this.notify()
  }
}

export const foodStore = new FoodStore()

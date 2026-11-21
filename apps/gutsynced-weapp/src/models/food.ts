export type FoodStatus = 'green' | 'yellow' | 'red'

export type DietId = 'sibo' | 'ssrd' | 'bile_reflux' | '6fedlr'

export interface RawFoodItem {
  name: string
  status: FoodStatus
  sidenote?: string
}

export interface RawFoodCategory {
  name: string
  items: RawFoodItem[]
}

export interface FoodDataFile {
  categories: RawFoodCategory[]
}

export interface FoodItem extends RawFoodItem {
  category: string
  isFavorite: boolean
}

export interface FoodCategory {
  name: string
  items: FoodItem[]
}

export interface DietProfile {
  id: DietId
  name: string
  shortName: string
  description: string
  statusDescriptions: Record<FoodStatus, string>
}

export const DIET_PROFILES: DietProfile[] = [
  {
    id: 'sibo',
    name: 'SIBO Diet',
    shortName: 'SIBO',
    description: 'Low FODMAP foods for SIBO management',
    statusDescriptions: {
      green: 'Allowed (low FODMAP)',
      yellow: 'Allowed in small amounts (moderate & high FODMAP)',
      red: 'Avoid'
    }
  },
  {
    id: 'ssrd',
    name: 'SSRD Diet',
    shortName: 'SSRD',
    description: 'Starch- and sucrose-reduced diet',
    statusDescriptions: {
      green: 'Well tolerated',
      yellow: 'Tolerated by some',
      red: 'Not tolerated'
    }
  },
  {
    id: 'bile_reflux',
    name: 'Bile Reflux Diet',
    shortName: 'Bile',
    description: 'Low-fat, low-acid foods for bile reflux management',
    statusDescriptions: {
      green: 'Allowed (safe & safest)',
      yellow: 'Caution (monitor tolerance)',
      red: 'Avoid'
    }
  },
  {
    id: '6fedlr',
    name: '6-Food Elimination & Low-Residue Diet',
    shortName: '6FED-LR',
    description: 'Modified elimination diet for EoE and GI healing',
    statusDescriptions: {
      green: 'Allowed',
      yellow: 'Caution (strict prep/labels)',
      red: 'Avoid'
    }
  }
]

export const STATUS_COLORS: Record<FoodStatus, string> = {
  green: '#4ADE80',
  yellow: '#FBBF24',
  red: '#F87171'
}

export const STATUS_ORDER: FoodStatus[] = ['green', 'yellow', 'red']

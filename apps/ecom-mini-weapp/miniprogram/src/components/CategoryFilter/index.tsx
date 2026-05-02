import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { AppShell } from '../../core/AppShell'
import './index.scss'

interface Category {
  id: string
  name: string
  icon: string
}

interface CategoryFilterProps {
  onCategoryChange: (categoryId: string) => void
  activeCategory?: string
}

export function CategoryFilter({ onCategoryChange, activeCategory = 'all' }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const config = AppShell.getConfigSafe()
    if (config?.categories) {
      setCategories(config.categories)
    }
  }, [])

  const handleClick = (categoryId: string) => {
    onCategoryChange(categoryId)
  }

  return (
    <View className="category-filter">
      <ScrollView scrollX className="category-scroll">
        <View className="category-list">
          {categories.map((category) => (
            <View
              key={category.id}
              className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleClick(category.id)}
            >
              <Text className="category-icon">{category.icon}</Text>
              <Text className="category-name">{category.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default CategoryFilter

import { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import './index.scss'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = 'Search products...' }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleInput = (e: any) => {
    setQuery(e.detail.value || '')
  }

  const handleConfirm = () => {
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <View className="search-bar">
      <View className="search-container">
        <Text className="search-icon">🔍</Text>
        <Input
          className="search-input"
          type="text"
          value={query}
          placeholder={placeholder}
          onInput={handleInput}
          onConfirm={handleConfirm}
        />
        {query && (
          <Text className="clear-btn" onClick={handleClear}>✕</Text>
        )}
      </View>
    </View>
  )
}

export default SearchBar

import { Component } from 'react'
import { View, Text, Input, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { recipeStore } from '../../utils/recipeStore'
import './index.scss'

interface SearchRecipe {
  id: string
  title: string
  time: string
  servings: string
  image: string
}

interface SearchState {
  searchQuery: string
  recentSearches: string[]
  isSearching: boolean
  searchResults: any[]
  loading: boolean
}

export default class Search extends Component<{}, SearchState> {
  state: SearchState = {
    searchQuery: '',
    recentSearches: ['Ramen', 'Soup', 'Japanese', 'Healthy', 'Quick meals'],
    isSearching: false,
    searchResults: [],
    loading: false
  }

  handleSearchInput = (e: any) => {
    const query = e.detail.value
    this.setState({ searchQuery: query, isSearching: query.length > 0 })
  }

  handleClearSearch = () => {
    this.setState({ searchQuery: '', isSearching: false, searchResults: [] })
  }

  handleRecentClick = async (search: string) => {
    this.setState({ searchQuery: search, isSearching: true, loading: true })
    try {
      const results = await recipeStore.search(search)
      this.setState({ searchResults: results, loading: false })
    } catch (err: any) {
      Taro.showToast({ title: 'Search failed', icon: 'none' })
      this.setState({ loading: false })
    }
  }

  handleRecipeClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })
  }

  handleCategoryClick = (cat: string) => {
    Taro.showToast({ title: `${cat} selected`, icon: 'none' })
  }

  render() {
    const { searchQuery, recentSearches, isSearching } = this.state

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        {/* Navbar */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-primary)' }}>GutSynced</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Search</Text>
          <View style={{ width: '24px' }} />
        </View>

        <View style={{ padding: '16px' }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '0 12px', height: '48px', border: '1px solid var(--color-outline)' }}>
            <Text style={{ fontSize: '18px', color: 'var(--color-muted)', marginRight: '8px' }}>Q</Text>
            <Input
              style={{ flex: 1, fontSize: '16px', color: 'var(--color-text)' }}
              type='text'
              value={searchQuery}
              placeholder='Search recipes...'
              placeholderStyle={{ color: 'var(--color-muted)' }}
              onInput={this.handleSearchInput}
            />
            {searchQuery.length > 0 && (
              <Text style={{ fontSize: '18px', color: 'var(--color-muted)' }} onClick={this.handleClearSearch}>X</Text>
            )}
          </View>
        </View>

        {!isSearching ? (
          <ScrollView style={{ flex: 1 }} scrollY>
            <View style={{ padding: '0 16px' }}>
              <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '12px' }}>Recent Searches</Text>
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {recentSearches.map((search, index) => (
                  <View key={index} style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '8px 16px', border: '1px solid var(--color-outline)' }} onClick={() => this.handleRecentClick(search)}>
                    <Text style={{ fontSize: '14px', color: 'var(--color-text)' }}>{search}</Text>
                  </View>
                ))}
              </View>

              <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '12px' }}>Popular Categories</Text>
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px' }}>
                {['Soup', 'Grill', 'Dessert', 'Salad', 'Drink', 'Breakfast'].map((cat, index) => (
                  <View key={index} style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '8px 16px', border: '1px solid var(--color-outline)' }} onClick={() => this.handleCategoryClick(cat)}>
                    <Text style={{ fontSize: '14px', color: 'var(--color-text)' }}>{cat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={{ flex: 1 }} scrollY>
            <View style={{ padding: '16px' }}>
              <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '12px' }}>Search Results</Text>
              {this.state.loading ? (
                <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', marginTop: '24px' }}>Searching...</Text>
              ) : this.state.searchResults.length === 0 ? (
                <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', marginTop: '24px' }}>No recipes found for "{searchQuery}"</Text>
              ) : (
                this.state.searchResults.map((recipe) => (
                  <View key={recipe.id} style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }} onClick={() => this.handleRecipeClick(recipe.id)}>
                    <View style={{ height: '160px', backgroundColor: 'var(--color-outline)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View style={{ padding: '12px' }}>
                      <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>{recipe.title}</Text>
                      <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>{recipe.estimatedTime || recipe.time} * {recipe.quantity || recipe.servings}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>
    )
  }
}

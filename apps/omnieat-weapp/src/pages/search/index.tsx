import { Component } from 'react'
import { View, Text, Input, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface SearchRecipe {
  id: string
  title: string
  time: string
  servings: string
  image: string
}

const SEARCH_RECIPES: SearchRecipe[] = [
  { id: '1', title: 'Beef Ramen', time: '120 min', servings: '2 servings', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop' },
  { id: '2', title: 'Tomato Soup', time: '220 min', servings: '2 servings', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop' },
  { id: '3', title: 'Ribeye Steak', time: '45 min', servings: '2 servings', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop' },
  { id: '4', title: 'Sweet and Sour Pork', time: '45 min', servings: '3 servings', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop' },
  { id: '5', title: 'Baked Gochujang Chicken', time: '35 min', servings: '2 servings', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop' },
  { id: '6', title: 'Steamed Siomay', time: '25 min', servings: '2 servings', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop' },
  { id: '7', title: 'Clam Cheese Soup', time: '30 min', servings: '2 servings', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop' },
]

interface SearchState {
  searchQuery: string
  recentSearches: string[]
  isSearching: boolean
}

export default class Search extends Component<{}, SearchState> {
  state: SearchState = {
    searchQuery: '',
    recentSearches: ['Ramen', 'Soup', 'Japanese', 'Healthy', 'Quick meals'],
    isSearching: false
  }

  handleSearchInput = (e: any) => {
    const query = e.detail.value
    this.setState({ searchQuery: query, isSearching: query.length > 0 })
  }

  handleClearSearch = () => {
    this.setState({ searchQuery: '', isSearching: false })
  }

  handleRecentClick = (search: string) => {
    this.setState({ searchQuery: search, isSearching: true })
  }

  handleRecipeClick = (id: number) => {
    Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })
  }

  handleCategoryClick = (cat: string) => {
    Taro.showToast({ title: `${cat} selected`, icon: 'none' })
  }

  render() {
    const { searchQuery, recentSearches, isSearching } = this.state

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        {/* Navbar */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF4F21' }}>Dapoer</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Search</Text>
          <View style={{ width: '24px' }} />
        </View>

        <View style={{ padding: '16px' }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '0 12px', height: '48px', border: '1px solid #EEEEEE' }}>
            <Text style={{ fontSize: '18px', color: '#757575', marginRight: '8px' }}>Q</Text>
            <Input
              style={{ flex: 1, fontSize: '16px', color: '#212121' }}
              type='text'
              value={searchQuery}
              placeholder='Search recipes...'
              placeholderStyle={{ color: '#BDBDBD' }}
              onInput={this.handleSearchInput}
            />
            {searchQuery.length > 0 && (
              <Text style={{ fontSize: '18px', color: '#999999' }} onClick={this.handleClearSearch}>X</Text>
            )}
          </View>
        </View>

        {!isSearching ? (
          <ScrollView style={{ flex: 1 }} scrollY>
            <View style={{ padding: '0 16px' }}>
              <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121', marginBottom: '12px' }}>Recent Searches</Text>
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {recentSearches.map((search, index) => (
                  <View key={index} style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '8px 16px', border: '1px solid #EEEEEE' }} onClick={() => this.handleRecentClick(search)}>
                    <Text style={{ fontSize: '14px', color: '#212121' }}>{search}</Text>
                  </View>
                ))}
              </View>

              <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121', marginBottom: '12px' }}>Popular Categories</Text>
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px' }}>
                {['Soup', 'Grill', 'Dessert', 'Salad', 'Drink', 'Breakfast'].map((cat, index) => (
                  <View key={index} style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '8px 16px', border: '1px solid #EEEEEE' }} onClick={() => this.handleCategoryClick(cat)}>
                    <Text style={{ fontSize: '14px', color: '#212121' }}>{cat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={{ flex: 1 }} scrollY>
            <View style={{ padding: '16px' }}>
              <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121', marginBottom: '12px' }}>Search Results</Text>
              {SEARCH_RECIPES.filter((r) =>
                r.title.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <Text style={{ fontSize: '14px', color: '#757575', textAlign: 'center', marginTop: '24px' }}>No recipes found for "{searchQuery}"</Text>
              ) : (
                SEARCH_RECIPES.filter((r) =>
                  r.title.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((recipe) => (
                  <View key={recipe.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }} onClick={() => this.handleRecipeClick(Number(recipe.id))}>
                    <View style={{ height: '160px', backgroundColor: '#EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src={recipe.image} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View style={{ padding: '12px' }}>
                      <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>{recipe.title}</Text>
                      <Text style={{ fontSize: '14px', color: '#757575', marginTop: '4px' }}>{recipe.time} * {recipe.servings}</Text>
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

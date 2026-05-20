import { Component } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { RecipeCard } from '../../components'

// Inline favorites helpers to avoid common.js chunk dependency in WeApp
const FAV_KEY = 'favorite_recipes'
function getFavoriteIds(): string[] { return Taro.getStorageSync(FAV_KEY) || [] }
function toggleFavorite(id: string): boolean {
  const favs = getFavoriteIds()
  const idx = favs.indexOf(id)
  const updated = idx > -1 ? favs.filter(f => f !== id) : [...favs, id]
  Taro.setStorageSync(FAV_KEY, updated)
  return idx === -1
}

// Inline request function to avoid common.js chunk dependency in WeApp
async function request({
  url,
  method = 'GET',
  data = {},
  headers = {}
}: {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  headers?: Record<string, string>
}): Promise<any> {
  const baseUrl = 'http://localhost:3001'
  const token = Taro.getStorageSync('user_token')

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  try {
    const res = await Taro.request({
      url: `${baseUrl}${url}`,
      method,
      data,
      header: finalHeaders,
    })

    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data
    }
    if (res.statusCode === 401) {
      Taro.removeStorageSync('user_token')
      Taro.redirectTo({ url: '/pages/sign-in/index' })
    }
    throw new Error(res.data?.error || `Request failed with status ${res.statusCode}`)
  } catch (err) {
    console.error('Network request error:', err)
    throw err
  }
}

export default class Categories extends Component<{}, { selectedId: string; favorites: string[]; categories: any[]; recipes: any[]; loading: boolean }> {
  state = { selectedId: '', favorites: [] as string[], categories: [] as any[], recipes: [] as any[], loading: true }

  async componentDidMount() {
    const params = Taro.getCurrentInstance().router?.params
    const categoryParam = params?.category

    try {
      const cats = await request({ url: '/api/categories' })
      const categories = cats || []
      const initialId = categoryParam && categories.find((c: any) => c.id === categoryParam || c.name.toLowerCase() === categoryParam.toLowerCase())
        ? categoryParam
        : categories[0]?.id || ''
      this.setState({ categories, selectedId: initialId })
      if (initialId) {
        await this.loadRecipes(initialId)
      } else {
        this.setState({ loading: false })
      }
    } catch (err) {
      console.error('Failed to load categories:', err)
      this.setState({ loading: false })
    }

    this.setState({ favorites: getFavoriteIds() })
  }

  onShow = () => {
    this.setState({ favorites: getFavoriteIds() })
  }

  loadRecipes = async (categoryId: string) => {
    this.setState({ loading: true })
    try {
      const recs = await request({ url: `/api/recipes?categoryId=${categoryId}` })
      this.setState({ recipes: recs || [], loading: false })
    } catch (err) {
      console.error('Failed to load recipes:', err)
      this.setState({ recipes: [], loading: false })
    }
  }

  handleSelectCategory = (id: string) => {
    this.setState({ selectedId: id })
    this.loadRecipes(id)
  }

  handleRecipeClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })
  }

  handleToggleLike = async (id: string, e: any) => {
    e.stopPropagation()
    const wasLiked = getFavoriteIds().includes(id)
    toggleFavorite(id)
    this.setState({ favorites: getFavoriteIds() })

    try {
      if (!wasLiked) {
        await request({ url: '/api/saved', method: 'POST', data: { recipeId: id } })
      } else {
        await request({ url: '/api/saved', method: 'DELETE', data: { recipeId: id } })
      }
    } catch (err) {
      console.error('Failed to update saved:', err)
    }
  }

  render() {
    const { selectedId, favorites, categories, recipes, loading } = this.state
    const selectedCategory = categories.find((c: any) => c.id === selectedId)

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        {/* Header */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>{selectedCategory?.name || 'Categories'} Recipes</Text>
          <View style={{ width: '24px' }} />
        </View>

        {/* Category Tabs */}
        <ScrollView style={{ backgroundColor: '#FFFFFF', padding: '12px 16px' }} scrollX showScrollbar={false}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
            {categories.map((cat: any) => (
              <View key={cat.id} style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: selectedId === cat.id ? '#FF5722' : '#F5F5F5' }} onClick={() => this.handleSelectCategory(cat.id)}>
                <Text style={{ fontSize: '14px', fontWeight: selectedId === cat.id ? '600' : '400', color: selectedId === cat.id ? '#FFFFFF' : '#212121' }}>{cat.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Recipe Grid using RecipeCard */}
        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#999999', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : (
              <>
                <Text style={{ fontSize: '14px', color: '#757575', marginBottom: '12px' }}>Showing {recipes.length} delicious recipes</Text>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                  {recipes.map((recipe: any) => (
                    <View key={recipe.id} style={{ width: 'calc(50% - 6px)' }}>
                      <RecipeCard
                        title={recipe.title}
                        subtitle={recipe.subtitle || `${recipe.views || 0} Views`}
                        estimatedTime={recipe.estimatedTime}
                        quantity={recipe.quantity}
                        creator={`by ${recipe.authorName}`}
                        category={recipe.category?.name || selectedCategory?.name}
                        imageUrl={recipe.imageUrl}
                        hasCrown={recipe.hasCrown}
                        onClick={() => this.handleRecipeClick(recipe.id)}
                      />
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

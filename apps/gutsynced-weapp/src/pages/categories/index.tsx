import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { RecipeCard } from '../../components'
import { categoryStore } from '../../utils/categoryStore'
import { recipeStore } from '../../utils/recipeStore'

export default class Categories extends Component<{}, { selectedId: string; categories: any[]; recipes: any[]; loading: boolean }> {
  state = { selectedId: '', categories: [] as any[], recipes: [] as any[], loading: true }

  async componentDidMount() {
    const params = Taro.getCurrentInstance().router?.params
    const categoryParam = params?.category

    try {
      // Use centralized category store
      const cats = await categoryStore.getAll()
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
  }

  loadRecipes = async (categoryId: string) => {
    this.setState({ loading: true })
    try {
      // Use centralized recipe store
      const recs = await recipeStore.getByCategory(categoryId)
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

  render() {
    const { selectedId, categories, recipes, loading } = this.state
    const selectedCategory = categories.find((c: any) => c.id === selectedId)

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        {/* Header */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>{selectedCategory?.name || 'Categories'} Recipes</Text>
          <View style={{ width: '24px' }} />
        </View>

        {/* Category Tabs */}
        <ScrollView style={{ backgroundColor: 'var(--color-surface)', padding: '12px 16px' }} scrollX showScrollbar={false}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
            {categories.map((cat: any) => (
              <View key={cat.id} style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: selectedId === cat.id ? 'var(--color-primary-container)' : 'var(--color-background)' }} onClick={() => this.handleSelectCategory(cat.id)}>
                <Text style={{ fontSize: '14px', fontWeight: selectedId === cat.id ? '600' : '400', color: selectedId === cat.id ? '#FFFFFF' : 'var(--color-text)' }}>{cat.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Recipe Grid using RecipeCard */}
        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : (
              <>
                <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '12px' }}>Showing {recipes.length} delicious recipes</Text>
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

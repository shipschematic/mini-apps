import { Component } from 'react'
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface EditRecipeState {
  recipeId: string
  loading: boolean
  saving: boolean
  recipe: {
    id: string
    title: string
    subtitle: string
    estimatedTime: string
    quantity: string
    imageUrl: string
    categoryId: string
    ingredients: string[]
    steps: string[]
    status: string
  }
  categories: any[]
}

export default class EditRecipe extends Component<{}, EditRecipeState> {
  state: EditRecipeState = {
    recipeId: '',
    loading: true,
    saving: false,
    recipe: {
      id: '',
      title: '',
      subtitle: '',
      estimatedTime: '',
      quantity: '',
      imageUrl: '',
      categoryId: '',
      ingredients: [],
      steps: [],
      status: 'DRAFT'
    },
    categories: [
      { id: '1', name: 'Breakfast', icon: '🍳' },
      { id: '2', name: 'Lunch', icon: '🥗' },
      { id: '3', name: 'Dinner', icon: '🍽️' },
      { id: '4', name: 'Dessert', icon: '🍰' }
    ]
  }

  componentDidMount = async () => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    const recipeId = currentPage.options?.id

    if (recipeId) {
      this.setState({ recipeId }, () => {
        this.loadRecipe()
      })
    } else {
      Taro.showToast({ title: 'Recipe ID required', icon: 'none' })
      Taro.navigateBack()
    }
  }

  loadRecipe = async () => {
    try {
      Taro.showLoading({ title: 'Loading...' })
      await new Promise(resolve => setTimeout(resolve, 500))
      this.setState({
        recipe: {
          id: this.state.recipeId,
          title: 'Sample Recipe',
          subtitle: '62K Views',
          estimatedTime: '20 Min',
          quantity: '1 Serving',
          imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
          categoryId: '1',
          ingredients: ['Ingredient 1', 'Ingredient 2'],
          steps: ['Step 1 description', 'Step 2 description'],
          status: 'DRAFT'
        },
        loading: false
      })
      Taro.hideLoading()
    } catch (error: any) {
      Taro.hideLoading()
      Taro.showToast({ title: 'Failed to load recipe', icon: 'none' })
      this.setState({ loading: false })
    }
  }

  handleInputChange = (field: keyof typeof this.state.recipe, value: string) => {
    this.setState((prev) => ({
      recipe: {
        ...prev.recipe,
        [field]: value
      }
    }))
  }

  handleArrayInputChange = (
    type: 'ingredients' | 'steps',
    index: number,
    value: string
  ) => {
    this.setState((prev) => {
      const newArray = [...prev.recipe[type]]
      newArray[index] = value
      return {
        recipe: {
          ...prev.recipe,
          [type]: newArray
        }
      }
    })
  }

  addArrayItem = (type: 'ingredients' | 'steps') => {
    this.setState((prev) => ({
      recipe: {
        ...prev.recipe,
        [type]: [...prev.recipe[type], '']
      }
    }))
  }

  removeArrayItem = (type: 'ingredients' | 'steps', index: number) => {
    this.setState((prev) => {
      const newArray = prev.recipe[type].filter((_, i) => i !== index)
      return {
        recipe: {
          ...prev.recipe,
          [type]: newArray
        }
      }
    })
  }

  handleSave = async (publish: boolean) => {
    Taro.showLoading({ title: publish ? 'Publishing...' : 'Saving...' })
    await new Promise(resolve => setTimeout(resolve, 1000))
    Taro.hideLoading()
    Taro.showToast({
      title: publish ? 'Recipe published!' : 'Draft saved!',
      icon: 'success'
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  handleDelete = async () => {
    Taro.showModal({
      title: 'Delete Recipe',
      content: 'Are you sure you want to delete this recipe? This cannot be undone.',
      success: async (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: 'Deleting...' })
          await new Promise(resolve => setTimeout(resolve, 1000))
          Taro.hideLoading()
          Taro.showToast({ title: 'Recipe deleted', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        }
      }
    })
  }

  render() {
    const { recipe, categories, loading } = this.state

    if (loading) {
      return (
        <View style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Edit Recipe</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Text>Loading recipe...</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Edit Recipe</Text>
        </View>

        <ScrollView scrollY style={{ height: 'calc(100vh - 130px)' }}>
          <View style={{ padding: '16px' }}>
            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Recipe Title</Text>
              <Input
                placeholder='Enter recipe title'
                value={recipe.title}
                onInput={(e) => this.handleInputChange('title', e.detail.value)}
                style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px' }}
              />
            </View>

            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Subtitle</Text>
              <Input
                placeholder='e.g., 62K Views'
                value={recipe.subtitle}
                onInput={(e) => this.handleInputChange('subtitle', e.detail.value)}
                style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px' }}
              />
            </View>

            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Estimated Time</Text>
              <Input
                placeholder='e.g., 20 Min'
                value={recipe.estimatedTime}
                onInput={(e) => this.handleInputChange('estimatedTime', e.detail.value)}
                style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px' }}
              />
            </View>

            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Quantity</Text>
              <Input
                placeholder='e.g., 1 Serving'
                value={recipe.quantity}
                onInput={(e) => this.handleInputChange('quantity', e.detail.value)}
                style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px' }}
              />
            </View>

            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Category</Text>
              <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map((cat) => (
                  <View
                    key={cat.id}
                    onClick={() => this.handleInputChange('categoryId', cat.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: recipe.categoryId === cat.id ? '#FF6B6B' : '#fff',
                      borderRadius: '20px',
                      border: recipe.categoryId === cat.id ? 'none' : '1px solid #eee'
                    }}
                  >
                    <Text style={{ color: recipe.categoryId === cat.id ? '#fff' : '#333', fontSize: '14px' }}>
                      {cat.icon} {cat.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Image URL</Text>
              <Input
                placeholder='https://...'
                value={recipe.imageUrl}
                onInput={(e) => this.handleInputChange('imageUrl', e.detail.value)}
                style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px' }}
              />
            </View>

            <View style={{ marginBottom: '16px' }}>
              <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Ingredients</Text>
                <Text onClick={() => this.addArrayItem('ingredients')} style={{ fontSize: '20px', color: '#FF6B6B' }}>+</Text>
              </View>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Input
                    placeholder={`Ingredient ${index + 1}`}
                    value={ingredient}
                    onInput={(e) => this.handleArrayInputChange('ingredients', index, e.detail.value)}
                    style={{ flex: 1, padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px', marginRight: '8px' }}
                  />
                  <Text onClick={() => this.removeArrayItem('ingredients', index)} style={{ fontSize: '20px', color: '#EF4444' }}>-</Text>
                </View>
              ))}
            </View>

            <View style={{ marginBottom: '16px' }}>
              <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Steps</Text>
                <Text onClick={() => this.addArrayItem('steps')} style={{ fontSize: '20px', color: '#FF6B6B' }}>+</Text>
              </View>
              {recipe.steps.map((step, index) => (
                <View key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <Textarea
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onInput={(e) => this.handleArrayInputChange('steps', index, e.detail.value)}
                    maxlength={500}
                    style={{ flex: 1, padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px', marginRight: '8px', height: '80px' }}
                  />
                  <Text onClick={() => this.removeArrayItem('steps', index)} style={{ fontSize: '20px', color: '#EF4444' }}>-</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={{ display: 'flex', padding: '16px', gap: '8px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
          <View onClick={this.handleDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', alignItems: 'center', border: '1px solid #EF4444' }}>
            <Text style={{ color: '#EF4444', fontSize: '14px', fontWeight: 'bold' }}>Delete</Text>
          </View>
          <View onClick={() => this.handleSave(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', alignItems: 'center', border: '1px solid #ccc' }}>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Save Draft</Text>
          </View>
          <View onClick={() => this.handleSave(true)} style={{ flex: 1, backgroundColor: '#FF6B6B', padding: '12px', borderRadius: '8px', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Publish</Text>
          </View>
        </View>
      </View>
    )
  }
}

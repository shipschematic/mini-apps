import { Component } from 'react'
import { View, Text, ScrollView, Input, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

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

interface UploadState {
  recipeName: string
  description: string
  ingredients: string[]
  steps: string[]
  categoryIndex: number
  categories: any[]
  cookTime: string
  servings: string
  loading: boolean
}

export default class Upload extends Component<{}, UploadState> {
  state: UploadState = {
    recipeName: '',
    description: '',
    ingredients: [''],
    steps: [''],
    categoryIndex: 0,
    categories: [],
    cookTime: '',
    servings: '',
    loading: false
  }

  async componentDidMount() {
    try {
      const cats = await request({ url: '/api/categories' })
      this.setState({ categories: cats || [] })
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  handleInputChange = (field: keyof UploadState, value: string) => {
    this.setState({ [field]: value } as any)
  }

  handleAddIngredient = () => {
    this.setState(prev => ({ ingredients: [...prev.ingredients, ''] }))
  }

  handleAddStep = () => {
    this.setState(prev => ({ steps: [...prev.steps, ''] }))
  }

  handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...this.state.ingredients]
    newIngredients[index] = value
    this.setState({ ingredients: newIngredients })
  }

  handleStepChange = (index: number, value: string) => {
    const newSteps = [...this.state.steps]
    newSteps[index] = value
    this.setState({ steps: newSteps })
  }

  validate = () => {
    const { recipeName, cookTime, servings, categories, categoryIndex } = this.state
    if (!recipeName.trim()) {
      Taro.showToast({ title: 'Please enter recipe name', icon: 'none' })
      return false
    }
    if (!categories[categoryIndex]) {
      Taro.showToast({ title: 'Please select a category', icon: 'none' })
      return false
    }
    if (!cookTime.trim()) {
      Taro.showToast({ title: 'Please enter cook time', icon: 'none' })
      return false
    }
    if (!servings.trim()) {
      Taro.showToast({ title: 'Please enter servings', icon: 'none' })
      return false
    }
    return true
  }

  submitRecipe = async (status: 'PUBLISHED' | 'DRAFT') => {
    if (!this.validate()) return

    const userInfo = Taro.getStorageSync('user_info')
    if (!userInfo?.id) {
      Taro.showToast({ title: 'Please login first', icon: 'none' })
      return
    }

    const { recipeName, description, ingredients, steps, categories, categoryIndex, cookTime, servings } = this.state
    const category = categories[categoryIndex]
    const filteredIngredients = ingredients.filter(i => i.trim())
    const filteredSteps = steps.filter(s => s.trim())

    this.setState({ loading: true })
    try {
      const recipe = await request({
        url: '/api/recipes',
        method: 'POST',
        data: {
          title: recipeName,
          subtitle: description || `${userInfo.name}'s recipe`,
          estimatedTime: cookTime,
          quantity: servings,
          categoryId: category.id,
          authorName: userInfo.name || 'Chef Guest',
          creatorId: userInfo.id,
          ingredients: filteredIngredients,
          steps: filteredSteps,
          status
        }
      })

      Taro.showToast({
        title: status === 'PUBLISHED' ? 'Recipe published!' : 'Draft saved!',
        icon: 'success'
      })

      // Clear form
      this.setState({
        recipeName: '',
        description: '',
        ingredients: [''],
        steps: [''],
        categoryIndex: 0,
        cookTime: '',
        servings: ''
      })

      // Navigate to the new recipe
      setTimeout(() => {
        Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${recipe.id}` })
      }, 1000)
    } catch (err: any) {
      console.error('Failed to save recipe:', err)
      Taro.showToast({ title: err.message || 'Save failed', icon: 'none' })
    } finally {
      this.setState({ loading: false })
    }
  }

  handlePublish = () => this.submitRecipe('PUBLISHED')
  handleSaveDraft = () => this.submitRecipe('DRAFT')

  render() {
    const { recipeName, description, ingredients, steps, categories, categoryIndex, cookTime, servings, loading } = this.state
    const categoryNames = categories.map(c => c.name)

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF4F21' }}>Dapoer</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Upload</Text>
          <View style={{ width: '24px' }} />
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            <View style={{ height: '160px', backgroundColor: '#EEEEEE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Text style={{ fontSize: '16px', color: '#757575' }}>Add Photo</Text>
            </View>

            <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Recipe Name *</Text>
            <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '12px', border: '1px solid #EEEEEE' }} type='text' value={recipeName} placeholder='Enter recipe name' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.handleInputChange('recipeName', e.detail.value)} />

            <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Description</Text>
            <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '12px', border: '1px solid #EEEEEE' }} type='text' value={description} placeholder='Describe your recipe' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.handleInputChange('description', e.detail.value)} />

            <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '12px' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Category *</Text>
                {categories.length > 0 ? (
                  <Picker mode='selector' range={categoryNames} value={categoryIndex} onChange={(e: any) => this.setState({ categoryIndex: e.detail.value })}>
                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', border: '1px solid #EEEEEE' }}>
                      <Text style={{ fontSize: '16px', color: categoryNames[categoryIndex] ? '#212121' : '#BDBDBD' }}>{categoryNames[categoryIndex] || 'Select category'}</Text>
                    </View>
                  </Picker>
                ) : (
                  <Text style={{ fontSize: '14px', color: '#999999' }}>Loading categories...</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Cook Time *</Text>
                <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', border: '1px solid #EEEEEE' }} type='text' value={cookTime} placeholder='e.g. 30 min' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.handleInputChange('cookTime', e.detail.value)} />
              </View>
            </View>

            <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Servings *</Text>
            <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid #EEEEEE' }} type='text' value={servings} placeholder='e.g. 4 serves' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.handleInputChange('servings', e.detail.value)} />

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121' }}>Ingredients</Text>
              <Text style={{ fontSize: '14px', color: '#FF4F21' }} onClick={this.handleAddIngredient}>+ Add</Text>
            </View>
            {ingredients.map((ingredient, index) => (
              <Input key={index} style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '8px', border: '1px solid #EEEEEE' }} type='text' value={ingredient} placeholder={`Ingredient ${index + 1}`} placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.handleIngredientChange(index, e.detail.value)} />
            ))}

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121' }}>Steps</Text>
              <Text style={{ fontSize: '14px', color: '#FF4F21' }} onClick={this.handleAddStep}>+ Add</Text>
            </View>
            {steps.map((step, index) => (
              <Input key={index} style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '8px', border: '1px solid #EEEEEE' }} type='text' value={step} placeholder={`Step ${index + 1}`} placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.handleStepChange(index, e.detail.value)} />
            ))}

            <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginTop: '16px' }}>
              <View style={{ flex: 1, borderRadius: '12px', border: '2px solid #FF4F21', padding: '14px', alignItems: 'center', opacity: loading ? 0.5 : 1 }} onClick={this.handleSaveDraft}>
                <Text style={{ color: '#FF4F21', fontWeight: '600', fontSize: '16px' }}>{loading ? 'Saving...' : 'Save Draft'}</Text>
              </View>
              <View style={{ flex: 1, borderRadius: '12px', backgroundColor: '#FF4F21', padding: '14px', alignItems: 'center', opacity: loading ? 0.5 : 1 }} onClick={this.handlePublish}>
                <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>{loading ? 'Publishing...' : 'Publish'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

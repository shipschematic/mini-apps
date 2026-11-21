import { Component } from 'react'
import { View, Text, ScrollView, Input, Picker, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { categoryStore } from '../../utils/categoryStore'
import { recipeStore } from '../../utils/recipeStore'
import './index.scss'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png']
const MAX_TITLE_LENGTH = 100
const MAX_DESC_LENGTH = 500

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
  imageUrl: string
  errors: Record<string, string>
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
    loading: false,
    imageUrl: '',
    errors: {}
  }

  async componentDidMount() {
    try {
      // Use centralized category store
      const cats = await categoryStore.getAll()
      this.setState({ categories: cats || [] })
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  handleInputChange = (field: keyof Omit<UploadState, 'errors' | 'categories' | 'loading'>, value: string) => {
    this.setState({ [field]: value, errors: { ...this.state.errors, [field]: '' } } as any)
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
    this.setState({ ingredients: newIngredients, errors: { ...this.state.errors, ingredients: '' } })
  }

  handleStepChange = (index: number, value: string) => {
    const newSteps = [...this.state.steps]
    newSteps[index] = value
    this.setState({ steps: newSteps, errors: { ...this.state.errors, steps: '' } })
  }

  handleRemoveIngredient = (index: number) => {
    if (this.state.ingredients.length <= 1) return
    const newIngredients = this.state.ingredients.filter((_, i) => i !== index)
    this.setState({ ingredients: newIngredients })
  }

  handleRemoveStep = (index: number) => {
    if (this.state.steps.length <= 1) return
    const newSteps = this.state.steps.filter((_, i) => i !== index)
    this.setState({ steps: newSteps })
  }

  handleImagePick = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFile = res.tempFilePaths[0]
        const fileExt = tempFile.split('.').pop()?.toLowerCase() || ''

        if (!ALLOWED_IMAGE_TYPES.includes(fileExt)) {
          Taro.showToast({ title: 'Only JPG and PNG images allowed', icon: 'none' })
          return
        }

        Taro.getFileInfo({
          filePath: tempFile,
          success: (info) => {
            if (info.size > MAX_IMAGE_SIZE) {
              Taro.showToast({ title: 'Image must be under 5MB', icon: 'none' })
              return
            }
            this.setState({ imageUrl: tempFile, errors: { ...this.state.errors, imageUrl: '' } })
          },
          fail: () => {
            this.setState({ imageUrl: tempFile })
          }
        })
      },
      fail: () => {
      }
    })
  }

  validate = (): boolean => {
    const { recipeName, description, cookTime, servings, categories, categoryIndex, ingredients, steps, imageUrl } = this.state
    const errors: Record<string, string> = {}

    if (!recipeName.trim()) {
      errors.recipeName = 'Recipe name is required'
    } else if (recipeName.trim().length > MAX_TITLE_LENGTH) {
      errors.recipeName = `Recipe name must be under ${MAX_TITLE_LENGTH} characters`
    }

    if (description.trim().length > MAX_DESC_LENGTH) {
      errors.description = `Description must be under ${MAX_DESC_LENGTH} characters`
    }

    if (!categories[categoryIndex]) {
      errors.categoryIndex = 'Please select a category'
    }

    if (!cookTime.trim()) {
      errors.cookTime = 'Cook time is required'
    } else {
      const timeMatch = cookTime.match(/^(\d+)\s*(min|minute|hour|hr|h)?$/i)
      if (!timeMatch) {
        errors.cookTime = 'Use format: 30 min or 1 hour'
      }
    }

    if (!servings.trim()) {
      errors.servings = 'Servings is required'
    } else {
      const servingMatch = servings.match(/^(\d+)\s*(serving|serves?|person|people|p)?$/i)
      if (!servingMatch) {
        errors.servings = 'Use format: 4 serves or 2 people'
      }
    }

    const filteredIngredients = ingredients.filter(i => i.trim())
    if (filteredIngredients.length === 0) {
      errors.ingredients = 'Add at least 1 ingredient'
    }

    const filteredSteps = steps.filter(s => s.trim())
    if (filteredSteps.length === 0) {
      errors.steps = 'Add at least 1 step'
    }

    this.setState({ errors })
    return Object.keys(errors).length === 0
  }

  submitRecipe = async (status: 'PUBLISHED' | 'DRAFT') => {
    if (!this.validate()) return

    const userInfo = Taro.getStorageSync('user_info')
    if (!userInfo?.id) {
      Taro.showToast({ title: 'Please login first', icon: 'none' })
      return
    }

    const { recipeName, description, ingredients, steps, categories, categoryIndex, cookTime, servings, imageUrl } = this.state
    const category = categories[categoryIndex]
    const filteredIngredients = ingredients.filter(i => i.trim())
    const filteredSteps = steps.filter(s => s.trim())

    this.setState({ loading: true })
    try {
      // Use centralized recipe store to create recipe
      const recipe = await recipeStore.create({
        title: recipeName.trim(),
        subtitle: description.trim() || `${userInfo.name}'s recipe`,
        estimatedTime: cookTime.trim(),
        quantity: servings.trim(),
        imageUrl: imageUrl || '',
        categoryId: category.id,
        ingredients: filteredIngredients.join('\n'),
        steps: filteredSteps.join('\n'),
        status
      })

      Taro.showToast({
        title: status === 'PUBLISHED' ? 'Recipe published!' : 'Draft saved!',
        icon: 'success'
      })

      // Reset form
      this.setState({
        recipeName: '',
        description: '',
        ingredients: [''],
        steps: [''],
        categoryIndex: 0,
        cookTime: '',
        servings: '',
        imageUrl: '',
        errors: {}
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
    const { recipeName, description, ingredients, steps, categories, categoryIndex, cookTime, servings, loading, imageUrl, errors } = this.state
    const categoryNames = categories.map(c => c.name)
    const filteredIngredients = ingredients.filter(i => i.trim())
    const filteredSteps = steps.filter(s => s.trim())

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-primary)' }}>GutSynced</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Upload</Text>
          <View style={{ width: '24px' }} />
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            <View onClick={this.handleImagePick} style={{ height: '180px', backgroundColor: 'var(--color-outline)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', overflow: 'hidden', border: errors.imageUrl ? '2px solid var(--color-danger)' : '2px dashed var(--color-outline)' }}>
              {imageUrl ? (
                <Image src={imageUrl} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: '32px', color: 'var(--color-muted)' }}>+</Text>
                  <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>Add Photo</Text>
                  <Text style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '2px' }}>JPG/PNG, max 5MB</Text>
                </View>
              )}
            </View>
            {errors.imageUrl && <Text style={{ fontSize: '12px', color: '#EF4444', marginBottom: '8px' }}>{errors.imageUrl}</Text>}

            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>Recipe Name *</Text>
              <Text style={{ fontSize: '12px', color: recipeName.length > MAX_TITLE_LENGTH ? '#EF4444' : '#9E9E9E' }}>{recipeName.length}/{MAX_TITLE_LENGTH}</Text>
            </View>
            <Input
              style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '4px', border: errors.recipeName ? '1px solid #EF4444' : '1px solid var(--color-outline)' }}
              type='text'
              value={recipeName}
              placeholder='Enter recipe name'
              placeholderStyle={{ color: 'var(--color-muted)' } as any}
              onInput={(e: any) => this.handleInputChange('recipeName', e.detail.value)}
              maxlength={MAX_TITLE_LENGTH + 10}
            />
            {errors.recipeName && <Text style={{ fontSize: '12px', color: '#EF4444', marginBottom: '8px' }}>{errors.recipeName}</Text>}

            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>Description</Text>
              <Text style={{ fontSize: '12px', color: description.length > MAX_DESC_LENGTH ? '#EF4444' : '#9E9E9E' }}>{description.length}/{MAX_DESC_LENGTH}</Text>
            </View>
            <Input
              style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '4px', border: errors.description ? '1px solid #EF4444' : '1px solid var(--color-outline)' }}
              type='text'
              value={description}
              placeholder='Describe your recipe'
              placeholderStyle={{ color: 'var(--color-muted)' } as any}
              onInput={(e: any) => this.handleInputChange('description', e.detail.value)}
              maxlength={MAX_DESC_LENGTH + 10}
            />
            {errors.description && <Text style={{ fontSize: '12px', color: '#EF4444', marginBottom: '8px' }}>{errors.description}</Text>}

            <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '12px' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '4px' }}>Category *</Text>
                {categories.length > 0 ? (
                  <Picker mode='selector' range={categoryNames} value={categoryIndex} onChange={(e: any) => this.setState({ categoryIndex: e.detail.value, errors: { ...this.state.errors, categoryIndex: '' } })}>
                    <View style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', border: errors.categoryIndex ? '1px solid #EF4444' : '1px solid var(--color-outline)' }}>
                      <Text style={{ fontSize: '16px', color: categoryNames[categoryIndex] ? 'var(--color-text)' : 'var(--color-muted)' }}>{categoryNames[categoryIndex] || 'Select category'}</Text>
                    </View>
                  </Picker>
                ) : (
                  <Text style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Loading categories...</Text>
                )}
                {errors.categoryIndex && <Text style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.categoryIndex}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '4px' }}>Cook Time *</Text>
                <Input
                  style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', border: errors.cookTime ? '1px solid #EF4444' : '1px solid var(--color-outline)' }}
                  type='text'
                  value={cookTime}
                  placeholder='e.g. 30 min'
                  placeholderStyle={{ color: 'var(--color-muted)' } as any}
                  onInput={(e: any) => this.handleInputChange('cookTime', e.detail.value)}
                />
                {errors.cookTime && <Text style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.cookTime}</Text>}
              </View>
            </View>

            <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '4px' }}>Servings *</Text>
            <Input
              style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '4px', border: errors.servings ? '1px solid #EF4444' : '1px solid var(--color-outline)' }}
              type='text'
              value={servings}
              placeholder='e.g. 4 serves'
              placeholderStyle={{ color: 'var(--color-muted)' } as any}
              onInput={(e: any) => this.handleInputChange('servings', e.detail.value)}
            />
            {errors.servings && <Text style={{ fontSize: '12px', color: '#EF4444', marginBottom: '8px' }}>{errors.servings}</Text>}

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>Ingredients ({filteredIngredients.length})</Text>
              <Text style={{ fontSize: '14px', color: 'var(--color-primary)' }} onClick={this.handleAddIngredient}>+ Add</Text>
            </View>
            {errors.ingredients && <Text style={{ fontSize: '12px', color: '#EF4444', marginBottom: '8px' }}>{errors.ingredients}</Text>}
            {ingredients.map((ingredient, index) => (
              <View key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Input
                  style={{ flex: 1, backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', border: '1px solid var(--color-outline)' }}
                  type='text'
                  value={ingredient}
                  placeholder={`Ingredient ${index + 1}`}
                  placeholderStyle={{ color: 'var(--color-muted)' } as any}
                  onInput={(e: any) => this.handleIngredientChange(index, e.detail.value)}
                />
                {ingredients.length > 1 && (
                  <Text onClick={() => this.handleRemoveIngredient(index)} style={{ marginLeft: '8px', fontSize: '20px', color: '#EF4444', padding: '8px' }}>×</Text>
                )}
              </View>
            ))}

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>Steps ({filteredSteps.length})</Text>
              <Text style={{ fontSize: '14px', color: 'var(--color-primary)' }} onClick={this.handleAddStep}>+ Add</Text>
            </View>
            {errors.steps && <Text style={{ fontSize: '12px', color: '#EF4444', marginBottom: '8px' }}>{errors.steps}</Text>}
            {steps.map((step, index) => (
              <View key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <View style={{ width: '28px', height: '28px', borderRadius: '14px', backgroundColor: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', flexShrink: 0 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>{index + 1}</Text>
                </View>
                <Input
                  style={{ flex: 1, backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', border: '1px solid var(--color-outline)' }}
                  type='text'
                  value={step}
                  placeholder={`Step ${index + 1}`}
                  placeholderStyle={{ color: 'var(--color-muted)' } as any}
                  onInput={(e: any) => this.handleStepChange(index, e.detail.value)}
                />
                {steps.length > 1 && (
                  <Text onClick={() => this.handleRemoveStep(index)} style={{ marginLeft: '8px', fontSize: '20px', color: '#EF4444', padding: '8px' }}>×</Text>
                )}
              </View>
            ))}

            <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginTop: '20px', marginBottom: '32px' }}>
              <View style={{ flex: 1, borderRadius: '12px', border: '2px solid var(--color-primary)', padding: '14px', alignItems: 'center', opacity: loading ? 0.5 : 1 }} onClick={loading ? undefined : this.handleSaveDraft}>
                <Text style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '16px' }}>{loading ? 'Saving...' : 'Save Draft'}</Text>
              </View>
              <View style={{ flex: 1, borderRadius: '12px', backgroundColor: 'var(--color-primary-container)', padding: '14px', alignItems: 'center', opacity: loading ? 0.5 : 1 }} onClick={loading ? undefined : this.handlePublish}>
                <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>{loading ? 'Publishing...' : 'Publish'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
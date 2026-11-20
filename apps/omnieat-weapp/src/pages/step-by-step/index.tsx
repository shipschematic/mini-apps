import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'

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

export default class StepByStep extends Component<{}, { currentStep: number; steps: string[]; recipeId: string; loading: boolean }> {
  state = { currentStep: 0, steps: [] as string[], recipeId: '', loading: true }

  async componentDidMount() {
    const recipeId = (Taro.getCurrentInstance().router?.params?.id as string) || ''
    this.setState({ recipeId })
    if (recipeId) {
      try {
        const recipe = await request({ url: `/api/recipes/${recipeId}` })
        const steps = recipe?.steps ? JSON.parse(recipe.steps) : []
        this.setState({ steps, loading: false })
      } catch (err) {
        console.error('Failed to load recipe steps:', err)
        this.setState({ loading: false })
      }
    } else {
      this.setState({ loading: false })
    }
  }

  handleNext = () => {
    if (this.state.currentStep >= this.state.steps.length - 1) {
      Taro.navigateTo({ url: `/pages/finish-cooking/index?id=${this.state.recipeId}` })
      return
    }
    this.setState(prev => ({ currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1) }))
  }
  handlePrev = () => this.setState(prev => ({ currentStep: Math.max(prev.currentStep - 1, 0) }))

  render() {
    const { currentStep, steps, loading } = this.state
    const isLast = currentStep === steps.length - 1

    if (loading) {
      return (
        <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '16px', color: '#999999' }}>Loading steps...</Text>
        </View>
      )
    }

    if (steps.length === 0) {
      return (
        <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '16px', color: '#999999' }}>No steps available</Text>
        </View>
      )
    }

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Step {currentStep + 1} of {steps.length}</Text>
          <View style={{ width: '24px' }} />
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '24px' }}>
            <View style={{ width: '60px', height: '60px', borderRadius: '30px', backgroundColor: '#FF5722', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Text style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: '600' }}>{currentStep + 1}</Text>
            </View>
            <Text style={{ fontSize: '20px', color: '#212121', lineHeight: '28px' }}>{steps[currentStep]}</Text>
          </View>
        </ScrollView>

        <View style={{ padding: '16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EEEEEE', display: 'flex', flexDirection: 'row', gap: '12px' }}>
          <View style={{ flex: 1, borderRadius: '12px', border: '2px solid #FF5722', padding: '14px', alignItems: 'center', opacity: currentStep === 0 ? 0.5 : 1 }} onClick={this.handlePrev}>
            <Text style={{ color: '#FF5722', fontWeight: '600', fontSize: '16px' }}>Previous</Text>
          </View>
          <View style={{ flex: 1, borderRadius: '12px', backgroundColor: '#FF5722', padding: '14px', alignItems: 'center' }} onClick={this.handleNext}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>{isLast ? 'Finish' : 'Next'}</Text>
          </View>
        </View>
      </View>
    )
  }
}

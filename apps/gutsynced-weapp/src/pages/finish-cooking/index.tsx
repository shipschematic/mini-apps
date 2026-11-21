import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { RecipeCard } from '../../components'

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

interface FinishCookingState {
  recipe: any
  loading: boolean
}

export default class FinishCooking extends Component<{}, FinishCookingState> {
  state: FinishCookingState = { recipe: null, loading: true }

  async componentDidMount() {
    const recipeId = (Taro.getCurrentInstance().router?.params?.id as string) || ''
    if (recipeId) {
      try {
        const recipe = await request({ url: `/api/recipes/${recipeId}` })
        this.setState({ recipe, loading: false })
      } catch (err) {
        console.error('Failed to load recipe:', err)
        this.setState({ loading: false })
      }
    } else {
      this.setState({ loading: false })
    }
  }

  handleCompleted = () => {
    Taro.showToast({ title: 'Enjoy your meal!', icon: 'success' })
    Taro.switchTab({ url: '/pages/home/index' })
  }

  handleViewRecipe = () => {
    if (this.state.recipe?.id) {
      Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${this.state.recipe.id}` })
    }
  }

  render() {
    const { recipe, loading } = this.state

    return (
      <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', padding: '24px', width: '100%' }}>
          {loading ? (
            <Text style={{ fontSize: '16px', color: 'var(--color-muted)' }}>Loading...</Text>
          ) : (
            <>
              <View style={{ position: 'relative', width: '220px', height: '220px', marginBottom: '32px', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ position: 'absolute', top: '0px', left: '20px' }}>
                  <Text style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{'\u25CB'}</Text>
                </View>
                <View style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <Text style={{ fontSize: '20px', color: '#FBBF24' }}>{'\u25CF'}</Text>
                </View>
                <View style={{ position: 'absolute', top: '40px', right: '0px' }}>
                  <Text style={{ fontSize: '16px', color: 'var(--color-primary)' }}>{'\u25CB'}</Text>
                </View>
                <View style={{ position: 'absolute', bottom: '40px', left: '0px' }}>
                  <Text style={{ fontSize: '18px', color: '#FBBF24' }}>{'\u25CF'}</Text>
                </View>
                <View style={{ position: 'absolute', bottom: '10px', right: '30px' }}>
                  <Text style={{ fontSize: '14px', color: 'var(--color-primary)' }}>{'\u25CB'}</Text>
                </View>
                <View style={{ position: 'absolute', bottom: '60px', right: '5px' }}>
                  <Text style={{ fontSize: '12px', color: '#4CAF50' }}>{'\u25CF'}</Text>
                </View>
                <View style={{ position: 'absolute', top: '60px', left: '5px' }}>
                  <Text style={{ fontSize: '12px', color: '#275AC5' }}>{'\u25CF'}</Text>
                </View>

                <Image
                  src={recipe?.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'}
                  mode='aspectFill'
                  style={{ width: '180px', height: '180px', borderRadius: '90px' }}
                />
              </View>

              <View style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Text style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-text)' }}>Horay!</Text>
                <Text style={{ fontSize: '24px', marginLeft: '8px' }}>{'\uD83C\uDF89'}</Text>
              </View>

              <Text style={{ fontSize: '15px', color: 'var(--color-muted)', marginBottom: '16px', textAlign: 'center', lineHeight: '22px' }}>
                You've completed cooking!{'\n'}Here's what you made:
              </Text>

              {recipe && (
                <View style={{ width: '100%', maxWidth: '300px', marginBottom: '24px' }}>
                  <RecipeCard
                    title={recipe.title}
                    subtitle={recipe.subtitle || `${recipe.views || 0} Views`}
                    estimatedTime={recipe.estimatedTime}
                    quantity={recipe.quantity}
                    creator={`by ${recipe.authorName}`}
                    category={recipe.category?.name}
                    imageUrl={recipe.imageUrl}
                    hasCrown={recipe.hasCrown}
                  />
                </View>
              )}

              <View
                onClick={this.handleCompleted}
                style={{
                  backgroundColor: 'var(--color-primary-container)',
                  padding: '16px',
                  borderRadius: '16px',
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600' }}>Completed</Text>
              </View>

              {recipe && (
                <View
                  onClick={this.handleViewRecipe}
                  style={{
                    borderRadius: '16px',
                    border: '2px solid var(--color-primary)',
                    padding: '14px',
                    width: '100%',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: '600' }}>View Recipe</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    )
  }
}
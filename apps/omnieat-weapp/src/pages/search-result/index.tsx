import { Component } from 'react'
import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
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

export default class SearchResult extends Component<{}, { query: string; results: any[]; loading: boolean }> {
  state = { query: '', results: [] as any[], loading: true }

  async componentDidMount() {
    const query = Taro.getStorageSync('search_query') || ''
    this.setState({ query })
    if (query) {
      await this.search(query)
    } else {
      this.setState({ loading: false })
    }
  }

  search = async (q: string) => {
    this.setState({ loading: true })
    try {
      const results = await request({ url: `/api/recipes?search=${encodeURIComponent(q)}` })
      this.setState({ results: results || [], loading: false })
    } catch (err) {
      console.error('Search failed:', err)
      this.setState({ loading: false })
    }
  }

  handleSearch = (e: any) => {
    const query = e.detail.value
    this.setState({ query })
    if (query.trim()) {
      Taro.setStorageSync('search_query', query)
      this.search(query)
    }
  }

  handleRecipeClick = (id: string) => Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })

  render() {
    const { query, results, loading } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Search Results</Text>
          <View style={{ width: '24px' }} />
        </View>

        <View style={{ padding: '12px 16px' }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '0 12px', height: '44px', border: '1px solid #EEEEEE' }}>
            <Text style={{ fontSize: '16px', color: '#757575', marginRight: '8px' }}>Q</Text>
            <Input style={{ flex: 1, fontSize: '16px', color: '#212121' }} type='text' value={query} placeholder='Search recipes...' placeholderStyle={{ color: '#BDBDBD' }} onInput={this.handleSearch} />
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '0 16px 16px' }}>
            <Text style={{ fontSize: '14px', color: '#757575', marginBottom: '12px' }}>{results.length} results for "{query || 'all'}"</Text>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#999999', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {results.map((recipe: any) => (
                  <View key={recipe.id} style={{ width: 'calc(50% - 6px)', backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden' }} onClick={() => this.handleRecipeClick(recipe.id)}>
                    <View style={{ height: '120px', backgroundColor: '#EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View style={{ padding: '10px' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>{recipe.title}</Text>
                      <Text style={{ fontSize: '12px', color: '#757575', marginTop: '4px' }}>by {recipe.authorName}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

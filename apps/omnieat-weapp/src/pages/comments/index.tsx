import { Component } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
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

export default class Comments extends Component<{}, { comment: string; comments: any[]; recipeId: string; loading: boolean }> {
  state = { comment: '', comments: [] as any[], recipeId: '', loading: true }

  async componentDidMount() {
    const recipeId = (Taro.getCurrentInstance().router?.params?.id as string) || ''
    this.setState({ recipeId })
    if (recipeId) {
      await this.loadComments(recipeId)
    }
  }

  loadComments = async (recipeId: string) => {
    try {
      const comments = await request({ url: `/api/recipes/${recipeId}/comments` })
      this.setState({ comments: comments || [], loading: false })
    } catch (err) {
      console.error('Failed to load comments:', err)
      this.setState({ loading: false })
    }
  }

  handleSend = async () => {
    const { comment, recipeId } = this.state
    if (!comment.trim() || !recipeId) return
    const userInfo = Taro.getStorageSync('user_info')
    try {
      await request({
        url: `/api/recipes/${recipeId}/comments`,
        method: 'POST',
        data: { userId: userInfo?.id || 'guest', text: comment }
      })
      await this.loadComments(recipeId)
      this.setState({ comment: '' })
    } catch (err) {
      console.error('Failed to send comment:', err)
    }
  }

  render() {
    const { comment, comments, loading } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Comments</Text>
          <View style={{ width: '24px' }} />
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#999999', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : comments.length === 0 ? (
              <Text style={{ fontSize: '14px', color: '#757575', textAlign: 'center', padding: '20px' }}>No comments yet. Be the first!</Text>
            ) : (
              comments.map((c: any) => (
                <View key={c.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '12px', marginBottom: '8px' }}>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '6px' }}>
                    <View style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: '#FF4F21', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                      <Text style={{ color: '#FFFFFF', fontSize: '14px' }}>{(c.user?.name || 'U')[0]}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>{c.user?.name || 'User'}</Text>
                      <Text style={{ fontSize: '12px', color: '#999999' }}>{new Date(c.createdAt).toLocaleString()}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: '14px', color: '#424242' }}>{c.text}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View style={{ padding: '12px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EEEEEE', display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
          <Input style={{ flex: 1, backgroundColor: '#F7F7F7', borderRadius: '20px', padding: '8px 16px', fontSize: '14px' }} type='text' value={comment} placeholder='Add a comment...' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ comment: e.detail.value })} />
          <View style={{ backgroundColor: '#FF4F21', borderRadius: '20px', padding: '8px 16px' }} onClick={this.handleSend}>
            <Text style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>Send</Text>
          </View>
        </View>
      </View>
    )
  }
}

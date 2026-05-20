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

export default class LiveCooking extends Component<{}, { input: string; likes: number; messages: any[]; livestream: any; loading: boolean }> {
  state = { input: '', likes: 0, messages: [] as any[], livestream: null as any, loading: true }

  async componentDidMount() {
    try {
      const livestreams = await request({ url: '/api/livestreams?status=LIVE' })
      const live = (livestreams || [])[0]
      if (live) {
        this.setState({ livestream: live, likes: live.likeCount || 0 })
        const msgs = await request({ url: `/api/livestreams/${live.id}/chat` })
        this.setState({ messages: msgs || [], loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (err) {
      console.error('Failed to load livestream:', err)
      this.setState({ loading: false })
    }
  }

  handleBack = () => Taro.navigateBack()

  handleSend = async () => {
    const { input, livestream } = this.state
    if (!input.trim() || !livestream) return
    const userInfo = Taro.getStorageSync('user_info')
    try {
      await request({
        url: `/api/livestreams/${livestream.id}/chat`,
        method: 'POST',
        data: { userId: userInfo?.id || 'guest', text: input }
      })
      const msgs = await request({ url: `/api/livestreams/${livestream.id}/chat` })
      this.setState({ messages: msgs || [], input: '' })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  render() {
    const { input, likes, messages, livestream, loading } = this.state

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={this.handleBack}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>{livestream?.title || 'Live Cooking'}</Text>
          <View style={{ width: '24px' }} />
        </View>

        <View style={{ height: '200px', backgroundColor: '#212121', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#FF4F21', borderRadius: '4px', padding: '4px 8px', position: 'absolute', top: '12px', left: '12px' }}>
            <Text style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: '600' }}>LIVE</Text>
          </View>
          <Text style={{ fontSize: '48px', color: '#FFFFFF' }}>L</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121', marginBottom: '12px' }}>Live Chat</Text>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#999999' }}>Loading chat...</Text>
            ) : messages.length === 0 ? (
              <Text style={{ fontSize: '14px', color: '#757575' }}>No messages yet. Be the first!</Text>
            ) : (
              messages.map((msg: any) => (
                <View key={msg.id} style={{ marginBottom: '12px' }}>
                  <Text style={{ fontSize: '14px', fontWeight: '600', color: '#FF4F21' }}>{msg.user?.name || 'User'}</Text>
                  <Text style={{ fontSize: '14px', color: '#424242', marginTop: '2px' }}>{msg.text}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View style={{ padding: '12px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EEEEEE', display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
          <Input style={{ flex: 1, backgroundColor: '#F7F7F7', borderRadius: '20px', padding: '8px 16px', fontSize: '14px' }} type='text' value={input} placeholder='Say something...' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ input: e.detail.value })} />
          <View style={{ backgroundColor: '#FF4F21', borderRadius: '20px', padding: '8px 16px' }} onClick={() => this.setState(prev => ({ likes: prev.likes + 1 }))}>
            <Text style={{ color: '#FFFFFF', fontSize: '14px' }}>{likes} Likes</Text>
          </View>
        </View>
      </View>
    )
  }
}

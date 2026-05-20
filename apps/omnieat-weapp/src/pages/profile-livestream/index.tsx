import { Component } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
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

interface LivestreamState {
  upcomingLivestreams: any[]
  pastLivestreams: any[]
  loading: boolean
}

export default class ProfileLivestream extends Component<{}, LivestreamState> {
  state: LivestreamState = {
    upcomingLivestreams: [],
    pastLivestreams: [],
    loading: true
  }

  async componentDidMount() {
    await this.loadLivestreams()
  }

  loadLivestreams = async () => {
    try {
      Taro.showLoading({ title: 'Loading...' })
      const livestreams = await request({ url: '/api/livestreams' })
      const all = livestreams || []
      const upcoming = all.filter((l: any) => l.status === 'UPCOMING')
      const past = all.filter((l: any) => l.status === 'ENDED')
      this.setState({ upcomingLivestreams: upcoming, pastLivestreams: past, loading: false })
      Taro.hideLoading()
    } catch (error: any) {
      Taro.hideLoading()
      Taro.showToast({ title: 'Failed to load livestreams', icon: 'none' })
      this.setState({ loading: false })
    }
  }

  handleStartLivestream = () => {
    Taro.showModal({
      title: 'Start Livestream',
      content: 'Go live now?',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: 'Starting livestream...', icon: 'none' })
        }
      }
    })
  }

  handleWatchLivestream = (livestream: any) => {
    Taro.navigateTo({ url: `/pages/livestream-watch/index?id=${livestream.id}` })
  }

  handleScheduleLivestream = () => {
    Taro.navigateTo({ url: '/pages/livestream-schedule/index' })
  }

  render() {
    const { upcomingLivestreams, pastLivestreams, loading } = this.state

    if (loading) {
      return (
        <View style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
            <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={() => Taro.navigateBack()}>&larr;</Text>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Livestreams</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Text>Loading...</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
          <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={() => Taro.navigateBack()}>&larr;</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Livestreams</Text>
        </View>

        <ScrollView scrollY style={{ height: 'calc(100vh - 50px)' }}>
          <View style={{ margin: '16px', display: 'flex', gap: '12px' }}>
            <View onClick={this.handleStartLivestream} style={{ flex: 1, backgroundColor: '#FF6B6B', padding: '12px', borderRadius: '8px', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Go Live</Text>
            </View>
            <View onClick={this.handleScheduleLivestream} style={{ flex: 1, backgroundColor: '#fff', padding: '12px', borderRadius: '8px', alignItems: 'center', border: '1px solid #FF6B6B' }}>
              <Text style={{ color: '#FF6B6B', fontSize: '14px', fontWeight: 'bold' }}>Schedule</Text>
            </View>
          </View>

          {upcomingLivestreams.length > 0 && (
            <View style={{ margin: '16px' }}>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Upcoming</Text>
              {upcomingLivestreams.map((livestream: any) => (
                <View key={livestream.id} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                  <Image src={livestream.imageUrl || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=670&h=360&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '180px' }} />
                  <View style={{ padding: '12px' }}>
                    <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{livestream.title}</Text>
                    <Text style={{ fontSize: '12px', color: '#666' }}>{livestream.scheduledAt ? new Date(livestream.scheduledAt).toLocaleString() : 'TBD'}</Text>
                    <View style={{ marginTop: '8px', backgroundColor: '#FFF3E0', padding: '4px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>
                      <Text style={{ fontSize: '10px', color: '#F57C00', fontWeight: 'bold' }}>UPCOMING</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={{ margin: '16px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Past Livestreams</Text>
            {pastLivestreams.length > 0 ? (
              <View>
                {pastLivestreams.map((livestream: any) => (
                  <View
                    key={livestream.id}
                    onClick={() => this.handleWatchLivestream(livestream)}
                    style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}
                  >
                    <View style={{ position: 'relative' }}>
                      <Image src={livestream.imageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=670&h=360&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '180px' }} />
                      <View style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px' }}>
                        <Text style={{ color: '#fff', fontSize: '12px' }}>{livestream.duration || '45:00'}</Text>
                      </View>
                    </View>
                    <View style={{ padding: '12px' }}>
                      <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{livestream.title}</Text>
                      <View style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: '12px', color: '#999' }}>{new Date(livestream.createdAt).toLocaleDateString()}</Text>
                        <Text style={{ fontSize: '12px', color: '#999' }}>{livestream.viewerCount || 0} views</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ alignItems: 'center', padding: '40px' }}>
                <Text style={{ fontSize: '32px', marginBottom: '12px' }}>&#128187;</Text>
                <Text style={{ fontSize: '14px', color: '#999' }}>Your past livestreams will appear here</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
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

export default class Notifications extends Component<{}, { notifications: any[]; loading: boolean }> {
  state = { notifications: [] as any[], loading: true }

  async componentDidMount() {
    try {
      const notifications = await request({ url: '/api/notifications' })
      this.setState({ notifications: notifications || [], loading: false })
    } catch (err) {
      console.error('Failed to load notifications:', err)
      this.setState({ loading: false })
    }
  }

  handleMarkRead = async (id?: string) => {
    try {
      await request({ url: '/api/notifications', method: 'PUT', data: id ? { id } : {} })
      const notifications = await request({ url: '/api/notifications' })
      this.setState({ notifications: notifications || [] })
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  render() {
    const { notifications, loading } = this.state

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Notifications</Text>
          <Text style={{ fontSize: '12px', color: 'var(--color-primary)' }} onClick={() => this.handleMarkRead()}>Mark all read</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ backgroundColor: 'var(--color-surface)' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : notifications.length === 0 ? (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', padding: '20px' }}>No notifications yet</Text>
            ) : (
              notifications.map((notif: any, index: number) => (
                <View key={notif.id} style={{ padding: '16px', borderBottom: index < notifications.length - 1 ? '1px solid var(--color-outline)' : 'none', backgroundColor: notif.read ? '#FFFFFF' : '#FFF8F6' }} onClick={() => !notif.read && this.handleMarkRead(notif.id)}>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text)' }}>{notif.title}</Text>
                      <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>{notif.message}</Text>
                      <Text style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '8px' }}>{new Date(notif.createdAt).toLocaleString()}</Text>
                    </View>
                    {!notif.read && <View style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-primary-container)' }} />}
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

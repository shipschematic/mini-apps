import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
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

interface EditProfileState {
  name: string
  bio: string
  email: string
  loading: boolean
}

export default class EditProfile extends Component<{}, EditProfileState> {
  state: EditProfileState = { name: '', bio: '', email: '', loading: false }

  componentDidMount() {
    const userInfo = Taro.getStorageSync('user_info')
    if (userInfo) this.setState({ name: userInfo.name || '', bio: userInfo.bio || '', email: userInfo.email || '' })
  }

  handleSave = async () => {
    const { name, bio, email } = this.state
    const userInfo = Taro.getStorageSync('user_info')
    if (!userInfo?.id) {
      Taro.showToast({ title: 'Please login first', icon: 'none' })
      return
    }

    this.setState({ loading: true })
    try {
      const res = await request({
        url: '/api/users/profile',
        method: 'PUT',
        data: { userId: userInfo.id, name, email, bio }
      })

      if (res.user) {
        Taro.setStorageSync('user_info', { ...userInfo, name: res.user.name, email: res.user.email, bio: res.user.bio })
        Taro.showToast({ title: 'Profile updated!', icon: 'success' })
        setTimeout(() => Taro.navigateBack(), 1000)
      } else {
        Taro.showToast({ title: res.error || 'Update failed', icon: 'none' })
      }
    } catch (err: any) {
      console.error('Profile update error:', err)
      Taro.showToast({ title: err.message || 'Network error', icon: 'none' })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { name, bio, email } = this.state

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Edit Profile</Text>
          <Text style={{ fontSize: '14px', color: '#FF4F21', fontWeight: '600' }} onClick={this.handleSave}>Save</Text>
        </View>

        <View style={{ padding: '16px' }}>
          <View style={{ alignItems: 'center', marginBottom: '24px' }}>
            <View style={{ width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#FF4F21', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: '32px', color: '#FFFFFF' }}>{name[0] || 'U'}</Text>
            </View>
          </View>

          <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Name</Text>
          <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid #EEEEEE' }} type='text' value={name} placeholder='Your name' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ name: e.detail.value })} />

          <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Email</Text>
          <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid #EEEEEE' }} type='text' value={email} placeholder='Your email' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ email: e.detail.value })} />

          <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Bio</Text>
          <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid #EEEEEE' }} type='text' value={bio} placeholder='Tell us about yourself' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ bio: e.detail.value })} />
        </View>
      </View>
    )
  }
}

import { Component } from 'react'
import { View, Text, Input, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

console.log('=== [SIGN-IN] module loaded ===')

async function signInRequest({
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

  const res = await Taro.request({
    url: `${baseUrl}${url}`,
    method,
    data,
    header: finalHeaders,
  })

  if (res.statusCode >= 200 && res.statusCode < 300) {
    return res.data
  }
  throw new Error(res.data?.error || `Request failed with status ${res.statusCode}`)
}

interface SignInState {
  email: string
  password: string
  loading: boolean
}

export default class SignIn extends Component<{}, SignInState> {
  state: SignInState = {
    email: '',
    password: '',
    loading: false
  }

  componentDidMount() {
    console.log('=== [SIGN-IN] componentDidMount ===')
  }

  componentDidShow() {
    console.log('=== [SIGN-IN] componentDidShow ===')
  }

  handleEmailChange = (e: any) => {
    this.setState({ email: e.detail.value })
  }

  handlePasswordChange = (e: any) => {
    this.setState({ password: e.detail.value })
  }

  handleSignIn = async () => {
    console.log('=== [SIGN-IN] handleSignIn ===', this.state)
    const { email, password } = this.state
    if (!email || !password) {
      Taro.showToast({ title: 'Please enter email and password', icon: 'none' })
      return
    }
    this.setState({ loading: true })
    try {
      const res = await signInRequest({ url: '/api/auth/login', method: 'POST', data: { email, password } })
      if (res.token) {
        Taro.setStorageSync('user_token', res.token)
        Taro.setStorageSync('user_info', res.user)
        Taro.showToast({ title: 'Welcome back!', icon: 'success' })
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/home/index' })
        }, 500)
      } else {
        Taro.showToast({ title: res.error || 'Login failed', icon: 'none' })
      }
    } catch (err: any) {
      console.error('Sign in error:', err)
      Taro.showToast({ title: err.message || 'Network error', icon: 'none' })
    } finally {
      this.setState({ loading: false })
    }
  }

  handleSignUp = () => {
    Taro.redirectTo({ url: '/pages/sign-up/index' })
  }

  render() {
    console.log('=== [SIGN-IN] render start ===')
    const { email, password, loading } = this.state

    return (
      <View className='signin'>
        <View className='signin__header'>
          <View className='signin__logo-placeholder'>
            <Text className='signin__logo-text'>D</Text>
          </View>
          <Text className='signin__title'>Welcome Back</Text>
          <Text className='signin__subtitle'>Sign in to continue cooking</Text>
        </View>

        <View className='signin__form'>
          <View className='signin__input-group'>
            <Text className='signin__input-icon'>&#9993;</Text>
            <Input
              className='signin__input-field'
              type='text'
              value={email}
              onInput={this.handleEmailChange}
              placeholder='Email'
              placeholderClass='signin__placeholder'
            />
          </View>

          <View className='signin__input-group'>
            <Text className='signin__input-icon'>&#128274;</Text>
            <Input
              className='signin__input-field'
              password
              type='text'
              value={password}
              onInput={this.handlePasswordChange}
              placeholder='Password'
              placeholderClass='signin__placeholder'
            />
          </View>

          <View className='signin__forgot'>
            <Text className='signin__forgot-text'>Forgot Password?</Text>
          </View>

          <View className='signin__btn signin__btn--primary' onClick={this.handleSignIn} style={{ opacity: loading ? 0.6 : 1 }}>
            <Text className='signin__btn-text'>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </View>
        </View>

        <View className='signin__divider'>
          <View className='signin__divider-line' />
          <Text className='signin__divider-text'>or continue with</Text>
          <View className='signin__divider-line' />
        </View>

        <View className='signin__social'>
          <View className='signin__social-btn'>
            <Text className='signin__social-icon'>G</Text>
            <Text className='signin__social-text'>Google</Text>
          </View>
          <View className='signin__social-btn'>
            <Text className='signin__social-icon'>&#128172;</Text>
            <Text className='signin__social-text'>WeChat</Text>
          </View>
        </View>

        <View className='signin__footer'>
          <Text className='signin__footer-text'>Don't have an account? </Text>
          <Text className='signin__footer-link' onClick={this.handleSignUp}>Sign Up</Text>
        </View>
      </View>
    )
  }
}

import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

console.log('=== [SIGN-UP] module loaded ===')

async function signUpRequest({
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

interface SignUpState {
  name: string
  email: string
  password: string
  loading: boolean
}

export default class SignUp extends Component<{}, SignUpState> {
  state: SignUpState = {
    name: '',
    email: '',
    password: '',
    loading: false
  }

  componentDidMount() {
    console.log('=== [SIGN-UP] componentDidMount ===')
  }

  handleNameChange = (e: any) => {
    this.setState({ name: e.detail.value })
  }

  handleEmailChange = (e: any) => {
    this.setState({ email: e.detail.value })
  }

  handlePasswordChange = (e: any) => {
    this.setState({ password: e.detail.value })
  }

  handleSignUp = async () => {
    const { name, email, password } = this.state
    if (!name || !email || !password) {
      Taro.showToast({ title: 'Please fill in all fields', icon: 'none' })
      return
    }
    if (password.length < 6) {
      Taro.showToast({ title: 'Password must be at least 6 characters', icon: 'none' })
      return
    }
    this.setState({ loading: true })
    try {
      const res = await signUpRequest({ url: '/api/auth/register', method: 'POST', data: { name, email, password } })
      if (res.token) {
        Taro.setStorageSync('user_token', res.token)
        Taro.setStorageSync('user_info', res.user)
        Taro.showToast({ title: 'Account created!', icon: 'success' })
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/home/index' })
        }, 500)
      } else {
        Taro.showToast({ title: res.error || 'Sign up failed', icon: 'none' })
      }
    } catch (err: any) {
      console.error('Sign up error:', err)
      Taro.showToast({ title: err.message || 'Network error', icon: 'none' })
    } finally {
      this.setState({ loading: false })
    }
  }

  handleSignIn = () => {
    Taro.redirectTo({ url: '/pages/sign-in/index' })
  }

  render() {
    console.log('=== [SIGN-UP] render start ===')
    const { name, email, password, loading } = this.state

    return (
      <View className='signup'>
        <View className='signup__header'>
          <Text className='signup__title'>Create Account</Text>
          <Text className='signup__subtitle'>Join our cooking community</Text>
        </View>

        <View className='signup__form'>
          <View className='signup__input-group'>
            <Text className='signup__label'>Full Name</Text>
            <Input
              className='signup__input'
              type='text'
              value={name}
              onInput={this.handleNameChange}
              placeholder='Enter your name'
              placeholderClass='signup__placeholder'
            />
          </View>

          <View className='signup__input-group'>
            <Text className='signup__label'>Email</Text>
            <Input
              className='signup__input'
              type='text'
              value={email}
              onInput={this.handleEmailChange}
              placeholder='Enter your email'
              placeholderClass='signup__placeholder'
            />
          </View>

          <View className='signup__input-group'>
            <Text className='signup__label'>Password</Text>
            <Input
              className='signup__input'
              password
              type='text'
              value={password}
              onInput={this.handlePasswordChange}
              placeholder='Create a password'
              placeholderClass='signup__placeholder'
            />
          </View>

          <View className='signup__btn signup__btn--primary' onClick={this.handleSignUp} style={{ opacity: loading ? 0.6 : 1 }}>
            <Text className='signup__btn-text'>{loading ? 'Creating account...' : 'Sign Up'}</Text>
          </View>
        </View>

        <View className='signup__footer'>
          <Text className='signup__footer-text'>Already have an account? </Text>
          <Text className='signup__footer-link' onClick={this.handleSignIn}>Sign In</Text>
        </View>
      </View>
    )
  }
}

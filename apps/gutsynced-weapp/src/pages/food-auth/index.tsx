import { Component } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { authStore } from '../../utils/authStore'
import { foodStore } from '../../utils/foodStore'
import { translate } from '../../config/i18n'
import './index.scss'

interface AuthState {
  email: string
  password: string
  isSignIn: boolean
  loading: boolean
  error: string
}

export default class FoodAuth extends Component<{}, AuthState> {
  state: AuthState = {
    email: '',
    password: '',
    isSignIn: true,
    loading: false,
    error: ''
  }

  submit = async () => {
    const { email, password, isSignIn } = this.state
    if (!email || !password || this.state.loading) return
    this.setState({ loading: true, error: '' })
    try {
      if (isSignIn) {
        await authStore.signIn(email, password)
      } else {
        await authStore.signUp(email, password)
      }
      Taro.showToast({ title: 'Signed in', icon: 'success' })
      Taro.switchTab({ url: '/pages/settings/index' })
    } catch (error: any) {
      this.setState({
        error: error?.message || error?.errMsg || 'Sign in failed'
      })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const lang = foodStore.currentLanguage
    const t = (key: string) => translate(lang, key)
    const { email, password, isSignIn, loading, error } = this.state

    return (
      <View className='food-auth'>
        <ScrollView className='food-auth-scroll' scrollY>
          <View className='food-auth-header'>
            <View className='food-auth-logo'>
              <Text className='food-auth-logo-text'>GS</Text>
            </View>
            <Text className='food-auth-title'>GutSynced</Text>
            <Text className='food-auth-subtitle'>{t('auth_subtitle')}</Text>
          </View>

          {error ? (
            <View className='food-auth-error'>
              <Text className='food-auth-error-text'>{error}</Text>
            </View>
          ) : null}

          <Text className='food-auth-label'>{t('email')}</Text>
          <Input
            className='food-auth-input'
            value={email}
            placeholder='you@example.com'
            placeholderClass='food-auth-placeholder'
            onInput={(event) => this.setState({ email: event.detail.value })}
          />

          <Text className='food-auth-label'>{t('password')}</Text>
          <Input
            className='food-auth-input'
            value={password}
            password
            placeholder='••••••••'
            placeholderClass='food-auth-placeholder'
            onInput={(event) => this.setState({ password: event.detail.value })}
          />

          <View
            className={`food-auth-submit ${loading ? 'food-auth-submit--disabled' : ''}`}
            onClick={this.submit}
          >
            <Text className='food-auth-submit-text'>
              {loading ? '...' : isSignIn ? t('sign_in') : t('create_account')}
            </Text>
          </View>

          <View
            className='food-auth-switch'
            onClick={() => this.setState({ isSignIn: !isSignIn, error: '' })}
          >
            <Text className='food-auth-switch-text'>
              {isSignIn ? t('auth_switch_signup') : t('auth_switch_signin')}
            </Text>
          </View>

          {!isSignIn ? (
            <Text className='food-auth-hint'>{t('auth_signup_hint')}</Text>
          ) : null}
        </ScrollView>
      </View>
    )
  }
}

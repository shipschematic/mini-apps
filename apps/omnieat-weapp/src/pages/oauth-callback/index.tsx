import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface OAuthCallbackState {
  loading: boolean
  message: string
}

export default class OAuthCallback extends Component<{}, OAuthCallbackState> {
  state: OAuthCallbackState = {
    loading: true,
    message: 'Completing authentication...'
  }

  componentDidMount = async () => {
    // Check URL for OAuth callback parameters
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = (currentPage as any).$taroParams
    
    if (options && options.token) {
      // OAuth successful, save token
      Taro.setStorageSync('user_token', options.token)
      Taro.showToast({ title: 'Authentication successful!', icon: 'success' })
      
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/home/index' })
      }, 1500)
    } else if (options && options.error) {
      // OAuth failed
      this.setState({
        loading: false,
        message: `Authentication failed: ${options.error}`
      })
      
      setTimeout(() => {
        Taro.navigateBack()
      }, 2000)
    } else {
      // No callback params, check if we're waiting for webview
      this.setState({
        loading: false,
        message: 'Waiting for authentication...'
      })
    }
  }

  render() {
    const { loading, message } = this.state

    return (
      <View className='oauth-callback'>
        <View className='oauth-callback__content'>
          {loading ? (
            <View className='oauth-callback__spinner' />
          ) : (
            <Text className='oauth-callback__icon'>✗</Text>
          )}
          <Text className='oauth-callback__message'>{message}</Text>
        </View>
      </View>
    )
  }
}

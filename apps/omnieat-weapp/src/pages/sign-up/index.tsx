import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

console.log('=== [SIGN-UP] module loaded ===')

export default class SignUp extends Component<{}, {}> {
  componentDidMount() {
    console.log('=== [SIGN-UP] componentDidMount ===')
  }

  handleSignIn = () => {
    Taro.redirectTo({ url: '/pages/sign-in/index' })
  }

  handleGoHome = () => {
    Taro.switchTab({ url: '/pages/home/index' })
  }

  render() {
    console.log('=== [SIGN-UP] render start ===')
    return (
      <View className='signup'>
        <View className='signup__header'>
          <Text className='signup__title'>Create Account</Text>
          <Text className='signup__subtitle'>Join our cooking community</Text>
        </View>

        <View className='signup__form'>
          <View className='signup__input-group'>
            <Text className='signup__label'>Full Name</Text>
            <View className='signup__input'>
              <Text className='signup__placeholder'>Enter your name</Text>
            </View>
          </View>

          <View className='signup__input-group'>
            <Text className='signup__label'>Email</Text>
            <View className='signup__input'>
              <Text className='signup__placeholder'>Enter your email</Text>
            </View>
          </View>

          <View className='signup__input-group'>
            <Text className='signup__label'>Password</Text>
            <View className='signup__input'>
              <Text className='signup__placeholder'>Create a password</Text>
            </View>
          </View>

          <View className='signup__btn signup__btn--primary' onClick={this.handleGoHome}>
            <Text className='signup__btn-text'>Sign Up</Text>
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

import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class ForgotPassword extends Component<{}, { email: string }> {
  state = { email: '' }

  handleSubmit = () => {
    if (!this.state.email) {
      Taro.showToast({ title: 'Please enter your email', icon: 'none' })
      return
    }
    Taro.showToast({ title: 'Code sent!', icon: 'success' })
    setTimeout(() => Taro.navigateTo({ url: '/pages/account-verification/index' }), 1500)
  }

  render() {
    const { email } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Forgot Password</Text>
          <View style={{ width: '24px' }} />
        </View>

        <View style={{ padding: '24px' }}>
          <Text style={{ fontSize: '22px', fontWeight: '600', color: '#212121', marginBottom: '8px' }}>Reset Password</Text>
          <Text style={{ fontSize: '14px', color: '#757575', marginBottom: '24px' }}>Enter your email and we will send you a reset code.</Text>

          <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Email Address</Text>
          <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '24px', border: '1px solid #EEEEEE' }} type='text' value={email} placeholder='example@gmail.com' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ email: e.detail.value })} />

          <View style={{ backgroundColor: '#FF4F21', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={this.handleSubmit}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Send Reset Code</Text>
          </View>
        </View>
      </View>
    )
  }
}

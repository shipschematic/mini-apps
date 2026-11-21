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
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Forgot Password</Text>
          <View style={{ width: '24px' }} />
        </View>

        <View style={{ padding: '24px' }}>
          <Text style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Reset Password</Text>
          <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '24px' }}>Enter your email and we will send you a reset code.</Text>

          <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '4px' }}>Email Address</Text>
          <Input style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '24px', border: '1px solid var(--color-outline)' }} type='text' value={email} placeholder='example@gmail.com' placeholderStyle={{ color: 'var(--color-muted)' }} onInput={(e: any) => this.setState({ email: e.detail.value })} />

          <View style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={this.handleSubmit}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Send Reset Code</Text>
          </View>
        </View>
      </View>
    )
  }
}

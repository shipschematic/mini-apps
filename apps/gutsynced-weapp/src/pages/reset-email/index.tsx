import { Component } from 'react'
import { View, Text, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface ResetEmailState {
  newEmail: string
  confirmEmail: string
}

export default class ResetEmail extends Component<{}, ResetEmailState> {
  state: ResetEmailState = {
    newEmail: '',
    confirmEmail: ''
  }

  handleInputChange = (field: keyof ResetEmailState, value: string) => {
    this.setState({ [field]: value } as any)
  }

  handleSubmit = async () => {
    const { newEmail, confirmEmail } = this.state

    if (!newEmail || !confirmEmail) {
      Taro.showToast({ title: 'Please fill all fields', icon: 'none' })
      return
    }

    if (newEmail !== confirmEmail) {
      Taro.showToast({ title: 'Emails do not match', icon: 'none' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      Taro.showToast({ title: 'Please enter a valid email', icon: 'none' })
      return
    }

    Taro.showLoading({ title: 'Updating email...' })
    await new Promise(resolve => setTimeout(resolve, 1000))
    Taro.hideLoading()

    Taro.showToast({ title: 'Email updated!', icon: 'success' })

    const userInfo = Taro.getStorageSync('user_info')
    if (userInfo) {
      userInfo.email = newEmail
      userInfo.emailVerified = false
      Taro.setStorageSync('user_info', userInfo)
    }

    setTimeout(() => {
      Taro.redirectTo({
        url: `/pages/account-verification/index?email=${encodeURIComponent(newEmail)}`
      })
    }, 1500)
  }

  render() {
    const { newEmail, confirmEmail } = this.state

    return (
      <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--color-outline)' }}>
          <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={() => Taro.navigateBack()}>&larr;</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Reset Email</Text>
        </View>

        <View style={{ padding: '24px 16px', alignItems: 'center' }}>
          <Image
            src='https://images.unsplash.com/photo-1557683316-973673baf926?w=100&h=100&fit=crop'
            mode='aspectFit'
            style={{ width: '80px', height: '80px', borderRadius: '40px', marginBottom: '24px' }}
          />

          <Text style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Reset Your Email</Text>
          <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '32px', textAlign: 'center' }}>
            Enter your new email address. We'll send a verification code to confirm.
          </Text>

          <View style={{ width: '100%', marginBottom: '24px' }}>
            <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>New Email</Text>
            <Input
              type='text'
              value={newEmail}
              onInput={(e: any) => this.handleInputChange('newEmail', e.detail.value)}
              placeholder='Enter new email'
              style={{ padding: '12px', border: '1px solid var(--color-outline)', borderRadius: '8px', fontSize: '14px' }}
            />
          </View>

          <View style={{ width: '100%', marginBottom: '32px' }}>
            <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Confirm Email</Text>
            <Input
              type='text'
              value={confirmEmail}
              onInput={(e: any) => this.handleInputChange('confirmEmail', e.detail.value)}
              placeholder='Confirm new email'
              style={{ padding: '12px', border: '1px solid var(--color-outline)', borderRadius: '8px', fontSize: '14px' }}
            />
          </View>

          <View onClick={this.handleSubmit} style={{ width: '100%', backgroundColor: 'var(--color-primary-container)', padding: '16px', borderRadius: '12px', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>Send Verification Code</Text>
          </View>
        </View>
      </View>
    )
  }
}

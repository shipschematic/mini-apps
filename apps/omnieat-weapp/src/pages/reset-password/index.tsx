import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class ResetPassword extends Component<{}, { pass: string; confirmPass: string }> {
  state = { pass: '', confirmPass: '' }

  handleSubmit = () => {
    const { pass, confirmPass } = this.state
    if (!pass || !confirmPass) {
      Taro.showToast({ title: 'Please fill both fields', icon: 'none' })
      return
    }
    if (pass !== confirmPass) {
      Taro.showToast({ title: 'Passwords do not match', icon: 'none' })
      return
    }
    Taro.showToast({ title: 'Password reset!', icon: 'success' })
    setTimeout(() => Taro.reLaunch({ url: '/pages/sign-in/index' }), 1500)
  }

  render() {
    const { pass, confirmPass } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Reset Password</Text>
          <View style={{ width: '24px' }} />
        </View>

        <View style={{ padding: '24px' }}>
          <Text style={{ fontSize: '22px', fontWeight: '600', color: '#212121', marginBottom: '8px' }}>Create New Password</Text>
          <Text style={{ fontSize: '14px', color: '#757575', marginBottom: '24px' }}>Your new password must be different from previous passwords.</Text>

          <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>New Password</Text>
          <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid #EEEEEE' }} type='password' value={pass} placeholder='••••••••' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ pass: e.detail.value })} />

          <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Confirm Password</Text>
          <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '24px', border: '1px solid #EEEEEE' }} type='password' value={confirmPass} placeholder='••••••••' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ confirmPass: e.detail.value })} />

          <View style={{ backgroundColor: '#FF4F21', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={this.handleSubmit}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Reset Password</Text>
          </View>
        </View>
      </View>
    )
  }
}

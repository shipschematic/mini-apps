import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface VerificationDisabledState {
  code: string[]
  email: string
}

export default class AccountVerificationDisabled extends Component<{}, VerificationDisabledState> {
  state: VerificationDisabledState = {
    code: ['', '', '', ''],
    email: ''
  }

  componentDidMount() {
    const email = Taro.getStorageSync('user_info')?.email || ''
    const params = Taro.getCurrentInstance().router?.params
    if (params?.email) {
      this.setState({ email: params.email })
    } else if (email) {
      this.setState({ email })
    }
  }

  handleInput = (index: number, val: string) => {
    const code = [...this.state.code]
    code[index] = val.slice(-1)
    this.setState({ code })
  }

  handleSubmit = async () => {
    const fullCode = this.state.code.join('')
    if (fullCode.length < 4) {
      Taro.showToast({ title: 'Please enter 4-digit code', icon: 'none' })
      return
    }

    Taro.showLoading({ title: 'Verifying...' })
    await new Promise(resolve => setTimeout(resolve, 1000))

    Taro.hideLoading()
    Taro.showToast({ title: 'Email verified!', icon: 'success' })
    const userInfo = Taro.getStorageSync('user_info')
    if (userInfo) {
      userInfo.emailVerified = true
      Taro.setStorageSync('user_info', userInfo)
    }
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/home/index' })
    }, 1500)
  }

  render() {
    const { code } = this.state

    return (
      <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--color-outline)' }}>
          <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={() => Taro.navigateBack()}>&larr;</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Verification</Text>
        </View>

        <View style={{ padding: '24px 16px' }}>
          <Text style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Enter Verification Code</Text>
          <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '32px' }}>
            We have sent a 4-digit OTP security code to your registered email address.
          </Text>

          <View style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            {code.map((num, i) => (
              <Input
                key={i}
                type='number'
                maxlength={1}
                value={num}
                onInput={(e) => this.handleInput(i, e.detail.value)}
                style={{
                  width: '56px',
                  height: '56px',
                  border: '2px solid var(--color-outline)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            ))}
          </View>

          <View style={{ alignItems: 'center', marginBottom: '32px' }}>
            <Text style={{ fontSize: '14px', color: '#EF4444' }}>Code expired. Contact support.</Text>
          </View>

          <View
            onClick={this.handleSubmit}
            style={{
              backgroundColor: 'var(--color-primary-container)',
              padding: '16px',
              borderRadius: '12px',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>Verify Code</Text>
          </View>
        </View>
      </View>
    )
  }
}

import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface VerificationState {
  code: string[]
  timer: number
  email: string
  canResend: boolean
}

export default class AccountVerification extends Component<{}, VerificationState> {
  state: VerificationState = {
    code: ['', '', '', ''],
    timer: 59,
    email: '',
    canResend: false
  }

  intervalId: any = null

  componentDidMount() {
    const email = Taro.getStorageSync('user_info')?.email || ''
    const params = Taro.getCurrentInstance().router?.params
    if (params?.email) {
      this.setState({ email: params.email })
    } else if (email) {
      this.setState({ email })
    }
    this.startTimer()
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId)
  }

  startTimer = () => {
    this.setState({ timer: 59, canResend: false })
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState({ timer: this.state.timer - 1 })
      } else {
        clearInterval(this.intervalId)
        this.setState({ canResend: true })
      }
    }, 1000)
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

  handleResend = async () => {
    if (!this.state.canResend) return
    Taro.showLoading({ title: 'Sending code...' })
    await new Promise(resolve => setTimeout(resolve, 1000))
    Taro.hideLoading()
    Taro.showToast({ title: 'Code resent!', icon: 'success' })
    this.startTimer()
    this.setState({ code: ['', '', '', ''] })
  }

  render() {
    const { code, timer, canResend } = this.state

    return (
      <View style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #eee' }}>
          <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={() => Taro.navigateBack()}>&larr;</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Verification</Text>
        </View>

        <View style={{ padding: '24px 16px' }}>
          <Text style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Enter Verification Code</Text>
          <Text style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>
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
                  border: '2px solid #eee',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            ))}
          </View>

          <View style={{ alignItems: 'center', marginBottom: '32px' }}>
            {timer > 0 ? (
              <Text style={{ fontSize: '14px', color: '#666' }}>Resend code in 0:{timer < 10 ? `0${timer}` : timer}</Text>
            ) : (
              <Text
                style={{ fontSize: '14px', color: canResend ? '#FF6B6B' : '#999' }}
                onClick={this.handleResend}
              >
                Resend Code
              </Text>
            )}
          </View>

          <View
            onClick={this.handleSubmit}
            style={{
              backgroundColor: '#FF6B6B',
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

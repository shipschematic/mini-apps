import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Subscribe extends Component<{}, { selectedPlan: 'monthly' | 'yearly' }> {
  state: { selectedPlan: 'monthly' | 'yearly' } = { selectedPlan: 'yearly' }

  handleSubscribe = () => {
    Taro.showToast({ title: 'Subscribed!', icon: 'success' })
    Taro.setStorageSync('is_premium', true)
    setTimeout(() => Taro.switchTab({ url: '/pages/profile/index' }), 1500)
  }

  render() {
    const { selectedPlan } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>GutSynced Premium</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ padding: '24px' }}>
          <View style={{ alignItems: 'center', marginBottom: '24px' }}>
            <Text style={{ fontSize: '48px', marginBottom: '8px' }}>C</Text>
            <Text style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text)' }}>Unlock All Access</Text>
            <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', marginTop: '8px' }}>Gain access to premium chef livestreams, exclusive video courses, and ad-free experience.</Text>
          </View>

          <View style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: selectedPlan === 'monthly' ? '2px solid var(--color-primary)' : '2px solid transparent' }} onClick={() => this.setState({ selectedPlan: 'monthly' })}>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Monthly</Text>
            <Text style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)', marginTop: '4px' }}>$9.99/mo</Text>
            <Text style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>Billed every month</Text>
          </View>

          <View style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: selectedPlan === 'yearly' ? '2px solid var(--color-primary)' : '2px solid transparent' }} onClick={() => this.setState({ selectedPlan: 'yearly' })}>
            <View style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: '4px', padding: '2px 8px', alignSelf: 'flex-start', marginBottom: '8px' }}>
              <Text style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: '600' }}>SAVE 50%</Text>
            </View>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Yearly</Text>
            <Text style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)', marginTop: '4px' }}>$59.99/yr</Text>
            <Text style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>Equivalent to $4.99/mo</Text>
          </View>

          <View style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={this.handleSubscribe}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Subscribe Now</Text>
          </View>
        </View>
      </View>
    )
  }
}

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
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Dapoer Premium</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ padding: '24px' }}>
          <View style={{ alignItems: 'center', marginBottom: '24px' }}>
            <Text style={{ fontSize: '48px', marginBottom: '8px' }}>C</Text>
            <Text style={{ fontSize: '22px', fontWeight: '600', color: '#212121' }}>Unlock All Access</Text>
            <Text style={{ fontSize: '14px', color: '#757575', textAlign: 'center', marginTop: '8px' }}>Gain access to premium chef livestreams, exclusive video courses, and ad-free experience.</Text>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: selectedPlan === 'monthly' ? '2px solid #FF4F21' : '2px solid transparent' }} onClick={() => this.setState({ selectedPlan: 'monthly' })}>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Monthly</Text>
            <Text style={{ fontSize: '20px', fontWeight: '600', color: '#FF4F21', marginTop: '4px' }}>$9.99/mo</Text>
            <Text style={{ fontSize: '13px', color: '#757575', marginTop: '4px' }}>Billed every month</Text>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: selectedPlan === 'yearly' ? '2px solid #FF4F21' : '2px solid transparent' }} onClick={() => this.setState({ selectedPlan: 'yearly' })}>
            <View style={{ backgroundColor: '#FF4F21', borderRadius: '4px', padding: '2px 8px', alignSelf: 'flex-start', marginBottom: '8px' }}>
              <Text style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: '600' }}>SAVE 50%</Text>
            </View>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Yearly</Text>
            <Text style={{ fontSize: '20px', fontWeight: '600', color: '#FF4F21', marginTop: '4px' }}>$59.99/yr</Text>
            <Text style={{ fontSize: '13px', color: '#757575', marginTop: '4px' }}>Equivalent to $4.99/mo</Text>
          </View>

          <View style={{ backgroundColor: '#FF4F21', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={this.handleSubscribe}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Subscribe Now</Text>
          </View>
        </View>
      </View>
    )
  }
}

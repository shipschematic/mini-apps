import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class PaymentMethod extends Component {
  handleAddCard = () => Taro.navigateTo({ url: '/pages/add-card/index' })

  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Payment Methods</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <Text style={{ fontSize: '48px', marginBottom: '16px' }}>C</Text>
          <Text style={{ fontSize: '16px', color: 'var(--color-muted)', marginBottom: '8px' }}>No saved payment methods</Text>
          <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', marginBottom: '24px' }}>Your card details are securely stored and never saved on our servers.</Text>
          <View style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: '12px', padding: '14px', alignItems: 'center', width: '100%' }} onClick={this.handleAddCard}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Add New Card</Text>
          </View>
        </View>
      </View>
    )
  }
}

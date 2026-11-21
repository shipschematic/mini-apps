import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class AddCard extends Component<{}, { number: string; holder: string; expiry: string; cvv: string }> {
  state = { number: '', holder: '', expiry: '', cvv: '' }

  handleSubmit = () => {
    const { number, holder, expiry, cvv } = this.state
    if (!number || !holder || !expiry || !cvv) {
      Taro.showToast({ title: 'Please fill all fields', icon: 'none' })
      return
    }
    Taro.showToast({ title: 'Card added!', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1500)
  }

  render() {
    const { number, holder, expiry, cvv } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Add New Card</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ padding: '16px' }}>
          <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '4px' }}>Card Number</Text>
          <Input style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid var(--color-outline)' }} type='number' value={number} placeholder='1234 5678 1234 5678' placeholderStyle={{ color: 'var(--color-muted)' }} onInput={(e: any) => this.setState({ number: e.detail.value })} />

          <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '4px' }}>Card Holder Name</Text>
          <Input style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid var(--color-outline)' }} type='text' value={holder} placeholder='Gourmet Cook' placeholderStyle={{ color: 'var(--color-muted)' }} onInput={(e: any) => this.setState({ holder: e.detail.value })} />

          <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '24px' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '4px' }}>Expiry Date</Text>
              <Input style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', border: '1px solid var(--color-outline)' }} type='text' value={expiry} placeholder='MM/YY' placeholderStyle={{ color: 'var(--color-muted)' }} onInput={(e: any) => this.setState({ expiry: e.detail.value })} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '4px' }}>CVV</Text>
              <Input style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', border: '1px solid var(--color-outline)' }} type='number' value={cvv} placeholder='123' placeholderStyle={{ color: 'var(--color-muted)' }} onInput={(e: any) => this.setState({ cvv: e.detail.value })} />
            </View>
          </View>

          <View style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={this.handleSubmit}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Add Card</Text>
          </View>
        </View>
      </View>
    )
  }
}

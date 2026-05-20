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
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Add New Card</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ padding: '16px' }}>
          <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Card Number</Text>
          <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid #EEEEEE' }} type='number' value={number} placeholder='1234 5678 1234 5678' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ number: e.detail.value })} />

          <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Card Holder Name</Text>
          <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid #EEEEEE' }} type='text' value={holder} placeholder='Gourmet Cook' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ holder: e.detail.value })} />

          <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '24px' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>Expiry Date</Text>
              <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', border: '1px solid #EEEEEE' }} type='text' value={expiry} placeholder='MM/YY' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ expiry: e.detail.value })} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', color: '#212121', marginBottom: '4px' }}>CVV</Text>
              <Input style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '12px', fontSize: '16px', border: '1px solid #EEEEEE' }} type='number' value={cvv} placeholder='123' placeholderStyle={{ color: '#BDBDBD' }} onInput={(e: any) => this.setState({ cvv: e.detail.value })} />
            </View>
          </View>

          <View style={{ backgroundColor: '#FF4F21', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={this.handleSubmit}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Add Card</Text>
          </View>
        </View>
      </View>
    )
  }
}

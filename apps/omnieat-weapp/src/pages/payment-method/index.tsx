import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class PaymentMethod extends Component {
  handleAddCard = () => Taro.navigateTo({ url: '/pages/add-card/index' })

  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Payment Methods</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <Text style={{ fontSize: '48px', marginBottom: '16px' }}>C</Text>
          <Text style={{ fontSize: '16px', color: '#757575', marginBottom: '8px' }}>No saved payment methods</Text>
          <Text style={{ fontSize: '14px', color: '#999999', textAlign: 'center', marginBottom: '24px' }}>Your card details are securely stored and never saved on our servers.</Text>
          <View style={{ backgroundColor: '#FF4F21', borderRadius: '12px', padding: '14px', alignItems: 'center', width: '100%' }} onClick={this.handleAddCard}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Add New Card</Text>
          </View>
        </View>
      </View>
    )
  }
}

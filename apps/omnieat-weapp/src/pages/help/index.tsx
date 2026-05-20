import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Help extends Component {
  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Help & Support</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ padding: '16px' }}>
          <Text style={{ fontSize: '20px', fontWeight: '600', color: '#212121', marginBottom: '8px' }}>Need Help?</Text>
          <Text style={{ fontSize: '14px', color: '#757575', marginBottom: '24px' }}>We are here to support you in your culinary journey.</Text>
          
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <Text style={{ fontSize: '15px', fontWeight: '600', color: '#212121' }}>Email Support</Text>
            <Text style={{ fontSize: '14px', color: '#757575', marginTop: '4px' }}>support@dapoerapp.com</Text>
          </View>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <Text style={{ fontSize: '15px', fontWeight: '600', color: '#212121' }}>Response Time</Text>
            <Text style={{ fontSize: '14px', color: '#757575', marginTop: '4px' }}>Typically within 24 hours</Text>
          </View>
          <View style={{ backgroundColor: '#FF4F21', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={() => Taro.showToast({ title: 'Ticket created!', icon: 'success' })}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Submit Support Ticket</Text>
          </View>
        </View>
      </View>
    )
  }
}

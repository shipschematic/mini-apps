import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class About extends Component {
  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>About Dapoer</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <View style={{ width: '80px', height: '80px', borderRadius: '20px', backgroundColor: '#FF4F21', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Text style={{ fontSize: '36px', color: '#FFFFFF', fontWeight: 'bold' }}>D</Text>
          </View>
          <Text style={{ fontSize: '22px', fontWeight: '600', color: '#212121', marginBottom: '4px' }}>Dapoer</Text>
          <Text style={{ fontSize: '14px', color: '#757575', marginBottom: '16px' }}>Version 1.0.0 (Build 2026)</Text>
          <Text style={{ fontSize: '14px', color: '#424242', textAlign: 'center', lineHeight: '20px', marginBottom: '16px' }}>
            Dapoer is a premium cookery hub connecting master chefs and home cooks worldwide.
          </Text>
          <Text style={{ fontSize: '12px', color: '#999999' }}>© 2026 Dapoer Inc. All rights reserved.</Text>
        </View>
      </View>
    )
  }
}

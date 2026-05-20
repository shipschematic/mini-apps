import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Account extends Component {
  render() {
    const userInfo = Taro.getStorageSync('user_info') || {}

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Account</Text>
          <View style={{ width: '24px' }} />
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ backgroundColor: '#FFFFFF', marginTop: '8px' }}>
            <View style={{ padding: '16px', borderBottom: '1px solid #EEEEEE' }}>
              <Text style={{ fontSize: '15px', color: '#212121' }}>Email</Text>
              <Text style={{ fontSize: '14px', color: '#757575', marginTop: '4px' }}>{userInfo.email || 'Not set'}</Text>
            </View>
            <View style={{ padding: '16px', borderBottom: '1px solid #EEEEEE', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => Taro.navigateTo({ url: '/pages/reset-password/index' })}>
              <Text style={{ fontSize: '15px', color: '#212121' }}>Change Password</Text>
              <Text style={{ fontSize: '18px', color: '#BDBDBD' }}>{'>'}</Text>
            </View>
            <View style={{ padding: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: '15px', color: '#D32F2F' }}>Delete Account</Text>
              <Text style={{ fontSize: '18px', color: '#BDBDBD' }}>{'>'}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

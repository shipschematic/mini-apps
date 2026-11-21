import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Account extends Component {
  render() {
    const userInfo = Taro.getStorageSync('user_info') || {}

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Account</Text>
          <View style={{ width: '24px' }} />
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ backgroundColor: 'var(--color-surface)', marginTop: '8px' }}>
            <View style={{ padding: '16px', borderBottom: '1px solid var(--color-outline)' }}>
              <Text style={{ fontSize: '15px', color: 'var(--color-text)' }}>Email</Text>
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>{userInfo.email || 'Not set'}</Text>
            </View>
            <View style={{ padding: '16px', borderBottom: '1px solid var(--color-outline)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => Taro.navigateTo({ url: '/pages/reset-password/index' })}>
              <Text style={{ fontSize: '15px', color: 'var(--color-text)' }}>Change Password</Text>
              <Text style={{ fontSize: '18px', color: 'var(--color-muted)' }}>{'>'}</Text>
            </View>
            <View style={{ padding: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: '15px', color: '#EF4444' }}>Delete Account</Text>
              <Text style={{ fontSize: '18px', color: 'var(--color-muted)' }}>{'>'}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

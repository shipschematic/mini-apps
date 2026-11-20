import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Terms extends Component {
  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Terms of Service</Text>
          <View style={{ width: '24px' }} />
        </View>
        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            <Text style={{ fontSize: '20px', fontWeight: '600', color: '#212121', marginBottom: '8px' }}>Terms of Service</Text>
            <Text style={{ fontSize: '14px', color: '#757575', marginBottom: '16px' }}>Last updated: May 2026</Text>
            <Text style={{ fontSize: '14px', color: '#424242', lineHeight: '20px', marginBottom: '12px' }}>
              Welcome to Dapoer. By using our recipe browsing, cooking live-streams, and collaborative menu-sharing tools, you agree to comply with our standards:
            </Text>
            <Text style={{ fontSize: '14px', color: '#424242', lineHeight: '20px', marginBottom: '12px' }}>
              1. Account Integrity: Keep your credentials secure. You are fully responsible for all recipe edits, photos, and ratings submitted under your username.
            </Text>
            <Text style={{ fontSize: '14px', color: '#424242', lineHeight: '20px', marginBottom: '12px' }}>
              2. Culinary Respect: Share positive kitchen tips and helpful cookery insights. Bullying or inappropriate text in comments is strictly prohibited.
            </Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

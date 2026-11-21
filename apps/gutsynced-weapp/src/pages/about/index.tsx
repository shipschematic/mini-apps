import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class About extends Component {
  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>About GutSynced</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <View style={{ width: '80px', height: '80px', borderRadius: '20px', backgroundColor: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Text style={{ fontSize: '36px', color: '#FFFFFF', fontWeight: 'bold' }}>D</Text>
          </View>
          <Text style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>GutSynced</Text>
          <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '16px' }}>Version 1.0.0 (Build 2026)</Text>
          <Text style={{ fontSize: '14px', color: 'var(--color-text)', textAlign: 'center', lineHeight: '20px', marginBottom: '16px' }}>
            GutSynced is a premium cookery hub connecting master chefs and home cooks worldwide.
          </Text>
          <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>© 2026 GutSynced Inc. All rights reserved.</Text>
        </View>
      </View>
    )
  }
}

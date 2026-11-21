import { Component } from 'react'
import { View, Text, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Privacy extends Component {
  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Privacy Settings</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ padding: '16px' }}>
          <View style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '15px', color: 'var(--color-text)' }}>Profile Visibility</Text>
              <Text style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>Allow other users to search and view your recipe posts.</Text>
            </View>
            <Switch checked color='#6750A4' />
          </View>
          <View style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '15px', color: 'var(--color-text)' }}>Data Analytics</Text>
              <Text style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>Share anonymous usage metrics to help improve user experience.</Text>
            </View>
            <Switch checked color='#6750A4' />
          </View>
        </View>
      </View>
    )
  }
}

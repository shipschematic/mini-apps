import { Component } from 'react'
import { View, Text, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Privacy extends Component {
  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Privacy Settings</Text>
          <View style={{ width: '24px' }} />
        </View>
        <View style={{ padding: '16px' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '15px', color: '#212121' }}>Profile Visibility</Text>
              <Text style={{ fontSize: '13px', color: '#757575', marginTop: '4px' }}>Allow other users to search and view your recipe posts.</Text>
            </View>
            <Switch checked color='#FF4F21' />
          </View>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '15px', color: '#212121' }}>Data Analytics</Text>
              <Text style={{ fontSize: '13px', color: '#757575', marginTop: '4px' }}>Share anonymous usage metrics to help improve user experience.</Text>
            </View>
            <Switch checked color='#FF4F21' />
          </View>
        </View>
      </View>
    )
  }
}

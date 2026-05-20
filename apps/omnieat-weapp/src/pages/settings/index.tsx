import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface SettingItem {
  id: string
  title: string
  subtitle?: string
}

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'account', title: 'Account', subtitle: 'Edit profile, change password' },
      { id: 'notifications', title: 'Notifications', subtitle: 'Manage notification preferences' },
      { id: 'privacy', title: 'Privacy', subtitle: 'Control your privacy settings' }
    ] as SettingItem[]
  },
  {
    title: 'App Settings',
    items: [
      { id: 'theme', title: 'Theme', subtitle: 'Dark mode, colors' },
      { id: 'language', title: 'Language', subtitle: 'English' },
      { id: 'location', title: 'Location', subtitle: 'Manage location settings' }
    ] as SettingItem[]
  },
  {
    title: 'Support',
    items: [
      { id: 'help', title: 'Help & Support', subtitle: 'Get help, contact us' },
      { id: 'terms', title: 'Terms & Policies', subtitle: 'Terms of service, privacy policy' },
      { id: 'about', title: 'About', subtitle: 'App version 1.0.0' }
    ] as SettingItem[]
  }
]

const ROUTES: Record<string, string> = {
  account: '/pages/account/index',
  notifications: '/pages/notifications/index',
  privacy: '/pages/privacy/index',
  theme: '/pages/theme/index',
  language: '/pages/language/index',
  location: '/pages/location/index',
  help: '/pages/help/index',
  terms: '/pages/terms/index',
  about: '/pages/about/index'
}

export default class Settings extends Component {
  handleItemClick = (item: SettingItem) => {
    const route = ROUTES[item.id]
    if (route) Taro.navigateTo({ url: route })
  }

  handleLogout = () => {
    Taro.showModal({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('user_token')
          Taro.removeStorageSync('user_info')
          Taro.reLaunch({ url: '/pages/sign-in/index' })
        }
      }
    })
  }

  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Settings</Text>
          <View style={{ width: '24px' }} />
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          {SECTIONS.map((section) => (
            <View key={section.title} style={{ marginBottom: '8px' }}>
              <Text style={{ fontSize: '14px', fontWeight: '600', color: '#757575', padding: '12px 16px 4px' }}>{section.title}</Text>
              <View style={{ backgroundColor: '#FFFFFF' }}>
                {section.items.map((item, index) => (
                  <View key={item.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '14px 16px', borderBottom: index < section.items.length - 1 ? '1px solid #EEEEEE' : 'none' }} onClick={() => this.handleItemClick(item)}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: '15px', color: '#212121' }}>{item.title}</Text>
                      {item.subtitle && <Text style={{ fontSize: '13px', color: '#757575', marginTop: '2px' }}>{item.subtitle}</Text>}
                    </View>
                    <Text style={{ fontSize: '18px', color: '#BDBDBD' }}>{'>'}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={{ padding: '16px' }}>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={this.handleLogout}>
              <Text style={{ color: '#D32F2F', fontWeight: '600', fontSize: '16px' }}>Logout</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

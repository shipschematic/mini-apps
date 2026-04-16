import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import './settings.scss'

export default function AdminSettings() {
  const dispatch = useDispatch()
  const storeConfig = useSelector((state: any) => state.storeConfig || {})
  const [formData, setFormData] = useState({
    appName: storeConfig.appName || 'My Store',
    primaryColor: storeConfig.primaryColor || '#2A4B7C',
    currency: storeConfig.currency || '¥'
  })

  const handleSave = () => {
    // Save to WeChat Cloud storage
    Taro.cloud.callFunction({
      name: 'saveStoreConfig',
      data: formData
    }).then(res => {
      if (res.result?.success) {
        Taro.showToast({ title: 'Saved!', icon: 'success' })
        dispatch({
          type: 'storeConfig/update',
          payload: formData
        })
      }
    }).catch(() => {
      Taro.showToast({ title: 'Failed', icon: 'none' })
    })
  }

  return (
    <View className="admin-settings">
      <View className="settings-section">
        <Text className="section-title">Store Information</Text>

        <View className="form-group">
          <Text className="label">Store Name</Text>
          <Input
            value={formData.appName}
            onInput={(e: any) => setFormData(prev => ({ ...prev, appName: e.detail.value }))}
            placeholder="Your store name"
          />
        </View>

        <View className="form-group">
          <Text className="label">Primary Color</Text>
          <View className="color-input">
            <Input
              value={formData.primaryColor}
              onInput={(e: any) => setFormData(prev => ({ ...prev, primaryColor: e.detail.value }))}
              placeholder="#2A4B7C"
            />
            <View
              className="color-preview"
              style={{ background: formData.primaryColor }}
            />
          </View>
        </View>

        <View className="form-group">
          <Text className="label">Currency Symbol</Text>
          <Input
            value={formData.currency}
            onInput={(e: any) => setFormData(prev => ({ ...prev, currency: e.detail.value }))}
            placeholder="¥"
          />
        </View>
      </View>

      <View className="settings-section">
        <Text className="section-title">Admin Access</Text>
        <Text className="hint">Add admin WeChat openids to src/pages/admin/index.tsx ADMIN_OPENIDS array</Text>
      </View>

      <View className="save-btn" onClick={handleSave}>
        Save Settings
      </View>
    </View>
  )
}

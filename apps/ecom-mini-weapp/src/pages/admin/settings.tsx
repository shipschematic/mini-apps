import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Button, Switch } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import './settings.scss'

export default function AdminSettings() {
  const dispatch = useDispatch()
  const storeConfig = useSelector((state: RootState) => state.storeConfig)
  const [formData, setFormData] = useState({
    appName: storeConfig.appName || 'My Store',
    primaryColor: storeConfig.primaryColor || '#2A4B7C',
    currency: storeConfig.currency || '¥',
    adminOpenids: '',
    paymentEnabled: storeConfig.payment?.enabled || false,
    paymentMchId: storeConfig.payment?.mchId || '',
    paymentBodyPrefix: storeConfig.payment?.bodyPrefix || ''
  })

  useEffect(() => {
    loadAdminList()
    loadPaymentConfig()
  }, [])

  const loadAdminList = async () => {
    try {
      if (typeof Taro.cloud !== 'undefined' && Taro.cloud.callFunction) {
        const res = await Taro.cloud.callFunction({
          name: 'getStoreConfig',
          data: {}
        })
        const adminList = res.result?.data?.adminOpenids || []
        setFormData(prev => ({ ...prev, adminOpenids: adminList.join('\n') }))
      }
    } catch (e) {
      // Silent fail
    }
  }

  const loadPaymentConfig = async () => {
    try {
      if (typeof Taro.cloud !== 'undefined' && Taro.cloud.callFunction) {
        const res = await Taro.cloud.callFunction({
          name: 'getStoreConfig',
          data: {}
        })
        const payment = res.result?.data?.payment
        if (payment) {
          setFormData(prev => ({
            ...prev,
            paymentEnabled: payment.enabled || false,
            paymentMchId: payment.mchId || '',
            paymentBodyPrefix: payment.bodyPrefix || ''
          }))
        }
      }
    } catch (e) {
      // Silent fail
    }
  }

  const handleSave = () => {
    const adminOpenids = formData.adminOpenids
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    const saveData = {
      appName: formData.appName,
      primaryColor: formData.primaryColor,
      currency: formData.currency,
      adminOpenids,
      payment: {
        enabled: formData.paymentEnabled,
        mchId: formData.paymentMchId,
        bodyPrefix: formData.paymentBodyPrefix
      }
    }

    // Update local state regardless
    dispatch({
      type: 'storeConfig/update',
      payload: saveData
    })

    if (typeof Taro.cloud !== 'undefined' && Taro.cloud.callFunction) {
      Taro.cloud.callFunction({
        name: 'saveStoreConfig',
        data: saveData
      }).then((res: any) => {
        if (res.result?.success) {
          Taro.showToast({ title: 'Saved!', icon: 'success' })
        }
      }).catch(() => {
        Taro.showToast({ title: 'Saved locally', icon: 'success' })
      })
    } else {
      Taro.showToast({ title: 'Saved locally', icon: 'success' })
    }
  }

  return (
    <View className="admin-settings">
      {/* Store Information */}
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

      {/* Payment Settings */}
      <View className="settings-section">
        <Text className="section-title">WeChat Pay</Text>
        <Text className="hint">Configure WeChat Cloud Pay for real payments. Setup merchant ID in cloud console first.</Text>

        <View className="form-group">
          <View className="switch-row">
            <Text className="label">Enable Real Payment</Text>
            <Switch
              checked={formData.paymentEnabled}
              onChange={(e: any) => setFormData(prev => ({ ...prev, paymentEnabled: e.detail.value }))}
              color="#2A4B7C"
            />
          </View>
          <Text className="hint">
            {formData.paymentEnabled 
              ? 'Real WeChat Pay is enabled. Users will pay with WeChat.'
              : 'Demo mode. Payments are simulated (no real charge).'}
          </Text>
        </View>

        <View className="form-group">
          <Text className="label">Merchant ID (mchId)</Text>
          <Input
            value={formData.paymentMchId}
            onInput={(e: any) => setFormData(prev => ({ ...prev, paymentMchId: e.detail.value }))}
            placeholder="e.g. 1234567890"
          />
          <Text className="hint">Find in WeChat Pay merchant platform (pay.weixin.qq.com)</Text>
        </View>

        <View className="form-group">
          <Text className="label">Payment Description Prefix</Text>
          <Input
            value={formData.paymentBodyPrefix}
            onInput={(e: any) => setFormData(prev => ({ ...prev, paymentBodyPrefix: e.detail.value }))}
            placeholder="e.g. MyStore - "
          />
          <Text className="hint">Shown before product name in WeChat Pay UI</Text>
        </View>

        <View className="payment-setup-guide">
          <Text className="guide-title">Setup Guide:</Text>
          <Text className="guide-step">1. Open cloud console: 云开发 -> 设置 -> 全局设置</Text>
          <Text className="guide-step">2. Add your merchant ID in WeChat Pay section</Text>
          <Text className="guide-step">3. Complete authorization in WeChat Pay merchant platform</Text>
          <Text className="guide-step">4. Enable "Real Payment" toggle above</Text>
        </View>
      </View>

      {/* Admin Access */}
      <View className="settings-section">
        <Text className="section-title">Admin Access</Text>
        <Text className="hint">Enter WeChat OpenIDs (one per line) to grant admin access</Text>
        <View className="form-group">
          <Text className="label">Admin OpenIDs</Text>
          <Input
            value={formData.adminOpenids}
            onInput={(e: any) => setFormData(prev => ({ ...prev, adminOpenids: e.detail.value }))}
            placeholder="One OpenID per line"
            style={{ minHeight: '120px' }}
          />
        </View>
      </View>

      <View className="save-btn" onClick={handleSave}>
        Save Settings
      </View>
    </View>
  )
}

import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface ShareModalProps {
  visible: boolean
  recipe: {
    id: string
    title: string
    imageUrl?: string
  }
  onClose: () => void
}

export default class ShareModal extends Component<ShareModalProps, {}> {
  handleShareToWeChat = async () => {
    try {
      Taro.showShareMenu({
        withShareTicket: true,
        showShareItems: ['wechatFriends', 'wechatMoment']
      })
      Taro.showToast({ title: 'Share opened', icon: 'success' })
      this.props.onClose()
    } catch (error) {
      Taro.showToast({ title: 'Failed to share', icon: 'none' })
    }
  }

  handleCopyLink = async () => {
    try {
      const { recipe } = this.props
      Taro.setClipboardData({
        data: `https://dapoer.app/recipe/${recipe.id}`,
        success: () => {
          Taro.showToast({ title: 'Link copied!', icon: 'success' })
        }
      })
      this.props.onClose()
    } catch (error) {
      Taro.showToast({ title: 'Failed to copy link', icon: 'none' })
    }
  }

  handleShareToFriends = () => {
    Taro.showToast({ title: 'Share to friends', icon: 'success' })
    this.props.onClose()
  }

  handleReport = () => {
    Taro.showModal({
      title: 'Report Recipe',
      content: 'Why do you want to report this recipe?',
      confirmText: 'Submit',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: 'Report submitted', icon: 'success' })
        }
      }
    })
    this.props.onClose()
  }

  render() {
    const { visible, recipe, onClose } = this.props

    if (!visible) return null

    const actions = [
      { label: 'WeChat', color: '#07C160', icon: 'W', handler: this.handleShareToWeChat },
      { label: 'Copy Link', color: '#1890FF', icon: 'L', handler: this.handleCopyLink },
      { label: 'Friends', color: '#FA541C', icon: 'F', handler: this.handleShareToFriends },
      { label: 'Report', color: '#F5222D', icon: '!', handler: this.handleReport }
    ]

    return (
      <View style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000
      }}>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)'
        }} onClick={onClose} />

        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderRadius: '24px 24px 0 0',
          padding: '24px'
        }}>
          <View style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Text style={{ fontSize: '18px', fontWeight: '600', color: '#333333' }}>Share Recipe</Text>
            <Text style={{ fontSize: '20px', color: '#999999' }} onClick={onClose}>X</Text>
          </View>

          <View style={{
            backgroundColor: '#F5F5F5',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <Text style={{ fontSize: '16px', color: '#333333' }}>{recipe.title}</Text>
          </View>

          <View style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            {actions.map((action) => (
              <View
                key={action.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={action.handler}
              >
                <View style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: action.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 'bold' }}>{action.icon}</Text>
                </View>
                <Text style={{ fontSize: '12px', color: '#999999', textAlign: 'center' }}>{action.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }
}

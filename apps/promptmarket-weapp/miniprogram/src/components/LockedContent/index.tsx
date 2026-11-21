import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

interface LockedContentProps {
  data: {
    id: string
    title: string
    preview?: string
    fullContent?: string
    price: number
    category?: string
    usageCount?: number
    rating?: number
    author?: string
    description?: string
    isPurchased?: boolean
  }
  config?: any
  onAction?: (actions: any[], context: any) => void
}

export default function LockedContent({ data, config, onAction }: LockedContentProps) {
  const [showPreview, setShowPreview] = useState(true)
  const isLocked = !data.isPurchased

  const handlePurchase = () => {
    if (onAction) {
      onAction([
        { type: 'purchase', payload: { ...data, productId: data.id } }
      ], { item: data })
    }
  }

  const handleUnlock = () => {
    if (onAction) {
      onAction([
        { type: 'showToast', payload: { title: 'Already purchased!', icon: 'success' } }
      ], { item: data })
    }
  }

  const renderContent = () => {
    const content = isLocked ? (data.preview || '') : (data.fullContent || '')
    
    if (!content) {
      return <Text className="no-content">No content available</Text>
    }

    return (
      <View className={`content-text ${isLocked ? 'blurred' : ''}`}>
        <Text>{content}</Text>
        {isLocked && (
          <View className="blur-overlay">
            <Text className="lock-icon">🔒</Text>
            <Text className="lock-text">Purchase to unlock full content</Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <View className="locked-content">
      {/* Header */}
      <View className="header">
        <View className="category-badge">
          <Text>{data.category || 'Prompt'}</Text>
        </View>
        <Text className="title">{data.title}</Text>
        {data.author && <Text className="author">by {data.author}</Text>}
      </View>

      {/* Stats */}
      <View className="stats">
        {data.rating && (
          <View className="stat">
            <Text className="stat-value">{'★'.repeat(Math.floor(data.rating))}</Text>
            <Text className="stat-label">{data.rating}</Text>
          </View>
        )}
        {data.usageCount && (
          <View className="stat">
            <Text className="stat-value">{data.usageCount}</Text>
            <Text className="stat-label">uses</Text>
          </View>
        )}
      </View>

      {/* Content Preview */}
      <View className="content-section">
        <View className="section-header">
          <Text className="section-title">
            {isLocked ? 'Preview' : 'Full Content'}
          </Text>
          {isLocked && (
            <View className="lock-badge">
              <Text>🔒 Locked</Text>
            </View>
          )}
        </View>
        
        {renderContent()}
      </View>

      {/* Description */}
      {data.description && (
        <View className="description-section">
          <Text className="section-title">About this prompt</Text>
          <Text className="description-text">{data.description}</Text>
        </View>
      )}

      {/* Purchase Bar */}
      <View className="purchase-bar">
        <View className="price-section">
          {isLocked ? (
            <>
              <Text className="price">¥{data.price.toFixed(2)}</Text>
              <Text className="price-label">One-time purchase</Text>
            </>
          ) : (
            <View className="unlocked-badge">
              <Text>✓ Unlocked</Text>
            </View>
          )}
        </View>
        
        <View 
          className={`action-btn ${isLocked ? 'purchase' : 'unlocked'}`}
          onClick={isLocked ? handlePurchase : handleUnlock}
        >
          <Text>{isLocked ? 'Purchase Now' : 'Copy to Clipboard'}</Text>
        </View>
      </View>
    </View>
  )
}

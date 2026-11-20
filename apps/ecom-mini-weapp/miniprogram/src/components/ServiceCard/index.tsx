import { View, Text } from '@tarojs/components'
import './index.scss'

interface ServiceCardProps {
  data: {
    id: string
    title: string
    price: number
    description?: string
    preview?: string
    usageCount?: number
    [key: string]: any
  }
  config: {
    pricePrefix?: string
    priceSuffix?: string
    showPreview?: boolean
    showUsageCount?: boolean
    [key: string]: any
  }
  onAction: (actions: any[], context: any) => void
}

/**
 * ServiceCard - Reusable service/prompt display component
 * Displays service title, description, preview, price, and usage stats
 */

export default function ServiceCard({ data, config, onAction }: ServiceCardProps) {
  const handleClick = () => {
    if (config.onClick) {
      onAction(config.onClick, { item: data })
    }
  }

  const handleUnlock = (e: any) => {
    e.stopPropagation()
    if (config.onUnlock) {
      onAction(config.onUnlock, { item: data })
    }
  }

  const pricePrefix = config.pricePrefix || '¥'
  const priceSuffix = config.priceSuffix || ''

  return (
    <View className="service-card" onClick={handleClick}>
      <View className="service-card__header">
        <Text className="service-card__title" numberOfLines={2}>
          {data.title}
        </Text>
        
        {config.showUsageCount && data.usageCount !== undefined && (
          <View className="service-card__usage">
            <Text className="service-card__usage-icon">📊</Text>
            <Text className="service-card__usage-count">{data.usageCount}</Text>
          </View>
        )}
      </View>
      
      {config.showPreview && data.preview && (
        <View className="service-card__preview">
          <Text className="service-card__preview-text" numberOfLines={3}>
            {data.preview}
          </Text>
        </View>
      )}
      
      {data.description && (
        <Text className="service-card__description" numberOfLines={2}>
          {data.description}
        </Text>
      )}
      
      <View className="service-card__footer">
        <View className="service-card__price">
          <Text className="service-card__price-symbol">{pricePrefix}</Text>
          <Text className="service-card__price-value">{data.price}</Text>
          {priceSuffix && (
            <Text className="service-card__price-suffix">{priceSuffix}</Text>
          )}
        </View>
        
        <View
          className="service-card__unlock-btn"
          onClick={handleUnlock}
        >
          <Text className="service-card__unlock-text">
            {data.unlocked ? 'View' : 'Unlock'}
          </Text>
        </View>
      </View>
    </View>
  )
}

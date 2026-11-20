import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'

interface RecipeCardProps {
  config?: any
  title?: string
  subtitle?: string
  estimatedTime?: string
  quantity?: string
  creator?: string
  category?: string
  imageUrl?: string
  hasCrown?: boolean
  onClick?: () => void
}

export default class RecipeCard extends Component<RecipeCardProps> {
  static defaultProps = {
    title: 'Beef Ramen',
    subtitle: '52K Views',
    estimatedTime: '35 Min',
    quantity: '1 Serve',
    creator: 'by Tania Adams',
    category: 'Soup'
  }

  render() {
    const { config, title, subtitle, estimatedTime, quantity, creator, category, imageUrl, hasCrown, onClick } = this.props

    const cardData = config || {
      title: title || 'Beef Ramen',
      subtitle: subtitle || '52K Views',
      estimatedTime: estimatedTime || '35 Min',
      quantity: quantity || '1 Serve',
      creator: creator || 'by Tania Adams',
      category: category || 'Soup',
      hasCrown: hasCrown || false
    }

    return (
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }} onClick={onClick}>
        <View style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
          {imageUrl ? (
            <Image src={imageUrl} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
          ) : (
            <View style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#EEEEEE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ fontSize: '48px', color: '#BDBDBD' }}>{cardData.title?.charAt(0) || 'R'}</Text>
            </View>
          )}
          {cardData.hasCrown && (
            <View style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(255,184,0,0.9)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ fontSize: '12px' }}>{'\u2605'}</Text>
            </View>
          )}
          <View style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            backgroundColor: '#FF4F21',
            borderRadius: '4px',
            padding: '2px 6px'
          }}>
            <Text style={{ fontSize: '10px', fontWeight: '600', color: '#FFFFFF' }}>{cardData.category}</Text>
          </View>
        </View>

        <View style={{ padding: '10px' }}>
          <Text style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#212121',
            marginBottom: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{cardData.title}</Text>
          <Text style={{
            display: 'block',
            fontSize: '12px',
            color: '#757575',
            marginBottom: '6px'
          }}>{cardData.creator}</Text>

          <View style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <View style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Text style={{ fontSize: '12px', color: '#757575' }}>{'\u23F1'}</Text>
              <Text style={{ fontSize: '11px', color: '#757575' }}>{cardData.estimatedTime}</Text>
            </View>
            <View style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Text style={{ fontSize: '12px', color: '#757575' }}>{'\u263A'}</Text>
              <Text style={{ fontSize: '11px', color: '#757575' }}>{cardData.quantity}</Text>
            </View>
            <View style={{ marginLeft: 'auto' }}>
              <Text style={{ fontSize: '11px', color: '#757575' }}>{cardData.subtitle}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

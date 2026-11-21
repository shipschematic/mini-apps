import { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class AddReviews extends Component<{}, { rating: number; text: string }> {
  state = { rating: 5, text: '' }

  handleSubmit = () => {
    if (!this.state.text.trim()) {
      Taro.showToast({ title: 'Please write a review', icon: 'none' })
      return
    }
    Taro.showToast({ title: 'Review submitted!', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1500)
  }

  render() {
    const { rating, text } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Write Review</Text>
          <View style={{ width: '24px' }} />
        </View>

        <View style={{ padding: '16px' }}>
          <Text style={{ fontSize: '16px', color: 'var(--color-text)', marginBottom: '16px' }}>How was your cooking experience?</Text>
          
          <View style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={{ fontSize: '32px', color: star <= rating ? '#FBBF24' : '#D1D1D6' }} onClick={() => this.setState({ rating: star })}>*</Text>
            ))}
          </View>

          <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '4px' }}>Your Review</Text>
          <Input style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '12px', fontSize: '16px', marginBottom: '16px', border: '1px solid var(--color-outline)', height: '100px' }} type='text' value={text} placeholder='Share your thoughts...' placeholderStyle={{ color: 'var(--color-muted)' }} onInput={(e: any) => this.setState({ text: e.detail.value })} />

          <View style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={this.handleSubmit}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>Submit Review</Text>
          </View>
        </View>
      </View>
    )
  }
}

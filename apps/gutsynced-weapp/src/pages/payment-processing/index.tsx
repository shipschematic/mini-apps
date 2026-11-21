import { Component } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface PaymentProcessingState {
  amount: number
  description: string
  isProcessing: boolean
}

export default class PaymentProcessing extends Component<{}, PaymentProcessingState> {
  state: PaymentProcessingState = {
    amount: 0,
    description: '',
    isProcessing: false
  }

  handleAmountChange = (e: any) => {
    this.setState({ amount: parseFloat(e.detail.value) || 0 })
  }

  handleDescriptionChange = (e: any) => {
    this.setState({ description: e.detail.value })
  }

  handleProcessPayment = async () => {
    const { amount, description } = this.state

    if (amount <= 0) {
      Taro.showToast({ title: 'Invalid amount', icon: 'none' })
      return
    }

    try {
      this.setState({ isProcessing: true })
      Taro.showLoading({ title: 'Processing...' })
      await new Promise(resolve => setTimeout(resolve, 2000))

      Taro.hideLoading()
      Taro.showToast({ title: 'Payment successful!', icon: 'success' })

      const paymentReceipts = Taro.getStorageSync('payment_receipts') || []
      paymentReceipts.push({
        id: Date.now().toString(),
        amount,
        description: description || 'Payment',
        date: new Date().toISOString(),
        status: 'success',
        currency: 'usd'
      })
      Taro.setStorageSync('payment_receipts', paymentReceipts)

      this.setState({ isProcessing: false })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error: any) {
      Taro.hideLoading()
      this.setState({ isProcessing: false })
      Taro.showToast({ title: error.message || 'Payment failed', icon: 'none' })
    }
  }

  handleBackClick = () => {
    Taro.navigateBack()
  }

  render() {
    const { amount, description, isProcessing } = this.state

    return (
      <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)' }}>
          <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={this.handleBackClick}>&larr;</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Payment</Text>
        </View>

        <ScrollView scrollY style={{ height: 'calc(100vh - 50px)' }}>
          <View style={{ margin: '16px', padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: '12px' }}>
            <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '8px' }}>Amount</Text>
            <View style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Text style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '8px' }}>$</Text>
              <Input
                type='digit'
                value={amount.toString()}
                onInput={this.handleAmountChange}
                placeholder='0.00'
                style={{ fontSize: '24px', fontWeight: 'bold', flex: 1 }}
              />
            </View>
            <Input
              placeholder='What is this payment for?'
              value={description}
              onInput={this.handleDescriptionChange}
              style={{ fontSize: '14px', padding: '8px', border: '1px solid var(--color-outline)', borderRadius: '8px' }}
            />
          </View>

          <View style={{ margin: '16px', padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: '12px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>&#128179; Secure Payment</Text>
            <Text style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
              Your payment will be processed securely. We never store your card details.
            </Text>
            <View style={{ marginTop: '12px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Accepted Methods:</Text>
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)' }}>&#128179; Credit/Debit Card</Text>
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)' }}>&#127822; Apple Pay</Text>
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)' }}>&#129302; Google Pay</Text>
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)' }}>&#128154; WeChat Pay</Text>
            </View>
          </View>

          <View style={{ margin: '16px' }}>
            <View
              onClick={isProcessing ? undefined : this.handleProcessPayment}
              style={{
                backgroundColor: isProcessing ? 'var(--color-outline)' : 'var(--color-primary-container)',
                padding: '16px',
                borderRadius: '12px',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

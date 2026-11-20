import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface PaymentReceipt {
  id: string
  amount: number
  description: string
  date: string
  status: string
  currency: string
}

interface PaymentHistoryState {
  transactions: PaymentReceipt[]
  loading: boolean
}

export default class PaymentHistory extends Component<{}, PaymentHistoryState> {
  state: PaymentHistoryState = {
    transactions: [],
    loading: true
  }

  componentDidMount = async () => {
    await this.loadTransactions()
  }

  loadTransactions = async () => {
    try {
      Taro.showLoading({ title: 'Loading...' })
      const paymentReceipts = Taro.getStorageSync('payment_receipts') || []
      const transactions = paymentReceipts.length > 0 ? paymentReceipts : [
        { id: 'pi_1', amount: 29.99, description: 'Premium Subscription', date: '2024-01-15T10:30:00Z', status: 'success', currency: 'usd' },
        { id: 'pi_2', amount: 9.99, description: 'Recipe Book Purchase', date: '2024-01-10T14:20:00Z', status: 'success', currency: 'usd' },
        { id: 'pi_3', amount: 49.99, description: 'Cooking Class', date: '2024-01-05T09:15:00Z', status: 'success', currency: 'usd' }
      ]
      this.setState({
        transactions: transactions.sort((a: PaymentReceipt, b: PaymentReceipt) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        loading: false
      })
      Taro.hideLoading()
    } catch (error: any) {
      Taro.hideLoading()
      Taro.showToast({ title: 'Failed to load transactions', icon: 'none' })
      this.setState({ loading: false })
    }
  }

  handleTransactionClick = (transaction: PaymentReceipt) => {
    Taro.showModal({
      title: 'Transaction Details',
      content: `${transaction.description}\nAmount: $${transaction.amount}\nDate: ${new Date(transaction.date).toLocaleDateString()}\nStatus: ${transaction.status.toUpperCase()}`,
      showCancel: false
    })
  }

  handleAddPaymentMethod = () => {
    Taro.navigateTo({ url: '/pages/payment-method/index' })
  }

  handleProcessPayment = () => {
    Taro.navigateTo({ url: '/pages/payment-processing/index' })
  }

  render() {
    const { transactions, loading } = this.state

    if (loading) {
      return (
        <View style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
            <Text style={{ fontSize: '18px', marginRight: '12px' }}>&larr;</Text>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Payment History</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Text>Loading...</Text>
          </View>
        </View>
      )
    }

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)

    return (
      <View style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
          <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={() => Taro.navigateBack()}>&larr;</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Payment History</Text>
        </View>

        <ScrollView scrollY style={{ height: 'calc(100vh - 50px)' }}>
          <View style={{ margin: '16px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', alignItems: 'center' }}>
            <Text style={{ fontSize: '14px', color: '#666' }}>Total Spent</Text>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', marginVertical: '8px' }}>${totalSpent.toFixed(2)}</Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</Text>
          </View>

          <View style={{ margin: '16px', display: 'flex', gap: '12px' }}>
            <View onClick={this.handleProcessPayment} style={{ flex: 1, backgroundColor: '#FF6B6B', padding: '12px', borderRadius: '8px', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>New Payment</Text>
            </View>
            <View onClick={this.handleAddPaymentMethod} style={{ flex: 1, backgroundColor: '#fff', padding: '12px', borderRadius: '8px', alignItems: 'center', border: '1px solid #FF6B6B' }}>
              <Text style={{ color: '#FF6B6B', fontSize: '14px', fontWeight: 'bold' }}>Add Card</Text>
            </View>
          </View>

          <View style={{ margin: '16px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Recent Transactions</Text>
            {transactions.length > 0 ? (
              <View>
                {transactions.map((transaction) => (
                  <View
                    key={transaction.id}
                    onClick={() => this.handleTransactionClick(transaction)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      marginBottom: '8px'
                    }}
                  >
                    <View style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      backgroundColor: transaction.status === 'success' ? '#E8F5E9' : '#FFEBEE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px'
                    }}>
                      <Text style={{ fontSize: '18px' }}>{transaction.status === 'success' ? '&#10003;' : '&#9888;'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>{transaction.description}</Text>
                      <Text style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                      -${transaction.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ alignItems: 'center', padding: '40px' }}>
                <Text style={{ fontSize: '32px', marginBottom: '12px' }}>&#128179;</Text>
                <Text style={{ fontSize: '14px', color: '#999' }}>No transactions yet</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

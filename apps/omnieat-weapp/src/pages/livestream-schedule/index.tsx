import { Component } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface LivestreamScheduleState {
  title: string
  description: string
  scheduledDate: string
  scheduledTime: string
}

export default class LivestreamSchedule extends Component<{}, LivestreamScheduleState> {
  state: LivestreamScheduleState = {
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: ''
  }

  handleTitleChange = (e: any) => {
    this.setState({ title: e.detail.value })
  }

  handleDescriptionChange = (e: any) => {
    this.setState({ description: e.detail.value })
  }

  handleDateChange = (e: any) => {
    this.setState({ scheduledDate: e.detail.value })
  }

  handleTimeChange = (e: any) => {
    this.setState({ scheduledTime: e.detail.value })
  }

  handleSchedule = async () => {
    const { title, scheduledDate, scheduledTime } = this.state

    if (!title || !scheduledDate || !scheduledTime) {
      Taro.showToast({ title: 'Please fill in all required fields', icon: 'none' })
      return
    }

    try {
      Taro.showLoading({ title: 'Scheduling...' })
      await new Promise(resolve => setTimeout(resolve, 1000))

      Taro.hideLoading()
      Taro.showToast({ title: 'Livestream scheduled!', icon: 'success' })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error: any) {
      Taro.hideLoading()
      Taro.showToast({ title: 'Failed to schedule', icon: 'none' })
    }
  }

  handleBackClick = () => {
    Taro.navigateBack()
  }

  render() {
    return (
      <View style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
          <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={this.handleBackClick}>&larr;</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Schedule Livestream</Text>
        </View>

        <ScrollView scrollY style={{ height: 'calc(100vh - 50px)' }}>
          <View style={{ padding: '16px' }}>
            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Title *</Text>
              <Input
                placeholder='e.g., Cooking Italian Pasta'
                value={this.state.title}
                onInput={this.handleTitleChange}
                style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px' }}
              />
            </View>

            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Description</Text>
              <Input
                placeholder='Describe your livestream'
                value={this.state.description}
                onInput={this.handleDescriptionChange}
                style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px' }}
              />
            </View>

            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Date *</Text>
              <Input
                placeholder='Select date'
                value={this.state.scheduledDate}
                onInput={this.handleDateChange}
                style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px' }}
              />
            </View>

            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Time *</Text>
              <Input
                placeholder='Select time'
                value={this.state.scheduledTime}
                onInput={this.handleTimeChange}
                style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '14px' }}
              />
            </View>

            <View onClick={this.handleSchedule} style={{ backgroundColor: '#FF6B6B', padding: '16px', borderRadius: '12px', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>Schedule Livestream</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

import { Component } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface LiveCollabState {
  message: string
  messages: Array<{ id: number; user: string; text: string; time: string; isHost?: boolean }>
  isJoined: boolean
}

export default class LiveCollab extends Component<{}, LiveCollabState> {
  state: LiveCollabState = {
    message: '',
    isJoined: false,
    messages: [
      { id: 1, user: 'Chef Tanaka', text: 'Welcome everyone! Today we will make authentic Japanese ramen.', time: '2:00 PM', isHost: true },
      { id: 2, user: 'Maria', text: 'So excited! Been wanting to learn this for ages.', time: '2:01 PM' },
      { id: 3, user: 'Chef Tanaka', text: 'Let\'s start with the broth. It\'s the soul of ramen.', time: '2:02 PM', isHost: true },
      { id: 4, user: 'John', text: 'What ingredients do we need?', time: '2:03 PM' },
      { id: 5, user: 'Chef Tanaka', text: 'Pork bones, onions, ginger, garlic, and soy sauce!', time: '2:04 PM', isHost: true }
    ]
  }

  handleJoin = () => {
    this.setState({ isJoined: true })
  }

  handleSendMessage = () => {
    if (!this.state.message.trim()) return
    const newMessage = {
      id: Date.now(),
      user: 'You',
      text: this.state.message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    this.setState(prev => ({
      messages: [...prev.messages, newMessage],
      message: ''
    }))
  }

  handleInputChange = (e: any) => {
    this.setState({ message: e.detail.value })
  }

  render() {
    const { message, messages, isJoined } = this.state

    return (
      <View style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
          <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={() => Taro.navigateBack()}>&larr;</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Live Collaboration</Text>
        </View>

        <ScrollView scrollY style={{ height: isJoined ? 'calc(100vh - 160px)' : 'calc(100vh - 50px)' }}>
          <View style={{ position: 'relative' }}>
            <Image
              src='https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=450&fit=crop'
              mode='aspectFill'
              style={{ width: '100%', height: '200px' }}
            />
            <View style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#FF4444', padding: '4px 8px', borderRadius: '4px' }}>
              <Text style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>LIVE</Text>
            </View>
            <View style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}>
              <Text style={{ color: '#fff', fontSize: '12px', marginRight: '4px' }}>&#128065;</Text>
              <Text style={{ color: '#fff', fontSize: '12px' }}>2.4K watching</Text>
            </View>
          </View>

          <View style={{ padding: '16px', backgroundColor: '#fff', marginBottom: '8px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>Live Cooking: Japanese Cuisine</Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>with Chef Tanaka</Text>
          </View>

          {!isJoined && (
            <View style={{ padding: '16px', backgroundColor: '#fff', marginBottom: '8px' }}>
              <View onClick={this.handleJoin} style={{ backgroundColor: '#FF6B6B', padding: '12px', borderRadius: '8px', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Join Collaboration</Text>
              </View>
            </View>
          )}

          <View style={{ padding: '16px', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Live Chat</Text>
            <View>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={{
                    marginBottom: '12px',
                    padding: '8px',
                    backgroundColor: msg.isHost ? '#FFF3E0' : '#f5f5f5',
                    borderRadius: '8px'
                  }}
                >
                  <View style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text style={{ fontSize: '12px', fontWeight: 'bold', color: msg.isHost ? '#F57C00' : '#666' }}>{msg.user}</Text>
                    <Text style={{ fontSize: '10px', color: '#999' }}>{msg.time}</Text>
                  </View>
                  <Text style={{ fontSize: '14px' }}>{msg.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {isJoined && (
          <View style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
            <Input
              type='text'
              value={message}
              onInput={this.handleInputChange}
              placeholder='Type a message...'
              style={{ flex: 1, padding: '8px', border: '1px solid #eee', borderRadius: '8px', marginRight: '8px' }}
            />
            <View onClick={this.handleSendMessage} style={{ backgroundColor: '#FF6B6B', padding: '8px 12px', borderRadius: '8px' }}>
              <Text style={{ color: '#fff', fontSize: '14px' }}>&rarr;</Text>
            </View>
          </View>
        )}
      </View>
    )
  }
}

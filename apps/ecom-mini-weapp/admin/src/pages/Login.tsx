import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined, WechatOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleWeChatLogin = () => {
    message.info('WeChat OAuth login will be implemented here')
  }

  const handleAdminLogin = (values: any) => {
    console.log('Login values:', values)
    message.success('Login successful!')
    navigate('/dashboard')
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0, color: '#2A4B7C' }}>Whitelabel Admin</h1>
          <p style={{ color: '#666', marginTop: 8 }}>Sign in to manage your store</p>
        </div>

        <Button
          type="primary"
          block
          size="large"
          icon={<WechatOutlined />}
          onClick={handleWeChatLogin}
          style={{ marginBottom: 16, background: '#07C160', borderColor: '#07C160' }}
        >
          Login with WeChat
        </Button>

        <div style={{ textAlign: 'center', margin: '16px 0', color: '#999' }}>
          — or —
        </div>

        <Form onFinish={handleAdminLogin}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Admin Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

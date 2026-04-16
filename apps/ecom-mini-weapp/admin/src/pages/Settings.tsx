import { Form, Input, Button, Card, Divider, Upload, message, Switch, Select } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const { Option } = Select

export default function Settings() {
  const [form] = Form.useForm()

  const handleSave = () => {
    message.success('Settings saved successfully!')
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Settings</h1>

      <Form form={form} layout="vertical">
        <Card title="Store Information" style={{ marginBottom: 24 }}>
          <Form.Item name="storeName" label="Store Name">
            <Input placeholder="Your Store Name" />
          </Form.Item>
          <Form.Item name="storeDescription" label="Store Description">
            <Input.TextArea rows={3} placeholder="Brief description of your store" />
          </Form.Item>
          <Form.Item name="contactEmail" label="Contact Email">
            <Input type="email" placeholder="contact@yourstore.com" />
          </Form.Item>
          <Form.Item name="supportPhone" label="Support Phone">
            <Input placeholder="+1 234 567 890" />
          </Form.Item>
        </Card>

        <Card title="WeChat Configuration" style={{ marginBottom: 24 }}>
          <Form.Item
            name="wechatAppId"
            label="WeChat AppID"
            extra="Found in WeChat Mini Program admin panel"
          >
            <Input placeholder="wx1234567890abcdef" />
          </Form.Item>
          <Form.Item
            name="wechatAppSecret"
            label="WeChat AppSecret"
            extra="Keep this secret! Found in WeChat Mini Program admin panel"
          >
            <Input.Password placeholder="Enter your AppSecret" />
          </Form.Item>
          <Divider />
          <Form.Item
            name="wechatMchId"
            label="WeChat Pay Merchant ID"
            extra="Your merchant ID for WeChat Pay"
          >
            <Input placeholder="1234567890" />
          </Form.Item>
          <Form.Item
            name="wechatApiV3Key"
            label="WeChat Pay API v3 Key"
            extra="API key for WeChat Pay v3 APIs"
          >
            <Input.Password placeholder="Enter your API v3 key" />
          </Form.Item>
          <Form.Item
            name="wechatCert"
            label="WeChat Pay Certificate"
            extra="Upload your apiclient_cert.p12 file"
          >
            <Upload>
              <Button>Upload Certificate</Button>
            </Upload>
          </Form.Item>
        </Card>

        <Card title="Payment Settings" style={{ marginBottom: 24 }}>
          <Form.Item name="currency" label="Currency">
            <Select defaultValue="usd">
              <Option value="usd">USD - US Dollar</Option>
              <Option value="cny">CNY - Chinese Yuan</Option>
              <Option value="eur">EUR - Euro</Option>
            </Select>
          </Form.Item>
          <Form.Item name="taxRate" label="Tax Rate (%)" extra="Applied to all orders">
            <Input type="number" placeholder="0" />
          </Form.Item>
        </Card>

        <Card title="Branding" style={{ marginBottom: 24 }}>
          <Form.Item name="primaryColor" label="Primary Color">
            <Input type="color" style={{ width: 100 }} />
          </Form.Item>
          <Form.Item name="logo" label="Store Logo">
            <Upload listType="picture" maxCount={1}>
              <Button>Upload Logo</Button>
            </Upload>
          </Form.Item>
        </Card>

        <Card title="Features" style={{ marginBottom: 24 }}>
          <Form.Item name="enableReviews" label="Enable Customer Reviews" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="enableWishlist" label="Enable Wishlist" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="enableCoupons" label="Enable Coupons" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Button type="primary" icon={<SaveOutlined />} size="large" onClick={handleSave}>
          Save Settings
        </Button>
      </Form>
    </div>
  )
}

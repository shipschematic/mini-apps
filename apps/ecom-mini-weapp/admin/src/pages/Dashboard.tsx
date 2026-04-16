import { Row, Col, Card, Statistic } from 'antd'
import { DollarOutlined, ShoppingCartOutlined, UserOutlined, RiseOutlined } from '@ant-design/icons'

export default function Dashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={11280}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Orders"
              value={93}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Customers"
              value={284}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Growth"
              value={11.28}
              precision={2}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Sales Overview">
            <p>Sales chart will be displayed here</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Products">
            <p>Top selling products will be displayed here</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Recent Orders">
            <p>Recent orders table will be displayed here</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

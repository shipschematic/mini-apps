import { Table, Tag, Card, Select, DatePicker, Space } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

const { Option } = Select
const { RangePicker } = DatePicker

const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    items: 2,
    total: 89.98,
    status: 'paid',
    paymentMethod: 'wechat',
    createdAt: '2024-01-15 14:30',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    items: 1,
    total: 59.99,
    status: 'pending',
    paymentMethod: 'wechat',
    createdAt: '2024-01-15 13:45',
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    items: 3,
    total: 149.97,
    status: 'paid',
    paymentMethod: 'wechat',
    createdAt: '2024-01-14 16:20',
  },
  {
    id: 'ORD-004',
    customer: 'Alice Brown',
    items: 1,
    total: 9.99,
    status: 'refunded',
    paymentMethod: 'wechat',
    createdAt: '2024-01-13 10:15',
  },
]

export default function Orders() {
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => (
        <Tag color="blue">{method === 'wechat' ? 'WeChat Pay' : method}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: 'default',
          paid: 'success',
          failed: 'error',
          refunded: 'warning',
        }
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space>
          <EyeOutlined style={{ cursor: 'pointer' }} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Orders</h1>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Select defaultValue="all" style={{ width: 150 }}>
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="paid">Paid</Option>
            <Option value="failed">Failed</Option>
            <Option value="refunded">Refunded</Option>
          </Select>
          <RangePicker />
        </div>

        <Table columns={columns} dataSource={mockOrders} rowKey="id" />
      </Card>
    </div>
  )
}

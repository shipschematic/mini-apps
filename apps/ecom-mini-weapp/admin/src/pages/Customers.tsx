import { Table, Card, Avatar, Tag } from 'antd'

const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    purchases: 12,
    totalSpent: 459.88,
    status: 'active',
    createdAt: '2023-06-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234 567 891',
    purchases: 8,
    totalSpent: 234.92,
    status: 'active',
    createdAt: '2023-07-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 234 567 892',
    purchases: 3,
    totalSpent: 149.97,
    status: 'inactive',
    createdAt: '2023-08-10',
  },
]

export default function Customers() {
  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar>{name[0]}</Avatar>
          <div>
            <div>{name}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Purchases',
      dataIndex: 'purchases',
      key: 'purchases',
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Customers</h1>
      <Card>
        <Table columns={columns} dataSource={mockCustomers} rowKey="id" />
      </Card>
    </div>
  )
}

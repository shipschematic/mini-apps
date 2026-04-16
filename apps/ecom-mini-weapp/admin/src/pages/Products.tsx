import { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Input, Select, Card, message, Popconfirm } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { adminCloudService, Product } from '../services/cloudService'

const { Search } = Input
const { Option } = Select

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const result = await adminCloudService.getProducts()
    if (result.success && result.data) {
      setProducts(result.data)
    } else {
      message.error('Failed to fetch products: ' + result.error)
    }
    setLoading(false)
  }

  const handleDelete = async (productId: string) => {
    const result = await adminCloudService.deleteProduct(productId)
    if (result.success) {
      message.success('Product deleted successfully')
      fetchProducts()
    } else {
      message.error('Failed to delete product: ' + result.error)
    }
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === 'digital' ? 'blue' : type === 'service' ? 'purple' : 'green'
        return <Tag color={color}>{type.toUpperCase()}</Tag>
      },
    },
    {
      title: 'Delivery',
      dataIndex: 'deliveryMethod',
      key: 'deliveryMethod',
      render: (method: string) => {
        const icons: Record<string, string> = {
          download: '📥',
          unlock: '🔓',
          ship: '🚚',
        }
        return `${icons[method]} ${method}`
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Sales',
      dataIndex: 'purchaseCount',
      key: 'purchaseCount',
      render: (count: number) => count || 0,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (rating > 0 ? `⭐ ${rating}` : '-'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'published' ? 'success' : 'default'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/products/${record._id}/edit`)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesType = typeFilter === 'all' || product.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Search
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
            <Option value="all">All Status</Option>
            <Option value="published">Published</Option>
            <Option value="draft">Draft</Option>
            <Option value="archived">Archived</Option>
          </Select>
          <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 150 }}>
            <Option value="all">All Types</Option>
            <Option value="digital">Digital</Option>
            <Option value="service">Service</Option>
            <Option value="physical">Physical</Option>
          </Select>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredProducts} 
          rowKey="_id" 
          loading={loading}
        />
      </Card>
    </div>
  )
}

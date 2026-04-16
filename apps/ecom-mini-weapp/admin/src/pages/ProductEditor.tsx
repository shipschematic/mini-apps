import { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Select, Button, Card, Upload, message, Spin } from 'antd'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { adminCloudService } from '../services/cloudService'

const { TextArea } = Input
const { Option } = Select

export default function ProductEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [productType, setProductType] = useState<'digital' | 'service' | 'physical'>('digital')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const isEdit = Boolean(id)

  useEffect(() => {
    if (isEdit && id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    setLoading(true)
    const result = await adminCloudService.getProducts()
    if (result.success && result.data) {
      const product = result.data.find(p => p._id === productId)
      if (product) {
        form.setFieldsValue(product)
        setProductType(product.type)
      } else {
        message.error('Product not found')
        navigate('/products')
      }
    } else {
      message.error('Failed to fetch product: ' + result.error)
    }
    setLoading(false)
  }

  const handleSubmit = async (values: any) => {
    setSubmitting(true)
    
    try {
      let coverUrl = values.cover || ''
      
      if (coverFile) {
        message.loading({ content: 'Uploading cover image...', key: 'upload' })
        coverUrl = await adminCloudService.uploadFile(coverFile)
        message.success({ content: 'Cover image uploaded!', key: 'upload' })
      }

      const productData = {
        ...values,
        cover: coverUrl,
        rating: values.rating || 0,
        reviewCount: values.reviewCount || 0,
        purchaseCount: values.purchaseCount || 0,
        viewCount: values.viewCount || 0,
        tags: values.tags || [],
      }

      let result
      if (isEdit && id) {
        result = await adminCloudService.updateProduct(id, productData)
      } else {
        result = await adminCloudService.createProduct(productData)
      }

      if (result.success) {
        message.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!')
        navigate('/products')
      } else {
        message.error('Failed to save product: ' + result.error)
      }
    } catch (error: any) {
      message.error('Error saving product: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCoverUpload = (file: File) => {
    setCoverFile(file)
    return false
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>

      <h1>{isEdit ? 'Edit Product' : 'Create New Product'}</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 'digital',
          deliveryMethod: 'download',
          status: 'draft',
          price: 0,
        }}
      >
        <Card title="Basic Information" style={{ marginBottom: 24 }}>
          <Form.Item
            name="title"
            label="Product Title"
            rules={[{ required: true, message: 'Please enter product title' }]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item name="author" label="Author/Creator">
            <Input placeholder="Enter author or creator name" />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Select placeholder="Select category">
              <Option value="programming">Programming</Option>
              <Option value="marketing">Marketing</Option>
              <Option value="design">Design</Option>
              <Option value="business">Business</Option>
              <Option value="ai">AI & Machine Learning</Option>
              <Option value="productivity">Productivity</Option>
            </Select>
          </Form.Item>
        </Card>

        <Card title="Product Type & Pricing" style={{ marginBottom: 24 }}>
          <Form.Item
            name="type"
            label="Product Type"
            rules={[{ required: true }]}
          >
            <Select onChange={(value: 'digital' | 'service' | 'physical') => {
              setProductType(value)
              const deliveryMap: Record<string, string> = {
                digital: 'download',
                service: 'unlock',
                physical: 'ship',
              }
              form.setFieldsValue({ deliveryMethod: deliveryMap[value] })
            }}>
              <Option value="digital">
                <span>📦 Digital Product - Downloadable files (eBooks, templates, etc.)</span>
              </Option>
              <Option value="service">
                <span>⚡ Service - Unlock access (prompts, courses, etc.)</span>
              </Option>
              <Option value="physical">
                <span>🚚 Physical Product - Shipping required</span>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="deliveryMethod"
            label="Delivery Method"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="download">📥 Download - Customer downloads file</Option>
              <Option value="unlock">🔓 Unlock - Customer gets access</Option>
              <Option value="ship">🚚 Ship - Physical delivery</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (USD)"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              placeholder="0.00"
            />
          </Form.Item>
        </Card>

        <Card title="Content" style={{ marginBottom: 24 }}>
          <Form.Item
            name="preview"
            label="Preview Content"
            extra="This content is shown before purchase"
          >
            <TextArea
              rows={6}
              placeholder="Enter preview content that customers can see before purchasing..."
            />
          </Form.Item>

          <Form.Item
            name="fullContent"
            label="Full Content"
            extra="This content is shown after purchase"
          >
            <TextArea
              rows={10}
              placeholder="Enter the full content that customers will see after purchasing..."
            />
          </Form.Item>

          {(productType === 'digital' || form.getFieldValue('type') === 'digital') && (
            <Form.Item
              name="downloadUrl"
              label="Download URL"
              extra="URL for customers to download the file after purchase"
            >
              <Input placeholder="https://example.com/download/file.pdf" />
            </Form.Item>
          )}
        </Card>

        <Card title="Media" style={{ marginBottom: 24 }}>
          <Form.Item name="cover" label="Cover Image">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={handleCoverUpload}
              accept="image/*"
            >
              <div>
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Card>

        {productType === 'physical' && (
          <Card title="Inventory" style={{ marginBottom: 24 }}>
            <Form.Item name="sku" label="SKU">
              <Input placeholder="Enter SKU" />
            </Form.Item>

            <Form.Item name="inventory" label="Stock Quantity">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Card>
        )}

        <Card title="Status" style={{ marginBottom: 24 }}>
          <Form.Item
            name="status"
            label="Publication Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="draft">Draft - Not visible to customers</Option>
              <Option value="published">Published - Visible to customers</Option>
              <Option value="archived">Archived - Hidden from store</Option>
            </Select>
          </Form.Item>
        </Card>

        <div style={{ display: 'flex', gap: 16 }}>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={submitting}>
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Button size="large" onClick={() => navigate('/products')}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}

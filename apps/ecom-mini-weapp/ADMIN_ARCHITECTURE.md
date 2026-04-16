# Admin Panel Architecture

## Overview

The admin panel allows store owners to manage their products, orders, and settings without touching code. It's a web-based interface that connects to a backend API.

---

## Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **UI Library:** Ant Design Pro (comprehensive admin UI)
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form + Zod validation

### Backend (WeChat-Aligned)
- **Runtime:** Node.js 18+
- **Framework:** NestJS (structured, TypeScript-native)
- **Database:** MongoDB (flexible schema for products)
- **Cache:** Redis (sessions, rate limiting)
- **File Storage:** Aliyun OSS (WeChat ecosystem)
- **Auth:** WeChat OAuth 2.0 + JWT

### Deployment
- **Server:** Aliyun ECS (China region for WeChat API speed)
- **CDN:** Aliyun CDN
- **SSL:** Let's Encrypt
- **CI/CD:** GitHub Actions

---

## Database Schema (MongoDB)

### Stores Collection
```typescript
interface Store {
  _id: ObjectId
  name: string
  subdomain: string  // yourstore.promptmarket.com
  owner: ObjectId    // Reference to User
  
  // WeChat Configuration
  wechat: {
    appId: string
    appSecret: string    // Encrypted
    mchId: string        // Merchant ID
    apiV3Key: string     // Encrypted
    certPath: string     // Path to apiclient_cert.p12
  }
  
  // Branding
  branding: {
    primaryColor: string
    secondaryColor: string
    logo: string
    appName: string
  }
  
  // Settings
  settings: {
    currency: string
    locale: string
    features: string[]
  }
  
  createdAt: Date
  updatedAt: Date
}
```

### Products Collection
```typescript
interface Product {
  _id: ObjectId
  storeId: ObjectId
  
  // Unified Product Structure
  title: string
  description: string
  price: number
  type: 'digital' | 'service' | 'physical'
  deliveryMethod: 'download' | 'unlock' | 'ship'
  
  // Content
  preview: string
  fullContent: string
  downloadUrl?: string
  
  // Metadata
  author?: string
  category?: string
  tags: string[]
  cover?: string
  
  // Stats
  rating: number
  reviewCount: number
  purchaseCount: number
  viewCount: number
  
  // Inventory (for physical)
  inventory?: number
  sku?: string
  
  // Status
  status: 'draft' | 'published' | 'archived'
  
  createdAt: Date
  updatedAt: Date
}
```

### Orders Collection
```typescript
interface Order {
  _id: ObjectId
  storeId: ObjectId
  userId: ObjectId
  
  // Items
  items: [{
    productId: ObjectId
    title: string
    price: number
    quantity: number
  }]
  
  // Totals
  subtotal: number
  discount: number
  total: number
  
  // Payment
  payment: {
    method: 'wechat'
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    transactionId?: string
    paidAt?: Date
  }
  
  // Delivery (for physical)
  shipping?: {
    address: string
    carrier: string
    trackingNumber: string
    status: string
  }
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### Users Collection
```typescript
interface User {
  _id: ObjectId
  
  // WeChat Info
  wechat: {
    openid: string
    unionid?: string
    nickname: string
    avatar: string
  }
  
  // Profile
  profile: {
    name?: string
    phone?: string
    email?: string
  }
  
  // Role
  role: 'customer' | 'store_owner' | 'admin'
  storeId?: ObjectId  // If store owner
  
  // Purchases
  purchases: [{
    productId: ObjectId
    orderId: ObjectId
    purchasedAt: Date
  }]
  
  createdAt: Date
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/wechat/login     - WeChat OAuth login
POST   /api/auth/refresh          - Refresh JWT token
POST   /api/auth/logout           - Logout
GET    /api/auth/me               - Get current user
```

### Stores
```
GET    /api/stores                - List stores (admin only)
POST   /api/stores                - Create store
GET    /api/stores/:id            - Get store details
PUT    /api/stores/:id            - Update store
DELETE /api/stores/:id            - Delete store
PUT    /api/stores/:id/wechat     - Update WeChat config
```

### Products
```
GET    /api/products              - List products (with filters)
POST   /api/products              - Create product
GET    /api/products/:id          - Get product details
PUT    /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product
PUT    /api/products/:id/status   - Update status (publish/archive)
POST   /api/products/:id/images   - Upload product images
```

### Orders
```
GET    /api/orders                - List orders (with filters)
GET    /api/orders/:id            - Get order details
PUT    /api/orders/:id/status     - Update order status
POST   /api/orders/:id/refund     - Process refund
```

### Analytics
```
GET    /api/analytics/overview    - Dashboard overview
GET    /api/analytics/sales       - Sales data
GET    /api/analytics/products    - Product performance
GET    /api/analytics/customers   - Customer insights
```

---

## Admin Panel Pages

### 1. Dashboard (`/admin`)
- Revenue overview (today, week, month)
- Order count & status breakdown
- Top-selling products
- Recent orders
- Customer growth chart

### 2. Products (`/admin/products`)
- Product list with filters (status, type, category)
- Search by title/author
- Bulk actions (publish, archive, delete)
- Quick edit (price, status)

### 3. Product Editor (`/admin/products/:id/edit`)
- **Basic Info**
  - Title, description, author
  - Category, tags
  - Price, compare at price
  
- **Product Type Selector**
  ```
  [ ] Digital Product (download)
  [ ] Service (unlock access)
  [ ] Physical Product (shipping)
  ```
  
- **Content**
  - Preview content (shown before purchase)
  - Full content (shown after purchase)
  - Upload files (for digital)
  
- **Media**
  - Cover image upload
  - Gallery images
  
- **Inventory** (for physical)
  - SKU
  - Stock quantity
  - Low stock threshold
  
- **SEO**
  - Meta title
  - Meta description
  - URL slug

### 4. Orders (`/admin/orders`)
- Order list with filters (status, date range)
- Search by order ID, customer
- Export to CSV/Excel
- Order details modal

### 5. Customers (`/admin/customers`)
- Customer list
- Purchase history
- Customer details

### 6. Settings (`/admin/settings`)
- **Store Info**
  - Store name
  - Logo
  - Contact info
  
- **WeChat Configuration**
  - AppID
  - AppSecret
  - Merchant ID
  - API Certificate upload
  
- **Payment**
  - WeChat Pay settings
  - Payment methods
  
- **Shipping** (for physical)
  - Shipping zones
  - Shipping rates
  
- **Notifications**
  - Order confirmation
  - Shipping updates
  
- **Branding**
  - Colors
  - Fonts
  - Custom CSS

---

## WeChat Integration

### WeChat OAuth Flow
```
1. User clicks "Login with WeChat"
2. Redirect to WeChat OAuth URL
3. User authorizes in WeChat
4. WeChat redirects back with code
5. Backend exchanges code for access_token
6. Backend gets user info (openid, nickname, avatar)
7. Backend creates/updates user in database
8. Backend generates JWT token
9. Frontend stores token and redirects to admin
```

### WeChat Pay Integration
```typescript
// Create payment order
async function createWechatPayOrder(order: Order) {
  const params = {
    appid: store.wechat.appId,
    mch_id: store.wechat.mchId,
    nonce_str: generateNonceStr(),
    body: `Order ${order._id}`,
    out_trade_no: order._id.toString(),
    total_fee: Math.round(order.total * 100),  // Convert to cents
    spbill_create_ip: getClientIP(),
    notify_url: `${API_URL}/webhooks/wechat/pay`,
    trade_type: 'JSAPI',
    openid: user.wechat.openid
  }
  
  // Sign request
  const sign = signWithMD5(params, store.wechat.apiV3Key)
  
  // Call WeChat Pay API
  const response = await axios.post(
    'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi',
    { ...params, sign }
  )
  
  return response.data
}

// Payment callback webhook
router.post('/webhooks/wechat/pay', async (req, res) => {
  // Verify signature
  const isValid = verifySignature(req.body, req.headers['x-wx-signature'])
  
  if (!isValid) {
    return res.status(400).send('Invalid signature')
  }
  
  // Update order status
  const order = await Order.findById(req.body.out_trade_no)
  order.payment.status = 'paid'
  order.payment.transactionId = req.body.transaction_id
  order.payment.paidAt = new Date()
  await order.save()
  
  // Grant access to digital/service products
  for (const item of order.items) {
    await grantProductAccess(order.userId, item.productId)
  }
  
  res.send('SUCCESS')
})
```

---

## File Structure

```
admin/
├── src/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Products/
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductEditor.tsx
│   │   ├── Orders/
│   │   ├── Customers/
│   │   └── Settings/
│   ├── components/
│   │   ├── Layout/
│   │   ├── ProductTypeSelector/
│   │   ├── RichTextEditor/
│   │   └── ImageUploader/
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── wechat.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   └── productsSlice.ts
│   └── utils/
│       ├── validators.ts
│       └── formatters.ts
├── public/
│   └── index.html
└── package.json

backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── stores/
│   │   ├── products/
│   │   ├── orders/
│   │   └── users/
│   ├── common/
│   │   ├── guards/
│   │   ├── decorators/
│   │   └── interceptors/
│   ├── config/
│   │   ├── database.ts
│   │   ├── wechat.ts
│   │   └── storage.ts
│   └── main.ts
├── test/
└── package.json
```

---

## Deployment Checklist

### Backend
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure Redis instance
- [ ] Set up Aliyun OSS bucket
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure WeChat Pay certificates
- [ ] Set up webhook endpoints
- [ ] Configure rate limiting
- [ ] Set up logging & monitoring

### Frontend
- [ ] Build admin panel
- [ ] Configure CDN
- [ ] Set up environment variables
- [ ] Test WeChat OAuth flow
- [ ] Test payment flow
- [ ] Performance optimization
- [ ] Security audit

### Mini Program
- [ ] Update API endpoints to production
- [ ] Test WeChat login
- [ ] Test payment flow
- [ ] Submit for review

---

## Security Considerations

1. **Authentication**
   - JWT tokens with short expiry (1 hour)
   - Refresh tokens with longer expiry (7 days)
   - Token rotation on refresh
   - Rate limiting on auth endpoints

2. **Authorization**
   - Role-based access control (RBAC)
   - Store isolation (users can only access their store)
   - API endpoint protection with guards

3. **Data Protection**
   - Encrypt sensitive data (WeChat secrets, API keys)
   - HTTPS only
   - Input validation & sanitization
   - SQL injection prevention (MongoDB injection)
   - XSS protection

4. **Payment Security**
   - Verify WeChat Pay signatures
   - Idempotency keys for payment requests
   - Webhook signature verification
   - PCI DSS compliance (handled by WeChat Pay)

---

## Next Steps

1. **Phase 1: Backend API** (Week 1-2)
   - Set up NestJS project
   - Configure MongoDB
   - Implement authentication
   - Create CRUD endpoints for products

2. **Phase 2: Admin Panel** (Week 3-4)
   - Set up React project with Ant Design Pro
   - Implement authentication flow
   - Create product management pages
   - Integrate with backend API

3. **Phase 3: WeChat Integration** (Week 5-6)
   - Implement WeChat OAuth
   - Integrate WeChat Pay
   - Set up webhooks
   - Test payment flow

4. **Phase 4: Deployment** (Week 7-8)
   - Set up production environment
   - Configure SSL & CDN
   - Deploy backend & frontend
   - Test end-to-end flow

---

## Estimated Costs (Monthly)

### Development
- MongoDB Atlas (M0 Sandbox): **FREE**
- Redis (256MB): **$15**
- Aliyun OSS (10GB storage + 10GB transfer): **$3**
- Aliyun ECS (1 vCPU, 1GB RAM): **$10**
- **Total: ~$28/month**

### Production
- MongoDB Atlas (M2): **$57**
- Redis (1GB): **$35**
- Aliyun OSS (100GB storage + 100GB transfer): **$15**
- Aliyun ECS (2 vCPU, 4GB RAM): **$40**
- Aliyun CDN (1TB transfer): **$20**
- **Total: ~$167/month**

---

## Alternative: Use Headless CMS

If you want to launch faster, consider using:

### Strapi (Self-hosted)
- **Pros:**
  - Built-in admin panel
  - Auto-generated REST API
  - User roles & permissions
  - Media library
  - Webhooks
  - FREE (self-hosted)
  
- **Cons:**
  - Less customization
  - Need to adapt to Strapi's structure

### Setup Time: **2-3 days** vs **4-6 weeks** for custom solution

---

## Recommendation

**For MVP:** Use Strapi to launch quickly
**For Production:** Build custom backend for full control

Would you like me to:
1. **Create a Strapi configuration for quick launch?**
2. **Build the custom NestJS backend?**
3. **Create the admin panel frontend?**
4. **Set up the WeChat integration?**

# Taro Whitelabel Framework - Complete Architecture Guide

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Mini Program (Taro)](#mini-program-taro)
4. [Admin Panel (React)](#admin-panel-react)
5. [Backend API (NestJS)](#backend-api-nestjs)
6. [WeChat Integration](#wechat-integration)
7. [Database Schema](#database-schema)
8. [Getting Started](#getting-started)
9. [Deployment](#deployment)

---

## Project Overview

**Taro Whitelabel Framework** is a multi-tenant e-commerce platform that allows creators to launch their own Mini Program stores without writing code. It supports:

- **Digital Products** (eBooks, templates, courses)
- **Services** (AI prompts, consulting, subscriptions)
- **Physical Products** (with shipping)

### Key Features

- ✅ **Configuration-Driven UI** - No hardcoding, everything from JSON
- ✅ **Single Source of Truth** - Data exists in one place
- ✅ **DRY Architecture** - Reusable components and functions
- ✅ **WeChat Pay Integration** - Native payment support
- ✅ **Admin Panel** - Manage products, orders, customers
- ✅ **Multi-Tenant** - Multiple stores from one codebase

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER FLOW                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│  WeChat Mini │◄───────►│  Backend API │◄───────►│   MongoDB    │
│   Program    │  HTTP   │   (NestJS)   │         │  Database    │
│   (Taro)     │         │              │         │              │
│              │         │              │         │              │
└──────┬───────┘         └──────┬───────┘         └──────────────┘
       │                        │
       │                        │
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│              │         │              │
│  WeChat Pay  │         │ Admin Panel  │
│   API v3     │         │   (React)    │
│              │         │              │
└──────────────┘         └──────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENT ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

Mini Program (Taro)                    Admin Panel (React)
┌─────────────────────┐               ┌─────────────────────┐
│   app.tsx (Shell)   │               │   main.tsx (Entry)  │
│          │          │               │          │          │
│          ▼          │               │          ▼          │
│   RenderEngine      │               │   Layout Component  │
│          │          │               │          │          │
│          ▼          │               │          ▼          │
│   ComponentRegistry │               │   Page Components   │
│          │          │               │   - Dashboard       │
│          ▼          │               │   - Products        │
│   ProductCard       │               │   - Orders          │
│   ServiceCard       │               │   - Customers       │
│   CartView          │               │   - Settings        │
│   LockedContent     │               │          │          │
│          │          │               │          ▼          │
│          ▼          │               │   Redux Store       │
│   ActionDispatcher  │               │          │          │
│          │          │               │          ▼          │
│          ▼          │               │   API Services      │
│   GlobalStore       │               │   - auth.ts         │
│   (Redux)           │               │   - wechat.ts       │
└─────────────────────┘               └─────────────────────┘
```

---

## Mini Program (Taro)

### File Structure

```
src/
├── app.tsx                    # App shell - loads config
├── app.config.ts              # App configuration (pages, tabBar)
├── core/                      # Core architecture
│   ├── types/
│   │   └── product.ts         # Unified product types
│   ├── ConfigParser.ts        # Parse JSON configs
│   ├── RenderEngine.tsx       # Dynamic page rendering
│   ├── ActionDispatcher.ts    # Handle all actions
│   ├── DataFetcher.ts         # Fetch data from API
│   └── ComponentRegistry.ts   # Register components
├── components/                # Whitelabel components
│   ├── ProductCard/           # Unified product card
│   ├── ServiceCard/           # Service-specific card
│   ├── CartView/              # Shopping cart
│   ├── LockedContent/         # Locked content display
│   ├── ProductDetail/         # Product detail page
│   ├── UserInfo/              # User profile
│   ├── OrderHistory/          # Order history
│   └── DigitalLibrary/        # Purchased products
├── pages/                     # Taro pages
│   ├── dynamic/               # Dynamic page renderer
│   ├── cart/                  # Cart page
│   ├── profile/               # Profile page
│   └── detail/                # Product detail
├── store/                     # Redux store
│   ├── index.ts               # Store configuration
│   ├── cartSlice.ts           # Cart state
│   └── userSlice.ts           # User state
└── assets/                    # Static assets
    └── icons/                 # TabBar icons
```

### Core Modules Explained

#### 1. ConfigParser (`src/core/ConfigParser.ts`)

**Purpose:** Parse and validate JSON configuration files

**What it does:**
- Loads JSON config from `/public/config/*.json`
- Validates required fields (meta, navigation, pages)
- Returns typed configuration object
- Handles errors gracefully

**Example:**
```typescript
const config = await ConfigParser.load('bookstore')
// Returns: { meta, navigation, products, pages }
```

#### 2. RenderEngine (`src/core/RenderEngine.tsx`)

**Purpose:** Dynamically render pages based on configuration

**What it does:**
- Takes `pageId` and `params` as input
- Fetches page config from loaded JSON
- Resolves components using ComponentRegistry
- Passes data and actions to components
- Handles loading and error states

**Example:**
```typescript
<RenderEngine pageId="home" params={{}} />
// Renders: Header + ProductGrid + Footer
```

#### 3. ActionDispatcher (`src/core/ActionDispatcher.ts`)

**Purpose:** Centralized action handling (SSOT for actions)

**What it does:**
- Receives action arrays from components
- Executes actions in sequence
- Handles navigation, cart, payment, etc.
- Updates Redux store

**Supported Actions:**
```typescript
[
  { type: 'navigate', payload: { target: 'detail', params: { id: '123' } } },
  { type: 'addToCart', payload: { productId: '123', quantity: 1 } },
  { type: 'purchase', payload: { productId: '123', price: 9.99 } },
  { type: 'showToast', payload: { title: 'Success!', icon: 'success' } }
]
```

#### 4. DataFetcher (`src/core/DataFetcher.ts`)

**Purpose:** Unified data fetching from multiple sources

**What it does:**
- Fetches from API endpoints
- Loads static data from config
- Retrieves from Redux store
- Handles timeouts and errors

**Example:**
```typescript
const products = await DataFetcher.fetch({
  type: 'api',
  endpoint: '/products'
})
```

#### 5. ComponentRegistry (`src/core/ComponentRegistry.ts`)

**Purpose:** Register and resolve whitelabel components

**What it does:**
- Maps component names to React components
- Provides `get()` method to resolve components
- Handles missing components gracefully

**Example:**
```typescript
ComponentRegistry.register('ProductCard', ProductCard)
const ProductCardComponent = ComponentRegistry.get('ProductCard')
```

### Unified Product Architecture

**File:** `src/core/types/product.ts`

```typescript
export type ProductType = 'digital' | 'service' | 'physical'
export type DeliveryMethod = 'download' | 'unlock' | 'ship'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  type: ProductType              // What kind of product
  deliveryMethod: DeliveryMethod // How it's delivered
  
  preview: string      // Shown before purchase
  fullContent: string  // Shown after purchase
  downloadUrl?: string // For digital products
  
  // Common fields
  author?: string
  category?: string
  cover?: string
  rating?: number
  reviewCount?: number
  
  // Physical product fields
  inventory?: number
  sku?: string
}
```

**Why this matters:**
- **DRY:** One component handles all product types
- **SSOT:** Single data structure for everything
- **Scalable:** Add new types without new components

### Configuration Files

**Location:** `public/config/*.json`

#### bookstore.json (Digital Products)

```json
{
  "meta": {
    "name": "BookStore",
    "version": "1.0.0"
  },
  "navigation": {
    "tabBar": {
      "list": [
        { "pagePath": "pages/dynamic/index", "text": "Home", "iconPath": "assets/icons/home.png" },
        { "pagePath": "pages/cart/index", "text": "Cart", "iconPath": "assets/icons/cart.png" },
        { "pagePath": "pages/profile/index", "text": "Profile", "iconPath": "assets/icons/profile.png" }
      ]
    }
  },
  "products": [
    {
      "id": "book-1",
      "title": "The Art of Programming",
      "type": "digital",
      "deliveryMethod": "download",
      "price": 59.99,
      "preview": "Chapter 1 preview...",
      "fullContent": "Full book content...",
      "downloadUrl": "https://example.com/book.pdf"
    }
  ],
  "pages": [
    {
      "id": "home",
      "components": [
        {
          "type": "ProductGrid",
          "data": { "source": "products" }
        }
      ]
    }
  ]
}
```

#### prompt-service.json (Services)

```json
{
  "meta": {
    "name": "PromptService",
    "version": "1.0.0"
  },
  "products": [
    {
      "id": "prompt-1",
      "title": "ChatGPT Marketing Expert",
      "type": "service",
      "deliveryMethod": "unlock",
      "price": 9.99,
      "preview": "Act as a marketing expert...",
      "fullContent": "Full prompt content..."
    }
  ]
}
```

---

## Admin Panel (React)

### File Structure

```
admin/
├── src/
│   ├── main.tsx               # Entry point
│   ├── App.tsx                # Router configuration
│   ├── components/
│   │   └── Layout.tsx         # Admin layout (sidebar + header)
│   ├── pages/
│   │   ├── Dashboard.tsx      # Overview stats
│   │   ├── Products.tsx       # Product list
│   │   ├── ProductEditor.tsx  # Create/Edit product
│   │   ├── Orders.tsx         # Order management
│   │   ├── Customers.tsx      # Customer list
│   │   ├── Settings.tsx       # Store settings
│   │   └── Login.tsx          # Login page
│   ├── store/
│   │   ├── index.ts           # Redux store
│   │   ├── authSlice.ts       # Auth state
│   │   └── productsSlice.ts   # Products state
│   └── services/
│       ├── api.ts             # Axios instance
│       ├── auth.ts            # Auth API calls
│       └── wechat.ts          # WeChat API calls
├── package.json
└── vite.config.ts
```

### Key Pages

#### 1. Dashboard (`src/pages/Dashboard.tsx`)

**What it shows:**
- Total revenue
- Order count
- Customer count
- Growth percentage
- Sales chart
- Top products
- Recent orders

#### 2. Products (`src/pages/Products.tsx`)

**Features:**
- List all products
- Filter by status/type
- Search by title
- Quick actions (edit, delete)
- Bulk operations

#### 3. ProductEditor (`src/pages/ProductEditor.tsx`)

**Form fields:**
- Basic info (title, description, author)
- Product type selector (digital/service/physical)
- Delivery method (download/unlock/ship)
- Pricing
- Preview content
- Full content
- Media upload
- Inventory (for physical)
- Publication status

#### 4. Orders (`src/pages/Orders.tsx`)

**Features:**
- List all orders
- Filter by status/date
- View order details
- Process refunds
- Export to CSV

#### 5. Settings (`src/pages/Settings.tsx`)

**Configuration sections:**
- Store information
- WeChat configuration (AppID, Secret, Merchant ID)
- Payment settings
- Branding (colors, logo)
- Features toggle

### Redux Store

**File:** `src/store/index.ts`

```typescript
{
  auth: {
    user: { id, name, email, role },
    token: 'jwt-token',
    isAuthenticated: true
  },
  products: {
    items: Product[],
    loading: false,
    error: null
  }
}
```

### API Services

**File:** `src/services/api.ts`

**Features:**
- Axios instance with base URL
- JWT token injection
- Automatic token refresh
- Error handling
- Request/response interceptors

---

## Backend API (NestJS)

### File Structure

```
backend/
├── src/
│   ├── main.ts                # Entry point
│   ├── app.module.ts          # Root module
│   ├── auth/                  # Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── jwt.strategy.ts
│   ├── wechat/                # WeChat integration
│   │   ├── wechat.module.ts
│   │   ├── wechat.service.ts
│   │   └── wechat.controller.ts
│   ├── products/              # Products API
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   ├── products.controller.ts
│   │   └── product.schema.ts
│   └── orders/                # Orders API
│       ├── orders.module.ts
│       ├── orders.service.ts
│       ├── orders.controller.ts
│       └── order.schema.ts
├── package.json
└── .env.example
```

### API Endpoints

#### Authentication

```
POST   /api/auth/wechat/login     - WeChat OAuth login
POST   /api/auth/admin/login      - Admin login
POST   /api/auth/refresh          - Refresh JWT token
GET    /api/auth/me               - Get current user
POST   /api/auth/logout           - Logout
```

#### Products

```
GET    /api/products              - List products (with filters)
GET    /api/products/:id          - Get product details
POST   /api/products              - Create product (auth required)
PUT    /api/products/:id          - Update product (auth required)
DELETE /api/products/:id          - Delete product (auth required)
PUT    /api/products/:id/status   - Update status (auth required)
```

#### Orders

```
GET    /api/orders                - List all orders (auth required)
GET    /api/orders/my             - Get user's orders (auth required)
GET    /api/orders/:id            - Get order details (auth required)
POST   /api/orders                - Create order (auth required)
POST   /api/orders/:id/payment    - Update payment status (auth required)
```

#### WeChat Pay

```
POST   /api/wechat/pay/create     - Create payment order
GET    /api/wechat/pay/query/:id  - Query payment status
POST   /api/wechat/pay/close/:id  - Close payment order
POST   /api/wechat/pay/refund     - Process refund
POST   /api/wechat/pay/callback   - Payment callback webhook
```

### Modules Explained

#### 1. AuthModule

**Purpose:** Handle authentication and authorization

**Components:**
- `JwtStrategy` - Passport JWT strategy
- `AuthService` - Login, token generation
- `AuthController` - API endpoints

**Flow:**
```
User clicks "Login with WeChat"
  ↓
Redirect to WeChat OAuth
  ↓
User authorizes
  ↓
WeChat redirects back with code
  ↓
Backend exchanges code for access_token
  ↓
Backend gets user info (openid, nickname, avatar)
  ↓
Backend creates/updates user in MongoDB
  ↓
Backend generates JWT token
  ↓
Frontend stores token and redirects to admin
```

#### 2. WechatModule

**Purpose:** WeChat Pay and OAuth integration

**Key Methods:**

**createJsapiOrder()**
- Creates payment order in WeChat Pay
- Returns prepay_id and JSAPI parameters
- Used for Mini Program payments

**queryOrder()**
- Queries payment status
- Returns transaction status and details

**refund()**
- Processes refund
- Returns refund status

**verifyCallback()**
- Verifies payment callback signature
- Ensures request is from WeChat

**handlePaymentCallback()**
- Processes payment webhook
- Updates order status
- Grants product access

#### 3. ProductsModule

**Purpose:** Product CRUD operations

**Schema:**
```typescript
{
  title: String,
  description: String,
  price: Number,
  type: 'digital' | 'service' | 'physical',
  deliveryMethod: 'download' | 'unlock' | 'ship',
  preview: String,
  fullContent: String,
  downloadUrl: String,
  status: 'draft' | 'published' | 'archived',
  // ... more fields
}
```

#### 4. OrdersModule

**Purpose:** Order management

**Schema:**
```typescript
{
  userId: String,
  items: [{
    productId: String,
    title: String,
    price: Number,
    quantity: Number
  }],
  subtotal: Number,
  total: Number,
  payment: {
    method: 'wechat',
    status: 'pending' | 'paid' | 'failed' | 'refunded',
    transactionId: String,
    paidAt: Date
  }
}
```

---

## WeChat Integration

### WeChat OAuth Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Mini    │         │  Backend │         │  WeChat  │
│  Program │         │   API    │         │   API    │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │
     │ 1. User clicks     │                    │
     │    "Login"         │                    │
     │                    │                    │
     │ 2. Redirect to ───►│                    │
     │    WeChat OAuth    │                    │
     │                    │                    │
     │                    │ 3. User authorizes │
     │                    │                    │
     │                    │ 4. WeChat returns ─►
     │                    │    code            │
     │                    │                    │
     │                    │ 5. Exchange code ──►
     │                    │    for token       │
     │                    │                    │
     │                    │ 6. Get user info ──►
     │                    │    (openid, etc)   │
     │                    │                    │
     │ 7. Return JWT ◄────┤                    │
     │    token           │                    │
     │                    │                    │
     └────────────────────┴────────────────────┘
```

### WeChat Pay Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  Mini    │         │  Backend │         │  WeChat  │         │  User    │
│  Program │         │   API    │         │   Pay    │         │          │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │ 1. User clicks     │                    │                    │
     │    "Buy Now"       │                    │                    │
     │                    │                    │                    │
     │ 2. Create order ──►│                    │                    │
     │    (productId)     │                    │                    │
     │                    │                    │                    │
     │                    │ 3. Create payment ─►│                    │
     │                    │    order           │                    │
     │                    │                    │                    │
     │                    │ 4. Return prepay_id◄┤                    │
     │                    │    & JSAPI params  │                    │
     │                    │                    │                    │
     │ 5. Return params ◄─┤                    │                    │
     │                    │                    │                    │
     │ 6. Call wx.request│                    │                    │
     │    Payment()       │                    │                    │
     │                    │                    │                    │
     │                    │                    │ 7. User pays ─────►│
     │                    │                    │                    │
     │                    │                    │ 8. Payment success │
     │                    │                    │                    │
     │                    │ 9. Webhook callback◄┤                    │
     │                    │    (payment success)│                    │
     │                    │                    │                    │
     │                    │ 10. Update order   │                    │
     │                    │     Grant access   │                    │
     │                    │                    │                    │
     │ 11. Payment success│                    │                    │
     │     notification ◄─┤                    │                    │
     │                    │                    │                    │
     └────────────────────┴────────────────────┴────────────────────┘
```

### WeChat Pay Integration Code

**File:** `backend/src/wechat/wechat.service.ts`

**Key Methods:**

#### 1. createJsapiOrder()

```typescript
async createJsapiOrder(order: PaymentOrder): Promise<PaymentResult> {
  // 1. Prepare parameters
  const params = {
    appid: this.config.appId,
    mchid: this.config.mchId,
    description: order.description,
    out_trade_no: order.orderId,
    notify_url: this.config.notifyUrl,
    amount: {
      total: Math.round(order.amount * 100), // Convert to cents
      currency: 'CNY',
    },
    payer: {
      openid: order.openid,
    },
  }

  // 2. Call WeChat Pay API
  const response = await axios.post(
    'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi',
    params
  )

  // 3. Generate JSAPI parameters for Mini Program
  const prepayId = response.data.prepay_id
  const jsapiParams = this.generateJsapiParams(prepayId)

  return { prepayId, jsapiParams }
}
```

#### 2. generateJsapiParams()

```typescript
private generateJsapiParams(prepayId: string) {
  const timeStamp = Math.floor(Date.now() / 1000).toString()
  const nonceStr = this.generateNonceStr()
  const packageStr = `prepay_id=${prepayId}`

  // Sign the parameters
  const message = `${this.config.appId}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`
  const paySign = this.signV3(message, this.config.apiV3Key)

  return {
    timeStamp,
    nonceStr,
    package: packageStr,
    signType: 'RSA',
    paySign,
  }
}
```

#### 3. handlePaymentCallback()

```typescript
async handlePaymentCallback(body: any) {
  // 1. Decrypt callback data
  const decrypted = this.decryptCallback(body.resource)

  // 2. Extract payment info
  const { out_trade_no, transaction_id } = decrypted

  // 3. Update order status
  await this.ordersService.updatePaymentStatus(
    out_trade_no,
    'paid',
    transaction_id
  )

  // 4. Grant product access
  const order = await this.ordersService.findOne(out_trade_no)
  for (const item of order.items) {
    await this.grantProductAccess(order.userId, item.productId)
  }

  return { code: 'SUCCESS', message: '成功' }
}
```

### Mini Program Payment Integration

**File:** `src/core/ActionDispatcher.ts`

```typescript
case 'purchase':
  // 1. Create order in backend
  const order = await api.post('/orders', {
    userId: store.getState().user.id,
    items: [{ productId: payload.productId, quantity: 1 }],
    total: payload.price,
  })

  // 2. Create WeChat Pay order
  const payment = await api.post('/wechat/pay/create', {
    orderId: order.data.id,
    amount: payload.price,
    description: payload.title,
    openid: store.getState().user.wechat.openid,
  })

  // 3. Call WeChat Pay in Mini Program
  Taro.requestPayment({
    ...payment.data.jsapiParams,
    success: () => {
      Taro.showToast({ title: 'Payment successful!', icon: 'success' })
    },
    fail: () => {
      Taro.showToast({ title: 'Payment failed', icon: 'error' })
    }
  })
  break
```

---

## Database Schema

### MongoDB Collections

#### 1. products

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  type: 'digital' | 'service' | 'physical',
  deliveryMethod: 'download' | 'unlock' | 'ship',
  author: String,
  category: String,
  cover: String,
  preview: String,
  fullContent: String,
  downloadUrl: String,
  tags: [String],
  rating: Number,
  reviewCount: Number,
  purchaseCount: Number,
  viewCount: Number,
  inventory: Number,
  sku: String,
  status: 'draft' | 'published' | 'archived',
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. orders

```javascript
{
  _id: ObjectId,
  userId: String,
  items: [{
    productId: String,
    title: String,
    price: Number,
    quantity: Number
  }],
  subtotal: Number,
  discount: Number,
  total: Number,
  payment: {
    method: 'wechat',
    status: 'pending' | 'paid' | 'failed' | 'refunded',
    transactionId: String,
    paidAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. users

```javascript
{
  _id: ObjectId,
  wechat: {
    openid: String,
    unionid: String,
    nickname: String,
    avatar: String
  },
  profile: {
    name: String,
    phone: String,
    email: String
  },
  role: 'customer' | 'store_owner' | 'admin',
  purchases: [{
    productId: String,
    orderId: String,
    purchasedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. stores

```javascript
{
  _id: ObjectId,
  name: String,
  subdomain: String,
  owner: ObjectId,
  wechat: {
    appId: String,
    appSecret: String,
    mchId: String,
    apiV3Key: String,
    certPath: String
  },
  branding: {
    primaryColor: String,
    secondaryColor: String,
    logo: String,
    appName: String
  },
  settings: {
    currency: String,
    locale: String,
    features: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+
- WeChat Developer Account
- WeChat Pay Merchant Account

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/velcranar/taro-whitelabel-framework.git
cd taro-whitelabel-framework
```

#### 2. Install Dependencies

```bash
# Mini Program
cd ../..
npm install

# Admin Panel
cd admin
npm install

# Backend
cd ../backend
npm install
```

#### 3. Configure Environment

**Backend (.env):**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
```

**Admin Panel (.env):**
```bash
cp admin/.env.example admin/.env
# Edit admin/.env with your API URL
```

#### 4. Start MongoDB

```bash
mongod --dbpath /path/to/mongodb/data
```

#### 5. Start Backend

```bash
cd backend
npm run start:dev
```

#### 6. Start Admin Panel

```bash
cd admin
npm run dev
```

#### 7. Start Mini Program

```bash
cd ../..
npm run dev:weapp
```

### Testing

#### Mini Program

1. Open WeChat Developer Tools
2. Import project from `dist/` directory
3. Test all features

#### Admin Panel

1. Open http://localhost:3001
2. Login with admin/REMOVED_DEFAULT_PASSWORD
3. Create products, manage orders

#### Backend

```bash
cd backend
npm run test
```

---

## Deployment

### Backend Deployment (Aliyun ECS)

#### 1. Set up Server

```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install MongoDB
sudo yum install -y mongodb-org
sudo systemctl start mongod

# Install PM2
sudo npm install -g pm2
```

#### 2. Deploy Backend

```bash
# Clone repository
git clone https://github.com/velcranar/taro-whitelabel-framework.git
cd taro-whitelabel-framework/backend

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env

# Build
npm run build

# Start with PM2
pm2 start dist/main.js --name "whitelabel-api"
pm2 save
pm2 startup
```

#### 3. Configure Nginx

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. Configure SSL

```bash
sudo certbot --nginx -d api.yourdomain.com
```

### Admin Panel Deployment

#### 1. Build

```bash
cd admin
npm run build
```

#### 2. Deploy to Aliyun OSS

```bash
# Install ossutil
wget http://gosspublic.alicdn.com/ossutil/1.7.0/ossutil-v1.7.0-linux-amd64.zip
unzip ossutil-v1.7.0-linux-amd64.zip

# Configure
./ossutil config -e oss-cn-hangzhou.aliyuncs.com -i your-access-key-id -k your-access-key-secret

# Upload
./ossutil cp -r dist/ oss://your-bucket-name/admin/ --update
```

### Mini Program Deployment

#### 1. Build for Production

```bash
npm run build:weapp
```

#### 2. Upload to WeChat

1. Open WeChat Developer Tools
2. Import project from `dist/` directory
3. Click "Upload" button
4. Fill in version number and notes
5. Submit for review

#### 3. Submit for Review

1. Log in to WeChat Mini Program admin panel
2. Go to "Version Management"
3. Select uploaded version
4. Submit for review
5. Wait for approval (usually 1-3 days)

---

## Summary

### What You Have Now

✅ **Mini Program (Taro)**
- Configuration-driven UI
- Unified product architecture
- WeChat Pay integration
- Cart and checkout flow
- User authentication

✅ **Admin Panel (React)**
- Product management
- Order management
- Customer management
- WeChat configuration
- Dashboard analytics

✅ **Backend API (NestJS)**
- RESTful API
- JWT authentication
- WeChat Pay integration
- MongoDB integration
- Payment webhooks

✅ **Database (MongoDB)**
- Products schema
- Orders schema
- Users schema
- Stores schema

### Next Steps

1. **Test Everything**
   - Test payment flow
   - Test product creation
   - Test order management

2. **Customize Branding**
   - Update colors in admin panel
   - Add your logo
   - Configure WeChat settings

3. **Deploy to Production**
   - Set up Aliyun ECS
   - Configure MongoDB Atlas
   - Deploy backend and admin

4. **Submit Mini Program**
   - Upload to WeChat
   - Submit for review
   - Launch!

---

## Support

**Repository:** https://github.com/velcranar/taro-whitelabel-framework

**Documentation:**
- [ADMIN_ARCHITECTURE.md](./ADMIN_ARCHITECTURE.md)
- [README.md](./README.md)

**Issues:**
https://github.com/velcranar/taro-whitelabel-framework/issues

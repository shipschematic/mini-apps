# WeChat Cloud Development Setup Guide

## 🎯 Overview

This guide shows you how to use WeChat Cloud Development (云开发) instead of a traditional backend server.

**Benefits:**
- ✅ No server needed
- ✅ Built-in database (MongoDB-like)
- ✅ Built-in file storage (5GB free)
- ✅ Built-in cloud functions
- ✅ Automatic authentication
- ✅ FREE tier available

---

## 📦 What WeChat Cloud Development Provides

### 1. **Cloud Database**
- NoSQL database (like MongoDB)
- Real-time sync
- Automatic indexing
- Security rules

### 2. **Cloud Storage**
- File storage (images, videos, etc.)
- Built-in CDN
- Automatic scaling
- 5GB free tier

### 3. **Cloud Functions**
- Serverless functions
- Node.js runtime
- HTTP triggers
- Scheduled tasks

---

## 🚀 Setup Instructions

### Step 1: Enable Cloud Development in WeChat Developer Tools

1. Open your project in **WeChat Developer Tools**
2. Click the **"云开发"** (Cloud Development) button in the toolbar
3. Click **"开通"** (Enable)
4. Choose **"免费额度"** (Free Tier)
5. Create a new environment (e.g., `taro-whitelabel`)
6. Wait for initialization (takes ~1 minute)

### Step 2: Get Your Environment ID

1. In Cloud Development console
2. Click **"设置"** (Settings)
3. Copy your **"环境ID"** (Environment ID)
4. Update `cloudbaserc.json`:

```json
{
  "envId": "your-actual-env-id-here",
  ...
}
```

### Step 3: Create Database Collections

In Cloud Development console, create these collections:

1. **products** - Store all products
2. **orders** - Store orders
3. **users** - Store user profiles

### Step 4: Upload Cloud Functions

1. Right-click `cloudfunctions` folder in WeChat Developer Tools
2. Select **"上传并部署：云端安装依赖"** (Upload and deploy: install dependencies in cloud)
3. Wait for deployment to complete

---

## 💾 Database Schema

### Products Collection

```javascript
{
  _id: "auto-generated",
  title: "Product Title",
  description: "Product description",
  price: 99.99,
  type: "digital", // or "service" or "physical"
  deliveryMethod: "download", // or "unlock" or "ship"
  
  // Content
  preview: "Preview content shown before purchase",
  fullContent: "Full content shown after purchase",
  downloadUrl: "cloud://xxx", // Cloud file ID
  
  // Media
  cover: "cloud://xxx", // Cloud file ID for cover image
  
  // Metadata
  author: "Author Name",
  category: "Programming",
  tags: ["javascript", "programming"],
  
  // Stats
  rating: 4.8,
  reviewCount: 100,
  purchaseCount: 500,
  viewCount: 1000,
  
  // Status
  status: "published", // or "draft" or "archived"
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection

```javascript
{
  _id: "auto-generated",
  userId: "user-openid",
  
  // Items
  items: [{
    productId: "product-id",
    title: "Product Title",
    price: 99.99,
    quantity: 1
  }],
  
  // Totals
  subtotal: 99.99,
  discount: 0,
  total: 99.99,
  
  // Payment
  payment: {
    method: "wechat",
    status: "paid", // or "pending" or "failed" or "refunded"
    transactionId: "wechat-transaction-id",
    paidAt: Date
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection

```javascript
{
  _id: "auto-generated",
  openid: "user-openid",
  
  // WeChat Info
  wechat: {
    nickname: "User Nickname",
    avatar: "https://...",
    openid: "user-openid"
  },
  
  // Profile
  profile: {
    name: "User Name",
    phone: "+1234567890",
    email: "user@example.com"
  },
  
  // Purchases
  purchases: [{
    productId: "product-id",
    orderId: "order-id",
    purchasedAt: Date
  }],
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Cloud Functions

### 1. getProducts

**Purpose:** Fetch products from database

**Usage:**
```javascript
// In your Taro app
const res = await Taro.cloud.callFunction({
  name: 'getProducts',
  data: {
    status: 'published',
    type: 'digital', // optional
    category: 'Programming' // optional
  }
})

console.log(res.result.data) // Array of products
```

**File:** `cloudfunctions/getProducts/index.js`

### 2. createOrder (Coming Next)

**Purpose:** Create a new order

**Usage:**
```javascript
const res = await Taro.cloud.callFunction({
  name: 'createOrder',
  data: {
    items: [{ productId: 'xxx', quantity: 1 }],
    total: 99.99
  }
})
```

### 3. getUserPurchases (Coming Next)

**Purpose:** Get user's purchased products

**Usage:**
```javascript
const res = await Taro.cloud.callFunction({
  name: 'getUserPurchases',
  data: {}
})

console.log(res.result.data) // Array of purchased products
```

---

## 📤 File Upload

### Upload Product Images

```javascript
// 1. Choose image
const res = await Taro.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['album', 'camera']
})

// 2. Upload to cloud storage
const uploadRes = await Taro.cloud.uploadFile({
  cloudPath: `products/${Date.now()}_${res.tempFiles[0].path.split('/').pop()}`,
  filePath: res.tempFiles[0].path
})

console.log('File ID:', uploadRes.fileID)
// Save this fileID to database

// 3. Display image
<Image src={uploadRes.fileID} />
```

### Upload Digital Products (Files)

```javascript
// For digital products like eBooks, PDFs, etc.
const res = await Taro.chooseMessageFile({
  count: 1,
  type: 'file'
})

const uploadRes = await Taro.cloud.uploadFile({
  cloudPath: `digital-products/${Date.now()}_${res.tempFiles[0].name}`,
  filePath: res.tempFiles[0].path
})

// Save uploadRes.fileID as downloadUrl in product
```

---

## 🎨 Admin Panel Integration

Since you're using WeChat Cloud Development, the admin panel will also use cloud functions instead of a backend API.

### Update Admin Panel to Use Cloud Functions

**File:** `admin/src/services/cloud.ts`

```typescript
// We'll create this to call cloud functions from admin panel
export const cloudService = {
  async getProducts(filters?: any) {
    // Call cloud function
    const res = await fetch('https://your-env-id.service.tcloudbase.com/getProducts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    })
    return res.json()
  },
  
  async createProduct(product: any) {
    // Call cloud function
    const res = await fetch('https://your-env-id.service.tcloudbase.com/createProduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    return res.json()
  }
}
```

---

## 💰 WeChat Pay Integration

WeChat Pay works seamlessly with Cloud Development:

### Payment Flow

```javascript
// 1. Create order in cloud function
const orderRes = await Taro.cloud.callFunction({
  name: 'createOrder',
  data: { items, total }
})

// 2. Get payment parameters from cloud function
const paymentRes = await Taro.cloud.callFunction({
  name: 'getPaymentParams',
  data: { orderId: orderRes.result.orderId }
})

// 3. Call WeChat Pay
await Taro.requestPayment({
  ...paymentRes.result,
  success: () => {
    // Payment successful
    Taro.showToast({ title: '支付成功', icon: 'success' })
  }
})
```

---

## 🔒 Security Rules

Set up database security rules in Cloud Development console:

### products collection

```json
{
  "read": true,
  "write": "auth.openid == 'admin-openid'"
}
```

### orders collection

```json
{
  "read": "auth.openid == doc.userId",
  "write": "auth.openid == doc.userId"
}
```

### users collection

```json
{
  "read": "auth.openid == doc._id",
  "write": "auth.openid == doc._id"
}
```

---

## 📊 Free Tier Limits

| Resource | Free Tier |
|----------|-----------|
| Database | 2GB |
| Storage | 5GB |
| Cloud Functions | 40,000 invocations/day |
| Bandwidth | 5GB/month |

**For most small stores, this is more than enough!**

---

## 🚀 Next Steps

1. ✅ Enable Cloud Development in WeChat Developer Tools
2. ✅ Create database collections
3. ✅ Upload cloud functions
4. ⏳ Create remaining cloud functions (createOrder, getUserPurchases, etc.)
5. ⏳ Update Mini Program to use cloud functions
6. ⏳ Update admin panel to use cloud functions
7. ⏳ Test payment flow

---

## 🆚 Comparison: Backend vs Cloud Development

| Feature | Traditional Backend | WeChat Cloud Development |
|---------|-------------------|-------------------------|
| Server Cost | $40+/month | **FREE** |
| Database | MongoDB Atlas ($57/month) | **FREE** (2GB) |
| Storage | Aliyun OSS ($15/month) | **FREE** (5GB) |
| CDN | Aliyun CDN ($20/month) | **FREE** |
| Authentication | Custom JWT | **Built-in** |
| Deployment | Manual | **One-click** |
| Scaling | Manual | **Automatic** |
| Maintenance | Required | **None** |

**Total Savings: $132+/month!**

---

## 📝 Summary

**You're making the RIGHT choice using WeChat Cloud Development!**

- ✅ No server to maintain
- ✅ No deployment headaches
- ✅ Built-in authentication
- ✅ Built-in database
- ✅ Built-in storage
- ✅ Built-in CDN
- ✅ FREE tier available
- ✅ Perfect for WeChat Mini Programs

**Let me know when you've enabled Cloud Development, and I'll help you create the remaining cloud functions!**

# Admin Panel Guide

## 🎯 Overview

The admin panel is a React web application that allows you to manage your WeChat Mini Program store. It connects to WeChat Cloud Development to manage products, orders, and customers.

---

## 📁 Location

**Admin Panel Folder:** `d:\Liberary\Taro\admin\`

---

## 🚀 How to Run the Admin Panel

### Step 1: Install Dependencies (Already Done)

```bash
cd d:\Liberary\Taro\admin
npm install
```

### Step 2: Configure Cloud Environment

1. Open `admin/.env` file
2. Replace `your-env-id` with your actual WeChat Cloud Environment ID:

```env
VITE_CLOUD_ENV_ID=your-actual-env-id-here
```

**Where to find your Environment ID:**
1. Open WeChat Developer Tools
2. Click "云开发" (Cloud Development)
3. Click "设置" (Settings)
4. Copy "环境ID" (Environment ID)

### Step 3: Start the Admin Panel

```bash
cd d:\Liberary\Taro\admin
npm run dev
```

The admin panel will open at: **http://localhost:3001**

---

## 🔐 Login

**Default Credentials:**
- Username: `admin`
- Password: `REMOVED_DEFAULT_PASSWORD`

---

## 📦 Features

### 1. **Dashboard**
- View sales statistics
- Recent orders
- Top products
- Revenue overview

### 2. **Products Management**
- ✅ **View all products** - See all products in your store
- ✅ **Add new products** - Create digital products, services, or physical items
- ✅ **Edit products** - Update product details, price, content
- ✅ **Delete products** - Remove products from store
- ✅ **Filter products** - By status, type, category
- ✅ **Search products** - Find products by title

### 3. **Product Editor**
When adding/editing a product, you can set:

**Basic Information:**
- Product title
- Description
- Author/Creator
- Category

**Product Type & Pricing:**
- **Digital Product** (📦) - Downloadable files (eBooks, templates, etc.)
- **Service** (⚡) - Unlock access (prompts, courses, etc.)
- **Physical Product** (🚚) - Shipping required
- Delivery method
- Price

**Content:**
- Preview content (shown before purchase)
- Full content (shown after purchase)
- Download URL (for digital products)

**Media:**
- Cover image upload

**Status:**
- Draft - Not visible to customers
- Published - Visible to customers
- Archived - Hidden from store

### 4. **Orders Management**
- View all orders
- Filter by payment status
- Update order status
- View order details

### 5. **Customers**
- View customer list
- Customer purchase history
- Customer details

### 6. **Settings**
- Store configuration
- Payment settings
- WeChat integration

---

## 🔧 How It Works

### Architecture

```
Admin Panel (React)
    ↓
Cloud Functions (HTTP Triggers)
    ↓
WeChat Cloud Database
```

### Cloud Functions Used

| Function | Purpose |
|----------|---------|
| `getProducts` | Fetch products from database |
| `createProduct` | Create new product |
| `updateProduct` | Update existing product |
| `deleteProduct` | Delete product |
| `getOrders` | Fetch orders |
| `updateOrderStatus` | Update order payment status |

---

## 📤 Uploading Product Images

### Method 1: Upload via Admin Panel

1. Go to **Products** → **Add Product**
2. Scroll to **Media** section
3. Click **Upload** button
4. Select image file
5. Fill in other product details
6. Click **Create Product**

The image will be automatically uploaded to WeChat Cloud Storage.

### Method 2: Use Cloud File ID Directly

If you already uploaded an image to cloud storage:

1. Get the file ID (e.g., `cloud://xxx/yyy.jpg`)
2. Go to **Products** → **Add Product**
3. In the **Cover Image** field, paste the file ID
4. Fill in other details
5. Click **Create Product**

---

## 🗄️ Database Structure

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

---

## 🎨 Product Types

### 1. Digital Product (📦)
- **Delivery:** Download
- **Use Case:** eBooks, templates, software, courses
- **After Purchase:** Customer gets download link

### 2. Service (⚡)
- **Delivery:** Unlock
- **Use Case:** Prompts, consultations, courses
- **After Purchase:** Customer gets access to content

### 3. Physical Product (🚚)
- **Delivery:** Ship
- **Use Case:** Books, merchandise, physical items
- **After Purchase:** Customer provides shipping address

---

## 🔄 Workflow

### Adding a New Product

1. **Login** to admin panel
2. Go to **Products** → **Add Product**
3. Fill in basic information (title, description, author, category)
4. Select product type and delivery method
5. Set price
6. Add preview content (what customers see before purchase)
7. Add full content (what customers see after purchase)
8. Upload cover image
9. Set status to **Published**
10. Click **Create Product**

### Editing a Product

1. Go to **Products**
2. Find the product you want to edit
3. Click **Edit**
4. Make changes
5. Click **Update Product**

### Deleting a Product

1. Go to **Products**
2. Find the product you want to delete
3. Click **Delete**
4. Confirm deletion

---

## ⚠️ Important Notes

### 1. Cloud Environment ID
**You MUST update the `.env` file with your actual cloud environment ID**, otherwise the admin panel won't be able to connect to your cloud database.

### 2. Upload Cloud Functions
Before using the admin panel, make sure you've uploaded all cloud functions to WeChat Cloud:

1. Open WeChat Developer Tools
2. Right-click `cloudfunctions` folder
3. Select "上传并部署：云端安装依赖"
4. Wait for deployment to complete

### 3. Database Collections
Make sure you've created these collections in WeChat Cloud:
- `products`
- `orders`
- `users`

### 4. Security Rules
Set up proper security rules in WeChat Cloud console to protect your data.

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch products"
**Solution:**
1. Check if cloud functions are deployed
2. Check if `.env` file has correct environment ID
3. Check if `products` collection exists in database

### Issue: "Failed to upload image"
**Solution:**
1. Check if cloud storage is enabled
2. Check file size (max 10MB)
3. Check file type (images only)

### Issue: "Cannot connect to cloud"
**Solution:**
1. Check internet connection
2. Verify environment ID in `.env`
3. Check if cloud development is enabled in WeChat Developer Tools

---

## 📊 Admin Panel vs Mini Program

| Feature | Admin Panel | Mini Program |
|---------|-------------|--------------|
| Purpose | Manage store | Customer shopping |
| Access | Admin only | All users |
| Products | Create/Edit/Delete | View/Purchase |
| Orders | View all orders | View own orders |
| Customers | View all customers | View own profile |
| Settings | Configure store | View store info |

---

## 🚀 Next Steps

1. ✅ **Enable Cloud Development** in WeChat Developer Tools
2. ✅ **Update `.env` file** with your environment ID
3. ✅ **Upload cloud functions** to WeChat Cloud
4. ✅ **Create database collections** (products, orders, users)
5. ✅ **Start admin panel** with `npm run dev`
6. ✅ **Add your first product** through the admin panel
7. ✅ **Test in Mini Program** to see the product

---

## 📝 Summary

**The admin panel is your store management center!**

✅ **Location:** `d:\Liberary\Taro\admin\`
✅ **Run:** `npm run dev` (opens at http://localhost:3001)
✅ **Login:** admin / REMOVED_DEFAULT_PASSWORD
✅ **Features:** Products, Orders, Customers, Settings
✅ **Backend:** WeChat Cloud Development (no server needed!)

**You can now:**
- Add products
- Edit products
- Delete products
- Manage orders
- View customers
- Configure store settings

All data is stored in WeChat Cloud Database, and the Mini Program will automatically display the products you add through the admin panel! 🎉

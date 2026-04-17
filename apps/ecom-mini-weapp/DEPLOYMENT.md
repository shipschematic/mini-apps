# Deployment Guide - E-com-mini

## Prerequisites

- [WeChat Developer Account](https://mp.weixin.qq.com/) (Mini Program)
- [WeChat Pay Merchant Account](https://pay.weixin.qq.com/) (for real payments)
- [WeChat DevTools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

---

## Step 1: WeChat Mini Program Setup

1. Log in to [WeChat MP Platform](https://mp.weixin.qq.com/)
2. Get your **AppID** from Development -> Development Settings
3. Add the AppID to `project.config.json`:

```json
{
  "appid": "YOUR_APPID_HERE"
}
```

---

## Step 2: Cloud Development Setup

1. Open the project in **WeChat DevTools**
2. Click **云开发** (Cloud Development) button
3. Create a new cloud environment (or use existing)
4. Note your **Environment ID** (envId)

### Create Database Collections

In cloud console -> Database, create these collections:

| Collection | Description |
|-----------|-------------|
| `products` | Product catalog |
| `orders` | Customer orders |
| `payments` | Payment records |
| `config` | Store configuration (create doc with `_id: "store"`) |

### Initialize Config Document

Create a document in `config` collection:

```json
{
  "_id": "store",
  "appName": "My Store",
  "primaryColor": "#2A4B7C",
  "currency": "¥",
  "adminOpenids": [],
  "payment": {
    "enabled": false,
    "mchId": "",
    "bodyPrefix": ""
  }
}
```

---

## Step 3: Deploy Cloud Functions

In WeChat DevTools:

1. Right-click each folder under `cloudfunctions/`
2. Select **上传并部署：云端安装依赖** (Upload and deploy: install dependencies on cloud)

Cloud functions to deploy:

| Function | Purpose |
|----------|---------|
| `checkAdminAccess` | Verify admin access by OpenID |
| `createOrder` | Create order in database |
| `createPayment` | Create WeChat Pay unified order |
| `paymentCallback` | Handle payment result callback |
| `getProducts` | Query products |
| `getUserPurchases` | Get user's purchases |
| `getOrders` | Get orders (admin) |
| `createProduct` | Create product (admin) |
| `updateProduct` | Update product (admin) |
| `deleteProduct` | Delete product (admin) |
| `updateOrderStatus` | Update order status (admin) |

---

## Step 4: WeChat Pay Configuration

### 4.1 Apply for WeChat Pay Merchant Account

1. Go to [WeChat Pay](https://pay.weixin.qq.com/)
2. Apply for a merchant account
3. Complete business verification
4. Get your **Merchant ID (mchId)**

### 4.2 Configure Cloud Pay

1. In cloud console -> **设置** -> **全局设置**
2. Find **微信支付配置** section
3. Add your **Merchant ID**
4. Complete the authorization:
   - Super admin confirms in **微信支付商家助手** mini program
   - Authorize JSAPI and refund permissions in merchant platform

### 4.3 Enable Payment in Admin Panel

1. Open the mini program
2. Navigate to Admin -> Settings (see Step 5 for admin access)
3. In "WeChat Pay" section:
   - Toggle "Enable Real Payment" to ON
   - Enter your Merchant ID
   - Optionally set a payment description prefix
4. Click "Save Settings"

> **Without merchant account**: Leave payment disabled. The app will use simulated payments (demo mode).

---

## Step 5: Admin Access Setup

### First-Time Admin Setup

Since you don't have admin access initially, you need to set it up manually:

1. Get your OpenID by deploying the `getUserInfo` cloud function
2. Add your OpenID to the `config` collection in cloud database:
   ```json
   {
     "_id": "store",
     "adminOpenids": ["YOUR_OPENID_HERE"]
   }
   ```
3. Alternatively, add OpenIDs via Admin -> Settings -> Admin Access

### How Admin Access Works

- Admin access is verified by checking the user's OpenID against `adminOpenids` list
- The OpenID is obtained securely from cloud context (cannot be spoofed)
- Only users in the admin list can access the admin panel
- In development mode (`NODE_ENV=development`), admin access is always allowed

---

## Step 6: Build & Deploy

### Build the Mini Program

```bash
# Using the batch file
build.bat

# Or manually
npm run build:weapp
```

### Upload to WeChat

1. Open the `dist` folder in WeChat DevTools
2. Click **上传** (Upload) button
3. Fill in version number and notes
4. Submit for review in [WeChat MP Platform](https://mp.weixin.qq.com/)

---

## Architecture Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│ Cloud Funcs  │────▶│  WeChat Pay  │
│   (Taro 4)   │     │ (wx-server)  │     │   (Cloud)    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                     │                     │
       │                     ▼                     ▼
       │             ┌──────────────┐     ┌──────────────┐
       │             │  Cloud DB    │     │  Payment     │
       │             │  (NoSQL)     │     │  Callback    │
       │             └──────────────┘     └──────────────┘
       │                     ▲                     │
       │                     │                     ▼
       ▼                     │             ┌──────────────┐
┌──────────────┐             │             │  Update      │
│  Redux Store │◀────────────┘             │  Order/      │
│  (State Mgmt)│                           │  Product     │
└──────────────┘                           └──────────────┘
```

### Payment Flow

```
1. User clicks "Purchase"
       │
2. ActionDispatcher → paymentService.quickPurchase()
       │
3. createOrder cloud function → Order saved in DB
       │
4. createPayment cloud function → cloud.pay.unifiedOrder()
       │
5. Returns payment params → Taro.requestPayment()
       │
6. User pays in WeChat Pay UI
       │
7. paymentCallback cloud function ← WeChat Pay notification
       │
8. Update order status, increment purchase count
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TARO_ENV` | Target platform | `weapp` |
| `NODE_ENV` | Environment | `production` |

---

## Security Checklist

- [x] Admin access verified by OpenID (not client-side)
- [x] Payment signing handled by cloud (no certificate exposure)
- [x] Payment callback validated by WeChat
- [x] No sensitive keys in frontend code
- [x] Cloud functions use `cloud.getWXContext()` for auth
- [ ] Admin OpenIDs properly configured in cloud DB
- [ ] WeChat Pay merchant account verified and bound
- [ ] Cloud function permissions properly scoped

---

## Troubleshooting

### "Cloud not available" errors
- Ensure cloud development is enabled in DevTools
- Check cloud environment ID is correct
- Verify cloud functions are deployed

### "Payment not available" errors
- Check cloud pay is configured in console settings
- Verify merchant ID is correct
- Ensure merchant authorization is complete

### Admin access denied
- Add your OpenID to `config.store.adminOpenids` in cloud DB
- Or use Admin Settings page to add OpenIDs

### Build errors
- Run `npm install` first
- Clear `dist` folder and rebuild
- Check `project.config.json` has correct AppID

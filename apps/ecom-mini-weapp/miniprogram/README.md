# Template WeApp - Digital Product Store

A Taro-based WeChat mini program template for selling digital products.

## Features

- 🛒 **Product Catalog** - Browse digital products with category filtering and search
- 🛍️ **Shopping Cart** - Add products, adjust quantities, checkout
- 📦 **Orders** - View order history and payment status
- 📚 **Library** - Access and download purchased digital products
- 👤 **Profile** - User authentication and admin access

## Tech Stack

- **Framework:** Taro 3.x
- **State Management:** Redux
- **Cloud:** WeChat Cloud Development (TCB)
- **Payment:** WeChat Pay (Cloud)

## Cloud Environment

- **Environment ID:** `cloud1-d4gc2e7w9638ce590`

## Cloud Functions

| Function | Purpose |
|----------|---------|
| `login` | Silent user authentication |
| `createOrder` | Create order record |
| `createPayment` | Initiate WeChat Pay payment |
| `paymentCallback` | Handle payment result callback |
| `getOrders` | Get user's order history |
| `getUserPurchases` | Get user's purchased products |
| `getUser` | Get/update user info |

## Database Collections

| Collection | Purpose |
|------------|---------|
| `orders` | Order and payment records |
| `userInfo` | User profile and admin info |

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd miniprogram
   npm install
   ```
3. Configure cloud environment in `cloudbaserc.json`
4. Build and test in WeChat DevTools

## Project Structure

```
miniprogram/
├── cloudfunctions/     # Cloud functions (deployed to TCB)
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API and cloud services
│   ├── store/          # Redux store and slices
│   └── utils/          # Utility functions
├── cloudbaserc.json    # Cloud environment config
└── project.config.json # WeChat project config
```

## Admin Access

Add admin openid to `cloudbaserc.json` to access admin panel.

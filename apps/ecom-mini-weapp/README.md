# E-com Mini App

A WeChat Mini App for e-commerce, built with Taro.

## Features
- Product browsing and purchase
- Digital library access
- User profile and order management
- WeChat Pay integration

## Tech Stack
- Taro 3.x
- React
- TypeScript
- WeChat Cloud Development (CloudBase)

## Getting Started

### Prerequisites
- Node.js 16+
- WeChat DevTools
- CloudBase CLI (`npm install -g @cloudbase/cli`)

### Installation
1. Clone the repo
2. Install dependencies: `npm install`
3. Configure CloudBase environment in `cloudbaserc.json`
4. Deploy cloud functions: `tcb fn deploy --all`
5. Open in WeChat DevTools and run

## Cloud Functions
All cloud functions use the `ecom_` prefix:
- `ecom_login` - User login
- `ecom_getUser` - Get user info
- `ecom_createOrder` - Create order
- `ecom_createPayment` - Create payment
- `ecom_paymentCallback` - Payment callback
- `ecom_updateOrderStatus` - Update order status
- `ecom_getOrders` - Get orders
- `ecom_getUserPurchases` - Get user purchases

## License
MIT

# Xingqiba Orchard WeChat Mini App

A WeChat Mini App for Xingqiba Orchard, built with Taro.

## Features
- Product browsing and purchase
- Reservation services
- User profile and order management
- Admin panel for product and order management
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
All cloud functions use the `xingqiba_` prefix:
- `xingqiba_login` - User login
- `xingqiba_getUser` - Get user info
- `xingqiba_createOrder` - Create order
- `xingqiba_createPayment` - Create payment
- `xingqiba_paymentCallback` - Payment callback
- `xingqiba_updateOrderStatus` - Update order status
- `xingqiba_getOrders` - Get orders
- `xingqiba_getUserPurchases` - Get user purchases

## License
MIT

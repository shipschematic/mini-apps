# 星期八果园 (Xingqiba Orchard) — WeChat Mini Program

[![GitHub](https://img.shields.io/badge/GitHub-shipblueprint%2Forchard--weapp-blue)](https://github.com/shipblueprint/orchard-weapp)

A **WeChat Mini Program (微信小程序)** for **星期八果园** (Xingqiba Orchard), built with **Taro 4.x** + **React** + **TypeScript** + **WeChat CloudBase (Cloud Functions & Database)**.

Enables customers to browse orchard products, make reservations, place orders, and pay via WeChat Pay. Includes a full admin panel for product and order management.

---

## Features

### 🛍️ Customer Features
- **Home Page** — Featured products, store info, and service navigation
- **Product Catalog** — Browse orchard products with details and pricing
- **Product Detail** — In-depth product info, images, and purchase options
- **Reservation System** — Book orchard visits and services
- **Shopping Cart & Orders** — Place orders and track status
- **WeChat Pay Integration** — Secure payment via WeChat Pay
- **User Profile** — View order history, manage personal info
- **Service Center** — Access to check-in, reviews, comments, likes, notes, and order reviews

### 🔧 Admin Features
- **Admin Login** — Secure authentication for administrators
- **Product Management** — Add, edit, and manage products
- **Order Management** — View and update order statuses
- **Dashboard** — (via admin panel)

### ☁️ Cloud Backend
- **CloudBase (Tencent)** — Serverless cloud environment
- **8 Cloud Functions** — Login, user management, orders, payments
- **4 Database Collections** — Products, admins, stores, orders

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Taro 4.2.0 |
| **View Layer** | React 18 + TypeScript |
| **State Management** | Zustand 4.5 |
| **Styling** | Sass (SCSS) |
| **Backend** | WeChat CloudBase (Cloud Functions) |
| **Database** | Tencent CloudBase (MongoDB-compatible) |
| **Payment** | WeChat Pay |
| **Build** | Webpack 5 + SWC |
| **Testing** | Jest + ts-jest |

---

## Project Structure

```
xingqiba-orchard/
├── miniprogram/                    # Taro mini-program app
│   ├── src/
│   │   ├── App.tsx                 # App entry point
│   │   ├── app.config.ts           # Taro app config (pages, windows, etc.)
│   │   ├── api/                    # API layer
│   │   │   ├── request.ts          # HTTP request wrapper
│   │   │   ├── authApi.ts          # Authentication endpoints
│   │   │   ├── productApi.ts       # Product endpoints
│   │   │   ├── orderApi.ts         # Order endpoints
│   │   │   ├── paymentApi.ts       # Payment endpoints
│   │   │   ├── reservationApi.ts   # Reservation endpoints
│   │   │   ├── storeApi.ts         # Store endpoints
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── business/           # Business-specific components
│   │   │   │   ├── BottomActionBar/
│   │   │   │   ├── CountDownTimer/
│   │   │   │   ├── OrderCard/
│   │   │   │   ├── OrderStatusTabs/
│   │   │   │   ├── OrderTypeToggle/
│   │   │   │   ├── ProductCard/
│   │   │   │   ├── ProductList/
│   │   │   │   ├── ServiceGrid/
│   │   │   │   ├── StoreSelector/
│   │   │   │   └── index.ts
│   │   │   └── common/             # Shared UI components
│   │   │       ├── CountBadge/
│   │   │       ├── Divider/
│   │   │       ├── EmptyState/
│   │   │       ├── ErrorRetry/
│   │   │       ├── Image/
│   │   │       ├── LoadingSpinner/
│   │   │       ├── PriceTag/
│   │   │       ├── Tag/
│   │   │       └── index.ts
│   │   ├── config/                 # App configuration
│   │   ├── constants/              # Constants & i18n
│   │   ├── core/                   # Core framework utilities
│   │   ├── dispatcher/             # Event dispatcher (Flux-like)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── pages/                  # Page views
│   │   │   ├── home/               # Home page
│   │   │   ├── product-detail/     # Product details
│   │   │   ├── orders/             # Order list
│   │   │   ├── reservation/        # Reservation booking
│   │   │   ├── profile/            # User profile
│   │   │   ├── payment-success/    # Payment success
│   │   │   ├── payment-fail/       # Payment failure
│   │   │   ├── services/           # Service center
│   │   │   │   ├── book/           # Service booking
│   │   │   │   ├── checkin/        # Check-in
│   │   │   │   ├── comments/       # Comments
│   │   │   │   ├── likes/          # Likes
│   │   │   │   ├── notes/          # Notes
│   │   │   │   ├── order-review/   # Order review
│   │   │   │   ├── products/       # Service products
│   │   │   │   └── review/         # Reviews
│   │   │   └── admin/              # Admin panel
│   │   │       ├── login/          # Admin login
│   │   │       └── products/       # Product management
│   │   │           └── edit/       # Product editor
│   │   ├── selectors/              # State selectors
│   │   ├── services/               # Service layer
│   │   │   ├── auth/               # WeChat auth
│   │   │   ├── cloud/              # CloudBase integration
│   │   │   ├── location/           # Geolocation
│   │   │   ├── payment/            # WeChat Pay
│   │   │   └── wechat/             # WeChat SDK wrappers
│   │   ├── store/                  # Zustand state management
│   │   │   ├── slices/             # State slices
│   │   │   └── middleware/         # Middleware
│   │   ├── styles/                 # Global styles (SCSS)
│   │   ├── types/                  # TypeScript type definitions
│   │   └── utils/                  # Utilities & helpers
│   ├── config/                     # Taro build config
│   ├── public/                     # Static assets
│   ├── dist/                       # Build output (gitignored)
│   ├── .swc/                       # SWC cache (gitignored)
│   ├── package.json
│   ├── tsconfig.json
│   ├── project.config.json         # WeChat DevTools config
│   ├── babel.config.js
│   ├── jest.config.js
│   └── .eslintrc.js
├── cloudfunctions/                 # CloudBase cloud functions
│   ├── xingqiba_login/             # User login
│   ├── xingqiba_getUser/           # Get user info
│   ├── xingqiba_createOrder/       # Create order
│   ├── xingqiba_createPayment/     # Create payment
│   ├── xingqiba_paymentCallback/   # Payment callback
│   ├── xingqiba_updateOrderStatus/ # Update order status
│   ├── xingqiba_getOrders/         # Get orders
│   └── xingqiba_getUserPurchases/  # Get user purchases
├── cloudbaserc.json                # CloudBase config (env, functions)
├── CLOUDBASE_SETUP_GUIDE.md        # Database setup instructions
├── QUICK_START_GUIDE.md            # Quick start guide
├── fix-git-history.ps1             # Git history fix script
├── fixgit.bat
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **WeChat DevTools** — Download from [WeChat Official](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- **CloudBase CLI** — `npm install -g @cloudbase/cli`
- A **WeChat Mini Program App ID** registered on the [WeChat Platform](https://mp.weixin.qq.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/shipblueprint/orchard-weapp.git
cd orchard-weapp/miniprogram

# Install dependencies
npm install
```

### Configuration

1. **CloudBase Setup**:
   - Edit `cloudbaserc.json` with your CloudBase environment ID
   - Run `tcb login` to authenticate with Tencent Cloud
   - Deploy cloud functions: `tcb fn deploy --all`

2. **Database Setup**:
   - Follow [CLOUDBASE_SETUP_GUIDE.md](./CLOUDBASE_SETUP_GUIDE.md) to create collections:
     - `products` — Product listings
     - `admins` — Administrator accounts
     - `stores` — Store information
     - `orders` — Order records
   - Add sample data (admin account, sample products, stores)

3. **WeChat DevTools**:
   - Open WeChat DevTools
   - Import the `miniprogram/` directory
   - Enter your App ID
   - Enable "Use Cloud Development" in the devtools

### Development

```bash
# Start development with hot reload (WeChat)
npm run dev:weapp

# Or for H5/web
npm run dev:h5

# Lint
npm run lint

# Type check
npm run typecheck

# Run tests
npm test
```

### Build for Production

```bash
# Build WeChat mini program
npm run build:weapp

# Build H5
npm run build:h5
```

---

## Cloud Functions

All functions use the `xingqiba_` prefix and run on Node.js 16.13:

| Function | Purpose |
|----------|---------|
| `xingqiba_login` | User login / authentication |
| `xingqiba_getUser` | Retrieve user profile data |
| `xingqiba_createOrder` | Create a new order |
| `xingqiba_createPayment` | Initiate WeChat Pay payment |
| `xingqiba_paymentCallback` | Handle payment result callback |
| `xingqiba_updateOrderStatus` | Update order status (admin) |
| `xingqiba_getOrders` | Retrieve order list |
| `xingqiba_getUserPurchases` | Get user purchase history |

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/pages/home/index` | Main landing with products, stores, services |
| **Product Detail** | `/pages/product-detail/index` | Detailed product view |
| **Orders** | `/pages/orders/index` | Order history and tracking |
| **Reservation** | `/pages/reservation/index` | Book orchard visits |
| **Profile** | `/pages/profile/index` | User account & settings |
| **Payment Success** | `/pages/payment-success/index` | Post-payment confirmation |
| **Payment Fail** | `/pages/payment-fail/index` | Payment error page |
| **Service Booking** | `/pages/services/book/index` | Book services |
| **Service Check-in** | `/pages/services/checkin/index` | Check-in for services |
| **Comments** | `/pages/services/comments/index` | User comments |
| **Likes** | `/pages/services/likes/index` | User likes |
| **Notes** | `/pages/services/notes/index` | User notes |
| **Order Review** | `/pages/services/order-review/index` | Review orders |
| **Service Products** | `/pages/services/products/index` | Browse service products |
| **Reviews** | `/pages/services/review/index` | Submit reviews |
| **Admin Login** | `/pages/admin/login/index` | Admin authentication |
| **Admin Products** | `/pages/admin/products/index` | Product management |
| **Admin Edit Product** | `/pages/admin/products/edit/index` | Product editor |

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:weapp` | Start dev server for WeChat (watch mode) |
| `npm run build:weapp` | Build for WeChat production |
| `npm run dev:h5` | Start dev server for H5/web |
| `npm run build:h5` | Build for H5/web production |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

---

## Branch Status

The repository has two branches:
- **`main`** (✅ current, most up-to-date) — includes all latest commits
- **`master`** (remote only) — behind by 2 commits

> **Recommendation**: On GitHub, go to Settings → Branches and set `main` as the default branch, then delete `master`.

---

## Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/shipblueprint/orchard-weapp/issues).

---

## License

MIT

---

*Built with [Taro](https://taro-docs.jd.com/) — a cross-platform framework for WeChat Mini Programs.*

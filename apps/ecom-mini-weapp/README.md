# E-Com Mini Program Framework

Taro 4.x whitelabel e-commerce framework for WeChat Mini Programs.

## Architecture

**Unified App**: Single WeChat Mini Program with both customer storefront and admin panel.

```
src/
├── pages/
│   ├── customer-facing/      # Storefront (Home, Detail, Cart, Profile)
│   │   ├── dynamic/          # Home/Browse products
│   │   ├── detail/           # Product detail
│   │   ├── cart/             # Shopping cart
│   │   └── profile/          # User profile
│   │
│   └── admin/                # Admin Panel (hidden)
│       ├── index/            # Admin entry
│       ├── dashboard/        # Stats overview
│       ├── products/         # Product CRUD
│       ├── orders/           # Order management
│       └── settings/         # Store settings
│
├── core/                     # Config-driven rendering engine
│   ├── ActionDispatcher.ts   # Array-based action executor
│   ├── ConfigParser.ts       # JSON config parser
│   └── RenderEngine.tsx      # Dynamic component renderer
│
├── services/
│   ├── cloudService.ts       # Customer cloud functions
│   └── adminService.ts       # Admin cloud functions
│
└── store/                    # Redux state
    ├── cartSlice.ts
    ├── wishlistSlice.ts
    ├── userSlice.ts
    └── storeConfigSlice.ts
```

## How Admin Access Works

1. **Customer View**: User opens Mini Program → sees storefront
2. **Admin Access**: User taps store logo **5 times** → enters admin panel
3. **Security**: Add your WeChat openid to `src/pages/admin/index.tsx` ADMIN_OPENIDS array

## Data Storage

Uses **WeChat Cloud Database** (no separate backend needed):
- Products collection
- Orders collection
- Config collection

## Config-Driven Actions

Actions are defined as arrays in JSON config:

```typescript
// Config
{
  "onBuy": [
    { "type": "addToCart", "payload": { "id": "{{item.id}}" } },
    { "type": "showToast", "payload": { "title": "Added!" } }
  ]
}
```

ActionDispatcher executes sequentially. No switch statements in components.

## Development

```bash
# Install dependencies
npm install

# WeChat DevTools
npm run dev:weapp

# Build
npm run build:weapp
```

## WeChat Cloud Setup

1. Enable Cloud Development in WeChat DevTools
2. Create `products`, `orders`, `config` collections in cloud DB
3. Deploy cloud functions from `/cloudfunctions` folder

## Tech Stack

- Taro 4.1.11 (React)
- Redux Toolkit
- WeChat Cloud DB
- TypeScript

# Taro Whitelabel E-Commerce Framework

Configuration-driven whitelabel framework for building multi-business Mini Programs with Taro. Single WeChat Mini Program with both customer storefront and admin panel.

## Project Structure

```
src/
├── pages/
│   ├── dynamic/              # Home / Browse products
│   ├── detail/               # Product detail
│   ├── cart/                  # Shopping cart
│   ├── profile/              # User profile & purchases
│   └── admin/                # Admin Panel (hidden)
│       ├── index             # Admin entry & auth gate
│       ├── dashboard         # Stats overview
│       ├── products          # Product CRUD + image upload
│       ├── orders            # Order management
│       └── settings          # Store settings
│
├── components/
│   ├── ProductCard/          # Product listing card
│   ├── ProductDetail/        # Full product detail view
│   ├── CartView/             # Cart with Redux state
│   ├── DigitalLibrary/       # Purchased digital content
│   ├── LockedContent/        # Paywall for digital products
│   ├── ServiceCard/          # Service-type product card
│   ├── OrderHistory/         # Past orders list
│   └── UserInfo/             # User profile info
│
├── core/                     # Config-driven rendering engine
│   ├── ActionDispatcher.ts   # Array-based action executor
│   ├── ConfigParser.ts       # JSON config → theme/page vars
│   ├── DataFetcher.ts        # Cloud DB query layer
│   ├── RenderEngine.tsx      # Dynamic component renderer
│   ├── ComponentRegistry.ts  # Component name → React lazy map
│   ├── AppShell.ts           # App lifecycle orchestrator
│   ├── types.ts              # Core type definitions
│   └── types/
│       └── product.ts        # Product SSOT type + config constants
│
├── services/
│   ├── cloudService.ts       # Customer cloud DB queries
│   ├── adminService.ts       # Admin cloud DB queries
│   └── paymentService.ts     # WeChat Pay integration
│
├── store/                    # Redux Toolkit state
│   ├── index.ts              # Store configuration
│   ├── cartSlice.ts
│   ├── wishlistSlice.ts
│   ├── userSlice.ts
│   └── storeConfigSlice.ts
│
├── types/
│   └── global.d.ts           # Global type declarations
│
└── assets/icons/             # Tab bar & UI icons (SVG + PNG)
```

## Architecture: Config → State → Intent → Execute

Every interaction follows the pipeline:

1. **Config** — Static JSON defines pages, actions, themes
2. **State** — Minimal Redux state (IDs only, never full objects)
3. **Intent** — UI/events dispatch actions, never mutate directly
4. **Execute** — ActionDispatcher handles all logic and state updates

### Config-Driven Actions

Actions are defined as arrays in JSON config:

```typescript
{
  "onBuy": [
    { "type": "addToCart", "payload": { "id": "{{item.id}}" } },
    { "type": "showToast", "payload": { "title": "Added!" } }
  ]
}
```

`ActionDispatcher` executes sequentially. No switch statements in components.

### Single Source of Truth

- `Product` type defined once in `src/core/types/product.ts`
- `PRODUCT_TYPE_CONFIG` and `DELIVERY_METHOD_CONFIG` constants for rendering
- Store holds minimal IDs; everything else is derived

## Admin Access

1. **Customer View** — User opens Mini Program → sees storefront
2. **Admin Entry** — Tap store logo **5 times** → enters admin panel
3. **Security** — First-time admin setup requires `INITIAL_ADMIN_OPENID` env var on `saveStoreConfig` cloud function. Subsequent access controlled by `ADMIN_OPENIDS` in cloud DB config

## Cloud Functions

14 cloud functions in `/cloudfunctions`:

| Function | Purpose |
|----------|---------|
| `getProducts` | Query product catalog |
| `createProduct` | Add new product |
| `updateProduct` | Edit product |
| `deleteProduct` | Remove product |
| `createOrder` | Place order |
| `getOrders` | Query orders |
| `updateOrderStatus` | Update order status |
| `getUserPurchases` | Get user's purchased items |
| `getUserInfo` | Get user profile |
| `checkAdminAccess` | Verify admin privileges |
| `getStoreConfig` | Get store configuration |
| `saveStoreConfig` | Save store configuration |
| `createPayment` | Initiate WeChat Pay |
| `paymentCallback` | Handle payment result |

## Whitelabel Configs

Example store configs in `public/config/`:

- `bookstore.json` — Physical book store
- `prompt-service.json` — Digital AI prompt service

## Development

```bash
# Install
npm install

# Dev (WeChat)
npm run dev:weapp

# Build
npm run build:weapp

# Other platforms
npm run dev:swan      # Baidu
npm run dev:alipay    # Alipay
npm run dev:tt        # Douyin
npm run dev:h5        # Web

# Quality
npm run lint
npm run typecheck
npm test
```

## WeChat Cloud Setup

1. Enable Cloud Development in WeChat DevTools
2. Set your env ID in `cloudbaserc.json`
3. Create `products`, `orders`, `config` collections in cloud DB
4. Deploy cloud functions from `/cloudfunctions`
5. Set `INITIAL_ADMIN_OPENID` env var on `saveStoreConfig` function for first admin setup

## Path Aliases

Configured in `tsconfig.json`:

| Alias | Path |
|-------|------|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@core/*` | `src/core/*` |
| `@store/*` | `src/store/*` |
| `@utils/*` | `src/utils/*` |

## Tech Stack

| Tech | Version |
|------|---------|
| Taro | 4.1.11 |
| React | 18.2 |
| Redux Toolkit | 1.9.7 |
| TypeScript | 5.2 |
| WeChat Cloud DB | — |
| Jest | 30.x |

## License

MIT

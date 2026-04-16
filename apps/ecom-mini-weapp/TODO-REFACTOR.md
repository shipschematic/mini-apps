# TODO: DRY SSOT Data-Driven Action Dispatcher

## Status: v2.0.0 - Unified Admin Architecture Complete

---

## Completed in v2.0.0

### ✅ Unified Admin Architecture
- [x] Admin panel embedded as Taro pages (no separate React app)
- [x] Admin access via secret gesture (tap logo 5 times)
- [x] Admin Dashboard with stats
- [x] Admin Products CRUD
- [x] Admin Orders management
- [x] Admin Settings
- [x] WeChat Cloud DB for all data (no MongoDB needed)

### ✅ Cleanup
- [x] Removed backend/ (NestJS)
- [x] Removed admin/ (separate React app)
- [x] Removed duplicate documentation
- [x] Clean .gitignore

---

## Remaining Tasks

### 1. CONFIG DEFINITION (DRY SSOT)

#### 1.1 Extract Action Config
- [ ] Create `src/config/actionConfig.ts`
- [ ] Define `DELIVERY_METHOD_ACTIONS` mapping:
  ```typescript
  {
    download: { primary: 'purchase', success: ['showToast'] },
    unlock:   { primary: 'purchase', success: ['showToast'] },
    ship:     { primary: 'addToCart', success: ['showToast'] }
  }
  ```
- [ ] Define `PRODUCT_TYPE_ACTIONS` mapping

#### 1.2 Tabbar Config
- [ ] Extract hardcoded `['home', 'cart', 'profile']` from ActionDispatcher:18

### 2. EXECUTION LAYER

#### 2.1 ProductCard Refactor
- [ ] Replace switch with config lookup
- [ ] Use `meta.currency` instead of hardcoded `¥`

#### 2.2 LockedContent Fix
- [ ] Remove dead "Already purchased" toast
- [ ] Fix navigation to non-existent 'checkout'

#### 2.3 ProductDetail Fix
- [ ] Replace hardcoded `(128 reviews)` with dynamic data

### 3. VERIFICATION
- [ ] TypeScript strict mode
- [ ] Test all delivery methods
- [ ] Test admin panel functionality

---

## Architecture (v2.0.0)

```
┌─────────────────────────────────────────────────────────────┐
│                    UNIFIED TARO APP                        │
│                                                          │
│  Customer View              │    Admin View               │
│  ─────────────────────────  │    ───────────────────────  │
│  pages/dynamic/ (Home)      │    pages/admin/index        │
│  pages/detail/              │    pages/admin/dashboard    │
│  pages/cart/                │    pages/admin/products    │
│  pages/profile/ (Admin入口)  │    pages/admin/orders     │
│                             │    pages/admin/settings    │
├─────────────────────────────┴────────────────────────────┤
│                    WeChat Cloud                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  products   │  │   orders    │  │    config    │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└──────────────────────────────────────────────────────────┘
```

## How Admin Access Works

1. Go to **Profile** page
2. Tap the **store logo** 5 times
3. Enter admin panel

**Security**: Add your WeChat openid to `src/pages/admin/index.tsx` ADMIN_OPENIDS array

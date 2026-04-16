# TODO: DRY SSOT Data-Driven Action Dispatcher

## Status: Ready for Refactor (Baseline: v1.0.0)

---

## 1. CONFIG DEFINITION

### 1.1 Define ActionConfig Schema
- [ ] Create `src/core/types/action.ts`
- [ ] Define `ActionConfig`, `ActionPayload`, `ActionHandler` types
- [ ] Document the config schema

### 1.2 Create Action Config File
- [ ] Create `src/config/actionConfig.ts`
- [ ] Extract `DELIVERY_METHOD_ACTIONS` mapping:
  ```typescript
  {
    download: { primary: 'purchase', success: ['showToast'] },
    unlock:   { primary: 'purchase', success: ['showToast'] },
    ship:     { primary: 'addToCart', success: ['showToast'] }
  }
  ```
- [ ] Extract `PRODUCT_TYPE_ACTIONS` mapping
- [ ] Define `TABBAR_PAGES` config (remove hardcoded `['home', 'cart', 'profile']`)

---

## 2. EXECUTION LAYER

### 2.1 Refactor ActionDispatcher
- [ ] Convert `execute()` from switch to config lookup
- [ ] Support array of actions per trigger
- [ ] Add middleware chain support (logging, analytics, rollback)

### 2.2 Create Action Pipeline
- [ ] Create `executeActionPipeline(actions: Action[], context: Context)`
- [ ] Add error handling with rollback
- [ ] Add async action support

---

## 3. COMPONENT REFACTOR

### 3.1 ProductCard
- [ ] Replace switch statement with config lookup
- [ ] Use `meta.currency` instead of hardcoded `¥`

### 3.2 LockedContent
- [ ] Remove dead "Already purchased" toast logic
- [ ] Fix navigation to non-existent 'checkout' page

### 3.3 ProductDetail
- [ ] Replace hardcoded `(128 reviews)` with dynamic data
- [ ] Add loading skeleton state

### 3.4 ServiceCard
- [ ] Either integrate with ProductCard or deprecate

---

## 4. VERIFICATION

- [ ] TypeScript strict mode passes
- [ ] Runtime action validation
- [ ] Test all delivery methods (download/ship/unlock)
- [ ] All hardcoded values replaced with config

---

## 5. ADMIN SPLIT (Future)

- [ ] Move `admin/` to separate repo: `E-Com-Admin`
- [ ] Move `backend/` to separate repo: `E-Com-Backend`
- [ ] Move `cloudfunctions/` to separate repo: `E-Com-CloudFunctions`
- [ ] Clean `E-Com` to contain only Taro runtime

---

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CONFIG (SSOT)                          │
│  src/config/actionConfig.ts                                 │
│  - DELIVERY_METHOD_ACTIONS                                  │
│  - PRODUCT_TYPE_ACTIONS                                     │
│  - TABBAR_PAGES                                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    STATE (Minimal)                         │
│  Redux: cartSlice, wishlistSlice, userSlice                │
│  - Only IDs/refs, not full objects                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              INTENT (User Actions)                         │
│  Components express intent, never execute logic            │
│  onAction([{ type: 'ship', payload: { itemId: '123' }}])   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                EXECUTE (Pipeline)                          │
│  ActionDispatcher.executeActionPipeline()                  │
│  - Config lookup → action[] array → execute sequentially   │
│  - Middleware: logging, analytics, rollback                │
└─────────────────────────────────────────────────────────────┘
```

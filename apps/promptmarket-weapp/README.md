# PromptMarket WeApp

Taro-based WeChat Mini Program for selling digital products. Catalog, cart, orders, purchased-content library, profile, and a config-driven admin screen are included.

## Features

- Product catalog with category filtering and search
- Product detail with locked-content preview
- Shopping cart and checkout
- Order history and payment status
- Digital library for purchased products
- Profile with optional admin access
- Config-driven storefront in `miniprogram/public/config/prompt-service.json`

## Stack

- Taro 4.1 + React + TypeScript
- Redux Toolkit
- WeChat CloudBase (TCB) functions and WeChat Pay

## Development

Run from the workspace root:

```bash
pnpm install
pnpm --filter promptmarket-weapp dev:weapp
pnpm --filter promptmarket-weapp build:weapp
```

Import `apps/promptmarket-weapp` in WeChat DevTools. Taro writes the mini program to `miniprogram/dist/`; the app-root `project.config.json` sets `miniprogramRoot` to that directory and `cloudfunctionRoot` to `cloudfunctions/`.

Other targets:

```bash
pnpm --filter promptmarket-weapp build:h5
pnpm --filter promptmarket-weapp typecheck
pnpm --filter promptmarket-weapp test
```

## Configuration

Storefront identity, colors, categories, products, and page data live in:

```text
miniprogram/public/config/prompt-service.json
```

The app loads this file at startup through `AppShell.loadLocalConfig()`.

## CloudBase

- Environment: `cloud1-d4gc2e7w9638ce590`
- Canonical function source: `shared/cloudfunctions/`
- Generated app copies: `apps/promptmarket-weapp/cloudfunctions/`
- Prefix: `ecom_` (legacy prefix retained after the app rename)

| Function | Purpose |
| --- | --- |
| `ecom_login` | Silent user authentication |
| `ecom_createOrder` | Create an order record |
| `ecom_createPayment` | Start WeChat Pay |
| `ecom_paymentCallback` | Handle the payment result |
| `ecom_getOrders` | Read the user's orders |
| `ecom_getUserPurchases` | Read purchased products |
| `ecom_getUser` | Read or update the user profile |
| `ecom_updateOrderStatus` | Update order state |

Collections: `ecom_orders`, `ecom_payments`, `ecom_userInfo`.

After editing shared functions:

```bash
pnpm sync:cloudfunctions
pnpm check:cloudfunctions
```

The sync also writes a `catalog.json` into `ecom_createOrder` from `miniprogram/public/config/prompt-service.json`. The deployed function rejects unknown products, unpublished products, and price mismatches. Re-sync and redeploy after catalog changes.

## Current Limitations

- Product-detail purchase still shows a placeholder instead of starting payment.
- Real payment is disabled by default; the cart uses demo checkout.
- Admin changes stay in a local pending queue and are not applied to the catalog.
- The admin page has no route guard.
- `ecom_getProducts` is referenced by the client but is not implemented.
- The Jest suite references modules that no longer exist.

Treat this app as a working storefront demo until those items are fixed.


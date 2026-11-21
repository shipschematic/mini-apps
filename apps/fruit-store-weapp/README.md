# Fruit Store (星期八果园) — WeChat Mini Program

Taro + React + TypeScript mini program for a fruit shop. Customers browse products, reserve visits, place orders, pay through WeChat Cloud Pay, and manage their profile. The local brand stays 星期八果园; the English brand is Fruit Store.

Formerly `xingqiba-orchard-weapp`. Cloud functions and collections keep the legacy `xingqiba_` prefix.

## Features

- Home page with product catalog, store information, and service entries
- Product detail and purchase flow
- Orders list, payment, cancel, and delete
- Reservation and booking pages
- Profile and order history
- Service pages: check-in, reviews, comments, likes, notes, order reviews
- Chinese and English UI strings
- WeChat CloudBase functions for login, users, orders, and payments

## Stack

- Taro 4.2 + React + TypeScript
- Zustand store
- WeChat CloudBase database and cloud functions
- WeChat Cloud Pay

## Development

Run from the workspace root:

```bash
pnpm install
pnpm --filter fruit-store-weapp dev:weapp
pnpm --filter fruit-store-weapp build:weapp
```

Open `apps/fruit-store-weapp` in WeChat DevTools. Taro writes the mini program to `miniprogram/dist/`; the app-root `project.config.json` sets `miniprogramRoot` to that directory and `cloudfunctionRoot` to `cloudfunctions/`.

## Configuration

- Storefront identity and products: `miniprogram/public/config/app.json`
- Cloud environment: `cloud1-d4gc2e7w9638ce590`
- AppID: `wx2ae5d48a13601dac` (WeChat test account, preview only)

The test AppID cannot be uploaded for review or published. Register a real mini program and replace the AppID before release.

## CloudBase

Canonical function source: `shared/cloudfunctions/`. Generated app copies: `apps/fruit-store-weapp/cloudfunctions/`.

| Function | Purpose |
| --- | --- |
| `xingqiba_login` | Read the current WeChat identity |
| `xingqiba_getUser` | Read or create the user profile |
| `xingqiba_createOrder` | Create an order with the caller's openid |
| `xingqiba_createPayment` | Start Cloud Pay using the stored order total |
| `xingqiba_paymentCallback` | Mark the payment and order as completed |
| `xingqiba_updateOrderStatus` | Cancel an order owned by the caller |
| `xingqiba_deleteOrder` | Soft-delete an order owned by the caller |
| `xingqiba_getOrders` | Read the caller's orders |
| `xingqiba_getUserPurchases` | Read completed purchases |

Collections: `xingqiba_orders`, `xingqiba_payments`, `xingqiba_userInfo`, plus `products`, `stores`, and `admins`.

After editing shared functions:

```bash
pnpm sync:cloudfunctions
pnpm check:cloudfunctions
```

## Theme

`src/styles/theme.scss` defines the light and dark CSS-variable palette. Pages use `var(--color-*)` tokens or the SCSS aliases in `src/styles/variables.scss`. Native navigation and tab-bar colors live in `src/theme.json`, which `src/app.config.ts` references with `@navBgColor`, `@tabColor`, and related keys. The app follows the system color scheme.

## Payment

The payment function reads `totalPrice` (or `total`) from the stored order and ignores any amount sent directly by the client. `createOrder` validates the product ID, published status, and price against `catalog.json`, which `pnpm sync:cloudfunctions` generates from `public/config/app.json`. Re-sync and redeploy after catalog changes. Payment also requires merchant configuration in the CloudBase console before `cloud.cloudPay.unifiedOrder` will work.

## Current Limitations

- Product catalog is static config. Admin product edits only copy JSON; they do not persist.
- Admin login stores an `admin_verified` flag locally and is not a server-side authorization check.
- Legacy cloud functions and collections keep the `xingqiba_` prefix.
- TypeScript reports legacy page errors, but production builds pass.

## App ID

`wx2ae5d48a13601dac` is a WeChat test account. Replace it with a registered AppID before publishing.

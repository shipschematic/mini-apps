# Shared

## `cloudfunctions/`

Canonical CloudBase function source for the commerce apps.

- Edit functions here.
- Run `pnpm sync:cloudfunctions` to update `apps/promptmarket-weapp/cloudfunctions` and `apps/fruit-store-weapp/cloudfunctions`.
- App copies are generated with the app prefix; do not edit them directly.
- CloudBase needs a self-contained `node_modules` inside each function at upload time.

## `brand-apps/`

Shared design tokens and notes recovered from the untracked `.layout/` directories. All four original copies were identical, so only one copy is kept here.

The app-specific `.layout/` directories remain ignored.

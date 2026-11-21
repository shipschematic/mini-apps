# Mini apps

One repository for the WeChat/Taro mini apps and their shared CloudBase functions.

## Apps

| App | Package | Stack | Backend | WeChat app ID |
| --- | --- | --- | --- | --- |
| `promptmarket-weapp` | `promptmarket-weapp` | Taro 4.1 + React | CloudBase functions | `wx2ae5d48a13601dac` (test account, preview only) |
| `minimalcove-weapp` | `minimalcove-weapp` | Taro 4.2 + React | None | `wx2ae5d48a13601dac` (test account, preview only) |
| `gutsynced-weapp` | `gutsynced-weapp` | Taro 4.2 + React | Next.js 14 in `backend/` | `wx0000000000000000` (real, publishable) |
| `fruit-store-weapp` | `fruit-store-weapp` | Taro 4.2 + React | CloudBase functions | `wx2ae5d48a13601dac` (test account, preview only) |

`gutsynced-weapp` now implements the GutSynced SIBO food-status flow from the Flutter app: four diets, food search and status filters, favorites, and account settings. The imported recipe pages remain in the app but are no longer in the tab bar.

### App IDs and test accounts

Only one real AppID exists in this workspace:

```text
wx0000000000000000   gutsynced-weapp   real, publishable
```

The test account AppID `wx2ae5d48a13601dac` is used by `promptmarket-weapp`, `minimalcove-weapp`, and `fruit-store-weapp`.

Each WeChat account includes two test accounts: one mini program test account and one mini game test account. Use the mini program test account for development.

Rules:

- Keep exactly one real AppID, assigned to `gutsynced-weapp`.
- All other local projects use the test AppID `wx2ae5d48a13601dac`.
- A test AppID supports preview only. It cannot upload a production version, submit for review, or publish.
- Never submit `wx2ae5d48a13601dac` for review as a registered mini program.
- To release an app, register it at <https://mp.weixin.qq.com>, get its own real AppID, then replace the test AppID in `project.config.json`.
- Do not assign the real AppID to PromptMarket, MinimalCove, or Fruit Store.

## Layout

```text
apps/
  promptmarket-weapp/
    miniprogram/              Taro source
    cloudfunctions/           generated CloudBase copies
  minimalcove-weapp/         Taro app at app root
  gutsynced-weapp/
    backend/                  Next.js backend
  fruit-store-weapp/
    miniprogram/              Taro source
    cloudfunctions/           generated CloudBase copies
shared/
  cloudfunctions/             canonical CloudBase function source
  brand-apps/                 shared design tokens from .layout
packages/                     shared JavaScript packages when needed
scripts/                      repository tooling
docs/                         catalog, deploy notes, conventions, migration history
```

## Commands

```bash
pnpm install
pnpm list
pnpm build:weapp
pnpm typecheck
pnpm sync:cloudfunctions
pnpm check:cloudfunctions
```

Build one app:

```bash
pnpm --filter minimalcove-weapp build:weapp
pnpm --filter gutsynced-weapp build:weapp
pnpm --filter promptmarket-weapp build:weapp
pnpm --filter fruit-store-weapp build:weapp
```

## Cloud functions

`shared/cloudfunctions` is the canonical source. Do not edit the generated copies directly. The sync script copies each function into the app with its prefix and rewrites internal callback names.

CloudBase uploads each function directory. Install production dependencies inside each function before deployment:

```bash
npm install --omit=dev
```

Do not symlink cloud-function directories into the pnpm workspace. CloudBase must receive self-contained function folders.

## Secrets

Commit `.env.example` files only. Keep real secrets in `.env` or `.env.local`, both ignored. `apps/gutsynced-weapp/.env` contains local Google and WeChat credentials and is intentionally untracked.

## Documentation

- `docs/catalog.md` — app inventory.
- `docs/deploy.md` — WeChat DevTools and CloudBase notes.
- `docs/conventions.md` — repository rules.
- `docs/migration.md` — import history and excluded paths.
- `docs/sources.tsv` — source repositories and heads.

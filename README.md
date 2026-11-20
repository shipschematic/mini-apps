# Mini apps

One repository for the WeChat/Taro mini apps and their shared CloudBase functions.

## Apps

| App | Package | Stack | Backend | WeChat app ID |
| --- | --- | --- | --- | --- |
| `ecom-mini-weapp` | `taro-whitelabel-framework` | Taro 4.1 + React | CloudBase functions | `wx0000000000000000` |
| `focusboard-weapp` | `focusboard-weapp` | Taro 4.2 + React | None | `touristappid` placeholder |
| `omnieat-weapp` | `omnieat-weapp` | Taro 4.2 + React | Next.js 14 in `backend/` | `wx0000000000000000` |
| `xingqiba-orchard-weapp` | `xingqiba-orchard` | Taro 4.2 + React | CloudBase functions | `wx2ae5d48a13601dac` |

`ecom-mini-weapp` and `omnieat-weapp` both declare `wx0000000000000000`. One must use a different app ID before release.

## Layout

```text
apps/
  ecom-mini-weapp/
    miniprogram/              Taro source
    cloudfunctions/           generated CloudBase copies
  focusboard-weapp/           Taro app at app root
  omnieat-weapp/
    backend/                  Next.js backend
  xingqiba-orchard-weapp/
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
pnpm --filter focusboard-weapp build:weapp
pnpm --filter omnieat-weapp build:weapp
pnpm --filter taro-whitelabel-framework build:weapp
pnpm --filter xingqiba-orchard build:weapp
```

## Cloud functions

`shared/cloudfunctions` is the canonical source. Do not edit the generated copies directly. The sync script copies each function into the app with its prefix and rewrites internal callback names.

CloudBase uploads each function directory. Install production dependencies inside each function before deployment:

```bash
npm install --omit=dev
```

Do not symlink cloud-function directories into the pnpm workspace. CloudBase must receive self-contained function folders.

## Secrets

Commit `.env.example` files only. Keep real secrets in `.env` or `.env.local`, both ignored. `apps/omnieat-weapp/.env` contains local Google and WeChat credentials and is intentionally untracked.

## Documentation

- `docs/catalog.md` — app inventory.
- `docs/deploy.md` — WeChat DevTools and CloudBase notes.
- `docs/conventions.md` — repository rules.
- `docs/migration.md` — import history and excluded paths.
- `docs/sources.tsv` — source repositories and heads.

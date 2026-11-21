# Mini Apps

A pnpm monorepo for four WeChat mini apps built with Taro and React. Two apps also include CloudBase cloud functions, and one includes a Next.js backend.

## Apps

| App | What it does | Backend |
| --- | --- | --- |
| `promptmarket-weapp` | Digital product store with catalog, cart, orders, library, and admin screens | CloudBase |
| `minimalcove-weapp` | Kanban board, Eisenhower matrix, and productivity analytics | Local storage |
| `gutsynced-weapp` | SIBO diet companion with food search, status filters, favorites, and four diet datasets | Local data; optional Next.js backend |
| `fruit-store-weapp` | Fruit store with products, reservations, orders, and payments | CloudBase |

## Requirements

- Node.js 20 or newer
- pnpm 9 or newer
- WeChat DevTools for previewing and publishing mini programs

## Setup

```bash
pnpm install
```

Copy any `.env.example` file to `.env` and fill in your own local values. Never commit `.env` files.

## Development

Run one app:

```bash
pnpm --filter minimalcove-weapp dev:weapp
pnpm --filter gutsynced-weapp dev:weapp
pnpm --filter promptmarket-weapp dev:weapp
pnpm --filter fruit-store-weapp dev:weapp
```

Build one app:

```bash
pnpm --filter minimalcove-weapp build:weapp
pnpm --filter gutsynced-weapp build:weapp
pnpm --filter promptmarket-weapp build:weapp
pnpm --filter fruit-store-weapp build:weapp
```

Build every app:

```bash
pnpm build:weapp
```

## Open in WeChat DevTools

Build the app first. Then import the app directory listed below:

| App | Import directory | Build output |
| --- | --- | --- |
| `promptmarket-weapp` | `apps/promptmarket-weapp` | `miniprogram/dist` |
| `minimalcove-weapp` | `apps/minimalcove-weapp` | `dist` |
| `gutsynced-weapp` | `apps/gutsynced-weapp` | `dist` |
| `fruit-store-weapp` | `apps/fruit-store-weapp` | `miniprogram/dist` |

Each app ships a `project.config.example.json`. Copy it and set your own AppID:

```bash
for app in minimalcove-weapp gutsynced-weapp promptmarket-weapp fruit-store-weapp; do
  cp "apps/$app/project.config.example.json" "apps/$app/project.config.json"
done
```

The real project config is ignored because it contains account-specific identifiers.

## Repository layout

```text
apps/
  promptmarket-weapp/
    miniprogram/              Taro source
    cloudfunctions/           generated CloudBase copies
  minimalcove-weapp/          Taro app at app root
  gutsynced-weapp/
    backend/                  optional Next.js backend
    src/                      Taro source
  fruit-store-weapp/
    miniprogram/              Taro source
    cloudfunctions/           generated CloudBase copies
shared/
  cloudfunctions/             canonical CloudBase function source
  brand-apps/                 shared design tokens
packages/                     shared JavaScript packages when needed
scripts/                      repository tooling
docs/                         catalog, deployment, conventions, migration history
```

## Cloud functions

`shared/cloudfunctions` is the canonical source. Do not edit generated app copies.

```bash
pnpm sync:cloudfunctions
pnpm check:cloudfunctions
```

The sync script copies each function into the app with its prefix and rewrites internal callback names. CloudBase needs self-contained function folders, so do not symlink them into the workspace.

After syncing, upload the generated function folders from:

- `apps/promptmarket-weapp/cloudfunctions`
- `apps/fruit-store-weapp/cloudfunctions`

Install production dependencies inside each function before deployment:

```bash
npm install --omit=dev
```

## Checks

```bash
pnpm list
pnpm typecheck
pnpm check:cloudfunctions
```

## Documentation

- `docs/catalog.md` — app inventory and status.
- `docs/deploy.md` — WeChat DevTools and CloudBase deployment notes.
- `docs/conventions.md` — repository rules.
- `docs/migration.md` — import history and excluded paths.
- `docs/sources.tsv` — source repositories and heads.

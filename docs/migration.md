# Migration

Four standalone repositories were imported into this monorepo with their histories.

## Source mapping

| App | Source repository | Branch | Source HEAD | Original commits | Snapshot commit |
| --- | --- | --- | --- | ---: | --- |
| `ecom-mini-weapp` | `https://github.com/shipschematic/ecom-mini-weapp.git` | `main` | `925fb11c559077e451856c3d2de7727a8960236e` | 20 | `snapshot: remove obsolete rebuild script before monorepo import` |
| `focusboard-weapp` | `https://github.com/shipschematic/focusboard-weapp.git` | `main` | `31b89164f395272eb9f9c368231cd186503d9677` | 2 | `snapshot: preserve lint-staged dependencies before monorepo import` |
| `omnieat-weapp` | `https://github.com/shipschematic/omnieat-weapp.git` | `master` | `7060d5e274667473f65e591d2a897c6e31935cf8` | 7 | none |
| `xingqiba-orchard-weapp` | `https://github.com/shipschematic/xingqiba-orchard-weapp.git` | `main` | `d3079222c9d6d3c9eb551a965587e8c4304d5afb` | 8 | `snapshot: preserve git history repair scripts before monorepo import` |

Totals: 37 original commits, 3 snapshot commits, 40 application commits, 4 import merge commits, 1 root scaffold commit, and 1 workspace finalization commit.

`focusboard-weapp` was renamed to `minimalcove-weapp` after import. The source repository and the import history keep the original name.

`omnieat-weapp` was renamed to `gutsynced-weapp` after import. The source repository and the import history keep the original name.

After the rename, `gutsynced-weapp` was reworked from the imported Dapoer recipe app into the GutSynced SIBO flow: four diet data sets, food search and status filters, favorites, food detail, account, and light/dark theme. The legacy recipe pages remain in the app but are no longer in the tab bar.

`ecom-mini-weapp` had 92 worktree paths with CRLF-only changes. Those line-ending-only differences were not imported. Its only substantive uncommitted change was the deletion of `miniprogram/rebuild.bat`, which is in the snapshot commit.

## Tags

`ecom-mini-weapp` had two tags. They were namespaced during import:

```text
ecom-mini-weapp/v1.0.0
ecom-mini-weapp/v2.0.0
```

No other source repository had tags.

## Excluded from the monorepo

The source repository tracked a Windows SWC build-cache binary at `apps/fruit-store-weapp/miniprogram/.swc/`. It was removed after import; the cache is generated, not source.

- `node_modules/`
- `dist/`
- `.next/`
- `.swc/`
- `.codegraph/`
- `.layout/` duplicates; one copy is preserved at `shared/brand-apps/`
- `gutsynced-weapp/.env` (contains local Google and WeChat credentials)
- generated output and caches

## Backup

Full pre-migration backup:

```text
/mnt/data/Liberary/development/mini-apps-pre-monorepo-20261121-043451.tar.gz
```

The backup excludes `node_modules`, `dist`, `.next`, `.swc`, and `.codegraph`. It includes the original `.git` directories, source working trees, and the local `gutsynced-weapp/.env`.

## Recovery

After validation, the original tree was moved to:

```text
/mnt/data/Liberary/development/mini-apps.pre-monorepo-20261121-043451
```

The backup can restore the full directory tree:

```bash
cd /mnt/data/Liberary/development
tar -xzf mini-apps-pre-monorepo-20261121-043451.tar.gz
```

## Build smoke tests

- `promptmarket-weapp` (then `ecom-mini-weapp`): `pnpm --filter promptmarket-weapp build:weapp` passed.
- `minimalcove-weapp` (then `focusboard-weapp`): `pnpm --filter minimalcove-weapp build:weapp` passed.
- `gutsynced-weapp`: `pnpm --filter gutsynced-weapp build:weapp` passed.
- `gutsynced-weapp/backend`: `pnpm --filter gutsynced-backend build` passed with Prisma generate and Next.js 14 production build.
- `fruit-store-weapp` (then `xingqiba-orchard-weapp`): `pnpm --filter fruit-store-weapp build:weapp` passed.

Two Linux portability fixes were required after import:

- `focusboard-weapp` and `fruit-store-weapp` used `src/App.tsx`; it was renamed to `src/app.tsx` because Taro looks for a lowercase app entry on case-sensitive filesystems.
- `gutsynced-weapp/backend/tsconfig.json` now sets `"types": ["node"]`. Without it, hoisted `@types/minimatch@6.0.0` is a stub package and Next.js type checking fails.

## Verification

- All four source HEAD trees matched the imported app subtrees after Git normalization, before the Linux `app.tsx` case fix.
- All 37 original commit metadata records match author, email, date, and subject.
- Both `ecom-mini-weapp` tags match their source tag trees.
- `git fsck --full` exits 0.
- The repository has no nested `.git` directories and no symlinks.
- `pnpm check:cloudfunctions` passes.
- The shared brand token copy matches all four original `.layout/brand-apps` copies.

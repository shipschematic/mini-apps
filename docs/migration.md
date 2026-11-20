# Migration

Four standalone repositories were imported into this monorepo with their histories.

## Source mapping

| App | Source repository | Branch | Source HEAD | Original commits | Snapshot commit |
| --- | --- | --- | --- | ---: | --- |
| `ecom-mini-weapp` | `https://github.com/shipschematic/ecom-mini-weapp.git` | `main` | `925fb11c559077e451856c3d2de7727a8960236e` | 20 | `snapshot: remove obsolete rebuild script before monorepo import` |
| `focusboard-weapp` | `https://github.com/shipschematic/focusboard-weapp.git` | `main` | `31b89164f395272eb9f9c368231cd186503d9677` | 2 | `snapshot: preserve lint-staged dependencies before monorepo import` |
| `omnieat-weapp` | `https://github.com/shipschematic/omnieat-weapp.git` | `master` | `7060d5e274667473f65e591d2a897c6e31935cf8` | 7 | none |
| `xingqiba-orchard-weapp` | `https://github.com/shipschematic/xingqiba-orchard-weapp.git` | `main` | `d3079222c9d6d3c9eb551a965587e8c4304d5afb` | 8 | `snapshot: preserve git history repair scripts before monorepo import` |

Totals: 37 original commits, 3 snapshot commits, 40 application commits, 4 import merge commits, and 1 root scaffold commit.

`ecom-mini-weapp` had 92 worktree paths with CRLF-only changes. Those line-ending-only differences were not imported. Its only substantive uncommitted change was the deletion of `miniprogram/rebuild.bat`, which is in the snapshot commit.

## Tags

`ecom-mini-weapp` had two tags. They were namespaced during import:

```text
ecom-mini-weapp/v1.0.0
ecom-mini-weapp/v2.0.0
```

No other source repository had tags.

## Excluded from the monorepo

- `node_modules/`
- `dist/`
- `.next/`
- `.swc/`
- `.codegraph/`
- `.layout/` duplicates; one copy is preserved at `shared/brand-apps/`
- `omnieat-weapp/.env` (contains local Google and WeChat credentials)
- generated output and caches

## Backup

Full pre-migration backup:

```text
/mnt/data/Liberary/development/mini-apps-pre-monorepo-20261121-043451.tar.gz
```

The backup excludes `node_modules`, `dist`, `.next`, `.swc`, and `.codegraph`. It includes the original `.git` directories, source working trees, and the local `omnieat-weapp/.env`.

## Recovery

The original standalone repositories remain at their paths until the monorepo is validated. The backup can restore the full directory tree:

```bash
cd /mnt/data/Liberary/development
tar -xzf mini-apps-pre-monorepo-20261121-043451.tar.gz
```

## Verification

During import each filtered snapshot tree was compared with its source working tree after Git normalization. Commit metadata, tags, and application counts should be checked again after the final swap.

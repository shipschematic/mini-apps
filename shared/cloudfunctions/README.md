# Cloud functions

This directory is the canonical source for the commerce CloudBase functions.

Generated copies:

| App | Prefix |
| --- | --- |
| `promptmarket-weapp` | `ecom_` |
| `fruit-store-weapp` | `xingqiba_` |

Run `pnpm sync:cloudfunctions` after editing a function. Run `pnpm check:cloudfunctions` in CI or before a commit.

The sync script rewrites internal `functionName` references and CloudBase collection names with the target app prefix.

Deploy flow:

1. Sync.
2. Enter each generated function directory.
3. Run `npm install --omit=dev`.
4. Upload the complete directory with WeChat DevTools or the CloudBase CLI.

Do not use pnpm symlinks for deployed function folders.

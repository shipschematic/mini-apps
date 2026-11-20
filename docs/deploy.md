# Deploy

## WeChat DevTools

| App | Import directory | Build command |
| --- | --- | --- |
| `ecom-mini-weapp` | `apps/ecom-mini-weapp` | `pnpm --filter taro-whitelabel-framework build:weapp` |
| `focusboard-weapp` | `apps/focusboard-weapp` | `pnpm --filter focusboard-weapp build:weapp` |
| `omnieat-weapp` | `apps/omnieat-weapp` | `pnpm --filter omnieat-weapp build:weapp` |
| `xingqiba-orchard-weapp` | `apps/xingqiba-orchard-weapp/miniprogram` | `pnpm --filter xingqiba-orchard build:weapp` |

Each app keeps its own `project.config.json`. Confirm `miniprogramRoot` points at the Taro output directory after the first build.

`xingqiba-orchard-weapp` is the exception: its source `project.config.json` has no `miniprogramRoot`, and the generated `miniprogram/dist/project.config.json` previously carried the `ecom` app ID. Check the generated config and app ID before uploading.

`focusboard-weapp` uses `touristappid`. Replace it with the real app ID before upload.

## App ID collision

`ecom-mini-weapp` and `omnieat-weapp` both declare:

```text
wx0000000000000000
```

Only one can use that ID. Decide which project owns it and change the other `project.config.json` before release.

## CloudBase functions

Canonical source:

```text
shared/cloudfunctions/
```

Generated app copies:

```text
apps/ecom-mini-weapp/cloudfunctions/ecom_*
apps/xingqiba-orchard-weapp/cloudfunctions/xingqiba_*
```

Run:

```bash
pnpm sync:cloudfunctions
pnpm check:cloudfunctions
```

Install production dependencies in every function directory before upload:

```bash
for d in apps/ecom-mini-weapp/cloudfunctions/* apps/xingqiba-orchard-weapp/cloudfunctions/*; do
  (cd "$d" && npm install --omit=dev)
done
```

Upload the complete function directory through WeChat DevTools or the CloudBase CLI. Do not upload a symlink or a folder that depends on the workspace root for `wx-server-sdk`.

## Omnieat backend

The backend is a separate Next.js 14 application:

```bash
cd apps/omnieat-weapp/backend
npm install
npm run build
```

It requires its own environment variables. Copy `backend/.env.example` and provide real values in `backend/.env.local` on the server. Do not commit that file.

## pnpm

The workspace uses:

```ini
node-linker=hoisted
```

This is deliberate for Taro and WeChat DevTools compatibility. If a build still fails on a pnpm symlink, run the app build once with npm to compare, then fix the package list rather than enabling more hoisting flags.

The dependency tree includes an old Puppeteer. Its postinstall can fail while downloading Chromium. `.npmrc` sets `puppeteer_skip_download=true`; if the postinstall still runs, use:

```bash
PUPPETEER_SKIP_DOWNLOAD=1 PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 pnpm install --frozen-lockfile
```

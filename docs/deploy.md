# Deploy

## WeChat DevTools

| App | Import directory | Build command |
| --- | --- | --- |
| `promptmarket-weapp` | `apps/promptmarket-weapp` | `pnpm --filter promptmarket-weapp build:weapp` |
| `minimalcove-weapp` | `apps/minimalcove-weapp` | `pnpm --filter minimalcove-weapp build:weapp` |
| `gutsynced-weapp` | `apps/gutsynced-weapp` | `pnpm --filter gutsynced-weapp build:weapp` |
| `fruit-store-weapp` | `apps/fruit-store-weapp` | `pnpm --filter fruit-store-weapp build:weapp` |

Each app keeps its own `project.config.json`. Confirm `miniprogramRoot` points at the Taro output directory after the first build.

`fruit-store-weapp` now uses app-root `project.config.json` with `miniprogramRoot: "miniprogram/dist/"` and `cloudfunctionRoot: "cloudfunctions/"`. Open `apps/fruit-store-weapp` in DevTools. Re-import the project if DevTools still points at the old `miniprogram` folder.

`minimalcove-weapp` uses the test account AppID `wx2ae5d48a13601dac`. It supports preview only. Replace it with a real AppID only if MinimalCove becomes the release app.

## App IDs and test accounts

Only one real AppID is available:

`gutsynced-weapp` is the only release app. Its real AppID is kept outside the public tree in the local, ignored `apps/gutsynced-weapp/project.config.json`.

These apps declare the test account AppID:

```text
wx2ae5d48a13601dac   promptmarket-weapp / minimalcove-weapp / fruit-store-weapp
```

That is a **WeChat test account AppID** (小程序测试号), not a registered mini program. It supports preview on a phone, but it cannot upload a production version, submit for review, or publish.

Each WeChat account includes two test accounts: one mini program test account and one mini game test account. Keep the workspace on one real AppID for `gutsynced-weapp` and use the mini program test account for everything else.

Rules:

- Do not submit `wx2ae5d48a13601dac` for review or treat it as a release ID.
- `gutsynced-weapp` is the only app assigned the real AppID.
- `promptmarket-weapp`, `minimalcove-weapp`, and `fruit-store-weapp` stay on the test AppID for preview.
- To release one of the test-ID projects, register a real mini program, get its AppID, and replace the test AppID in `project.config.json`.
- Test account previews can appear on the phone as normal mini programs. Remove the phone shortcut and delete the preview to clean them up.

## CloudBase functions

Canonical source:

```text
shared/cloudfunctions/
```

Generated app copies:

```text
apps/promptmarket-weapp/cloudfunctions/ecom_*
apps/fruit-store-weapp/cloudfunctions/xingqiba_*
```

Run:

```bash
pnpm sync:cloudfunctions
pnpm check:cloudfunctions
```

The sync also regenerates each app's `createOrder/catalog.json` from its local product config. Redeploy `createOrder` after catalog or price changes.

Install production dependencies in every function directory before upload:

```bash
for d in apps/promptmarket-weapp/cloudfunctions/* apps/fruit-store-weapp/cloudfunctions/*; do
  (cd "$d" && npm install --omit=dev)
done
```

Upload the complete function directory through WeChat DevTools or the CloudBase CLI. Do not upload a symlink or a folder that depends on the workspace root for `wx-server-sdk`.

## GutSynced backend

The backend is a separate Next.js 14 application:

```bash
cd apps/gutsynced-weapp/backend
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

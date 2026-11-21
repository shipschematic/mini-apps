# PromptMarket Mini Program

Taro source for the PromptMarket WeChat Mini Program.

- Source: `src/`
- Storefront config: `public/config/prompt-service.json`
- Build output: `dist/`
- WeChat project config: `../project.config.json` (`miniprogramRoot: "miniprogram/dist/"`)

Build from the workspace root:

```bash
pnpm --filter promptmarket-weapp dev:weapp
pnpm --filter promptmarket-weapp build:weapp
```

Open `apps/promptmarket-weapp` in WeChat DevTools so the cloud functions are included.

Cloud functions live in `../cloudfunctions/` and use the legacy `ecom_` prefix. Their canonical source is `shared/cloudfunctions/`; run `pnpm sync:cloudfunctions` after editing it.

See `../README.md` for features, configuration, CloudBase details, and current limitations.

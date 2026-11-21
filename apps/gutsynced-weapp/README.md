# GutSynced WeApp

A SIBO diet companion for WeChat, built with Taro 4, React, and TypeScript. The app is a port of the Flutter `gutsynced` app and focuses on food status tracking, favorites, and diet switching.

## Features

- Four diet profiles: SIBO, SSRD, Bile Reflux, and 6-Food Elimination / Low-Residue.
- 761 foods across the four diets, based on the Flutter app's local JSON data.
- Green, yellow, and red food status with diet-specific descriptions.
- Search, status filters, favorites-only mode, and expandable categories.
- Local favorites per diet, persisted in WeChat storage.
- Food detail view with copy-name and favorite actions.
- English and Chinese interface labels.
- Optional account sign-in for cloud favorite backup through the Next.js backend.
- Light and dark themes that follow the WeChat system color scheme.

## Tabs

| Tab | Page | Purpose |
| --- | --- | --- |
| Home | `pages/home/index` | Search, filter, browse diets and foods |
| Favorites | `pages/saved/index` | Saved foods for the active diet |
| Settings | `pages/settings/index` | Account, language, active diet, app info |

## Commands

Run commands from the workspace root:

```bash
pnpm install
pnpm --filter gutsynced-weapp dev:weapp
pnpm --filter gutsynced-weapp build:weapp
pnpm --filter gutsynced-weapp build:h5
```

Copy `project.config.example.json` to `project.config.json` and set your real AppID. Then import `apps/gutsynced-weapp` in WeChat DevTools. Taro writes the mini-program output to `dist/` as configured in `project.config.json`.


## Local Data

```
src/data/
├── food_data.json      # SIBO diet
├── ssrd_data.json      # SSRD diet
├── bile_data.json      # Bile Reflux diet
└── 6fedlr_data.json    # 6-Food Elimination & Low-Residue diet
```

`src/utils/foodStore.ts` is the single source of truth for the active diet, search, filters, favorites, and language. Favorites are stored under `gutsynced_favorites_<diet>` and the active diet under `gutsynced_active_diet`.

## Theme

The app follows the WeChat system color scheme.

- `src/config/theme.scss` defines the light and dark CSS variables used by the pages.
- `src/theme.json` sets the native navigation bar and tab bar colors for each scheme.
- `src/app.config.ts` enables `darkmode` and references `theme.json`.
- Page styles use `var(--color-*)` tokens instead of fixed light colors.

## Backend

The Next.js backend in `backend/` is optional. Favorites and food data work offline. Sign-in and cloud backup require the backend:

```bash
pnpm --filter gutsynced-backend dev
```

The mini-program uses `http://localhost:3001` by default. Set `TARO_APP_API_BASE_URL` when the backend runs elsewhere.

## Legacy Pages

The original Dapoer recipe pages remain in `src/pages` but are not part of the tab bar. The active GutSynced flow is Home, Favorites, Settings, Food Detail, and Account.

## Upstream

The earlier recipe app was based on [OmniEat](https://github.com/Zhang-Mulin/OmniEat). The current food-status data and screen structure come from the GutSynced Flutter app.

## License

MIT

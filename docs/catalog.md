# App catalog

| App | Package | Stack | Deploy target | Source |
| --- | --- | --- | --- | --- |
| `promptmarket-weapp` | `promptmarket-weapp` | Taro 4.1 + React + TypeScript | WeChat Mini Program, CloudBase | `shipschematic/ecom-mini-weapp` |
| `minimalcove-weapp` | `minimalcove-weapp` | Taro 4.2 + React + TypeScript | WeChat Mini Program | `shipschematic/focusboard-weapp` |
| `gutsynced-weapp` | `gutsynced-weapp` + `gutsynced-backend` | Taro 4.2 + React + TypeScript, Next.js 14 | WeChat Mini Program + separate backend host | `shipschematic/omnieat-weapp` |
| `fruit-store-weapp` | `fruit-store-weapp` | Taro 4.2 + React + TypeScript | WeChat Mini Program, CloudBase | `shipschematic/xingqiba-orchard-weapp` |

## Notes

- `promptmarket-weapp` and `fruit-store-weapp` share CloudBase functions in `shared/cloudfunctions`.
- `promptmarket-weapp` is the PromptMarket digital-product store, formerly `ecom-mini-weapp`. `fruit-store-weapp` is the 星期八果园 fruit store, formerly `xingqiba-orchard-weapp`.
- `minimalcove-weapp` has no backend. It uses the test account AppID `wx2ae5d48a13601dac` for preview.
- `gutsynced-weapp` contains a Taro frontend and a Next.js backend with Prisma. Deploy them separately. The active UI is the GutSynced SIBO food-status flow; the original recipe pages are retained but not tabbed.
- `gutsynced-weapp` is the only app assigned the real AppID `wx0000000000000000`. Release this app under that ID.
- `promptmarket-weapp`, `minimalcove-weapp`, and `fruit-store-weapp` use the test account AppID `wx2ae5d48a13601dac`. Test AppIDs are preview-only and cannot be published.
- To release PromptMarket, MinimalCove, or Fruit Store, register a separate real mini program for that app.
- Taro versions: `promptmarket` 4.1.11, the other three 4.2.0.

# App catalog

| App | Package | Stack | Deploy target | Source |
| --- | --- | --- | --- | --- |
| `ecom-mini-weapp` | `taro-whitelabel-framework` | Taro 4.1 + React + TypeScript | WeChat Mini Program, CloudBase | `shipschematic/ecom-mini-weapp` |
| `focusboard-weapp` | `focusboard-weapp` | Taro 4.2 + React + TypeScript | WeChat Mini Program | `shipschematic/focusboard-weapp` |
| `omnieat-weapp` | `omnieat-weapp` + `dapoer-backend` | Taro 4.2 + React + TypeScript, Next.js 14 | WeChat Mini Program + separate backend host | `shipschematic/omnieat-weapp` |
| `xingqiba-orchard-weapp` | `xingqiba-orchard` | Taro 4.2 + React + TypeScript | WeChat Mini Program, CloudBase | `shipschematic/xingqiba-orchard-weapp` |

## Notes

- `ecom-mini-weapp` and `xingqiba-orchard-weapp` share CloudBase functions in `shared/cloudfunctions`.
- `ecom-mini-weapp` is a whitelabel commerce template. `xingqiba-orchard-weapp` is a concrete orchard-commerce app.
- `focusboard-weapp` has no backend and still uses `touristappid`; set a real app ID before upload.
- `omnieat-weapp` contains a Taro frontend and a Next.js backend with Prisma. Deploy them separately.
- `ecom-mini-weapp` and `omnieat-weapp` both declare `wx0000000000000000`. They cannot both be released under that ID.
- Taro versions: `ecom` 4.1.11, the other three 4.2.0.

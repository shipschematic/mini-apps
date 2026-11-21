# MinimalCove WeApp

MinimalCove WeChat mini-program (Taro) focused on Kanban and the Eisenhower Matrix.

## Overview

A WeChat mini-program built with Taro that provides a mobile Kanban and Eisenhower Matrix task manager.

## Getting started

Run from the repository root:

```bash
pnpm install
pnpm --filter minimalcove-weapp dev:weapp
```

Build a production bundle:

```bash
pnpm --filter minimalcove-weapp build:weapp
```

Import `apps/minimalcove-weapp` in WeChat DevTools. Taro writes the mini-program to `dist/`, as configured in `project.config.json`.

## Theme

MinimalCove uses the shared brand palette with light and dark schemes. CSS variables live in `src/app.css`; native navigation and tab-bar colours live in `src/theme.json`. The app follows the system colour scheme.

## License

MIT

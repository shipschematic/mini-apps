# Conventions

## Repository shape

- One deployable app per `apps/<name>`.
- Shared source belongs in `shared/` or `packages/`.
- CloudBase function source belongs in `shared/cloudfunctions`; app copies are generated.
- Do not create nested `.git` repositories inside `apps/`.

## What not to commit

- `node_modules/`
- `dist/`
- `.next/`
- `.swc/`
- `.codegraph/`
- `.layout/` (the shared copy lives at `shared/brand-apps`)
- `.env`, `.env.local`, and other local secret files
- build logs, coverage, OS metadata

Only `.env.example` files belong in Git. Real credentials stay in local or host environment files.

## Cloud functions

- Edit `shared/cloudfunctions`, never the generated `apps/*/cloudfunctions/*` copies.
- Run `pnpm sync:cloudfunctions` after changing a shared function.
- Run `pnpm check:cloudfunctions` before committing.
- The generated copies prefix CloudBase collection names as well as function names.
- Keep each function self-contained for deployment. `wx-server-sdk` must be installed inside the function folder before upload.
- Do not add app cloud-function directories to the pnpm workspace.

## Packages

- Add a package under `packages/` only when at least two apps import it.
- Apps are independently deployable even when they share source.
- Do not force every app into one root build. `pnpm -r --if-present` runs only scripts that exist.
- `pnpm-lock.yaml` at the root is canonical. Per-app `package-lock.json` files are retained as source provenance; pnpm ignores them.

## Versions and tags

- Release tags are namespaced by app: `<app>/v<version>`.
- The imported history keeps original commit authors and dates. Paths and commit hashes changed during the subtree import.
- `docs/sources.tsv` is the provenance index for source repositories.

## Secrets review

Before making the repository public, re-scan for secrets, account-specific identifiers, API URLs, CloudBase environment IDs, and personal data.

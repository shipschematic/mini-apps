# TARO RULES (Load with CORE-RULES.md for Mini Programs)

## Taro-Specific
- Use Taro components + WeChat Mini Program APIs.
- Routing: Prefer Taro.navigateTo with config-defined paths.
- State: Redux / @tarojs/redux or Taro's eventCenter for simple cases.

## Config-Driven UI
- Define page/tab/button configs as typed arrays.
- Render with .map() in Taro View/Text components.
- New feature = add config object.

## Execution Pipeline
Config → State (Redux or local) → Dispatch({type, payload}) → Execute (reducer/action)
- UI never mutates directly — always dispatch.
- For Mini Program lifecycle: Handle in app.tsx or page components via config.

## Taro Git & Resources
cd "d:\Liberary\Taro"
git add . && git commit -m "feat: ..." && git push
Repo: https://github.com/velcranar/taro-whitelabel-ecommerce

Resource Protocol: Use Context7 for Taro docs, WebSearch for WeChat API updates.
## Git Protocol (Taro)
After every meaningful change:
git add .
git commit -m "feat: ... | update: ... | refactor: ..."   # Use descriptive message
git push

Never use "fix:" until user tests and confirms.
Repo: https://github.com/velcranar/taro-whitelabel-ecommerce
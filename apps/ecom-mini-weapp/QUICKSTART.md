# Quick Start Guide

## Prerequisites

- Node.js >= 14.x
- npm >= 6.x
- Taro CLI (optional, we have it in package.json)

## Installation

```bash
cd d:\Liberary\Taro
npm install
```

## Development

### Option 1: WeChat Mini Program (Recommended)

```bash
npm run dev:weapp
```

This will:
1. Compile the project
2. Open WeChat DevTools automatically
3. Watch for file changes

### Option 2: H5 (Web Browser)

```bash
npm run dev:h5
```

Then open `http://localhost:10086` in your browser.

### Option 3: Other Platforms

```bash
# Alipay
npm run dev:alipay

# Baidu
npm run dev:swan

# Toutiao
npm run dev:tt
```

## Switch Between Whitelabel Examples

### Bookstore (Default)

Edit `src/app.tsx`:

```typescript
await AppShell.loadLocalConfig(require('../public/config/bookstore.json'))
```

### Prompt Selling Service

Edit `src/app.tsx`:

```typescript
await AppShell.loadLocalConfig(require('../public/config/prompt-service.json'))
```

## Build for Production

### WeChat Mini Program

```bash
npm run build:weapp
```

Output: `dist/` directory, ready to upload to WeChat.

### H5

```bash
npm run build:h5
```

Output: `dist/` directory, deploy to any web server.

## Project Structure Overview

```
src/
├── core/              # Framework engine (don't modify often)
│   ├── ConfigParser   # Loads JSON config
│   ├── RenderEngine   # Renders pages dynamically
│   └── ActionDispatcher # Executes actions from config
├── components/        # Your whitelabel components
│   ├── ProductCard
│   └── ServiceCard
├── pages/dynamic/     # Single dynamic page (never modify)
├── store/            # Redux state management
└── app.tsx           # App entry (change config here)
```

## Common Tasks

### Add a New Page

Edit your JSON config:

```json
{
  "pages": [
    {
      "id": "my-new-page",
      "type": "grid",
      "title": "My Page",
      "dataSource": {
        "type": "static",
        "data": [...]
      },
      "itemTemplate": "ProductCard"
    }
  ]
}
```

### Add a New Component

1. Create component file:

```typescript
// components/MyCard/index.tsx
export default function MyCard({ data, config, onAction }) {
  return <View>...</View>
}
```

2. Register it:

```typescript
// components/index.ts
import MyCard from './MyCard'
ComponentRegistry.register('MyCard', MyCard)
```

3. Use in config:

```json
{
  "itemTemplate": "MyCard"
}
```

### Add Custom Action

```typescript
// Add to ActionDispatcher.ts
export const registerAction = (type, handler) => {
  actionRegistry[type] = handler
}

registerAction('myCustomAction', async (payload, context) => {
  // Your logic here
})
```

Then use in config:

```json
{
  "actions": {
    "onCustom": [
      {
        "type": "myCustomAction",
        "payload": { ... }
      }
    ]
  }
}
```

## Debugging

### Enable Debug Mode

```typescript
// In app.tsx
console.log('Config:', AppShell.getConfig())
console.log('Pages:', ConfigParser.getPages())
console.log('Components:', ComponentRegistry.getNames())
```

### Check Architecture

```typescript
// Import and run architecture tests
import { ArchitectureTests } from './core/__tests__/architecture.test'
ArchitectureTests.runAll()
```

## Troubleshooting

### "Config not loaded"
- Check JSON syntax
- Verify file path in app.tsx
- Check console for errors

### "Component not found"
- Ensure component is registered in `components/index.ts`
- Check `itemTemplate` name matches exactly

### "Action not found"
- Check action type spelling
- Verify action is registered in ActionDispatcher

### Build fails
- Delete `node_modules/` and `dist/`
- Run `npm install` again
- Check Node.js version

## Next Steps

1. ✅ Run the default bookstore example
2. ✅ Switch to prompt service example
3. ✅ Modify JSON config to see changes
4. ✅ Add your own component
5. ✅ Connect to real API

## Resources

- [README.md](./README.md) - Full documentation
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [todo.md](./todo.md) - Original design document
- [Taro Documentation](https://taro.jd.com/) - Official Taro docs

## Support

For issues or questions:
1. Check console logs
2. Review architecture tests
3. Read error messages carefully
4. Check JSON syntax

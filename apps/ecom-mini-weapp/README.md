# Taro Whitelabel E-commerce Framework

A **configuration-driven** whitelabel e-commerce framework built with Taro for WeChat Mini Programs and other platforms.

## Features

- ✅ **Single Source of Truth (SSOT)** - All UI, navigation, and business rules defined in JSON
- ✅ **Data-Driven Shell** - One dynamic page renders everything based on config
- ✅ **Whitelabel Components** - Reusable component library (ProductCard, ServiceCard, etc.)
- ✅ **Array Dispatcher** - Actions declared in config, executed by central dispatcher
- ✅ **Multi-Platform** - Compile to WeChat, Alipay, Baidu, Toutiao Mini Programs, H5, React Native
- ✅ **Type-Safe** - Full TypeScript support with strict interfaces
- ✅ **State Management** - Redux-based global store (cart, wishlist, user)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AppShell                              │
│  - Loads JSON Config                                     │
│  - Initializes Store                                     │
│  - Provides Context                                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   ConfigParser                           │
│  - Validates JSON Schema                                 │
│  - Builds Page Map                                       │
│  - Applies Theme                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  RenderEngine                            │
│  - Fetches Data (API/Static/Store)                       │
│  - Resolves Components                                   │
│  - Renders Dynamic UI                                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Component Registry                          │
│  - ProductCard                                           │
│  - ServiceCard                                           │
│  - Custom Components                                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               Action Dispatcher                          │
│  - Navigate                                              │
│  - AddToCart                                             │
│  - API Calls                                             │
│  - ShowToast                                             │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── app.config.ts          # Taro routing config
├── app.tsx                # App entry, loads config
├── app.scss               # Global styles
├── core/                  # Framework core modules
│   ├── types.ts           # TypeScript interfaces
│   ├── ConfigParser.ts    # JSON config loader
│   ├── RenderEngine.tsx   # Dynamic page renderer
│   ├── ActionDispatcher.ts# Action executor
│   ├── DataFetcher.ts     # Data source handler
│   ├── ComponentRegistry.ts# Component registry
│   └── AppShell.ts        # App container
├── components/            # Whitelabel components
│   ├── ProductCard/
│   ├── ServiceCard/
│   └── index.ts           # Component registration
├── pages/
│   └── dynamic/           # Single dynamic page
│       └── index.tsx
├── store/                 # Redux store
│   ├── index.ts
│   ├── cartSlice.ts
│   ├── wishlistSlice.ts
│   └── userSlice.ts
└── public/config/         # JSON configurations
    ├── bookstore.json
    └── prompt-service.json
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

```bash
# WeChat Mini Program
npm run dev:weapp

# H5
npm run dev:h5

# Alipay
npm run dev:alipay
```

### 3. Build

```bash
# WeChat Mini Program
npm run build:weapp

# H5
npm run build:h5
```

## Configuration Schema

### Meta Section

```json
{
  "meta": {
    "appName": "BookStore",
    "primaryColor": "#2A4B7C",
    "currency": "USD",
    "features": ["cart", "wishlist", "reviews"]
  }
}
```

### Pages Section

```json
{
  "pages": [
    {
      "id": "home",
      "type": "grid",
      "title": "Featured Books",
      "dataSource": {
        "type": "api",
        "endpoint": "/api/books/featured"
      },
      "itemTemplate": "ProductCard",
      "actions": {
        "onItemClick": [
          {
            "type": "navigate",
            "target": "detail",
            "params": { "id": "{{item.id}}" }
          }
        ]
      }
    }
  ]
}
```

### Data Sources

- **api** - Fetch from REST API
- **static** - Inline data in config
- **store** - Read from Redux store
- **function** - Custom transformer function

### Action Types

- `navigate` - Navigate to page
- `navigateBack` - Go back
- `switchTab` - Switch tab bar
- `addToCart` - Add item to cart
- `removeFromCart` - Remove from cart
- `addToWishlist` - Add to wishlist
- `showToast` - Show toast message
- `showModal` - Show modal dialog
- `apiCall` - Make API request
- `setClipboardData` - Copy to clipboard
- `previewImage` - Preview images
- `makePhoneCall` - Make phone call

## Whitelabel Examples

### Example 1: Bookstore

```bash
# Already loaded by default in app.tsx
require('../public/config/bookstore.json')
```

Features:
- Grid layout for book covers
- Detail page with format selection
- Digital library for purchased books
- Cart and checkout

### Example 2: Prompt Selling Service

```bash
# Switch config in app.tsx
require('../public/config/prompt-service.json')
```

Features:
- List layout for prompts
- Blurred text preview
- One-click purchase & unlock
- My Prompts library with copy function

## Creating Custom Components

```typescript
// components/CustomCard/index.tsx
import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  data: any
  config: any
  onAction: (actions: any[], context: any) => void
}

export default function CustomCard({ data, config, onAction }: Props) {
  const handleClick = () => {
    if (config.onClick) {
      onAction(config.onClick, { item: data })
    }
  }

  return (
    <View className="custom-card" onClick={handleClick}>
      <Text>{data.title}</Text>
    </View>
  )
}
```

Then register in `components/index.ts`:

```typescript
import CustomCard from './CustomCard'

ComponentRegistry.register('CustomCard', CustomCard)
```

## Best Practices

### 1. Configuration-Driven UI
- ❌ Don't hardcode UI elements
- ✅ Define in config arrays

### 2. Single Source of Truth
- ❌ Don't create shadow states
- ✅ Store IDs, derive data from source

### 3. Execution Pipeline
- ❌ Don't update state directly
- ✅ Use `dispatch({ type, payload })`

### 4. DRY Principle
- ❌ Don't duplicate logic
- ✅ Merge into parameterized functions

## Development Rules

Before writing code, verify:

1. ✅ Config array exists for UI elements
2. ✅ TypeScript Interface defined
3. ✅ Uses `.map()` for rendering
4. ✅ No shadow states
5. ✅ Follows Config → State → Dispatch → Execute

## Troubleshooting

### Config Not Loading
- Check JSON syntax
- Verify path in `app.tsx`
- Check console for errors

### Component Not Rendering
- Ensure component is registered
- Check `itemTemplate` name matches
- Verify data structure

### Actions Not Working
- Check action type in dispatcher
- Verify payload structure
- Check console for warnings

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

# OmniEat - Recipe Sharing Platform

A modern, cross-platform recipe sharing application built with Taro (React) for WeChat Mini Programs and Next.js for web, featuring a centralized architecture with single source of truth state management.

## 🏗️ Architecture

OmniEat follows a **configuration-driven, single source of truth** architecture with event-driven updates:

### Core Principles

1. **Single Source of Truth** - All data lives in centralized stores
2. **Event-Driven Updates** - Subscription-based state propagation
3. **Configuration-Driven** - UI renders from config, not hardcoded values
4. **Execution Pipeline** - Config → State → Intent → Execute

### Centralized Stores

```
src/utils/
├── favoriteStore.ts    # Favorite recipes state
├── recipeStore.ts      # All recipes state
├── categoryStore.ts    # Categories state
└── userStore.ts        # User profile state
```

Each store implements:
- **Subscription system** - Components subscribe to state changes
- **Smart caching** - Fetch once, use everywhere
- **Dispatcher methods** - All mutations go through controlled methods
- **Automatic notifications** - All subscribers update automatically

## 📁 Project Structure

```
food/
├── backend/                 # Next.js API backend
│   └── src/app/api/
│       ├── recipes/        # Recipe endpoints
│       ├── categories/     # Category endpoints
│       ├── saved/          # Favorites endpoints
│       └── users/          # User endpoints
│
├── src/
│   ├── pages/              # Taro pages (WeChat Mini Program)
│   │   ├── home/           # Home page with recipe feed
│   │   ├── categories/     # Browse by category
│   │   ├── search/         # Search recipes
│   │   ├── upload/         # Upload new recipe
│   │   ├── saved/          # Saved favorites
│   │   ├── recipe-detail/  # Recipe details
│   │   └── my-recipes/     # User's recipes
│   │
│   ├── components/         # Reusable UI components
│   ├── utils/              # Centralized stores & utilities
│   └── config/             # Configuration files
│
└── README.md
```

## 🚀 Features

### For Users

- ✅ **Browse Recipes** - Discover recipes by category or search
- ✅ **Favorite System** - Save and manage favorite recipes
- ✅ **Upload Recipes** - Create and publish your own recipes
- ✅ **Recipe Management** - Edit and delete your recipes
- ✅ **Real-time Updates** - Changes sync across all pages instantly
- ✅ **Offline Support** - Cached data for offline viewing

### Technical Features

- ✅ **Centralized State** - Single source of truth for all data
- ✅ **Event-Driven UI** - Automatic updates across all pages
- ✅ **Smart Caching** - Minimize API calls with intelligent caching
- ✅ **TypeScript** - Full type safety
- ✅ **WeChat Mini Program** - Cross-platform compatibility
- ✅ **RESTful API** - Clean backend architecture

## 🛠️ Tech Stack

### Frontend

- **Taro 3.x** - Cross-platform framework (React)
- **TypeScript** - Type safety
- **WeChat Mini Program** - Target platform
- **Next.js** - Backend API framework

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **SQLite** - Database
- **JWT** - Authentication

### State Management

- **Custom Store Pattern** - Subscription-based state management
- **EventEmitter** - Pub/sub for state updates
- **Singleton Pattern** - One instance per store

## 📦 Installation

### Prerequisites

- Node.js 16+ 
- WeChat DevTools
- SQLite3

### Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd food
npm install
npm run dev:weapp
```

Open WeChat DevTools and import the project.

## 🔌 API Endpoints

### Recipes

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### User Recipes

- `GET /api/users/recipes` - Get user's recipes
- `POST /api/users/recipes` - Create user recipe

### Favorites

- `GET /api/saved` - Get saved recipes
- `POST /api/saved` - Save recipe
- `DELETE /api/saved/:id` - Unsave recipe

## 📖 Usage Examples

### Using Stores in Components

```typescript
import { recipeStore } from '../../utils/recipeStore'

class MyComponent extends Component {
  private unsubscribe?: () => void

  async componentDidMount() {
    // Subscribe to updates
    this.unsubscribe = recipeStore.subscribe((recipes) => {
      this.setState({ recipes })
    })
    
    // Fetch data (cached)
    await recipeStore.getAll()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }
}
```

### Creating a Recipe

```typescript
import { recipeStore } from '../../utils/recipeStore'

// Create recipe - automatically notifies all subscribers
await recipeStore.create({
  title: 'My Recipe',
  estimatedTime: '30 min',
  categoryId: 'category-id',
  // ... other fields
})
```

## 🎯 Architecture Benefits

### Before (❌ Broken)

```typescript
// Every page fetches independently
const recipes = await request({ url: '/api/recipes' })

// User creates recipe → doesn't appear anywhere
// User updates category → other pages show old data
// Search uses hardcoded mock data
```

### After (✅ Fixed)

```typescript
// All pages use centralized stores
const recipes = await recipeStore.getAll()

// User creates recipe → ALL pages auto-update
// User updates category → ALL pages see new data
// Search queries real database
```

## 📊 State Flow

```
┌─────────────────────────────────────┐
│         Centralized Stores          │
│  (Single Source of Truth)           │
│  - recipeStore                      │
│  - categoryStore                    │
│  - favoriteStore                    │
│  - userStore                        │
└─────────────────────────────────────┘
              ↓ (subscription)
┌─────────────────────────────────────┐
│            UI Pages                 │
│  - Home (auto-updates)              │
│  - Categories (auto-updates)        │
│  - Search (real data)               │
│  - Saved (auto-updates)             │
│  - Upload (creates via store)       │
└─────────────────────────────────────┘
```

## 🧪 Testing

### Manual Testing Checklist

1. **Favorite System**
   - [ ] Favorite a recipe on home page
   - [ ] Navigate to recipe detail → should show as favorited
   - [ ] Unfavorite from detail → go back to home → should update
   - [ ] Check saved tab → should reflect changes

2. **Recipe Creation**
   - [ ] Upload new recipe
   - [ ] Navigate to home → should appear
   - [ ] Navigate to categories → should appear in correct category
   - [ ] Search for recipe → should find it

3. **Category Updates**
   - [ ] Add new category (via database)
   - [ ] Refresh app → should appear in upload dropdown
   - [ ] Should appear in categories page

## 🐛 Known Issues

- [ ] Profile page still uses direct API calls (needs userStore integration)
- [ ] Notifications page needs notificationStore
- [ ] Livestream page needs livestreamStore

## 📝 Development Guidelines

### Creating New Stores

```typescript
class Store {
  private data: T
  private listeners: Set<Listener> = new Set()
  
  subscribe(listener): () => void {
    this.listeners.add(listener)
    listener(this.data)
    return () => this.listeners.delete(listener)
  }
  
  async getAll(): Promise<T[]> {
    // Fetch and cache
  }
  
  async create(data): Promise<T> {
    // Create and notify
  }
}
```

### Page Lifecycle

```typescript
componentDidMount() {
  // 1. Subscribe to store
  this.unsubscribe = store.subscribe(this.handleUpdate)
  
  // 2. Fetch data
  await store.getAll()
}

componentWillUnmount() {
  // 3. Cleanup subscription
  this.unsubscribe?.()
}
```

## 🤝 Contributing

1. Follow the single source of truth pattern
2. Never fetch directly in pages - use stores
3. All mutations through store methods
4. Add tests for new stores
5. Update documentation

## 📄 License

MIT

## 👥 Authors

- Zhang-Mulin

## 🔗 Repository

https://github.com/Zhang-Mulin/OmniEat

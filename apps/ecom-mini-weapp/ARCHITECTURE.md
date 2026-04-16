# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Dynamic Page (Single Page)                  │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │           RenderEngine                            │  │   │
│  │  │  - Reads page config from JSON                    │  │   │
│  │  │  - Fetches data from configured source            │  │   │
│  │  │  - Renders components dynamically                 │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CORE ENGINE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Config      │  │   Data       │  │  Component   │         │
│  │  Parser      │  │  Fetcher     │  │  Registry    │         │
│  │              │  │              │  │              │         │
│  │ - Load JSON  │  │ - API        │  │ - Register   │         │
│  │ - Validate   │  │ - Static     │  │ - Resolve    │         │
│  │ - Build Map  │  │ - Store      │  │ - Lookup     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                    │               │
│         └──────────────────┴────────────────────┘               │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────┐          │
│  │           Action Dispatcher                      │          │
│  │  ┌────────────────────────────────────────────┐ │          │
│  │  │  Action Types (20+):                       │ │          │
│  │  │  • Navigation (navigate, back, switchTab)  │ │          │
│  │  │  • Cart (add, remove, update, clear)       │ │          │
│  │  │  • Wishlist (add, remove)                  │ │          │
│  │  │  • UI (toast, modal, loading)              │ │          │
│  │  │  • API (apiCall)                           │ │          │
│  │  │  • Device (clipboard, image, phone)        │ │          │
│  │  │  • User (login, logout, update)            │ │          │
│  │  └────────────────────────────────────────────┘ │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT LAYER                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Redux Store                             │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │   │
│  │  │   Cart     │  │ Wishlist   │  │    User    │        │   │
│  │  │  Slice     │  │   Slice    │  │   Slice    │        │   │
│  │  │            │  │            │  │            │        │   │
│  │  │ - items[]  │  │ - items[]  │  │ - id       │        │   │
│  │  │ - total    │  │            │  │ - name     │        │   │
│  │  │ - count    │  │            │  │ - avatar   │        │   │
│  │  │            │  │            │  │ - phone    │        │   │
│  │  │            │  │            │  │ - isLoggedIn│       │   │
│  │  └────────────┘  └────────────┘  └────────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CONFIGURATION LAYER (SSOT)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  JSON Config File                        │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  meta:                                            │   │   │
│  │  │    - appName, primaryColor, features             │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  pages[]:                                         │   │   │
│  │  │    - id, type, dataSource, itemTemplate          │   │   │
│  │  │    - actions (onItemClick, onBuy, etc.)          │   │   │
│  │  │    - layout (for detail pages)                   │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  components[]: (optional)                         │   │   │
│  │  │    - Custom component definitions                │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Examples:                                                       │
│  • bookstore.json - Digital products (books)                    │
│  • prompt-service.json - Service products (prompts)             │
│  └──────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. App Initialization

```
User Opens App
        │
        ▼
┌─────────────────┐
│    AppShell     │
│  - Load Config  │
│  - Init Store   │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  ConfigParser   │
│  - Validate     │
│  - Build Map    │
│  - Apply Theme  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Component Reg   │
│  - Register     │
│  - Components   │
└─────────────────┘
        │
        ▼
App Ready
```

### 2. Page Rendering

```
User Navigates to Page
        │
        ▼
┌─────────────────┐
│  Dynamic Page   │
│  - Get pageId   │
│  - From Route   │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  RenderEngine   │
│  - Get Config   │
│  - Fetch Data   │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  DataFetcher    │
│  - API/Static/  │
│    Store        │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ ComponentRegistry│
│  - Resolve      │
│  - Component    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Render UI     │
│  - Grid/List/   │
│    Detail       │
└─────────────────┘
        │
        ▼
Page Displayed
```

### 3. User Action (e.g., Add to Cart)

```
User Clicks "Add to Cart"
        │
        ▼
┌─────────────────┐
│   Component     │
│  - onAction()   │
│  - Call         │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│    Dispatch     │
│  - actions[]    │
│  - Context      │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ ActionDispatcher│
│  - Execute      │
│  - Sequentially │
└─────────────────┘
        │
        ├──────────────┬──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐
│ Update Store │ │ Navigate │ │ Show UI  │
│  - Cart      │ │  - Page  │ │ - Toast  │
│  - Wishlist  │ │  - Back  │ │ - Modal  │
│  - User      │ │  - Tab   │ │          │
└──────────────┘ └──────────┘ └──────────┘
        │
        ▼
Action Complete
```

## Component Hierarchy

```
App (app.tsx)
│
├─ Provider (Redux)
│  │
│  └─ DynamicPage (pages/dynamic/index.tsx)
│     │
│     └─ RenderEngine
│        │
│        ├─ ScrollView
│        │  │
│        │  └─ Components (mapped from config)
│        │     ├─ ProductCard
│        │     ├─ ServiceCard
│        │     └─ Custom Components
│        │
│        └─ Layout Components (detail pages)
│           ├─ ImageGallery
│           ├─ ProductInfo
│           └─ PurchaseOptions
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                     UI Components                       │
│  - Dispatch Actions (never update state directly)       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Action Dispatcher                     │
│  - Receives action arrays from config                   │
│  - Executes sequentially                                │
│  - Updates store via dispatch                           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      Redux Store                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Reducers (Pure Functions)                        │  │
│  │  - cartReducer                                    │  │
│  │  - wishlistReducer                                │  │
│  │  - userReducer                                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Updated State                        │
│  - Components re-render automatically                   │
│  - Via React-Redux connect                              │
└─────────────────────────────────────────────────────────┘
```

## Configuration-Driven Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  JSON Configuration                     │
│                                                         │
│  {                                                      │
│    "meta": { ... },                                    │
│    "pages": [                                          │
│      {                                                  │
│        "id": "home",                                   │
│        "dataSource": { ... },                          │
│        "itemTemplate": "ProductCard",                  │
│        "actions": {                                    │
│          "onItemClick": [                              │
│            { "type": "navigate", ... }                 │
│          ]                                              │
│        }                                                │
│      }                                                  │
│    ]                                                    │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Runtime Interpretation                     │
│                                                         │
│  ConfigParser.parse() → PageConfig[]                   │
│  RenderEngine.render() → React Components              │
│  ActionDispatcher.execute() → Side Effects             │
└─────────────────────────────────────────────────────────┘
```

## Key Architectural Patterns

### 1. Single Source of Truth (SSOT)
```
JSON Config → ConfigParser → Page Map
                     │
                     └─→ Single source for:
                        - UI structure
                        - Navigation
                        - Actions
                        - Data sources
```

### 2. Configuration-Driven UI
```
Config Array → .map() → Components
   │
   └─→ No hardcoded JSX
   └─→ Scalable (add object, not code)
```

### 3. Execution Pipeline
```
Config → State → Dispatch → Execute
   │        │         │          │
   │        │         │          └─→ Update State
   │        │         └─→ Intent
   │        └─→ Truth
   └─→ Blueprint
```

### 4. Component Registry
```
ComponentRegistry
   │
   ├─→ register(name, component)
   ├─→ get(name)
   └─→ Dynamic resolution at runtime
```

### 5. Strategy Pattern (Actions)
```
ACTIONS = {
  navigate: handler,
  addToCart: handler,
  showToast: handler,
  ...
}

Execute: ACTIONS[action.type](payload)
```

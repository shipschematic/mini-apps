# Architecture Analysis: Data-Driven Single Source of Truth Violations

## ✅ FIXED - Favorite System

### Before (Violations):
1. ❌ **Multiple sources of truth**: Each page maintained its own `favoritedIds` state
2. ❌ **Direct state mutation**: Pages manually updated state without dispatcher
3. ❌ **Duplicate API calls**: Every page fetched favorites independently
4. ❌ **No event-driven updates**: Pages didn't know when other pages changed data
5. ❌ **Manual lifecycle management**: Duplicate `onShow` + `componentDidShow` calls

### After (Fixed):
1. ✅ **Single source**: `favoriteStore` is the ONLY source of truth
2. ✅ **Dispatcher pattern**: All changes go through `favoriteStore.toggle/add/remove`
3. ✅ **Event-driven**: Components subscribe to store, auto-update on changes
4. ✅ **Centralized API**: Store handles all API calls, components just dispatch
5. ✅ **Clean lifecycle**: Components subscribe in `componentDidMount`, unsubscribe in `componentWillUnmount`

---

## ⚠️ REMAINING VIOLATIONS

### 1. Recipe Data (VIOLATION)
**Files**: `home/index.tsx`, `recipes-for-you/index.tsx`, `recipe-detail/index.tsx`, `search/index.tsx`

**Problem**:
- Each page fetches recipes independently
- No centralized recipe cache
- No event-driven updates when recipes are created/updated/deleted
- Duplicate data across pages

**Solution Needed**:
```typescript
// Create recipeStore.ts
class RecipeStore {
  private recipes: Map<string, Recipe> = new Map()
  
  async getAll(): Promise<Recipe[]>
  async getById(id: string): Promise<Recipe>
  async create(recipe: Recipe): Promise<Recipe>
  async update(id: string, updates: Partial<Recipe>): Promise<Recipe>
  async delete(id: string): Promise<void>
  
  subscribe(listener: (recipes: Recipe[]) => void): () => void
}
```

---

### 2. Category Data (VIOLATION)
**Files**: `home/index.tsx`, `categories/index.tsx`, `all-categories/index.tsx`

**Problem**:
- Each page fetches categories independently
- No centralized category cache
- No event-driven updates

**Solution Needed**:
```typescript
// Create categoryStore.ts
class CategoryStore {
  private categories: Category[] = []
  
  async getAll(): Promise<Category[]>
  async getById(id: string): Promise<Category>
  
  subscribe(listener: (categories: Category[]) => void): () => void
}
```

---

### 3. User/Profile Data (VIOLATION)
**Files**: `profile/index.tsx`, `edit-profile/index.tsx`, `my-recipes/index.tsx`

**Problem**:
- User data fetched multiple times
- No centralized user state
- Profile updates don't propagate

**Solution Needed**:
```typescript
// Create userStore.ts
class UserStore {
  private user: User | null = null
  
  async getCurrentUser(): Promise<User>
  async updateProfile(updates: Partial<User>): Promise<User>
  
  subscribe(listener: (user: User | null) => void): () => void
}
```

---

### 4. Livestream Data (VIOLATION)
**Files**: `home/index.tsx`, `live-cooking/index.tsx`, `livestream-schedule/index.tsx`

**Problem**:
- Duplicate API calls
- No centralized state
- No real-time updates

**Solution Needed**:
```typescript
// Create livestreamStore.ts
class LivestreamStore {
  private livestreams: Livestream[] = []
  
  async getAll(): Promise<Livestream[]>
  async getById(id: string): Promise<Livestream>
  
  subscribe(listener: (livestreams: Livestream[]) => void): () => void
}
```

---

### 5. Notifications (VIOLATION)
**Files**: `notifications/index.tsx`

**Problem**:
- No centralized notification state
- No real-time updates
- No read/unread tracking across pages

**Solution Needed**:
```typescript
// Create notificationStore.ts
class NotificationStore {
  private notifications: Notification[] = []
  
  async getAll(): Promise<Notification[]>
  async markAsRead(id: string): Promise<void>
  async markAllAsRead(): Promise<void>
  
  subscribe(listener: (notifications: Notification[]) => void): () => void
}
```

---

### 6. Search State (VIOLATION)
**Files**: `search/index.tsx`, `search-result/index.tsx`

**Problem**:
- Search query stored locally
- No centralized search history
- No event-driven search results

**Solution Needed**:
```typescript
// Create searchStore.ts
class SearchStore {
  private query: string = ''
  private history: string[] = []
  private results: Recipe[] = []
  
  setQuery(query: string): void
  addToHistory(query: string): void
  async search(query: string): Promise<Recipe[]>
  
  subscribe(listener: (state: SearchState) => void): () => void
}
```

---

### 7. Upload/Recipe Creation (VIOLATION)
**Files**: `upload/index.tsx`, `edit-recipe/index.tsx`

**Problem**:
- Recipe creation logic duplicated
- No centralized draft management
- No event-driven updates to recipe list

**Solution Needed**:
```typescript
// Use recipeStore.create()
// Create draftStore.ts for draft management
class DraftStore {
  private drafts: Draft[] = []
  
  async save(draft: Draft): Promise<void>
  async load(id: string): Promise<Draft>
  async delete(id: string): Promise<void>
  
  subscribe(listener: (drafts: Draft[]) => void): () => void
}
```

---

## 📊 SEVERITY RATING

| System | Severity | Impact | Priority |
|--------|----------|--------|----------|
| Favorites | ✅ FIXED | - | - |
| Recipes | 🔴 CRITICAL | High | P0 |
| Categories | 🟠 HIGH | Medium | P1 |
| User/Profile | 🟠 HIGH | Medium | P1 |
| Livestreams | 🟡 MEDIUM | Low | P2 |
| Notifications | 🟡 MEDIUM | Low | P2 |
| Search | 🟢 LOW | Low | P3 |
| Upload/Drafts | 🟡 MEDIUM | Medium | P2 |

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

1. **P0 - Recipe Store** (Most critical - affects most pages)
2. **P1 - Category Store** (High usage, easy to implement)
3. **P1 - User Store** (Critical for profile features)
4. **P2 - Livestream Store** (For real-time features)
5. **P2 - Notification Store** (For UX improvements)
6. **P2 - Draft Store** (For upload flow)
7. **P3 - Search Store** (Nice to have)

---

## 🏗️ ARCHITECTURE PATTERN

All stores should follow this pattern:

```typescript
// 1. Single source of truth (private state)
class Store {
  private data: T
  private listeners: Set<Listener> = new Set()
  
  // 2. Subscribe pattern (event-driven)
  subscribe(listener: Listener): () => void
  
  // 3. Dispatcher methods (all changes go through these)
  async action(payload: any): Promise<void> {
    // a. Optimistic update (optional)
    // b. API call
    // c. Sync with server
    // d. Notify listeners
  }
  
  // 4. Getters (read-only access)
  getState(): T {
    return { ...this.data } // Return copy to prevent mutation
  }
}
```

---

## ✅ BENEFITS OF THIS ARCHITECTURE

1. **Single Source of Truth**: Data lives in ONE place
2. **Event-Driven**: Components react to changes, don't poll
3. **Dispatcher Pattern**: All changes go through controlled methods
4. **Config-Driven**: Stores can be configured, not hardcoded
5. **Testable**: Stores can be tested independently
6. **Maintainable**: Changes in one place affect all consumers
7. **Performance**: Reduced duplicate API calls
8. **Consistency**: No stale data across pages

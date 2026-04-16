import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'
import userReducer from './userSlice'
import storeConfigReducer from './storeConfigSlice'

/**
 * GlobalStore - Centralized state management using Redux
 */

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    user: userReducer,
    storeConfig: storeConfigReducer
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable data
        ignoredActions: [],
        // Ignore these field paths in state
        ignoredPaths: []
      }
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

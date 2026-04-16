import { createSlice } from '@reduxjs/toolkit'

interface Purchase {
  productId: string
  purchaseDate: string
  price: number
  title?: string
}

interface UserState {
  id?: string
  name?: string
  avatar?: string
  phone?: string
  isLoggedIn: boolean
  purchases: Purchase[]
}

const initialState: UserState = {
  isLoggedIn: false,
  purchases: []
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state: any, action: any) {
      const { id, name, avatar, phone } = action.payload
      
      state.id = id
      state.name = name
      state.avatar = avatar
      state.phone = phone
      state.isLoggedIn = true
    },

    logout(state: any) {
      state.id = undefined
      state.name = undefined
      state.avatar = undefined
      state.phone = undefined
      state.isLoggedIn = false
      state.purchases = []
    },

    update(state: any, action: any) {
      const { name, avatar, phone } = action.payload
      
      if (name !== undefined) state.name = name
      if (avatar !== undefined) state.avatar = avatar
      if (phone !== undefined) state.phone = phone
    },

    addPurchase(state: any, action: any) {
      const { productId, purchaseDate, price, title } = action.payload
      
      // Check if already purchased
      const existingPurchase = state.purchases.find((p: Purchase) => p.productId === productId)
      if (!existingPurchase) {
        state.purchases.push({
          productId,
          purchaseDate,
          price,
          title
        })
      }
    }
  }
})

export const { login, logout, update, addPurchase } = userSlice.actions
export default userSlice.reducer

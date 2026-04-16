import { createSlice } from '@reduxjs/toolkit'

interface StoreConfigState {
  appName: string
  primaryColor: string
  secondaryColor?: string
  currency: string
  locale?: string
}

const initialState: StoreConfigState = {
  appName: 'Whitelabel Store',
  primaryColor: '#2A4B7C',
  currency: '¥'
}

const storeConfigSlice = createSlice({
  name: 'storeConfig',
  initialState,
  reducers: {
    update(state, action) {
      const { appName, primaryColor, secondaryColor, currency, locale } = action.payload
      if (appName !== undefined) state.appName = appName
      if (primaryColor !== undefined) state.primaryColor = primaryColor
      if (secondaryColor !== undefined) state.secondaryColor = secondaryColor
      if (currency !== undefined) state.currency = currency
      if (locale !== undefined) state.locale = locale
    }
  }
})

export const { update } = storeConfigSlice.actions
export default storeConfigSlice.reducer

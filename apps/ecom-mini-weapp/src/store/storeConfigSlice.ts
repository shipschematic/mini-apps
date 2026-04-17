import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PaymentConfig {
  enabled: boolean
  mchId: string
  bodyPrefix: string
}

interface StoreConfigState {
  appName: string
  primaryColor: string
  secondaryColor?: string
  currency: string
  locale?: string
  payment: PaymentConfig
  adminOpenids: string[]
  _pendingTabParams?: { target: string; params: Record<string, any> }
}

interface UpdatePayload {
  appName?: string
  primaryColor?: string
  secondaryColor?: string
  currency?: string
  locale?: string
  payment?: Partial<PaymentConfig>
  adminOpenids?: string[]
  _pendingTabParams?: { target: string; params: Record<string, any> } | undefined
}

const initialState: StoreConfigState = {
  appName: 'Whitelabel Store',
  primaryColor: '#2A4B7C',
  currency: '¥',
  payment: {
    enabled: false,
    mchId: '',
    bodyPrefix: ''
  },
  adminOpenids: []
}

const storeConfigSlice = createSlice({
  name: 'storeConfig',
  initialState,
  reducers: {
    update(state, action: PayloadAction<UpdatePayload>) {
      const { appName, primaryColor, secondaryColor, currency, locale, payment, adminOpenids, _pendingTabParams } = action.payload
      if (appName !== undefined) state.appName = appName
      if (primaryColor !== undefined) state.primaryColor = primaryColor
      if (secondaryColor !== undefined) state.secondaryColor = secondaryColor
      if (currency !== undefined) state.currency = currency
      if (locale !== undefined) state.locale = locale
      if (payment !== undefined) {
        state.payment = { ...state.payment, ...payment }
      }
      if (adminOpenids !== undefined) state.adminOpenids = adminOpenids
      if (_pendingTabParams !== undefined) state._pendingTabParams = _pendingTabParams
    }
  }
})

export const { update } = storeConfigSlice.actions
export default storeConfigSlice.reducer

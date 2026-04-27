import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from '@/features/api/baseApi'
import authReducer from '@/features/auth/authSlice'
import '@/features/api/authApi'
import '@/features/api/userApi'
import '@/features/api/productApi'
import '@/features/api/serviceApi'
import '@/features/api/orderApi'
import '@/features/api/deliveryApi'
import '@/features/api/analyticsApi'
import '@/features/api/messageApi'
import '@/features/api/milestoneApi'
import '@/features/api/adminApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

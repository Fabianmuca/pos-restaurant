import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../services/authApi';
import { menuApi } from '../services/menuApi';
import { orderApi } from '../services/orderApi';
import { tableApi } from '../services/tableApi';
import { paymentApi } from '../services/paymentApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [tableApi.reducerPath]: tableApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      menuApi.middleware,
      orderApi.middleware,
      tableApi.middleware,
      paymentApi.middleware
    ),
});

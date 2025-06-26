import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import labResultsReducer from './slices/labResultsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    labResults: labResultsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

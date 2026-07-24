import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from './loader';
import authReducer from './authSlice';
import wardReducer from './wardSlice';
import importantContactsReducer from './importantContactsSlice';
import emergencyAlertReducer from './emergencyAlertSlice';
import sanitationReducer from './sanitationSlice';

export const store = configureStore({
  reducer: {
    loader: loadingReducer,
    auth: authReducer,
    ward: wardReducer,
    importantContacts: importantContactsReducer,
    emergencyAlert: emergencyAlertReducer,
    sanitation: sanitationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
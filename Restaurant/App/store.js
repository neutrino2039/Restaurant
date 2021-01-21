import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import authenticationReducer from './features/authentication/AuthenticationSlice';

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
  },
  middleware: [...getDefaultMiddleware()],
});

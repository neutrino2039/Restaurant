import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import authenticationReducer from './features/authentication/AuthenticationSlice';
import restaurantDetailsReducer from './features/home/RestaurantDetailsSlice';
import restaurantsReducer from './features/home/RestaurantsSlice';
import reviewReducer from './features/home/components/ReviewSlice';
import splashScreenReducer from './features/splash-screen/SplashScreenSlice';

export const store = configureStore({
  reducer: {
    splashScreen: splashScreenReducer,
    authentication: authenticationReducer,
    restaurants: restaurantsReducer,
    restaurantDetails: restaurantDetailsReducer,
    review: reviewReducer,
  },
  middleware: [...getDefaultMiddleware()],
});

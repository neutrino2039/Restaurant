import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import authenticationReducer from './features/authentication/AuthenticationSlice';
import pendingReviewsReducer from './features/pending-reviews/PendingReviewsSlice';
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
    pendingReviews: pendingReviewsReducer,
  },
  middleware: [...getDefaultMiddleware()],
});

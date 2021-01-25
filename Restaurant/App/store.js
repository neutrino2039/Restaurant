import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import authenticationReducer from './features/authentication/AuthenticationSlice';
import pendingReviewsReducer from './features/pending-reviews/PendingReviewsSlice';
import restaurantDetailsReducer from './features/home/RestaurantDetailsSlice';
import restaurantsReducer from './features/home/RestaurantsSlice';
import reviewsReducer from './features/reviews/ReviewSlice';
import splashScreenReducer from './features/splash-screen/SplashScreenSlice';
import usersReducer from './features/users/UsersSlice';

export const store = configureStore({
  reducer: {
    splashScreen: splashScreenReducer,
    authentication: authenticationReducer,
    restaurants: restaurantsReducer,
    restaurantDetails: restaurantDetailsReducer,
    reviews: reviewsReducer,
    pendingReviews: pendingReviewsReducer,
    users: usersReducer,
  },
  middleware: [...getDefaultMiddleware()],
});

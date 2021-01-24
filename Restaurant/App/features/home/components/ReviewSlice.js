import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {get, post, thunkHandler} from '../../../apis/api';

const initialState = {
  data: null,
  status: 'idle',
  errors: null,
};

export const createReview = createAsyncThunk(
  'review/create',
  async ({restaurantId, stars, comment}, thunkAPI) =>
    thunkHandler(
      post('Review/Create', {
        restaurantId,
        stars,
        comment,
      }),
      thunkAPI,
    ),
);

export const getReviewByRestaurantId = createAsyncThunk(
  'review/getByRestaurantId',
  async ({restaurantId}, thunkAPI) =>
    thunkHandler(get('Review/GetByRestaurantId', {restaurantId}), thunkAPI),
);

const reviewSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    clearErrors: (state, action) => {
      state.errors = null;
    },
  },
  extraReducers: {
    [createReview.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [createReview.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.errors = null;
    },
    [createReview.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },

    [getReviewByRestaurantId.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [getReviewByRestaurantId.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
      state.errors = null;
    },
    [getReviewByRestaurantId.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
    },
  },
});

export const {setErrors, clearErrors} = reviewSlice.actions;

export default reviewSlice.reducer;

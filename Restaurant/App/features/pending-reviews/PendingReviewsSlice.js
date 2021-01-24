import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {get, post, thunkHandler} from '../../apis/api';

const initialState = {
  data: null,
  status: 'idle',
  errors: null,
};

export const replyToReview = createAsyncThunk(
  'review/create',
  async ({id, reply}, thunkAPI) =>
    thunkHandler(post('Review/ReplyToReview', {id, reply}), thunkAPI),
);

export const getReviewsPendingReply = createAsyncThunk(
  'review/getByRestaurantId',
  async (restaurantId, thunkAPI) =>
    thunkHandler(
      get('Review/getReviewsPendingReply', {restaurantId}),
      thunkAPI,
    ),
);

const pendingReviewsSlice = createSlice({
  name: 'pendingReviews',
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
    [replyToReview.pending]: (state, action) => {
      state.status = 'loading';
      state.errors = null;
    },
    [replyToReview.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.errors = null;
    },
    [replyToReview.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },

    [getReviewsPendingReply.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [getReviewsPendingReply.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
      state.errors = null;
    },
    [getReviewsPendingReply.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
    },
  },
});

export const {setErrors, clearErrors} = pendingReviewsSlice.actions;

export default pendingReviewsSlice.reducer;

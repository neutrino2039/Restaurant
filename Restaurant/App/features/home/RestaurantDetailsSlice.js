import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {get, thunkHandler} from '../../apis/api';

const initialState = {
  data: null,
  status: 'idle',
  errors: null,
};

export const getRestaurantDetails = createAsyncThunk(
  'restaurant/getDetails',
  async (restaurantId, thunkAPI) =>
    thunkHandler(get('Restaurant/GetDetails', {id: restaurantId}), thunkAPI),
);

const restaurantDetailsSlice = createSlice({
  name: 'restaurantDetails',
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
    [getRestaurantDetails.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [getRestaurantDetails.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
      state.errors = null;
    },
    [getRestaurantDetails.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },
  },
});

export const {setErrors, clearErrors} = restaurantDetailsSlice.actions;

export default restaurantDetailsSlice.reducer;

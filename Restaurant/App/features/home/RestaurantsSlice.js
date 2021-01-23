import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {get, thunkHandler} from '../../apis/api';

const initialState = {
  data: null,
  status: 'idle',
  errors: null,
};

export const getAllRestaurants = createAsyncThunk(
  'restaurant/getAll',
  async (thunkAPI) =>
    thunkHandler(
      get('Restaurant/GetAll', {
        sort: true,
        sortDirection: 'Desc',
        filter: false,
      }),
      thunkAPI,
    ),
);

const restaurantsSlice = createSlice({
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
    [getAllRestaurants.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [getAllRestaurants.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload.restaurants;
      state.errors = null;
    },
    [getAllRestaurants.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },
  },
});

export const {setErrors, clearErrors} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;

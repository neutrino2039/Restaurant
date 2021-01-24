import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {get, post, postImage, thunkHandler} from '../../apis/api';

const initialState = {
  filter: false,
  starsFrom: 0,
  starsTo: 0,
  data: null,
  imageName: null,
  status: 'idle',
  errors: null,
};

export const getAllRestaurants = createAsyncThunk(
  'restaurant/getAll',
  async (_, thunkAPI) => {
    const restaurants = thunkAPI.getState().restaurants;
    return thunkHandler(
      get('Restaurant/GetAll', {
        sort: true,
        sortDirection: 'Desc',
        filter: restaurants.filter,
        starsFrom: restaurants.starsFrom,
        starsTo: restaurants.starsTo,
      }),
      thunkAPI,
    );
  },
);

export const uploadImage = createAsyncThunk(
  'restaurant/uploadImage',
  async (imageData, thunkAPI) => {
    return thunkHandler(
      postImage('Restaurant/UploadImage', imageData),
      thunkAPI,
    );
  },
);

export const createRestaurant = createAsyncThunk(
  'restaurant/create',
  async ({name, address, imageName}, thunkAPI) => {
    return thunkHandler(
      post('Restaurant/Create', {name, address, imageName}),
      thunkAPI,
    );
  },
);

export const updateRestaurant = createAsyncThunk(
  'restaurant/update',
  async ({id, name, address, imageName}, thunkAPI) => {
    return thunkHandler(
      post('Restaurant/Update', {id, name, address, imageName}),
      thunkAPI,
    );
  },
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
    setFilter: (state, action) => {
      state.filter = true;
      state.starsFrom = action.payload.starsFrom;
      state.starsTo = action.payload.starsTo;
    },
    clearFilter: (state, action) => {
      state.filter = false;
      state.starsFrom = 0;
      state.starsTo = 0;
    },
    setImageName: (state, action) => {
      state.imageName = action.payload;
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
      state.imageName = null;
      state.errors = null;
    },
    [getAllRestaurants.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },

    [uploadImage.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [uploadImage.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.imageName = action.payload.fileName;
      state.errors = null;
    },
    [uploadImage.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },

    [createRestaurant.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [createRestaurant.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.errors = null;
    },
    [createRestaurant.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },

    [updateRestaurant.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [updateRestaurant.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.errors = null;
    },
    [updateRestaurant.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },
  },
});

export const {
  setErrors,
  clearErrors,
  setFilter,
  clearFilter,
  setImageName,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;

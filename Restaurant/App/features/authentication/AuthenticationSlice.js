import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postWithoutAuthorization, thunkHandler} from '../../apis/api';

const initialState = {
  data: null,
  status: 'idle',
  errors: null,
};

export const login = createAsyncThunk(
  'user/login',
  async ({userName, password}, thunkAPI) =>
    thunkHandler(
      postWithoutAuthorization('User/Login', {userName, password}),
      thunkAPI,
    ),
);

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearErrors: (state, action) => {
      state.errors = null;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [login.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
      state.errors = null;
    },
    [login.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },
  },
});

export const {clearErrors} = authenticationSlice.actions;

export default authenticationSlice.reducer;

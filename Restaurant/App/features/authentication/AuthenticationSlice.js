import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postWithoutAuthorization, thunkHandler} from '../../apis/api';

const initialState = {
  token: '',
  status: 'idle',
  errors: null,
  isAuthenticated: false,
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
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    clearErrors: (state, action) => {
      state.errors = null;
    },
    setAccessToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    logout: (state, action) => {
      state.token = '';
      state.isAuthenticated = false;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.status = 'loading';
      state.token = '';
      state.errors = null;
      state.isAuthenticated = false;
    },
    [login.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      state.errors = null;
      state.isAuthenticated = true;
    },
    [login.rejected]: (state, action) => {
      state.status = 'failed';
      state.token = '';
      state.errors = action.payload;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setErrors,
  clearErrors,
  setAccessToken,
  logout,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;

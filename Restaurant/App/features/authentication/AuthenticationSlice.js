import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {postWithoutToken, thunkHandler} from '../../apis/api';

export const ROLES = {ADMIN: 'Admin', OWNER: 'Owner', REGULAR: 'Regular'};

const initialState = {
  token: '',
  role: '',
  status: 'idle',
  errors: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  'user/login',
  async ({userName, password}, thunkAPI) =>
    thunkHandler(
      postWithoutToken('User/Login', {userName, password}),
      thunkAPI,
    ),
);

export const register = createAsyncThunk(
  'user/register',
  async ({userName, password, firstName, lastName}, thunkAPI) =>
    thunkHandler(
      postWithoutToken('User/Register', {
        userName,
        password,
        firstName,
        lastName,
      }),
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
      state.role = action.payload.role;
      state.token = action.payload.token;
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
      state.role = '';
      state.errors = null;
      state.isAuthenticated = false;
    },
    [login.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.errors = null;
      state.isAuthenticated = true;
    },
    [login.rejected]: (state, action) => {
      state.status = 'failed';
      state.token = '';
      state.role = '';
      state.errors = action.payload;
      state.isAuthenticated = false;
    },

    [register.pending]: (state, action) => {
      state.status = 'loading';
      state.errors = null;
    },
    [register.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.errors = null;
      state.isAuthenticated = true;
    },
    [register.rejected]: (state, action) => {
      state.status = 'failed';
      state.token = '';
      state.role = '';
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

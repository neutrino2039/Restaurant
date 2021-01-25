import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {get, post, thunkHandler} from '../../apis/api';

const initialState = {
  data: null,
  status: 'idle',
  errors: null,
};

export const getAllUsers = createAsyncThunk(
  'user/getAll',
  async (_, thunkAPI) => {
    return thunkHandler(get('User/GetAll'), thunkAPI);
  },
);

export const createUser = createAsyncThunk(
  'user/create',
  async ({userName, password, firstName, lastName, role}, thunkAPI) => {
    return thunkHandler(
      post('User/Create', {
        userName,
        password,
        firstName,
        lastName,
        role,
      }),
      thunkAPI,
    );
  },
);

export const updateUser = createAsyncThunk(
  'user/update',
  async ({id, firstName, lastName, password}, thunkAPI) => {
    return thunkHandler(
      post('User/Update', {id, firstName, lastName, password}),
      thunkAPI,
    );
  },
);

export const deleteUser = createAsyncThunk(
  'user/delete',
  async ({id}, thunkAPI) => {
    return thunkHandler(post('User/Delete', {id}), thunkAPI);
  },
);

const restaurantsSlice = createSlice({
  name: 'users',
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
    [getAllUsers.pending]: (state, action) => {
      state.status = 'loading';
      state.data = null;
      state.errors = null;
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload.users;
      state.errors = null;
    },
    [getAllUsers.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = null;
      state.errors = action.payload;
    },

    [createUser.pending]: (state, action) => {
      state.status = 'creating';
      state.errors = null;
    },
    [createUser.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.errors = null;
    },
    [createUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.errors = action.payload;
    },

    [updateUser.pending]: (state, action) => {
      state.status = 'updating';
      state.errors = null;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.errors = null;
    },
    [updateUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.errors = action.payload;
    },

    [deleteUser.pending]: (state, action) => {
      state.status = 'deleting';
      state.errors = null;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.errors = null;
    },
    [deleteUser.rejected]: (state, action) => {
      state.status = 'failed';
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

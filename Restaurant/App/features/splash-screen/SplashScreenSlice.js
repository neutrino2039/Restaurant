import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: true,
};

const splashScreenSlice = createSlice({
  name: 'splash-screen',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {setLoading} = splashScreenSlice.actions;

export default splashScreenSlice.reducer;

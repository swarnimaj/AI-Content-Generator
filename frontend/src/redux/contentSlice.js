import { createSlice } from '@reduxjs/toolkit';

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    generatedContent: '',
    isLoading: false,
    error: null,
  },
  reducers: {
    setGeneratedContent: (state, action) => {
      state.generatedContent = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setGeneratedContent, setLoading, setError } = contentSlice.actions;

export default contentSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState: { email: string; timer: number; currentQuestion: number } =
  {
    email: '',
    timer: 30,
    currentQuestion: 0,
  };

const persistSlice = createSlice({
  name: 'persistInfos',
  initialState,
  reducers: {
    updatePersistReducer: (state, action) => {
      const {
        email,
        timer,
        currentQuestion,
      }: { email?: string; timer?: number; currentQuestion?: number } =
        action.payload;
      if (email) {
        state.email = email;
      }
      if (typeof timer === 'number') {
        state.timer = timer;
      }
      if (currentQuestion) {
        state.currentQuestion = currentQuestion;
      }
    },
  },
});

export const { updatePersistReducer } = persistSlice.actions;
export default persistSlice.reducer;

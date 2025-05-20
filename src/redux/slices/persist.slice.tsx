import { createSlice } from '@reduxjs/toolkit';

const initialState: { timer: number; currentQuestion: number } = {
  timer: 30,
  currentQuestion: 0,
};

const persistSlice = createSlice({
  name: 'persistInfos',
  initialState,
  reducers: {
    updatePersistReducer: (state, action) => {
      const {
        timer,
        currentQuestion,
      }: {
        timer?: number;
        currentQuestion?: number;
      } = action.payload;

      if (typeof timer === 'number') {
        state.timer = timer;
      }

      if (typeof currentQuestion === 'number') {
        state.currentQuestion = currentQuestion;
      }
    },
  },
});

export const { updatePersistReducer } = persistSlice.actions;
export default persistSlice.reducer;

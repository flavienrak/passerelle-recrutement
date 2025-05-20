import { createSlice } from '@reduxjs/toolkit';

const initialState: { timer: number; currentQuestion: number; userId: string } =
  {
    timer: 30,
    currentQuestion: 0,
    userId: '',
  };

const persistSlice = createSlice({
  name: 'persistInfos',
  initialState,
  reducers: {
    updatePersistReducer: (state, action) => {
      const {
        timer,
        currentQuestion,
        userId,
      }: {
        timer?: number;
        currentQuestion?: number;
        userId?: string;
      } = action.payload;

      if (typeof timer === 'number') {
        state.timer = timer;
      }

      if (typeof currentQuestion === 'number') {
        state.currentQuestion = currentQuestion;
      }

      if (userId) {
        state.userId = userId;
      }
    },
    resetPersistReducer: () => {
      return initialState;
    },
  },
});

export const { updatePersistReducer, resetPersistReducer } =
  persistSlice.actions;
export default persistSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  email: string;
  timer: number;
  currentQuestion: number;
  acceptConditions: boolean;
} = {
  email: '',
  timer: 30,
  currentQuestion: 0,
  acceptConditions: false,
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
        acceptConditions,
      }: {
        email?: string;
        timer?: number;
        currentQuestion?: number;
        acceptConditions?: boolean;
      } = action.payload;
      if (email) {
        state.email = email;
      }
      if (typeof timer === 'number') {
        state.timer = timer;
      }
      if (typeof currentQuestion === 'number') {
        state.currentQuestion = currentQuestion;
      }
      if (typeof acceptConditions === 'boolean') {
        state.acceptConditions = acceptConditions;
      }
    },
  },
});

export const { updatePersistReducer } = persistSlice.actions;
export default persistSlice.reducer;

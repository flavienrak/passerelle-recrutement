import { createSlice } from '@reduxjs/toolkit';
import { CvInterface } from '../../interfaces/Cv.interface';
import { AnswerInterviewInterface } from '../../interfaces/AnswerInterview.interface';
import { TestInterviewInterface } from '../../interfaces/TestInterview.interface';

const initialState: {
  tests: TestInterviewInterface;
  interviews: { answers: AnswerInterviewInterface[] };
  cv: CvInterface | null;
} = {
  interviews: { answers: [] },
  tests: {
    answers: [],
    highContent: '',
    weakContent: '',
    synthese: '',
    email: '',
  },
  cv: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserReducer: (state, action) => {
      const data: {
        interviews?: { answers: AnswerInterviewInterface[] };
        tests?: TestInterviewInterface;
        cv?: CvInterface;
      } = action.payload;
      if (data.interviews) {
        state.interviews = data.interviews;
      }
      if (data.tests) {
        state.tests = data.tests;
      }
      if (data.cv) {
        state.cv = data.cv;
      }
    },
    resetUserReducer: () => {
      return initialState;
    },
  },
});

export const { updateUserReducer, resetUserReducer } = userSlice.actions;
export default userSlice.reducer;

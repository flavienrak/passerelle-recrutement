import { createSlice } from '@reduxjs/toolkit';
import { CvInterface } from '../../interfaces/Cv.interface';
import { InterviewInterface } from '../../interfaces/Interview.interface';
import { TestInterviewInterface } from '../../interfaces/TestInterview.interface';

const initialState: {
  tests: TestInterviewInterface;
  interviews: InterviewInterface[];
  cv: CvInterface | null;
} = {
  interviews: [],
  tests: { answers: [], synthese: '' },
  cv: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserReducer: (state, action) => {
      const data: {
        interviews?: InterviewInterface[];
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
  },
});

export const { updateUserReducer } = userSlice.actions;
export default userSlice.reducer;

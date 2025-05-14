import { createSlice } from '@reduxjs/toolkit';
import { CvInterface } from '../../interfaces/Cv.interface';
import { InterviewInterface } from '../../interfaces/Interview.interface';
import { TestResponseInterface } from '../../interfaces/TestResponse.interface';

const initialState: {
  tests: TestResponseInterface[];
  interviews: InterviewInterface[];
  cv: CvInterface | null;
} = {
  interviews: [],
  tests: [],
  cv: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserReducer: (state, action) => {
      const data: {
        interviews?: InterviewInterface[];
        tests?: TestResponseInterface[];
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

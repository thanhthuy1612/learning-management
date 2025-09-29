import type { PayloadAction } from '@reduxjs/toolkit';
import type { IQuestionItem } from 'src/types/question';

import { createSlice } from '@reduxjs/toolkit';

export type IExamDashboardReduce = {
  questions: IQuestionItem[];
};

const initialState: IExamDashboardReduce = {
  questions: [],
};

export const examDashboardSlice = createSlice({
  name: 'examDashboard',
  initialState,
  reducers: {
    updateExamChoice: (state, action: PayloadAction<IQuestionItem[]>) => {
      state.questions = action.payload;
    },
    resetStateExamDashboard: () => initialState,
  },
});

export default examDashboardSlice.reducer;

export const { resetStateExamDashboard, updateExamChoice } = examDashboardSlice.actions;

import type { PayloadAction } from '@reduxjs/toolkit';
import type { IQuestionItem } from 'src/types/question';

import { createSlice } from '@reduxjs/toolkit';

export type IExamDashboardReduce = {
  questions: IQuestionItem[];
  name: string;
  id: string;
};

const initialState: IExamDashboardReduce = {
  questions: [],
  name: '',
  id: '',
};

export const examDashboardSlice = createSlice({
  name: 'examDashboard',
  initialState,
  reducers: {
    updateExamChoice: (state, action: PayloadAction<IQuestionItem[]>) => {
      state.questions = action.payload;
    },
    updateExamName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updateExamId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    resetStateExamDashboard: () => initialState,
  },
});

export default examDashboardSlice.reducer;

export const { resetStateExamDashboard, updateExamChoice, updateExamName, updateExamId } =
  examDashboardSlice.actions;

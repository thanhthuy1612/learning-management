import type { PayloadAction } from '@reduxjs/toolkit';
import type { IQuestionItem } from 'src/types/question';

import { createSlice } from '@reduxjs/toolkit';

export type IExamReduce = {
  questions: IQuestionItem[];
  targetDate: number;
  name: string;
};

const initialState: IExamReduce = {
  questions: [],
  targetDate: 0,
  name: '',
};

export const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    updateQuestions: (state, action: PayloadAction<IQuestionItem[]>) => {
      state.questions = action.payload;
    },
    updateTargetDate: (state, action: PayloadAction<number>) => {
      state.targetDate = action.payload;
    },
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    resetStateExam: () => initialState,
  },
});

export default examSlice.reducer;

export const { resetStateExam, updateTargetDate, updateQuestions, updateName } = examSlice.actions;

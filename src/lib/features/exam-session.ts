import type { PayloadAction } from '@reduxjs/toolkit';
import type { IQuestionItem } from 'src/types/question';

import { createSlice } from '@reduxjs/toolkit';

export type IExamSessionReduce = {
  questions: IQuestionItem[];
};

const initialState: IExamSessionReduce = {
  questions: [],
};

export const examSessionSlice = createSlice({
  name: 'examSession',
  initialState,
  reducers: {
    updateQuestionsSession: (state, action: PayloadAction<IQuestionItem[]>) => {
      state.questions = action.payload;
    },
    resetStateExamSession: () => initialState,
  },
});

export default examSessionSlice.reducer;

export const { resetStateExamSession, updateQuestionsSession } = examSessionSlice.actions;

import type { PayloadAction } from '@reduxjs/toolkit';
import type { IQuestionItem } from 'src/types/question';
import type { IExamSessionRequestBody } from 'src/types/exam-session';

import { createSlice } from '@reduxjs/toolkit';

import { defaultPageSize, defaultPageIndex } from 'src/utils/default';

export type IExamSessionReduce = {
  questions: IQuestionItem[];
  filters?: IExamSessionRequestBody;
  searchText: string;
};

const initialState: IExamSessionReduce = {
  questions: [],
  searchText: '',
};

export const examSessionSlice = createSlice({
  name: 'examSession',
  initialState,
  reducers: {
    updateQuestionsSession: (state, action: PayloadAction<IQuestionItem[]>) => {
      state.questions = action.payload;
    },
    updateSearchTextExamSession: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    updateFiltersExamSession: (state, action: PayloadAction<IExamSessionRequestBody>) => {
      state.filters = action.payload;
    },
    updateFiltersSearchExamSession: (state, action: PayloadAction<string>) => {
      state.filters = {
        pageIndex: defaultPageIndex,
        pageSize: defaultPageSize,
        name: action.payload,
      };
    },
    resetStateExamSession: () => initialState,
  },
});

export default examSessionSlice.reducer;

export const {
  updateFiltersExamSession,
  updateFiltersSearchExamSession,
  updateSearchTextExamSession,
  resetStateExamSession,
  updateQuestionsSession,
} = examSessionSlice.actions;

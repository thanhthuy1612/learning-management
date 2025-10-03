import type { PayloadAction } from '@reduxjs/toolkit';
import type { IExamRequestBody } from 'src/types/exam';
import type { IQuestionItem } from 'src/types/question';

import { createSlice } from '@reduxjs/toolkit';

import { defaultPageSize, defaultPageIndex } from 'src/utils/default';

export type IExamDashboardReduce = {
  questions: IQuestionItem[];
  name: string;
  id: string;
  filters?: IExamRequestBody;
  searchText: string;
};

const initialState: IExamDashboardReduce = {
  questions: [],
  name: '',
  id: '',
  searchText: '',
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
    updateSearchTextExamDashboard: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    updateFiltersExamDashboard: (state, action: PayloadAction<IExamRequestBody>) => {
      state.filters = action.payload;
    },
    updateFiltersSearchExamDashboard: (state, action: PayloadAction<string>) => {
      state.filters = {
        pageIndex: defaultPageIndex,
        pageSize: defaultPageSize,
        name: action.payload,
      };
    },
    resetStateExamDashboard: () => initialState,
  },
});

export default examDashboardSlice.reducer;

export const {
  updateFiltersSearchExamDashboard,
  resetStateExamDashboard,
  updateSearchTextExamDashboard,
  updateFiltersExamDashboard,
  updateExamChoice,
  updateExamName,
  updateExamId,
} = examDashboardSlice.actions;

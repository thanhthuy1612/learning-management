import type { PayloadAction } from '@reduxjs/toolkit';
import type { ISubmission } from 'src/types/exam-session';

import { createSlice } from '@reduxjs/toolkit';

export interface IScoresRedux {
  filters?: string;
  searchText: string;
  submission: ISubmission[];
}
const initialState: IScoresRedux = {
  searchText: '',
  submission: [],
};

export const scoresSlice = createSlice({
  name: 'scores',
  initialState,
  reducers: {
    updateFiltersScores: (state, action: PayloadAction<string>) => {
      state.filters = action.payload;
    },
    updateSearchTextScores: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    updateSubmission: (state, action: PayloadAction<ISubmission[]>) => {
      state.submission = action.payload;
    },
    resetStateScores: () => initialState,
  },
});

export default scoresSlice.reducer;

export const { resetStateScores, updateSubmission, updateFiltersScores, updateSearchTextScores } =
  scoresSlice.actions;

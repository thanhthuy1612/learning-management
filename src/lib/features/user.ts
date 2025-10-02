import type { PayloadAction } from '@reduxjs/toolkit';
import type { IUserRequestBody } from 'src/types/user';

import { createSlice } from '@reduxjs/toolkit';

import { defaultPageSize, defaultPageIndex } from 'src/utils/default';

export interface IUserRedux {
  filters?: IUserRequestBody;
  searchText: string;
}
const initialState: IUserRedux = {
  searchText: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateFiltersUser: (state, action: PayloadAction<IUserRequestBody>) => {
      state.filters = action.payload;
    },
    updateFiltersSearchUser: (state, action: PayloadAction<string>) => {
      state.filters = {
        pageIndex: defaultPageIndex,
        pageSize: defaultPageSize,
        searchText: action.payload,
      };
    },
    updateSearchTextUser: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    resetStateUser: () => initialState,
  },
});

export default userSlice.reducer;

export const { resetStateUser, updateFiltersUser, updateFiltersSearchUser, updateSearchTextUser } =
  userSlice.actions;

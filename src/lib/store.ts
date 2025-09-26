import { configureStore } from '@reduxjs/toolkit';

import userSlice from './features/user';
import examSlice from './features/exam';

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userSlice,
      exam: examSlice,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

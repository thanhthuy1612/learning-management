import { configureStore } from '@reduxjs/toolkit';

import userSlice from './features/user';
import examSlice from './features/exam';
import scoresSlice from './features/scores';
import examSessionSlice from './features/exam-session';
import examDashboardSlice from './features/exam-dashboard';

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userSlice,
      exam: examSlice,
      examDashboard: examDashboardSlice,
      examSession: examSessionSlice,
      scores: scoresSlice,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

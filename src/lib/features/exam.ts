import type { PayloadAction } from '@reduxjs/toolkit';
import type { IPin, IQuestionItem } from 'src/types/question';

import { createSlice } from '@reduxjs/toolkit';

export type IExamReduce = {
  questions: IQuestionItem[];
  targetDate: number;
  name: string;
  pin: string;
  errorStepOne: string;
  dataStepOne?: IPin;
};

const initialState: IExamReduce = {
  questions: [],
  targetDate: 0,
  name: '',
  pin: '',
  errorStepOne: '',
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
    updatePin: (state, action: PayloadAction<string>) => {
      state.pin = action.payload;
    },
    updateErrorStepOne: (state, action: PayloadAction<string>) => {
      state.errorStepOne = action.payload;
    },
    updateData: (state, action: PayloadAction<IPin>) => {
      state.dataStepOne = action.payload;
    },
    resetStateExam: () => initialState,
  },
});

export default examSlice.reducer;

export const {
  resetStateExam,
  updateErrorStepOne,
  updatePin,
  updateTargetDate,
  updateQuestions,
  updateName,
  updateData,
} = examSlice.actions;

import type { PayloadAction } from '@reduxjs/toolkit';
import type { SignInSchemaType } from 'src/auth/view/jwt';

import { createSlice } from '@reduxjs/toolkit';

const initialState: SignInSchemaType = {
  email: '',
  password: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updateUser: (_state, action: PayloadAction<SignInSchemaType>) => ({
      ...action.payload,
    }),
    resetStateUser: () => initialState,
  },
});

export default userSlice.reducer;

export const { resetStateUser, updateEmail, updateUser } = userSlice.actions;

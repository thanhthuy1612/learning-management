/* eslint-disable no-useless-catch */

'use client';

import type { UserType } from 'src/auth/types';

import axios from 'axios';

import { endpoints } from 'src/lib/axios';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  userName: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  userName,
  password,
}: SignInParams): Promise<UserType> => {
  try {
    const params = { userName, password };

    const res = await axios.post(endpoints.auth.login, params);

    const { accessToken } = res.data;

    if (!res.data.data) {
      throw new Error(res.data.message);
    }
    // localStorage.setItem(USER_LOCAL_STORAGE, JSON.stringify(res.data));
    setSession(accessToken);

    return res.data;
  } catch (error) {
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, accessToken);
  } catch (error) {
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await axios.post(endpoints.auth.logout);
    await setSession(null);
  } catch (error) {
    throw error;
  }
};

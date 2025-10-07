'use client';

import axios from 'axios';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { endpoints } from 'src/lib/axios';

import { setSession } from './utils';
import { AuthContext } from '../auth-context';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      // const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);
      // const refreshToken = sessionStorage.getItem(JWT_REFRESH_STORAGE_KEY);
      // const userString = localStorage.getItem(USER_LOCAL_STORAGE) ?? '';

      // if (userString && userString != 'undefined') {
      // setSession(accessToken, refreshToken);

      const res = await axios.get(endpoints.auth.me);
      const data = res.data;
      setSession(data?.accessToken);

      // const user = JSON.parse(userString);
      if (data) {
        setState({ user: data, loading: false });
      } else {
        setState({ user: null, loading: false });
        // sessionStorage.removeItem(USER_LOCAL_STORAGE);
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
      // sessionStorage.removeItem(USER_LOCAL_STORAGE);
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------
  console.log(state.user);
  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}

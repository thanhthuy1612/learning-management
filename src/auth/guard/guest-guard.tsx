'use client';

import React, { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();

  const { loading, authenticated, user } = useAuthContext();

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = React.useCallback(async (): Promise<void> => {
    setIsChecking(true);
    console.log(loading, authenticated);
    if (loading) {
      return;
    }

    if (authenticated) {
      console.log(returnTo);
      router.replace(returnTo);
      return;
    }

    setIsChecking(false);
  }, [authenticated, loading, returnTo, router]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

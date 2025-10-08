'use client';

import React, { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

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
  const returnTo = searchParams.get('returnTo') || paths.dashboard.root;

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = React.useCallback(async (): Promise<void> => {
    setIsChecking(true);
    if (loading) {
      return;
    }

    if (authenticated) {
      router.push(returnTo);
      return;
    }

    setIsChecking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading, returnTo, user, router]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

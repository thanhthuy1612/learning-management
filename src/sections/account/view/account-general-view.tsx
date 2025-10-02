'use client';

import type { IUserItem } from 'src/types/user';

import { UserNewEditForm } from 'src/sections/user/user-new-edit-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function AccountGeneralView() {
  const { user } = useAuthContext();
  return <UserNewEditForm currentUser={user as IUserItem} />;
}

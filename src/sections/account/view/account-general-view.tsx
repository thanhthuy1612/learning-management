'use client';

import type { IUserItem } from 'src/types/user';

import { UserNewEditForm } from 'src/sections/user/user-new-edit-form';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function AccountGeneralView() {
  const { user } = useMockedUser();
  return <UserNewEditForm currentUser={user as unknown as IUserItem} />;
}

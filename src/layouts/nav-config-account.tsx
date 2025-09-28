import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import type { AccountDrawerProps } from './components/account-drawer';

// ----------------------------------------------------------------------

export const _account: AccountDrawerProps['data'] = [
  { label: 'Home', href: '/', icon: <Iconify icon="solar:home-angle-bold-duotone" /> },
  {
    label: 'Profile',
    href: paths.dashboard.user.account,
    icon: <Iconify icon="custom:profile-duotone" />,
  },
];

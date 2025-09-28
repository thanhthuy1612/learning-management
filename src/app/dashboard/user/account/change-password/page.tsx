import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountChangePasswordView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Đổi mật khẩu | Tổng quan - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountChangePasswordView />;
}

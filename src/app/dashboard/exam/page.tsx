import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountGeneralView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Đề thi | Tổng quan - ${CONFIG.appName}` };

export default function Page() {
  return <AccountGeneralView />;
}

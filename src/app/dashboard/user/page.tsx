import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountGeneralView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `User profile | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AccountGeneralView />;
}

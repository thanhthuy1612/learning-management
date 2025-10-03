import { CONFIG } from 'src/global-config';

import { OverviewAppView } from 'src/sections/dashboard/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Tổng quan - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewAppView />;
}

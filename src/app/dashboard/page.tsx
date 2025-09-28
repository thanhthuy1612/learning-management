import { CONFIG } from 'src/global-config';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Tổng quan - ${CONFIG.appName}` };

export default function Page() {
  return <BlankView title="Page one" />;
}

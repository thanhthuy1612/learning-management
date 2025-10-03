import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ScoresListView } from 'src/sections/scores/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Danh sách điểm thi | Tổng quan - ${CONFIG.appName}` };

export default function Page() {
  return <ScoresListView />;
}

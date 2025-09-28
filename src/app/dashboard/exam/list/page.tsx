import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ExamListView } from 'src/sections/exam-dashboard/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Danh sách đề thi | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ExamListView />;
}

import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ExamListView } from 'src/sections/exam-dashboard/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Đề thi | Tổng quan - ${CONFIG.appName}` };

export default function Page() {
  return <ExamListView />;
}

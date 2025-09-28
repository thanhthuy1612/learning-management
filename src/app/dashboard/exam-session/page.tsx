import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ExamSessionListView } from 'src/sections/exam-session/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Danh sách kì thi | Tổng quan - ${CONFIG.appName}` };

export default function Page() {
  return <ExamSessionListView />;
}

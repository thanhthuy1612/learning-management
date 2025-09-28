import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ExamCreateView } from 'src/sections/exam-dashboard/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Tạo đề thi | Tổng quan - ${CONFIG.appName}` };

export default function Page() {
  return <ExamCreateView />;
}

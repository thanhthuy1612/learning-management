import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ExamSessionCreateView } from 'src/sections/exam-session/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Tạo mới kỳ thi | Tổng quan - ${CONFIG.appName}` };

export default function Page() {
  return <ExamSessionCreateView />;
}

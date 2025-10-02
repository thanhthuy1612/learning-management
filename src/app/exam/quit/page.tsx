import { CONFIG } from 'src/global-config';

import { ExamView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Bài thi - ${CONFIG.appName}` };

export default function Page() {
  return <ExamView />;
}

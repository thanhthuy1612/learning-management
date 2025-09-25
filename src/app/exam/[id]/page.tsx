import { CONFIG } from 'src/global-config';

import { ExamView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ExamView />;
}

import { CONFIG } from 'src/global-config';
import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { ExamPinView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Vào thi - ${CONFIG.appName}` };

export default function Page() {
  return (
    <AuthCenteredLayout>
      <ExamPinView />
    </AuthCenteredLayout>
  );
}

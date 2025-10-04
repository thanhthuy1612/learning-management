import type { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'TRƯỜNG THCS CỔ PHÚC',
  description: 'KIỂM TRA, ĐÁNH GIÁ TRỰC TUYẾN - TRƯỜNG THCS CỔ PHÚC, XÃ TRẤN YÊN, TỈNH LÀO CAI',
};

export default function Page() {
  return <HomeView />;
}

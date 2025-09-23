'use client';

import type { AppStore } from 'src/lib/store';

import React from 'react';
import { Provider } from 'react-redux';

import { makeStore } from 'src/lib/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = React.useRef<AppStore>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

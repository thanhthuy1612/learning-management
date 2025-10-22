'use client';

import { useEffect } from 'react';

export function useChunkErrorReload() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Loading chunk')) {
        console.warn('[ChunkLoadError] Reloading page due to missing JS chunk...');
        window.location.reload();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
}

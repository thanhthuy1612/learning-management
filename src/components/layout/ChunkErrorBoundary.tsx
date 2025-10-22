'use client';

import { useChunkErrorReload } from 'src/utils/chunk-error-handler';

export function ChunkErrorBoundary() {
  useChunkErrorReload();
  return null;
}

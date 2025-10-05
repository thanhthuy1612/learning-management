'use client';

import type { GridSlotProps } from '@mui/x-data-grid';

import React from 'react';

import { Box, Button } from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  }
}

export type Props = GridSlotProps['toolbar'] & {
  showSearch?: boolean;
  exportCurrentPage?: () => void;
};

export const localeText = {
  toolbarColumns: 'Cột',
  toolbarFilters: 'Bộ lọc',
  toolbarDensity: 'Mật độ',
  toolbarExport: 'Xuất',
};

export function CustomDataGridToolbar({
  setFilterButtonEl,
  showSearch,
  sx,
  exportCurrentPage,
}: Props) {
  return (
    <GridToolbarContainer sx={{ mt: 2, ...sx }}>
      {showSearch && <GridToolbarQuickFilter />}
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarDensitySelector />
      {/* <GridToolbarExport /> */}
      <Button
        startIcon={<Iconify icon="solar:export-bold" />}
        sx={{ p: 0.5, borderRadius: 1 }}
        onClick={exportCurrentPage}
      >
        Xuất Excel
      </Button>
    </GridToolbarContainer>
  );
}

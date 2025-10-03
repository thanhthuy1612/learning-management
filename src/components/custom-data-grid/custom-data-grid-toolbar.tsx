import type { GridSlotProps } from '@mui/x-data-grid';

import React from 'react';

import { Box } from '@mui/material';
import {
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

// ----------------------------------------------------------------------

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  }
}

export type Props = GridSlotProps['toolbar'] & {
  showSearch?: boolean;
};

export const localeText = {
  toolbarColumns: 'Cột',
  toolbarFilters: 'Bộ lọc',
  toolbarDensity: 'Mật độ',
  toolbarExport: 'Xuất',
};

export function CustomDataGridToolbar({ setFilterButtonEl, showSearch, sx }: Props) {
  return (
    <GridToolbarContainer sx={{ mt: 2, ...sx }}>
      {showSearch && <GridToolbarQuickFilter />}
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

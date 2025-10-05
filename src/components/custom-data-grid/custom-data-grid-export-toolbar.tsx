import type { GridSlotProps } from '@mui/x-data-grid';

import React from 'react';

import { GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';

// ----------------------------------------------------------------------

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  }
}

export type Props = GridSlotProps['toolbar'] & {};

export const localeText = {
  toolbarColumns: 'Cột',
  toolbarFilters: 'Bộ lọc',
  toolbarDensity: 'Mật độ',
  toolbarExport: 'Xuất',
};

export function CustomDataGridExportToolbar({ sx }: Props) {
  return (
    <GridToolbarContainer sx={{ mt: 2, ...sx }}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

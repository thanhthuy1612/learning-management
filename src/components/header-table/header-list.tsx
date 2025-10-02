'use client';

import { Box, CardHeader } from '@mui/material';
import {
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

// ----------------------------------------------------------------------

export type Props = {
  header?: string;
};

// ----------------------------------------------------------------------

export function HeaderList({ header }: Props) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      sx={{ px: 2.5 }}
    >
      <CardHeader sx={{ m: 0, p: 0, width: 'fit-content' }} title={header ?? 'Danh sách'} />
      <GridToolbarContainer
        sx={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', pb: 2.5, gap: 2.5 }}
      >
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <GridToolbarColumnsButton />
      </GridToolbarContainer>
    </Box>
  );
}

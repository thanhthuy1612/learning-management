import type { DataGridProps } from '@mui/x-data-grid';

import React from 'react';

import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { varAlpha } from 'src/theme/styles';

const ODD_OPACITY = 0.1;

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor:
      theme.palette.mode === 'light'
        ? varAlpha(theme.vars.palette.grey['300Channel'], 0.2)
        : theme.palette.grey[900],
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
  [`& .${gridClasses.row}`]: {
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '.standard': {
      minHeight: '52px',
      display: 'flex',
      alignItems: 'center',
    },
    '.compact': {
      minHeight: '36px',
      display: 'flex',
      alignItems: 'center',
    },
    '.comfortable': {
      minHeight: '67px',
      display: 'flex',
      alignItems: 'center',
    },
  },
  // [`& .${gridClasses.columnHeader}`]: {
  //   backgroundColor: theme.vars.palette.background.paper,
  //   borderTop: '1px solid',
  //   borderBottom: '1px solid',
  //   borderColor: theme.vars.palette.divider,
  // },
}));

export type CustomDataGridProps = DataGridProps & {};

export default function CustomDataGrid({ ...props }: CustomDataGridProps) {
  return (
    <StyledDataGrid
      {...props}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 1 ? 'even' : 'odd')}
    />
  );
}

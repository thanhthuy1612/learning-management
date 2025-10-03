import type { Theme, SxProps } from '@mui/material/styles';
import type { PaginationProps } from '@mui/material/Pagination';

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { Stack, Select, MenuItem, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export type PaginationCustomProps = PaginationProps & {
  sx?: SxProps<Theme>;
  rowsPerPageOptions?: number[];
  rowsPerPage?: number;
  onRowsPerPageChange: (event: number) => void;
  total: number;
  optionAll?: boolean;
};

export function PaginationCustom({
  sx,
  rowsPerPageOptions = [10, 25, 50, 100],
  rowsPerPage,
  onRowsPerPageChange,
  total,
  optionAll,
  ...other
}: PaginationCustomProps) {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent={{ xs: 'center', md: 'space-between' }}
      alignItems="center"
      sx={{
        m: 2,
        width: 1,
        ...sx,
      }}
    >
      <Box sx={{ typography: 'body2' }}>
        <strong>{total} </strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          kết quả được tìm thấy
        </Box>
      </Box>
      <Box display="flex" alignItems="center" gap={3}>
        <Stack direction="row" gap={2} alignItems="center" justifyContent="center">
          <Typography>Số hàng trên mỗi trang:</Typography>
          <Select
            value={rowsPerPage}
            onChange={(row) => {
              onRowsPerPageChange(Number(row.target.value));
            }}
            sx={{
              padding: 1,
              '& .MuiSelect-select': {
                padding: '2px 4px',
              },
            }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
            {optionAll && (
              <MenuItem key={total} value={total}>
                Tất cả
              </MenuItem>
            )}
          </Select>
        </Stack>
        <Pagination
          defaultPage={other.page}
          page={other.page}
          sx={{ borderTopColor: 'transparent' }}
          variant="outlined"
          color="primary"
          {...other}
        />
      </Box>
    </Box>
  );
}

import type { Theme, SxProps } from '@mui/material';

import { useCallback } from 'react';

import { Grid, Button, TextField, InputAdornment } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { updateSearchTextExamSession } from 'src/lib/features';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  sx?: SxProps<Theme>;
};

export function ExamSessionTableToolbar({ sx, onResetPage }: Props) {
  const { searchText } = useAppSelector((state) => state.examSession);
  const dispatch = useAppDispatch();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateSearchTextExamSession(event.target.value));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Grid container spacing={2} alignItems="end" sx={{ ...sx }}>
      <Grid size={{ xs: 12, md: 10 }}>
        <TextField
          fullWidth
          value={searchText}
          onChange={handleFilterName}
          placeholder="Tìm kiếm..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <Button
          variant="contained"
          onClick={onResetPage}
          sx={{ width: 1, height: '56px' }}
          startIcon={<Iconify icon="eva:search-fill" />}
        >
          Tìm kiếm
        </Button>
      </Grid>
    </Grid>
  );
}

'use client';

import { Stack } from '@mui/material';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Exam } from '../exam';

// ----------------------------------------------------------------------

export function ExamView() {
  return (
    <Stack>
      <CustomBreadcrumbs
        links={[{ name: 'Trường' }, { name: 'Lớp' }, { name: 'Môn thi' }]}
        sx={{ mb: 3, zIndex: 2 }}
      />

      <Exam />
    </Stack>
  );
}

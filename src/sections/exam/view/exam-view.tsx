'use client';

import React from 'react';

import { Stack } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAppSelector } from 'src/lib/hooks';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Exam } from '../exam';
import { SubmitDone } from '../submit-done';

// ----------------------------------------------------------------------

export function ExamView() {
  const { questions, submit } = useAppSelector((state) => state.exam);
  const router = useRouter();

  React.useEffect(() => {
    if (!questions.length) {
      router.push(paths.pin);
    }
  }, [questions, router]);

  const renderBody = () => {
    if (submit) return <SubmitDone />;
    return <Exam />;
  };

  return (
    <Stack
      sx={{
        width: 1,
        userSelect: 'none',
      }}
    >
      <CustomBreadcrumbs
        links={[{ name: 'Trường' }, { name: 'Lớp' }, { name: 'Môn thi' }]}
        sx={{ mb: 3, zIndex: 2, width: 1 }}
      />

      {renderBody()}
    </Stack>
  );
}

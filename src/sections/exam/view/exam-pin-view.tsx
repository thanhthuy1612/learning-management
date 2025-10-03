'use client';

import Alert from '@mui/material/Alert';

import { useAppSelector } from 'src/lib/hooks';

import { AnimateLogoRotate } from 'src/components/animate';

import { ExamNameForm } from '../exam-name-form';

// ----------------------------------------------------------------------

export function ExamPinView() {
  const { errorStepOne } = useAppSelector((state) => state.exam);
  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      {!!errorStepOne && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorStepOne}
        </Alert>
      )}

      <ExamNameForm />
    </>
  );
}

'use client';

import React from 'react';

import Alert from '@mui/material/Alert';
import { Typography } from '@mui/material';

import { resetStateExam } from 'src/lib/features';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';

import { AnimateLogoRotate } from 'src/components/animate';

import { ExamNameForm } from '../exam-name-form';

// ----------------------------------------------------------------------

export function ExamPinView() {
  const { errorStepOne } = useAppSelector((state) => state.exam);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(resetStateExam());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />
      <Typography variant="h5" sx={{ mb: 1, textAlign: 'center' }}>
        Trường THCS Cổ Phúc
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
        KIỂM TRA, ĐÁNH GIÁ TRỰC TUYẾN
      </Typography>
      {!!errorStepOne && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorStepOne}
        </Alert>
      )}

      <ExamNameForm />
    </>
  );
}

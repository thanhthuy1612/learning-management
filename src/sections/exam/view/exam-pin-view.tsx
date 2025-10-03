'use client';

import Alert from '@mui/material/Alert';
import { Typography } from '@mui/material';

import { useAppSelector } from 'src/lib/hooks';

import { AnimateLogoRotate } from 'src/components/animate';

import { ExamNameForm } from '../exam-name-form';

// ----------------------------------------------------------------------

export function ExamPinView() {
  const { errorStepOne } = useAppSelector((state) => state.exam);
  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />
      <Typography variant="h5" sx={{ mb: 1, textAlign: 'center' }}>
        Trường THCS Cổ Phúc
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
        KIỂM TRA, ĐÁNH GIÁ TRƯỜNG THCS CỔ PHÚC, XÃ TRẤN YÊN, TỈNH LÀO CA
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

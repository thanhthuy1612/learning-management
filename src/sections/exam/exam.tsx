'use client';

import React, { useState } from 'react';

import { Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { ExamFormView } from './exam-form';

// ----------------------------------------------------------------------

export function Exam() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const theme = useTheme();

  const defaultCSSCard = {
    p: 3,
    zIndex: 2,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    bgcolor: theme.vars.palette.background.default,
    width: 1,
  };

  return (
    <Stack>
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <ExamFormView
        handleSend={(error?: string) => {
          if (error) setErrorMessage(error);
        }}
        sx={defaultCSSCard}
      />
    </Stack>
  );
}

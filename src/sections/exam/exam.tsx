'use client';

import type { IQuestionItem } from 'src/types/question';

import { useState } from 'react';

import { Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { _question } from 'src/_mock/_question';

import { ExamFormView } from './exam-form';

// ----------------------------------------------------------------------

export function Exam() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const theme = useTheme();

  const defaultCSSCard = {
    p: 3,
    width: 'calc(100% - 48px)',
    zIndex: 2,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    bgcolor: theme.vars.palette.background.default,
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
        questions={_question.De_1 as unknown as IQuestionItem[]}
        sx={defaultCSSCard}
      />
    </Stack>
  );
}

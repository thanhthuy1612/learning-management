'use client';

import type { Choice } from 'src/types/question';
import type { Theme, SxProps } from '@mui/material';

import React from 'react';

import { Box, useTheme, Typography, LinearProgress } from '@mui/material';

import { useAppSelector } from 'src/lib/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { ExamTimer } from './exam-timer';

// ----------------------------------------------------------------------
type Props = {
  sx?: SxProps<Theme>;
  progress?: number;
  renderButtonSubmit: React.ReactNode;
  fields: {
    question: string;
    answer: '' | Choice;
  }[];
};

// ----------------------------------------------------------------------

export function ExamFooter({ sx, renderButtonSubmit, fields = [] }: Props) {
  const theme = useTheme();

  const { targetDate } = useAppSelector((state) => state.exam);

  return (
    <Box
      sx={{
        ...sx,
        position: 'fixed',
        bottom: 0,
        z: 5,
        left: 0,
        width: '100%',
        pb: 3,
        borderRadius: 0,
        backgroundColor: theme.vars.palette.background.paper,
      }}
    >
      <LinearProgress
        variant="determinate"
        value={(fields.filter((item) => item.answer !== '').length / fields.length) * 100}
        color="primary"
        sx={{ mb: 1 }}
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          Hoàn thành {fields.filter((item) => item.answer !== '').length}/{fields.length}
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          {targetDate > new Date().getTime() ? (
            <ExamTimer targetDate={targetDate} />
          ) : (
            <Label
              color="error"
              sx={{
                width: 'fit-content',
                p: 1,
                height: '36px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 1,
              }}
            >
              <Iconify width={16} icon="solar:clock-circle-bold" /> Hết giờ
            </Label>
          )}
          {renderButtonSubmit}
        </Box>
      </Box>
    </Box>
  );
}

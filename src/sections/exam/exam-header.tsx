'use client';

import type { Theme, SxProps } from '@mui/material';

import React from 'react';

import { Box, Card, Typography, LinearProgress } from '@mui/material';

import { ExamTimer } from './exam-timer';

// ----------------------------------------------------------------------
type Props = {
  sx?: SxProps<Theme>;
  targetDate: Date;
  progress?: number;
  renderButtonSubmit: React.ReactNode;
};

// ----------------------------------------------------------------------

export function ExamHeader({ sx, targetDate, progress = 0, renderButtonSubmit }: Props) {
  return (
    <Card sx={{ ...sx, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Bài thi</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <ExamTimer targetDate={targetDate} />
          {renderButtonSubmit}
        </Box>
      </Box>
      <Typography variant="body2">Hoàn thành 2/10</Typography>
      <LinearProgress sx={{ mb: 1.5 }} variant="determinate" value={progress} color="primary" />
    </Card>
  );
}

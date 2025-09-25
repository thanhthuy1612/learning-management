'use client';

import React from 'react';
import { useCountdownDate } from 'minimal-shared/hooks';

import { Box, Stack } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
type Props = {
  targetDate: Date;
};

// ----------------------------------------------------------------------

export function ExamTimer({ targetDate }: Props) {
  const countdown = useCountdownDate(targetDate);

  return (
    <Label
      color="primary"
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
      <Iconify width={16} icon="solar:clock-circle-bold" />
      <Stack
        divider={<Box sx={{ mx: 0 }}>:</Box>}
        sx={{
          typography: 'body2',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        {Number(countdown?.days) > 0 && <TimeBlock label="days" value={countdown.days} />}
        <TimeBlock label="hours" value={countdown.hours} />
        <TimeBlock label="minutes" value={countdown.minutes} />
        <TimeBlock label="seconds" value={countdown.seconds} />
      </Stack>
    </Label>
  );
}

// ----------------------------------------------------------------------

type TimeBlockProps = {
  label: string;
  value: string;
};

function TimeBlock({ label, value }: TimeBlockProps) {
  return (
    <Box>
      <Box> {value} </Box>
      {/* <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box> */}
    </Box>
  );
}

'use client';

import React from 'react';

import { Box, Stack } from '@mui/material';

import { useCountdownDate } from 'src/hooks/use-countdown';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
type Props = {
  targetDate: number;
};

// ----------------------------------------------------------------------

export function ExamTimer({ targetDate }: Props) {
  const countdown = useCountdownDate(new Date(targetDate));

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
        <TimeBlock value={countdown.hours} />
        <TimeBlock value={countdown.minutes} />
        <TimeBlock value={countdown.seconds} />
      </Stack>
    </Label>
  );
}

// ----------------------------------------------------------------------

type TimeBlockProps = {
  label?: string;
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

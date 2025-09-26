'use client';

import type { Choice } from 'src/types/question';
import type { Theme, SxProps } from '@mui/material';

import React from 'react';

import { Box, Card, Grid, Link, Stack, Button, Typography, LinearProgress } from '@mui/material';

import { useAppSelector } from 'src/lib/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { ExamTimer } from './exam-timer';

// ----------------------------------------------------------------------
type Props = {
  ref: React.RefObject<HTMLDivElement | null>;
  sx?: SxProps<Theme>;
  renderButtonSubmit: React.ReactNode;
  fields: {
    question: string;
    answer: '' | Choice;
  }[];
};

// ----------------------------------------------------------------------

export function ExamHeader({ sx, renderButtonSubmit, fields = [], ref }: Props) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const { targetDate } = useAppSelector((state) => state.exam);

  const handleToggle = () => {
    setIsExpanded((pre) => !pre);
  };

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const offset = window.innerHeight / 2 - elementRect.height / 2;

      window.scrollTo({
        top: window.scrollY + elementRect.top - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Card ref={ref} sx={{ ...sx, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="end">
        <Typography variant="h5">Bài thi</Typography>
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
      <LinearProgress
        variant="determinate"
        value={(fields.filter((item) => item.answer !== '').length / fields.length) * 100}
        color="primary"
        sx={{ mt: 1 }}
      />
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2">
            Hoàn thành {fields.filter((item) => item.answer !== '').length}/{fields.length}
          </Typography>
          <Link
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: 1,
              fontWeight: 600,
              color: 'primary.main',
              justifyContent: 'flex-end',
            }}
            onClick={handleToggle}
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            <Iconify
              icon={isExpanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </Link>
        </Box>
        <Box
          sx={{
            transition: 'height 0.5s ease',
            height: isExpanded ? '1000px' : '0px',
            maxHeight: 'fit-content',
            overflow: 'hidden',
          }}
        >
          <Grid container spacing={1}>
            {fields.map((field, index) => (
              <Grid key={index}>
                <Button
                  color="primary"
                  variant={field?.answer ? 'contained' : 'outlined'}
                  sx={{ width: 'fit-content' }}
                  onClick={() => handleScroll(`question_${index}`)}
                >
                  {index + 1}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Card>
  );
}

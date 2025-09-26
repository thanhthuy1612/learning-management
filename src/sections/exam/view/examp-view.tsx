'use client';

import type { IQuestionItem } from 'src/types/question';

import React from 'react';

import { Stack } from '@mui/material';

import { _question } from 'src/_mock/_question';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { updateQuestions, updateTargetDate } from 'src/lib/features';

import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Exam } from '../exam';
import { ExamExpried } from '../examp-expired';

// ----------------------------------------------------------------------

export function ExamView() {
  const [isVisible, setIsVisible] = React.useState(true);
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  const dispatch = useAppDispatch();
  const { targetDate } = useAppSelector((state) => state.exam);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const newTimer = setTimeout(() => {
          alert('Bạn đã không focus vào trang trong 3 giây!');
        }, 3000);
        setTimer(newTimer);
      } else {
        if (timer) {
          clearTimeout(timer);
          setTimer(null);
        }
      }
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  React.useEffect(() => {
    dispatch(updateQuestions(_question.De_1 as unknown as IQuestionItem[]));
    dispatch(updateTargetDate(new Date('2025-09-27 5:00').getTime()));
  }, [dispatch]);

  const renderBody = () => {
    if (!isVisible) return <></>;
    if (!targetDate) return <SplashScreen />;
    if (targetDate - new Date().getTime() < 5 * 60 * 1000) return <ExamExpried />;
    return <Exam />;
  };

  return (
    <Stack
      sx={{
        width: 1,
        userSelect: 'none',
      }}
    >
      <CustomBreadcrumbs
        links={[{ name: 'Trường' }, { name: 'Lớp' }, { name: 'Môn thi' }]}
        sx={{ mb: 3, zIndex: 2, width: 1 }}
      />

      {renderBody()}
    </Stack>
  );
}

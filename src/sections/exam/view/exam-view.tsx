'use client';

import React from 'react';

import { Stack } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'src/lib/hooks';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Exam } from '../exam';

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

  const renderBody = () => {
    if (!isVisible) return null;
    // if (!targetDate) return <SplashScreen />;
    // if (targetDate - new Date().getTime() < 5 * 60 * 1000) return <ExamExpried />;
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

'use client';

import React from 'react';

import { Stack } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAppSelector } from 'src/lib/hooks';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Exam } from '../exam';

// ----------------------------------------------------------------------

export function ExamView() {
  const [isVisible, setIsVisible] = React.useState(true);
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  const { questions } = useAppSelector((state) => state.exam);
  const router = useRouter();
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
    if (!questions) {
      router.push(paths.pin);
    }
  }, [questions, router]);

  const renderBody = () => {
    if (!isVisible) return null;
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

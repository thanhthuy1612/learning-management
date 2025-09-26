'use client';

import type { IQuestionItem } from 'src/types/question';

import React from 'react';

import { Stack } from '@mui/material';

import { _question } from 'src/_mock/_question';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { updateQuestions, updateTargetDate } from 'src/lib/features';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Exam } from '../exam';
import { ExamExpried } from '../examp-expired';

// ----------------------------------------------------------------------

export function ExamView() {
  const dispatch = useAppDispatch();
  const { targetDate } = useAppSelector((state) => state.exam);

  React.useEffect(() => {
    dispatch(updateQuestions(_question.De_1 as unknown as IQuestionItem[]));
    dispatch(updateTargetDate(new Date('2025-09-27 1:00').getTime()));
  }, [dispatch]);

  const renderBody = () => {
    if (targetDate && targetDate > new Date().getTime()) <ExamExpried />;
    return <Exam />;
  };

  return (
    <Stack sx={{ width: 1 }}>
      <CustomBreadcrumbs
        links={[{ name: 'Trường' }, { name: 'Lớp' }, { name: 'Môn thi' }]}
        sx={{ mb: 3, zIndex: 2, width: 1 }}
      />

      <Exam />
    </Stack>
  );
}

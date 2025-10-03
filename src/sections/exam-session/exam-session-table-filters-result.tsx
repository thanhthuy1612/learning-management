import type { IExamRequestBody } from 'src/types/exam';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { defaultPageSize, defaultPageIndex } from 'src/utils/default';

import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { updateFiltersSearchExamSession } from 'src/lib/features';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  onResetPage: (body: IExamRequestBody) => void;
};

export function ExamSessionTableFiltersResult({ onResetPage, totalResults, sx }: Props) {
  const { filters } = useAppSelector((state) => state.examSession);

  const dispatch = useAppDispatch();

  const handleRemoveKeyword = useCallback(() => {
    onResetPage({
      pageIndex: defaultPageIndex,
      pageSize: defaultPageSize,
      name: '',
    });
    dispatch(updateFiltersSearchExamSession(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = useCallback(() => {
    onResetPage({
      pageIndex: defaultPageIndex,
      pageSize: defaultPageSize,
      name: '',
    });
    dispatch(updateFiltersSearchExamSession(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Từ khoá:" isShow={!!filters?.name}>
        <Chip {...chipProps} label={filters?.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}

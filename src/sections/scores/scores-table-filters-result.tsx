import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { updateFiltersScores } from 'src/lib/features';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  onResetPage: () => void;
};

export function ScoresTableFiltersResult({ onResetPage, totalResults, sx }: Props) {
  const { filters } = useAppSelector((state) => state.scores);

  const dispatch = useAppDispatch();

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    dispatch(updateFiltersScores(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = useCallback(() => {
    onResetPage();
    dispatch(updateFiltersScores(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Từ khoá:" isShow={!!filters}>
        <Chip {...chipProps} label={filters} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}

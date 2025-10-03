import type { IUserRequestBody } from 'src/types/user';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { defaultPageSize, defaultPageIndex } from 'src/utils/default';

import { updateFiltersSearchUser } from 'src/lib/features';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  onResetPage: (body?: IUserRequestBody) => void;
};

export function UserTableFiltersResult({ onResetPage, totalResults, sx }: Props) {
  const { filters } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const handleRemoveKeyword = useCallback(() => {
    onResetPage({
      pageIndex: defaultPageIndex,
      pageSize: defaultPageSize,
      searchText: '',
    });
    dispatch(updateFiltersSearchUser(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = useCallback(() => {
    onResetPage({
      pageIndex: defaultPageIndex,
      pageSize: defaultPageSize,
      searchText: '',
    });
    dispatch(updateFiltersSearchUser(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Từ khoá:" isShow={!!filters?.searchText}>
        <Chip {...chipProps} label={filters?.searchText} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}

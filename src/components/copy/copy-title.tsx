'use client';

import React from 'react';

import { Tooltip, Typography } from '@mui/material';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { toast } from '../snackbar';

// ----------------------------------------------------------------------

export type Props = {
  value: string;
};

// ----------------------------------------------------------------------

export function CopyTitle({ value }: Props) {
  const { copy } = useCopyToClipboard();

  const onCopy = React.useCallback(
    (text: string) => {
      if (text) {
        toast.success('Copied!');
        copy(text);
      }
    },
    [copy]
  );

  return (
    <Tooltip title={value}>
      <Typography
        onClick={() => onCopy(value)}
        variant="inherit"
        sx={{
          cursor: 'poiter',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </Tooltip>
  );
}

'use client';

import type { LinkProps } from '@mui/material/Link';

import Image from 'next/image';
import { mergeClasses } from 'minimal-shared/utils';

import { Box, Link, styled } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';
// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
  size?: number;
};

export function Logo({
  size,
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {
  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 40,
          height: 40,
          ...(!isSingle && { width: 102, height: 36 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ borderRadius: '100%', ...sx }}>
        <Image
          alt="logo"
          src="/assets/images/logo.png"
          width={size ?? '40'}
          height={size ?? '40'}
          style={{ borderRadius: '100%' }}
        />
      </Box>
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));

'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import { Fragment } from 'react';

import Portal from '@mui/material/Portal';
import { Box, styled } from '@mui/material';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type SplashScreenProps = React.ComponentProps<'div'> & {
  portal?: boolean;
  sx?: SxProps<Theme>;
  slotProps?: {
    wrapper?: React.ComponentProps<typeof LoadingWrapper>;
  };
};

export function SplashScreen({ portal = true, slotProps, sx, ...other }: SplashScreenProps) {
  const PortalWrapper = portal ? Portal : Fragment;

  return (
    <PortalWrapper>
      <LoadingWrapper {...slotProps?.wrapper}>
        <LoadingContent sx={sx} {...other}>
          <Box
            sx={{
              width: '160px',
              height: '185px',
              position: 'relative',
              background: '#fff',
              borderRadius: '100px 100px 0 0',
              '&::after': {
                content: "''",
                position: 'absolute',
                width: '100px',
                height: '125px',
                left: '50%',
                top: '25px',
                transform: 'translateX(-50%)',
                backgroundImage: `
                  radial-gradient(circle, #000 48%, transparent 55%),
                  radial-gradient(circle, #000 48%, transparent 55%),
                  radial-gradient(circle, #fff 30%, transparent 45%),
                  radial-gradient(circle, #000 48%, transparent 51%),
                  linear-gradient(#000 20px, transparent 0),
                  linear-gradient(#cfecf9 60px, transparent 0),
                  radial-gradient(circle, #cfecf9 50%, transparent 51%),
                  radial-gradient(circle, #cfecf9 50%, transparent 51%)
                `,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `
                  16px 16px,
                  16px 16px,
                  10px 10px,
                  42px 42px,
                  12px 3px,
                  50px 25px,
                  70px 70px,
                  70px 70px
                `,
                backgroundPosition: `
                  25px 10px,
                  55px 10px,
                  36px 44px,
                  50% 30px,
                  50% 85px,
                  50% 50px,
                  50% 22px,
                  50% 45px
                `,
                animation: 'faceLift 3s linear infinite alternate',
              },
              '&::before': {
                content: "''",
                position: 'absolute',
                width: '140%',
                height: '125px',
                left: '-20%',
                top: '0',
                backgroundImage: `
                  radial-gradient(circle, #fff 48%, transparent 50%),
                  radial-gradient(circle, #fff 48%, transparent 50%)
                `,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '65px 65px',
                backgroundPosition: '0px 12px, 145px 12px',
                animation: 'earLift 3s linear infinite alternate',
              },
              '@keyframes faceLift': {
                '0%': { transform: 'translateX(-60%)' },
                '100%': { transform: 'translateX(-30%)' },
              },
              '@keyframes earLift': {
                '0%': { transform: 'translateX(10px)' },
                '100%': { transform: 'translateX(0px)' },
              },
            }}
          />
        </LoadingContent>
      </LoadingWrapper>
    </PortalWrapper>
  );
}

// ----------------------------------------------------------------------

const LoadingWrapper = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const LoadingContent = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 9998,
  flexGrow: 1,
  width: '100%',
  height: '100%',
  display: 'flex',
  position: 'fixed',
  alignItems: 'center',
  justifyContent: 'center',
  ...theme.mixins.bgGradient({
    images: [`url(${CONFIG.assetsDir}/assets/background/background-3-blur.webp)`],
  }),
}));

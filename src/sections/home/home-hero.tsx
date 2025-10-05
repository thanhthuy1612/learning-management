import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { MotionProps, MotionValue, SpringOptions } from 'framer-motion';

import { useRef, useState } from 'react';
import { m, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { ServerErrorIllustration } from 'src/assets/illustrations';

import { varFade, MotionContainer } from 'src/components/animate';

import { useAuthContext } from 'src/auth/hooks';

import { HomeWelcome } from './home-welcome';
import { HeroBackground } from './components/hero-background';

// ----------------------------------------------------------------------

const smKey: Breakpoint = 'sm';
const mdKey: Breakpoint = 'md';
const lgKey: Breakpoint = 'lg';

const motionProps: MotionProps = {
  variants: varFade('inUp', { distance: 24 }),
};

export function HomeHero({ sx, ...other }: BoxProps) {
  const { user } = useAuthContext();
  const scrollProgress = useScrollPercent();

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up(mdKey));

  const distance = mdUp ? scrollProgress.percent : 0;

  const y1 = useTransformY(scrollProgress.scrollY, distance * -7);
  const y2 = useTransformY(scrollProgress.scrollY, distance * -6);
  const y3 = useTransformY(scrollProgress.scrollY, distance * -5);

  const opacity: MotionValue<number> = useTransform(
    scrollProgress.scrollY,
    [0, 1],
    [1, mdUp ? Number((1 - scrollProgress.percent / 100).toFixed(1)) : 1]
  );

  const renderHeading = () => (
    <m.div {...motionProps}>
      <HomeWelcome
        title="TRƯỜNG THCS CỔ PHÚC"
        description="KIỂM TRA, ĐÁNH GIÁ TRỰC TUYẾN"
        img={<ServerErrorIllustration hideBackground />}
        action={
          <Button
            component={RouterLink}
            href={!user ? paths.pin : paths.dashboard.exam.list}
            variant="contained"
            size="large"
            color="primary"
          >
            {!user ? 'Bắt đầu kiểm tra' : 'Quản lý đề thi'}
          </Button>
        }
      />
    </m.div>
  );

  const renderTextLarge = () => (
    <m.div {...motionProps}>
      <Box
        component="h1"
        sx={[
          (theme) => ({
            my: 0,
            mx: 'auto',
            maxWidth: 680,
            display: 'flex',
            flexWrap: 'wrap',
            typography: 'h2',
            justifyContent: 'center',
            fontFamily: theme.typography.fontSecondaryFamily,
            [theme.breakpoints.up(lgKey)]: {
              fontSize: theme.typography.pxToRem(72),
              lineHeight: '90px',
            },
          }),
        ]}
      >
        <Box component="span" sx={{ width: 1, opacity: 0.24 }}>
          Khám Phá Học Tập Thông Minh
        </Box>
        <Box
          component={m.span}
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={[
            (theme) => ({
              ...theme.mixins.textGradient(
                `300deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.warning.main} 25%, ${theme.vars.palette.primary.main} 50%, ${theme.vars.palette.warning.main} 75%, ${theme.vars.palette.primary.main} 100%`
              ),
              backgroundSize: '400%',
              ml: { xs: 0.75, md: 1, xl: 1.5 },
            }),
          ]}
        >
          Công Nghệ Đồng Hành Tri Thức
        </Box>
      </Box>
    </m.div>
  );

  const renderText = () => (
    <m.div {...motionProps}>
      <Typography
        variant="h6"
        sx={[
          (theme) => ({
            mx: 'auto',
            [theme.breakpoints.up(smKey)]: { whiteSpace: 'pre' },
            [theme.breakpoints.up(lgKey)]: { fontSize: 20, lineHeight: '36px' },
          }),
        ]}
      >
        Công Nghệ Thông Tin - Trí Tuệ Nhân Tạo - Đánh Giá Hiệu Quả
      </Typography>
    </m.div>
  );

  return (
    <Box
      ref={scrollProgress.elementRef}
      component="section"
      sx={[
        (theme) => ({
          overflow: 'hidden',
          position: 'relative',
          [theme.breakpoints.up(mdKey)]: {
            minHeight: 760,
            height: '100vh',
            maxHeight: 1440,
            display: 'block',
            willChange: 'opacity',
            mt: 'calc(var(--layout-header-desktop-height) * -1)',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component={m.div}
        style={{ opacity }}
        sx={[
          (theme) => ({
            width: 1,
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            transition: theme.transitions.create(['opacity']),
            [theme.breakpoints.up(mdKey)]: {
              height: 1,
              position: 'fixed',
              maxHeight: 'inherit',
            },
          }),
        ]}
      >
        <Container
          component={MotionContainer}
          sx={[
            (theme) => ({
              py: 3,
              gap: 5,
              zIndex: 9,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              [theme.breakpoints.up(mdKey)]: {
                flex: '1 1 auto',
                justifyContent: 'flex-start',
                py: 'var(--layout-header-desktop-height)',
              },
            }),
          ]}
        >
          <Stack spacing={3} sx={{ textAlign: 'center', width: '100%' }}>
            <m.div style={{ y: y1 }}>{renderHeading()}</m.div>
            <m.div style={{ y: y2 }}>{renderTextLarge()}</m.div>
            <m.div style={{ y: y3 }}>{renderText()}</m.div>
          </Stack>
        </Container>

        <HeroBackground />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function useTransformY(value: MotionValue<number>, distance: number) {
  const physics: SpringOptions = {
    mass: 0.1,
    damping: 20,
    stiffness: 300,
    restDelta: 0.001,
  };

  return useSpring(useTransform(value, [0, 1], [0, distance]), physics);
}

function useScrollPercent() {
  const elementRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollY, 'change', (scrollHeight) => {
    let heroHeight = 0;

    if (elementRef.current) {
      heroHeight = elementRef.current.offsetHeight;
    }

    const scrollPercent = Math.floor((scrollHeight / heroHeight) * 100);

    if (scrollPercent >= 100) {
      setPercent(100);
    } else {
      setPercent(Math.floor(scrollPercent));
    }
  });

  return { elementRef, percent, scrollY };
}

'use client';

import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { ServerErrorIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export function ExamExpried() {
  return (
    <Container
      sx={{
        width: 1,
        zIndex: 2,
        display: 'flex',
        justifyItems: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      component={MotionContainer}
    >
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Hết thời gian làm bài
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>
          Liên hệ với giáo viên bộ môn nếu xảy ra lỗi
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <ServerErrorIllustration sx={{ my: { xs: 5, sm: 10 } }} />
      </m.div>

      <Button component={RouterLink} href={paths.pin} size="large" variant="contained">
        Quay lại
      </Button>
    </Container>
  );
}

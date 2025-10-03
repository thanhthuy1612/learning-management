'use client';

import { m } from 'framer-motion';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { varBounce, MotionContainer } from 'src/components/animate';

import Icon from './icon';

// ----------------------------------------------------------------------

export function SubmitDone() {
  return (
    <Container
      component={MotionContainer}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 5,
      }}
    >
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2, mt: 5 }}>
          Chúc mừng
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>
          Bạn đã hoàn thành bài thi. Chờ nhận kết quả thi từ giáo viên của bạn.
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Icon sx={{ my: { xs: 5, sm: 10 } }} />
      </m.div>

      <Button component={RouterLink} href={paths.pin} size="large" variant="contained">
        Tiếp tục thi
      </Button>
    </Container>
  );
}

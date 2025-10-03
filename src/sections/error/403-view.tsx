'use client';

import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  isHeader?: boolean;
  isButton?: boolean;
};
export function View403({ isHeader = true, isButton = false }: Props) {
  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
      isHeader={isHeader}
    >
      <Container component={MotionContainer}>
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Không có quyền
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            Trang bạn đang cố gắng truy cập đã bị hạn chế quyền truy cập. Vui lòng liên hệ với quản
            trị viên hệ thống của bạn.
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        {isButton ? (
          <Button component={RouterLink} href="/" size="large" variant="contained">
            Về trang chủ
          </Button>
        ) : (
          <></>
        )}
      </Container>
    </SimpleLayout>
  );
}

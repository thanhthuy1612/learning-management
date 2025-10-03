'use client';

import Grid from '@mui/material/Grid';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { useAuthContext } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useAuthContext();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <AppWelcome
            title={`Chào mừng trở lại 👋 \n ${user?.username}`}
            description=""
            img={<SeoIllustration hideBackground />}
            // action={
            //   <Button variant="contained" color="primary">
            //     Go now
            //   </Button>
            // }
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

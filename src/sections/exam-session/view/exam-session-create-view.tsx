'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExamSessionNewEditForm } from '../exam-session-new-edit-form';

// ----------------------------------------------------------------------

export function ExamSessionCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo kỳ thi mới"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Kỳ thi', href: paths.dashboard.examSession.root },
          { name: 'Tạo mới' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExamSessionNewEditForm />
    </DashboardContent>
  );
}

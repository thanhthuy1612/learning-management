'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExamNewEditForm } from '../exam-new-edit-form';

// ----------------------------------------------------------------------

export function ExamCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo đề thi mới"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Đề thi', href: paths.dashboard.exam.root },
          { name: 'Tạo mới' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExamNewEditForm />
    </DashboardContent>
  );
}

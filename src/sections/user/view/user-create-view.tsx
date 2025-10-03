'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewForm } from '../user-new-form';

// ----------------------------------------------------------------------

export function UserCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Thêm người dung"
        links={[
          { name: 'Danh sách', href: paths.dashboard.root },
          { name: 'Người dùng', href: paths.dashboard.user.root },
          { name: 'Thêm người dung' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewForm />
    </DashboardContent>
  );
}

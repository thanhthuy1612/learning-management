'use client';

import React from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExamNewAIForm } from '../exam-new-ai-form';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    id: 1,
    label: 'Sử dụng AI',
    icon: <Iconify width={24} icon="solar:export-bold" />,
    renderComponent: ExamNewAIForm,
  },
  {
    id: 2,
    label: 'Thêm thủ công',
    icon: <Iconify width={24} icon="solar:pen-bold" />,
    renderComponent: ExamNewAIForm,
  },
];

// ----------------------------------------------------------------------

export function ExamCreateView() {
  // const [tabSelected, setTagSelected] = React.useState<number>(NAV_ITEMS[0].id);

  // const handleChangeTab = React.useCallback((_event: React.SyntheticEvent, newValue: number) => {
  //   setTagSelected(newValue);
  // }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo đề thi mới"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Đề thi', href: paths.dashboard.exam.root },
          { name: 'Tạo mới' },
        ]}
        sx={{ mb: 3 }}
      />
      <ExamNewAIForm />

      {/* <Tabs value={tabSelected} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {NAV_ITEMS.map((tab) => (
          <Tab key={tab.id} label={tab.label} icon={tab.icon} value={tab.id} />
        ))}
      </Tabs> */}

      {/* {tabSelected === NAV_ITEMS[0].id ? <ExamNewAIForm /> : <></>} */}
    </DashboardContent>
  );
}

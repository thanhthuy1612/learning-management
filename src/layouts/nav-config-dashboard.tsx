import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    subheader: 'Quản lý',
    items: [
      {
        title: 'Người dùng',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Thông tin cá nhân', path: paths.dashboard.user.account },
          { title: 'Danh sách người dùng', path: paths.dashboard.user.list },
          { title: 'Thêm giáo viên', path: paths.dashboard.user.new },
        ],
      },
    ],
  },
  {
    subheader: 'Tổng quan',
    items: [
      {
        title: 'Đề thi',
        path: paths.dashboard.exam.root,
        icon: ICONS.file,
        children: [
          { title: 'Danh sách', path: paths.dashboard.exam.list },
          { title: 'Thêm mới', path: paths.dashboard.exam.new },
        ],
      },
      {
        title: 'Kỳ thi',
        path: paths.dashboard.examSession.root,
        icon: ICONS.calendar,
        children: [
          { title: 'Danh sách', path: paths.dashboard.examSession.list },
          { title: 'Thêm mới', path: paths.dashboard.examSession.new },
        ],
      },
      {
        title: 'Kết quả thi',
        path: paths.dashboard.scores.root,
        icon: ICONS.booking,
        children: [{ title: 'Danh sách', path: paths.dashboard.scores.list }],
      },
    ],
  },
];

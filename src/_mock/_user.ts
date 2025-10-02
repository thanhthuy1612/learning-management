import { StatusUser } from 'src/types/user';

import { _mock } from './_mock';

// ----------------------------------------------------------------------

export enum StatusAll {
  ALL = -5,
}
export const USER_STATUS_OPTIONS = [
  { value: StatusUser.BANNED, label: 'Bị cấm', type: 'BANNED' },
  { value: StatusUser.ACTIVE, label: 'Hoạt động', type: 'ACTIVE' },
  { value: StatusUser.INACTIVE, label: 'Ngưng hoạt động', type: 'INACTIVE' },
];

export const _userList = Array.from({ length: 20 }, (_, index) => ({
  id: _mock.id(index),
  roles: [_mock.role(index)],
  email: _mock.email(index),
  username: _mock.fullName(index),
  phone: _mock.phoneNumber(index),
  createdDate: new Date(),
  modifiedDate: new Date(),
  status: 0,
}));

// ----------------------------------------------------------------------

import type { StatusAll } from 'src/_mock';

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: StatusUser | StatusAll;
};

export enum StatusUser {
  BANNED = -1,
  ACTIVE = 0,
  INACTIVE = 1,
}

export type IUserItem = {
  id?: string;
  username: string;
  email: string;
  phone: string;
  status?: StatusUser;
  createdDate: Date;
  modifiedDate: Date;
  roles: string[];
  accessToken?: string;
  refreshToken?: string;
  password?: string;
};

export type IUserRequestBody = {
  searchText: string;
  pageIndex: number;
  pageSize: number;
};

export type IRole = {
  id: string;
  name: string;
  description: string;
};

export type IChangeStatusRequestBody = {
  userId: string;
  status: StatusUser;
};

export type IChangePasswordRequestBody = {
  userId: string;
  password: string;
};

export type ICreateUserRequestBody = {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  roleId: string;
};

export type IChangeInformationRequestBody = {
  email: string;
  phone: string;
};

export type IChangePasswordMeRequestBody = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

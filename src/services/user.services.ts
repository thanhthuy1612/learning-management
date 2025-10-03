import type {
  IUserRequestBody,
  ICreateUserRequestBody,
  IChangeStatusRequestBody,
  IChangePasswordRequestBody,
  IChangePasswordMeRequestBody,
  IChangeInformationRequestBody,
} from 'src/types/user';

import axios, { endpoints } from 'src/lib/axios';

export const userService = {
  async list(body: IUserRequestBody) {
    const { data } = await axios.post(endpoints.user.list, body);

    return data;
  },
  async roles() {
    const { data } = await axios.post(endpoints.user.roles, {});

    return data;
  },
  async changeStatus(body: IChangeStatusRequestBody) {
    const { data } = await axios.post(endpoints.user.changeStatus, body);

    return data;
  },
  async changePassword(body: IChangePasswordRequestBody) {
    const { data } = await axios.post(endpoints.user.changePassword, body);

    return data;
  },
  async changeInfomation(body: IChangeInformationRequestBody) {
    const { data } = await axios.post(endpoints.user.changeInfomation, body);

    return data;
  },
  async createUser(body: ICreateUserRequestBody) {
    const { data } = await axios.post(endpoints.user.createUser, body);

    return data;
  },
  async changePasswordMe(body: IChangePasswordMeRequestBody) {
    const { data } = await axios.post(endpoints.user.changePasswordMe, body);

    return data;
  },
};

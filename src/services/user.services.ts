/* eslint-disable no-useless-catch */
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
    try {
      const { data } = await axios.post(endpoints.user.list, body);

      if (data.code) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async roles() {
    try {
      const { data } = await axios.post(endpoints.user.roles, {});

      if (data.code) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async changeStatus(body: IChangeStatusRequestBody) {
    try {
      const { data } = await axios.post(endpoints.user.changeStatus, body);

      if (!data.data) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async changePassword(body: IChangePasswordRequestBody) {
    try {
      const { data } = await axios.post(endpoints.user.changePassword, body);

      if (!data.data) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async changeInfomation(body: IChangeInformationRequestBody) {
    try {
      const { data } = await axios.post(endpoints.user.changeInfomation, body);

      if (!data.data) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async createUser(body: ICreateUserRequestBody) {
    try {
      const { data } = await axios.post(endpoints.user.createUser, body);
      if (!data.data) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async changePasswordMe(body: IChangePasswordMeRequestBody) {
    try {
      const { data } = await axios.post(endpoints.user.changePasswordMe, body);

      if (!data.data) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
};

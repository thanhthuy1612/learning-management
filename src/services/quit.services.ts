/* eslint-disable no-useless-catch */

import type { IPinRequestBody, IQuitRequestBody } from 'src/types/question';

import axios, { endpoints } from 'src/lib/axios';

export const quitService = {
  async pin(body: IPinRequestBody) {
    try {
      const { data } = await axios.post(endpoints.exam.pin, body);

      if (data.code) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async quit(body: IQuitRequestBody) {
    try {
      const { data } = await axios.post(endpoints.exam.submit, body);

      if (!data.data) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
};

/* eslint-disable no-useless-catch */

import type {
  IExamRequestBody,
  IExamEditRequestBody,
  IExamCreateRequestBody,
} from 'src/types/exam';

import axios, { endpoints } from 'src/lib/axios';

export const examService = {
  async list(body: IExamRequestBody) {
    try {
      const { data } = await axios.post(endpoints.examTemplate.list, body);

      if (data.code) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async prompt(prompt: string) {
    try {
      const { data } = await axios.post(endpoints.examTemplate.prompt, {
        prompt,
      });

      if (!data.data) {
        throw data.message ?? 'Lỗi propmt';
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async create(body: IExamCreateRequestBody) {
    try {
      const { data } = await axios.post(endpoints.examTemplate.create, body);

      if (!data.data) {
        throw data.message ?? 'Lỗi xảy ra';
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async edit(body: IExamEditRequestBody) {
    try {
      const { data } = await axios.post(endpoints.examTemplate.edit, body);

      if (!data.data) {
        throw data.message ?? 'Lỗi xảy ra';
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
};

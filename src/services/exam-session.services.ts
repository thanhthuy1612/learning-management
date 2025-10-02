/* eslint-disable no-useless-catch */

import type {
  ITypeExamRequestBody,
  IExamSessionRequestBody,
  IExamSessionIdRequestBody,
  ICreateExamSessionRequestBody,
} from 'src/types/exam-session';

import axios, { endpoints } from 'src/lib/axios';

export const examSessionService = {
  async list(body: IExamSessionRequestBody) {
    try {
      const { data } = await axios.post(endpoints.examSession.list, body);

      if (data.code) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async create(body: ICreateExamSessionRequestBody) {
    try {
      const { data } = await axios.post(endpoints.examSession.create, body);

      if (data.code) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async openOrClose(body: ITypeExamRequestBody) {
    try {
      const { data } = await axios.post(endpoints.examSession.openOrClose, body);

      if (data.code) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async mark(body: IExamSessionIdRequestBody) {
    try {
      const { data } = await axios.post(endpoints.examSession.mark, body);

      if (data.code) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
  async scores(body: IExamSessionIdRequestBody) {
    try {
      const { data } = await axios.post(endpoints.examSession.scores, body);

      if (!data.data) {
        throw data.message;
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
};

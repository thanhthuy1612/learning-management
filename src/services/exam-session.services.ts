import type {
  ITypeExamRequestBody,
  IExamSessionRequestBody,
  IExamSessionIdRequestBody,
  ICreateExamSessionRequestBody,
} from 'src/types/exam-session';

import axios, { endpoints } from 'src/lib/axios';

export const examSessionService = {
  async list(body: IExamSessionRequestBody) {
    const { data } = await axios.post(endpoints.examSession.list, body);

    return data;
  },
  async create(body: ICreateExamSessionRequestBody) {
    const { data } = await axios.post(endpoints.examSession.create, body);

    return data;
  },
  async openOrClose(body: ITypeExamRequestBody) {
    const { data } = await axios.post(endpoints.examSession.openOrClose, body);

    return data;
  },
  async mark(body: IExamSessionIdRequestBody) {
    const { data } = await axios.post(endpoints.examSession.mark, body);

    return data;
  },
  async scores(body: IExamSessionIdRequestBody) {
    const { data } = await axios.post(endpoints.examSession.scores, body);

    return data;
  },
};

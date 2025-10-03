import type { IPinRequestBody, IQuizRequestBody } from 'src/types/question';

import axios, { endpoints } from 'src/lib/axios';

export const quizService = {
  async pin(body: IPinRequestBody) {
    const { data } = await axios.post(endpoints.exam.pin, body);

    return data;
  },
  async quiz(body: IQuizRequestBody) {
    const { data } = await axios.post(endpoints.exam.submit, body);

    return data;
  },
};

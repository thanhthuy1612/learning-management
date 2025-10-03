import type {
  IExamRequestBody,
  IExamEditRequestBody,
  IExamCreateRequestBody,
} from 'src/types/exam';

import axios, { endpoints } from 'src/lib/axios';

export const examService = {
  async list(body: IExamRequestBody) {
    const { data } = await axios.post(endpoints.examTemplate.list, body);

    return data;
  },
  async prompt(prompt: string) {
    const { data } = await axios.post(endpoints.examTemplate.prompt, {
      prompt,
    });

    return data;
  },
  async create(body: IExamCreateRequestBody) {
    const { data } = await axios.post(endpoints.examTemplate.create, body);

    return data;
  },
  async edit(body: IExamEditRequestBody) {
    const { data } = await axios.post(endpoints.examTemplate.edit, body);

    return data;
  },
};

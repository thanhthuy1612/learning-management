import type { StatusAll } from 'src/_mock';

import type { StatusUser } from './user';
import type { IQuestionItem } from './question';

export type IExamTableFilters = {
  name: string;
  status: StatusUser | StatusAll;
};

export type IExamRequestBody = {
  name: string;
  pageIndex: number;
  pageSize: number;
};

export type IExamItem = {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  question: IQuestionItem[];
  createdDate: Date;
  modifiedDate: Date;
};

export type IExamCreateRequestBody = {
  name: string;
  questions: IQuestionItem[];
};

export type IExamEditRequestBody = {
  id: string;
  name: string;
  questions: IQuestionItem[];
  isDeleted: boolean;
};

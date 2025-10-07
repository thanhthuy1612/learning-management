import type { Choice, IQuestionItem } from './question';

export type IExamSessionRequestBody = {
  name: string;
  pageIndex: number;
  pageSize: number;
};

export type IExamSession = {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  question: IQuestionItem[];
  code: string;
  duration: 0;
  isOpen: true;
  createdDate: Date;
};

export type ICreateExamSessionRequestBody = {
  examTemplateId: string;
  name: string;
  duration: number;
};

export type IExamSessionIdRequestBody = {
  examSessionId: string;
};

export type ITypeExamRequestBody = {
  examSessionId: string;
  isOpen: boolean;
};

export type ISubmission = {
  id?: string;
  question: string;
  choices: Record<Choice, string>;
  answer?: Choice;
  submittedAnswer: Choice;
  isCorrect: boolean;
};

export type IScores = {
  id: string;
  examSessionId: string;
  examSessionName: string;
  username: string;
  score: 0;
  submission: ISubmission[];
  enrollDate: Date;
  lastSubmittedDate: Date;
  finishedDate: Date;
  endTime: Date;
};

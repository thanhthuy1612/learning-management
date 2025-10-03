export const Choices = ['A', 'B', 'C', 'D'] as const;
export type Choice = (typeof Choices)[number];

export type IQuestionItem = {
  id?: string;
  question: string;
  choices: Record<Choice, string>;
  answer?: Choice;
};

export type IPinRequestBody = {
  username: string;
  code: string;
};

export type IPin = {
  examSessionId: string;
  name: string;
  question: IQuestionItem[];
  code: string;
  duration: 0;
  scoreId: string;
  enrollDate: Date;
  endTime: Date;
  serverTime: Date;
};

export type IQuizRequestBody = {
  scoreId: string;
  questions: {
    id: string;
    answer?: Choice;
  }[];

  isFinished: boolean;
};

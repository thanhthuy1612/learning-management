export const Choices = ['A', 'B', 'C', 'D'] as const;

export const Choice1: Choice[][] = [
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'D', 'C'],
  ['A', 'C', 'B', 'D'],
  ['A', 'C', 'D', 'B'],
  ['A', 'D', 'B', 'C'],
  ['A', 'D', 'C', 'B'],
  ['B', 'A', 'C', 'D'],
  ['B', 'A', 'D', 'C'],
  ['B', 'C', 'A', 'D'],
  ['B', 'C', 'D', 'A'],
  ['B', 'D', 'A', 'C'],
  ['B', 'D', 'C', 'A'],
  ['C', 'A', 'B', 'D'],
  ['C', 'A', 'D', 'B'],
  ['C', 'B', 'A', 'D'],
  ['C', 'B', 'D', 'A'],
  ['C', 'D', 'A', 'B'],
  ['C', 'D', 'B', 'A'],
  ['D', 'A', 'B', 'C'],
  ['D', 'A', 'C', 'B'],
  ['D', 'B', 'A', 'C'],
  ['D', 'B', 'C', 'A'],
  ['D', 'C', 'A', 'B'],
  ['D', 'C', 'B', 'A'],
];
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

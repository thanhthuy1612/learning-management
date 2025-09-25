export const Choices = ['A', 'B', 'C', 'D'] as const;
export type Choice = (typeof Choices)[number];

export type IQuestionItem = {
  question: string;
  choices: Record<Choice, string>;
  answer?: Choice;
};

export type AnswerInput = {
  text: string;
  isCorrect: boolean;
};

export type QuestionInput = {
  text: string;
  type: string;
  answers: AnswerInput[];
};

export type CreateQuizInput = {
  title: string;
  description?: string;
  questions: QuestionInput[];
};

export type UpdateQuizInput = {
  title?: string;
  description?: string;
  questions?: QuestionInput[];
};

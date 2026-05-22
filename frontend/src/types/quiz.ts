export const QuestionType = {
  SingleText: "single_text",
  MultipleChoice: "multiple_choice",
  TrueFalse: "true_false",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export type AnswerInput = {
  text: string;
  isCorrect: boolean;
};

export type QuestionInput = {
  text: string;
  type: QuestionType;
  answers: AnswerInput[];
};

export type CreateQuizInput = {
  title: string;
  description?: string;
  questions: QuestionInput[];
};

export type Quiz = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  questions: Array<{
    id: string;
    text: string;
    type: QuestionType;
    position: number;
    answers: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      position: number;
    }>;
  }>;
};

export type QuizListItem = {
  id: string;
  title: string;
  description: string | null;
  _count: { questions: number };
};

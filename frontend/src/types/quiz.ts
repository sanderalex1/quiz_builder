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

export type UpdateQuizInput = Partial<CreateQuizInput>;

export type Quiz = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  questions: Array<{
    id: string;
    text: string;
    type: string;
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

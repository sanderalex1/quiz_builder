import { z } from "zod";

const AnswerSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

const QuestionSchema = z.object({
  text: z.string().min(1),
  type: z.string(),
  answers: z.array(AnswerSchema).min(1),
});

export const CreateQuizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  questions: z.array(QuestionSchema).min(1),
});

export const UpdateQuizSchema = CreateQuizSchema.partial();

export type CreateQuizInput = z.infer<typeof CreateQuizSchema>;
export type UpdateQuizInput = z.infer<typeof UpdateQuizSchema>;

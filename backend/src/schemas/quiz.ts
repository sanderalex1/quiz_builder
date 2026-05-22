import { z } from "zod";

const AnswerSchema = z.object({
  text: z.string().min(1).max(500),
  isCorrect: z.boolean(),
});

const QuestionSchema = z.object({
  text: z.string().min(1).max(500),
  type: z.string(),
  answers: z.array(AnswerSchema).min(1).max(20),
});

export const CreateQuizSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  questions: z.array(QuestionSchema).min(1).max(200),
});

const UpdateAnswerSchema = AnswerSchema.extend({
  id: z.string().uuid().optional(),
});

const UpdateQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string().min(1).max(500),
  type: z.string(),
  answers: z.array(UpdateAnswerSchema).min(1).max(20),
});

export const UpdateQuizSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional(),
  questions: z.array(UpdateQuestionSchema).min(1).max(200).optional(),
});

export type CreateQuizInput = z.infer<typeof CreateQuizSchema>;
export type UpdateQuizInput = z.infer<typeof UpdateQuizSchema>;

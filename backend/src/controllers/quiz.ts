import type { Request, Response } from "express";
import * as quizService from "../services/quiz.js";
import * as quizSchema from "../schemas/quiz.js";
import { z } from "zod";

const QuizParamsSchema = z.object({ id: z.uuid() });

export const getQuizzes = async (_req: Request, res: Response) => {
  const quizzes = await quizService.getQuizzes();
  res.json(quizzes);
};

export const getQuizById = async (req: Request, res: Response) => {
  const paramsResult = QuizParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ errors: paramsResult.error.issues });
    return;
  }
  const { id } = paramsResult.data;

  const quiz = await quizService.getQuizById(id);
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }
  res.json(quiz);
};

export const createQuiz = async (req: Request, res: Response) => {
  const result = quizSchema.CreateQuizSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const quiz = await quizService.makeQuize(result.data);
  res.status(201).json(quiz);
};

export const updateQuiz = async (req: Request, res: Response) => {
  const paramsResult = QuizParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ errors: paramsResult.error.issues });
    return;
  }
  const { id } = paramsResult.data;

  const result = quizSchema.UpdateQuizSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const updatedQuiz = await quizService.updateQuize(id, result.data);
  res.status(200).json(updatedQuiz);
};

export const deleteQuiz = async (req: Request, res: Response) => {
  const paramsResult = QuizParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ errors: paramsResult.error.issues });
    return;
  }
  const { id } = paramsResult.data;

  await quizService.deleteQuize(id);
  res.status(204).send();
};

import type { Request, Response } from "express";
import * as quizService from "../services/quiz.js";

interface IdParams {
  id: string;
}

export const getQuizzes = async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;

  const quizzes = await quizService.getQuizzes({ limit, cursor });
  res.json(quizzes);
};

export const getQuizById = async (req: Request<IdParams>, res: Response) => {
  const quiz = await quizService.getQuizById(req.params.id);
  res.json(quiz);
};

export const createQuiz = async (req: Request, res: Response) => {
  const quiz = await quizService.makeQuize(req.body);
  res.status(201).json(quiz);
};

export const updateQuiz = async (req: Request<IdParams>, res: Response) => {
  const updatedQuiz = await quizService.updateQuize(req.params.id, req.body);
  res.json(updatedQuiz);
};

export const deleteQuiz = async (req: Request<IdParams>, res: Response) => {
  await quizService.deleteQuize(req.params.id);
  res.status(204).send();
};

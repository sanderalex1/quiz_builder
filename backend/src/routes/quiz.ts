import { Router } from "express";

import {
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizzes,
  getQuizById,
} from "../controllers/quiz.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { CreateQuizSchema, UpdateQuizSchema, QuizParamsSchema } from "../schemas/quiz.js";

const router = Router();

const validateId = validate(QuizParamsSchema, "params");

router.get("/", asyncHandler(getQuizzes));

router.get("/:id", validateId, asyncHandler(getQuizById));

router.post("/", validate(CreateQuizSchema, "body"), asyncHandler(createQuiz));

router.patch(
  "/:id",
  validateId,
  validate(UpdateQuizSchema, "body"),
  asyncHandler(updateQuiz),
);

router.delete("/:id", validateId, asyncHandler(deleteQuiz));

export default router;

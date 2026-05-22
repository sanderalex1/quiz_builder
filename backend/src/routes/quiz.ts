import { Router } from "express";

import {
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizzes,
  getQuizById,
} from "../controllers/quiz.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getQuizzes));

router.get("/:id", asyncHandler(getQuizById));

router.post("/", asyncHandler(createQuiz));

router.put("/:id", asyncHandler(updateQuiz));

router.delete("/:id", asyncHandler(deleteQuiz));

export default router;

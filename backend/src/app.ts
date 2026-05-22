import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import quizRouter from "./routes/quiz.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/v1/quizzes", quizRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Hello from Express + TS" });
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;

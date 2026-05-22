import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import quizRouter from "./routes/quiz.js";

const app = express();

app.use(helmet());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use(cors({ origin: process.env["CORS_ORIGIN"] ?? "http://localhost:5173" }));
app.use(express.json({ limit: "256kb" }));
app.use("/api/v1/quizzes", quizRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Hello from Express + TS" });
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;

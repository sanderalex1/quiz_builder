import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import quizRouter from "./routes/quiz.js";

const app = express();

app.use(helmet());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "256kb" }));

app.get("/healthz", (_req, res) => res.json({ status: "ok" }));
app.use("/api/v1/quizzes", quizRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

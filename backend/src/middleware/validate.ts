import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../errors/AppError.js";

export const validate =
  (schema: ZodSchema, source: "body" | "params") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(new AppError("Validation failed", 400, result.error.issues));
    }
    req[source] = result.data;
    next();
  };

import "dotenv/config";
import { z } from "zod";

export const env = z
  .object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3000),
    CORS_ORIGIN: z.string().default("http://localhost:5173"),
    NODE_ENV: z.string().default("development"),
  })
  .parse(process.env);

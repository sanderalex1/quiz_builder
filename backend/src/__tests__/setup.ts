import { vi } from "vitest";

// Mock config before anything else imports it
vi.mock("../config.js", () => ({
  env: {
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    PORT: 3000,
    CORS_ORIGIN: "http://localhost:5173",
    NODE_ENV: "test",
  },
}));

// Mock prisma client
vi.mock("../prisma.js", () => ({
  prisma: {
    quiz: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    question: {
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    answer: {
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn((fn: (tx: unknown) => Promise<unknown>) =>
      fn({
        quiz: {
          update: vi.fn(),
        },
        question: {
          create: vi.fn(),
          update: vi.fn(),
          deleteMany: vi.fn(),
        },
        answer: {
          create: vi.fn(),
          update: vi.fn(),
          deleteMany: vi.fn(),
        },
      }),
    ),
  },
}));

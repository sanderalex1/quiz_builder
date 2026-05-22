import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { prisma } from "../prisma.js";

const mockPrisma = vi.mocked(prisma);

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

const sampleQuiz = {
  id: VALID_UUID,
  title: "Test Quiz",
  description: "A test",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: [
    {
      id: "q1",
      quizId: VALID_UUID,
      text: "Q1",
      type: "multiple_choice",
      position: 0,
      answers: [
        {
          id: "a1",
          questionId: "q1",
          text: "A1",
          isCorrect: true,
          position: 0,
        },
      ],
    },
  ],
};

const validCreatePayload = {
  title: "New Quiz",
  description: "A quiz",
  questions: [
    {
      text: "What is 2+2?",
      type: "multiple_choice",
      answers: [
        { text: "3", isCorrect: false },
        { text: "4", isCorrect: true },
      ],
    },
  ],
};

describe("Health check", () => {
  it("GET /healthz returns 200 with status ok", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("404 handler", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/v1/nonexistent");
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Route not found/);
  });
});

describe("GET /api/v1/quizzes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 with paginated quiz list", async () => {
    const quizList = [
      { id: "1", title: "Q1", description: null, _count: { questions: 2 } },
    ];
    mockPrisma.quiz.findMany.mockResolvedValue(quizList as never);

    const res = await request(app).get("/api/v1/quizzes");

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.nextCursor).toBeDefined();
  });

  it("respects limit query parameter", async () => {
    mockPrisma.quiz.findMany.mockResolvedValue([] as never);

    await request(app).get("/api/v1/quizzes?limit=5");

    expect(mockPrisma.quiz.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 6 }),
    );
  });

  it("caps limit at 100", async () => {
    mockPrisma.quiz.findMany.mockResolvedValue([] as never);

    await request(app).get("/api/v1/quizzes?limit=500");

    expect(mockPrisma.quiz.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 101 }),
    );
  });

  it("passes cursor query parameter", async () => {
    mockPrisma.quiz.findMany.mockResolvedValue([] as never);

    await request(app).get(`/api/v1/quizzes?cursor=${VALID_UUID}`);

    expect(mockPrisma.quiz.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 1,
        cursor: { id: VALID_UUID },
      }),
    );
  });
});

describe("GET /api/v1/quizzes/:id", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 with quiz when found", async () => {
    mockPrisma.quiz.findUnique.mockResolvedValue(sampleQuiz as never);

    const res = await request(app).get(`/api/v1/quizzes/${VALID_UUID}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(VALID_UUID);
  });

  it("returns 404 when quiz not found", async () => {
    mockPrisma.quiz.findUnique.mockResolvedValue(null as never);

    const res = await request(app).get(`/api/v1/quizzes/${VALID_UUID}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Quiz not found");
  });

  it("returns 400 for invalid UUID param", async () => {
    const res = await request(app).get("/api/v1/quizzes/not-a-uuid");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
    expect(res.body.details).toBeDefined();
  });
});

describe("POST /api/v1/quizzes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 201 with created quiz", async () => {
    mockPrisma.quiz.create.mockResolvedValue(sampleQuiz as never);

    const res = await request(app).post("/api/v1/quizzes").send(validCreatePayload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/api/v1/quizzes")
      .send({ questions: validCreatePayload.questions });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 when questions array is empty", async () => {
    const res = await request(app)
      .post("/api/v1/quizzes")
      .send({ title: "Test", questions: [] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 when answers array is empty", async () => {
    const res = await request(app)
      .post("/api/v1/quizzes")
      .send({
        title: "Test",
        questions: [{ text: "Q", type: "mc", answers: [] }],
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 when body is empty", async () => {
    const res = await request(app).post("/api/v1/quizzes").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 for title exceeding max length", async () => {
    const res = await request(app)
      .post("/api/v1/quizzes")
      .send({
        ...validCreatePayload,
        title: "a".repeat(501),
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });
});

describe("PATCH /api/v1/quizzes/:id", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 with updated quiz", async () => {
    mockPrisma.$transaction.mockResolvedValue(sampleQuiz as never);

    const res = await request(app)
      .patch(`/api/v1/quizzes/${VALID_UUID}`)
      .send({ title: "Updated Title" });

    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid UUID param", async () => {
    const res = await request(app)
      .patch("/api/v1/quizzes/bad-id")
      .send({ title: "Updated" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("accepts partial update with only description", async () => {
    mockPrisma.$transaction.mockResolvedValue(sampleQuiz as never);

    const res = await request(app)
      .patch(`/api/v1/quizzes/${VALID_UUID}`)
      .send({ description: "New description" });

    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid question id in update", async () => {
    const res = await request(app)
      .patch(`/api/v1/quizzes/${VALID_UUID}`)
      .send({
        questions: [
          {
            id: "not-a-uuid",
            text: "Q",
            type: "mc",
            answers: [{ text: "A", isCorrect: true }],
          },
        ],
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });
});

describe("DELETE /api/v1/quizzes/:id", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 204 on successful delete", async () => {
    mockPrisma.quiz.delete.mockResolvedValue(sampleQuiz as never);

    const res = await request(app).delete(`/api/v1/quizzes/${VALID_UUID}`);

    expect(res.status).toBe(204);
  });

  it("returns 400 for invalid UUID param", async () => {
    const res = await request(app).delete("/api/v1/quizzes/bad-id");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });
});

describe("Error handling", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 for malformed JSON body", async () => {
    const res = await request(app)
      .post("/api/v1/quizzes")
      .set("Content-Type", "application/json")
      .send("{ bad json }");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/JSON|Unexpected/i);
  });

  it("returns 500 for unexpected errors", async () => {
    mockPrisma.quiz.findMany.mockRejectedValue(new Error("DB down") as never);

    const res = await request(app).get("/api/v1/quizzes");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal server error");
  });
});

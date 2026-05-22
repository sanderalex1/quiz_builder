import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../prisma.js";
import { getQuizzes, getQuizById, makeQuize, updateQuize, deleteQuize } from "./quiz.js";
import { AppError } from "../errors/AppError.js";

const mockPrisma = vi.mocked(prisma);

const sampleQuiz = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Test Quiz",
  description: "A test quiz",
  createdAt: new Date(),
  updatedAt: new Date(),
  questions: [
    {
      id: "q1",
      quizId: "550e8400-e29b-41d4-a716-446655440000",
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

describe("quiz service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getQuizzes", () => {
    it("returns paginated data with no more items", async () => {
      const items = [
        {
          id: "1",
          title: "Quiz 1",
          description: null,
          _count: { questions: 2 },
        },
      ];
      mockPrisma.quiz.findMany.mockResolvedValue(items as never);

      const result = await getQuizzes({ limit: 20 });

      expect(result.data).toEqual(items);
      expect(result.nextCursor).toBeNull();
      expect(mockPrisma.quiz.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 21 }),
      );
    });

    it("returns nextCursor when more items exist", async () => {
      const items = Array.from({ length: 3 }, (_, i) => ({
        id: `id-${i}`,
        title: `Quiz ${i}`,
        description: null,
        _count: { questions: 1 },
      }));
      mockPrisma.quiz.findMany.mockResolvedValue(items as never);

      const result = await getQuizzes({ limit: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.nextCursor).toBe("id-1");
    });

    it("passes cursor to findMany when provided", async () => {
      mockPrisma.quiz.findMany.mockResolvedValue([] as never);

      await getQuizzes({ limit: 20, cursor: "some-cursor-id" });

      expect(mockPrisma.quiz.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 1,
          cursor: { id: "some-cursor-id" },
        }),
      );
    });
  });

  describe("getQuizById", () => {
    it("returns quiz when found", async () => {
      mockPrisma.quiz.findUnique.mockResolvedValue(sampleQuiz as never);

      const result = await getQuizById(sampleQuiz.id);

      expect(result).toEqual(sampleQuiz);
      expect(mockPrisma.quiz.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: sampleQuiz.id } }),
      );
    });

    it("throws AppError 404 when not found", async () => {
      mockPrisma.quiz.findUnique.mockResolvedValue(null as never);

      await expect(getQuizById("nonexistent")).rejects.toThrow(AppError);
      await expect(getQuizById("nonexistent")).rejects.toMatchObject({
        statusCode: 404,
        message: "Quiz not found",
      });
    });
  });

  describe("makeQuize", () => {
    it("creates a quiz with nested questions and answers", async () => {
      const input = {
        title: "New Quiz",
        questions: [
          {
            text: "Q1",
            type: "multiple_choice",
            answers: [{ text: "A1", isCorrect: true }],
          },
        ],
      };
      mockPrisma.quiz.create.mockResolvedValue(sampleQuiz as never);

      const result = await makeQuize(input);

      expect(result).toEqual(sampleQuiz);
      expect(mockPrisma.quiz.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: "New Quiz",
            questions: expect.objectContaining({
              create: expect.arrayContaining([
                expect.objectContaining({
                  text: "Q1",
                  position: 0,
                }),
              ]),
            }),
          }),
        }),
      );
    });

    it("maps position indexes correctly for multiple questions", async () => {
      const input = {
        title: "Multi Q",
        questions: [
          {
            text: "Q0",
            type: "mc",
            answers: [{ text: "A", isCorrect: true }],
          },
          {
            text: "Q1",
            type: "mc",
            answers: [{ text: "B", isCorrect: false }],
          },
        ],
      };
      mockPrisma.quiz.create.mockResolvedValue(sampleQuiz as never);

      await makeQuize(input);

      const createCall = mockPrisma.quiz.create.mock.calls[0]?.[0];
      const questions = createCall?.data?.questions?.create;
      expect(questions?.[0]?.position).toBe(0);
      expect(questions?.[1]?.position).toBe(1);
    });
  });

  describe("updateQuize", () => {
    it("calls $transaction", async () => {
      mockPrisma.$transaction.mockResolvedValue(sampleQuiz as never);

      await updateQuize(sampleQuiz.id, { title: "Updated" });

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  describe("deleteQuize", () => {
    it("deletes the quiz by id", async () => {
      mockPrisma.quiz.delete.mockResolvedValue(sampleQuiz as never);

      await deleteQuize(sampleQuiz.id);

      expect(mockPrisma.quiz.delete).toHaveBeenCalledWith({
        where: { id: sampleQuiz.id },
      });
    });
  });
});

import { describe, it, expect } from "vitest";
import { CreateQuizSchema, UpdateQuizSchema, QuizParamsSchema } from "./quiz.js";

const validQuestion = {
  text: "What is 2+2?",
  type: "multiple_choice",
  answers: [
    { text: "3", isCorrect: false },
    { text: "4", isCorrect: true },
  ],
};

const validCreateInput = {
  title: "Math Quiz",
  description: "Basic arithmetic",
  questions: [validQuestion],
};

describe("QuizParamsSchema", () => {
  it("accepts a valid UUID", () => {
    const result = QuizParamsSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid UUID", () => {
    const result = QuizParamsSchema.safeParse({ id: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects missing id", () => {
    const result = QuizParamsSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("CreateQuizSchema", () => {
  it("accepts valid input", () => {
    const result = CreateQuizSchema.safeParse(validCreateInput);
    expect(result.success).toBe(true);
  });

  it("accepts input without description", () => {
    const { description, ...input } = validCreateInput;
    const result = CreateQuizSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = CreateQuizSchema.safeParse({
      ...validCreateInput,
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title exceeding 500 chars", () => {
    const result = CreateQuizSchema.safeParse({
      ...validCreateInput,
      title: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("rejects description exceeding 2000 chars", () => {
    const result = CreateQuizSchema.safeParse({
      ...validCreateInput,
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty questions array", () => {
    const result = CreateQuizSchema.safeParse({
      ...validCreateInput,
      questions: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects questions exceeding max of 200", () => {
    const questions = Array.from({ length: 201 }, () => validQuestion);
    const result = CreateQuizSchema.safeParse({
      ...validCreateInput,
      questions,
    });
    expect(result.success).toBe(false);
  });

  it("rejects question with empty answers", () => {
    const result = CreateQuizSchema.safeParse({
      ...validCreateInput,
      questions: [{ ...validQuestion, answers: [] }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects answers exceeding max of 20", () => {
    const answers = Array.from({ length: 21 }, (_, i) => ({
      text: `Answer ${i}`,
      isCorrect: i === 0,
    }));
    const result = CreateQuizSchema.safeParse({
      ...validCreateInput,
      questions: [{ ...validQuestion, answers }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects answer with empty text", () => {
    const result = CreateQuizSchema.safeParse({
      ...validCreateInput,
      questions: [
        {
          ...validQuestion,
          answers: [{ text: "", isCorrect: true }],
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing isCorrect on answer", () => {
    const result = CreateQuizSchema.safeParse({
      ...validCreateInput,
      questions: [
        {
          ...validQuestion,
          answers: [{ text: "Yes" }],
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdateQuizSchema", () => {
  it("accepts partial update with only title", () => {
    const result = UpdateQuizSchema.safeParse({ title: "New Title" });
    expect(result.success).toBe(true);
  });

  it("accepts partial update with only description", () => {
    const result = UpdateQuizSchema.safeParse({
      description: "Updated desc",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty object (no fields to update)", () => {
    const result = UpdateQuizSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts questions with optional id for upsert", () => {
    const result = UpdateQuizSchema.safeParse({
      questions: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          text: "Updated question",
          type: "multiple_choice",
          answers: [
            {
              id: "660e8400-e29b-41d4-a716-446655440000",
              text: "Updated answer",
              isCorrect: true,
            },
          ],
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts questions without id (new questions)", () => {
    const result = UpdateQuizSchema.safeParse({
      questions: [validQuestion],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid question id", () => {
    const result = UpdateQuizSchema.safeParse({
      questions: [{ ...validQuestion, id: "not-uuid" }],
    });
    expect(result.success).toBe(false);
  });
});

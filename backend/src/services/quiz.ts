import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";
import type { CreateQuizInput, UpdateQuizInput } from "../types/quiz.js";

export const getQuizzes = async () => {
  return prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getQuizById = async (id: string) => {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { position: "asc" },
        include: {
          answers: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });
};

export const makeQuize = async (input: CreateQuizInput) => {
  return prisma.quiz.create({
    data: {
      title: input.title,
      description: input.description,
      questions: {
        create: input.questions.map((q, qIndex) => ({
          text: q.text,
          type: q.type,
          position: qIndex,
          answers: {
            create: q.answers.map((a, aIndex) => ({
              text: a.text,
              isCorrect: a.isCorrect,
              position: aIndex,
            })),
          },
        })),
      },
    },
    include: {
      questions: { include: { answers: true } },
    },
  });
};

export const updateQuize = async (id: string, input: UpdateQuizInput) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (input.questions) {
      await tx.question.deleteMany({ where: { quizId: id } });
    }

    return tx.quiz.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        ...(input.questions && {
          questions: {
            create: input.questions.map((q, qIndex) => ({
              text: q.text,
              type: q.type,
              position: qIndex,
              answers: {
                create: q.answers.map((a, aIndex) => ({
                  text: a.text,
                  isCorrect: a.isCorrect,
                  position: aIndex,
                })),
              },
            })),
          },
        }),
      },
      include: {
        questions: { include: { answers: true } },
      },
    });
  });
};

export const deleteQuize = async (id: string) => {
  return prisma.quiz.delete({
    where: { id },
  });
};

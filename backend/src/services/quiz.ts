import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma.js";
import { AppError } from "../errors/AppError.js";
import type { CreateQuizInput, UpdateQuizInput } from "../schemas/quiz.js";

interface PaginationParams {
  limit: number;
  cursor?: string;
}

export const getQuizzes = async ({ limit, cursor }: PaginationParams) => {
  const items = await prisma.quiz.findMany({
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    select: {
      id: true,
      title: true,
      description: true,
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const lastItem = data[data.length - 1];
  const nextCursor = hasMore && lastItem ? lastItem.id : null;

  return { data, nextCursor };
};

export const getQuizById = async (id: string) => {
  const quiz = await prisma.quiz.findUnique({
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

  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  return quiz;
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
      const incomingQuestionIds = input.questions
        .map((q) => q.id)
        .filter((qid): qid is string => !!qid);

      await tx.question.deleteMany({
        where: { quizId: id, id: { notIn: incomingQuestionIds } },
      });

      for (const [qIndex, q] of input.questions.entries()) {
        if (q.id) {
          const incomingAnswerIds = q.answers
            .map((a) => a.id)
            .filter((aid): aid is string => !!aid);

          await tx.answer.deleteMany({
            where: { questionId: q.id, id: { notIn: incomingAnswerIds } },
          });

          await tx.question.update({
            where: { id: q.id },
            data: {
              text: q.text,
              type: q.type,
              position: qIndex,
            },
          });

          for (const [aIndex, a] of q.answers.entries()) {
            if (a.id) {
              await tx.answer.update({
                where: { id: a.id },
                data: { text: a.text, isCorrect: a.isCorrect, position: aIndex },
              });
            } else {
              await tx.answer.create({
                data: {
                  questionId: q.id,
                  text: a.text,
                  isCorrect: a.isCorrect,
                  position: aIndex,
                },
              });
            }
          }
        } else {
          await tx.question.create({
            data: {
              quizId: id,
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
            },
          });
        }
      }
    }

    return tx.quiz.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
      },
      include: {
        questions: {
          orderBy: { position: "asc" },
          include: { answers: { orderBy: { position: "asc" } } },
        },
      },
    });
  });
};

export const deleteQuize = async (id: string) => {
  return prisma.quiz.delete({
    where: { id },
  });
};

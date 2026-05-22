import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../src/config.js";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Wipe existing data so seed is idempotent
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  // Quiz 1: Geography
  await prisma.quiz.create({
    data: {
      title: "World Geography Basics",
      description: "Test your knowledge of capitals and continents.",
      questions: {
        create: [
          {
            text: "What is the capital of France?",
            type: "multiple_choice",
            position: 0,
            answers: {
              create: [
                { text: "London", isCorrect: false, position: 0 },
                { text: "Paris", isCorrect: true, position: 1 },
                { text: "Berlin", isCorrect: false, position: 2 },
                { text: "Madrid", isCorrect: false, position: 3 },
              ],
            },
          },
          {
            text: "Which continent is Egypt in?",
            type: "multiple_choice",
            position: 1,
            answers: {
              create: [
                { text: "Asia", isCorrect: false, position: 0 },
                { text: "Europe", isCorrect: false, position: 1 },
                { text: "Africa", isCorrect: true, position: 2 },
                { text: "South America", isCorrect: false, position: 3 },
              ],
            },
          },
          {
            text: "The Amazon River is the longest river in the world.",
            type: "true_false",
            position: 2,
            answers: {
              create: [
                { text: "True", isCorrect: false, position: 0 },
                { text: "False", isCorrect: true, position: 1 },
              ],
            },
          },
        ],
      },
    },
  });

  // Quiz 2: Programming
  await prisma.quiz.create({
    data: {
      title: "JavaScript Fundamentals",
      description: "Core concepts every JS developer should know.",
      questions: {
        create: [
          {
            text: "Which keyword declares a block-scoped variable?",
            type: "multiple_choice",
            position: 0,
            answers: {
              create: [
                { text: "var", isCorrect: false, position: 0 },
                { text: "let", isCorrect: true, position: 1 },
                { text: "function", isCorrect: false, position: 2 },
                { text: "static", isCorrect: false, position: 3 },
              ],
            },
          },
          {
            text: 'What does "===" do in JavaScript?',
            type: "multiple_choice",
            position: 1,
            answers: {
              create: [
                { text: "Assigns a value", isCorrect: false, position: 0 },
                {
                  text: "Compares values with type coercion",
                  isCorrect: false,
                  position: 1,
                },
                {
                  text: "Compares values without type coercion",
                  isCorrect: true,
                  position: 2,
                },
                { text: "Concatenates strings", isCorrect: false, position: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  // Quiz 3: empty-ish — useful for testing the "zero questions" UI case
  await prisma.quiz.create({
    data: {
      title: "Science Trivia",
      description: "Coming soon — questions to be added.",
      questions: {
        create: [
          {
            text: "Water boils at 100°C at sea level.",
            type: "true_false",
            position: 0,
            answers: {
              create: [
                { text: "True", isCorrect: true, position: 0 },
                { text: "False", isCorrect: false, position: 1 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeded 3 quizzes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

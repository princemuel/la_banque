import { PrismaClient } from "@prisma/client";

const data = await import("./data.json", { with: { type: "json" } });

const categories = data.default || [];
const db = new PrismaClient();

/**
 * @typedef {Object} Vote
 * @property {number} answerId
 * @property {number} questionId
 * @property {string} email
 * @property {number} random
 */

async function main() {
  let voterIndex = 0;
  /** @type {Vote[]} */
  let votes = [];

  for (const category of categories) {
    const { name, questions, image } = category;

    const categoryData = await db.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        image,
      },
    });

    for (const question of questions) {
      const { question: questionText, answers } = question;

      const questionData = await db.question.upsert({
        where: { question: questionText },
        update: {},
        create: {
          question: questionText,
          categoryId: categoryData.id,
        },
      });

      for (const answer of answers) {
        const answerData = await db.answer.create({
          data: {
            answer,
            questionId: questionData.id,
          },
        });

        const count = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < count; i++) {
          votes = [
            ...votes,
            {
              answerId: answerData.id,
              questionId: questionData.id,
              email: `voter-${voterIndex++}@donotreply.com`,
              random: Math.random(),
            },
          ];
        }
      }

      for (const vote of votes.sort((a, b) => a.random - b.random)) {
        await db.vote.create({
          data: {
            answerId: vote.answerId,
            questionId: vote.questionId,
            email: vote.email,
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });

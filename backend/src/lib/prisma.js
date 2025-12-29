const { PrismaClient } = require("@prisma/client");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./prisma/dev.db";
}

const prisma = new PrismaClient();

module.exports = prisma;

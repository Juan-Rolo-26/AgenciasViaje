const prisma = require("../lib/prisma");

async function connectDb() {
  return prisma.$connect();
}

module.exports = {
  connectDb,
  prisma
};

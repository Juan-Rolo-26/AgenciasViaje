const { exec } = require("child_process");
const path = require("path");
const prisma = require("../lib/prisma");

function runMigration() {
  const cwd = path.resolve(__dirname, "..", "..");
  exec("npx prisma db push --skip-generate", { cwd }, (err, stdout, stderr) => {
    if (err) {
      console.warn("⚠️  prisma db push:", stderr || err.message);
    } else {
      console.log("✅ prisma db push completado.");
    }
  });
}

async function connectDb() {
  await prisma.$connect();
  runMigration();
}

module.exports = {
  connectDb,
  prisma
};

const { execSync } = require("child_process");
const prisma = require("../lib/prisma");

async function connectDb() {
  try {
    execSync("npx prisma db push --skip-generate", {
      stdio: "inherit",
      cwd: require("path").resolve(__dirname, "..", "..")
    });
  } catch (e) {
    console.warn("⚠️  prisma db push falló (puede ser normal en dev):", e.message);
  }
  return prisma.$connect();
}

module.exports = {
  connectDb,
  prisma
};

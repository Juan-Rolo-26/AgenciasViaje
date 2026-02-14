require("dotenv").config();
const { exec } = require("child_process");

const PORT = process.env.PORT || 3000;

function runPrismaCommand({ label, command }) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 ${label}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error en ${label.toLowerCase()}: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.log(`⚠️ Advertencia de Prisma: ${stderr}`);
      }
      console.log(`✅ Resultado de ${label.toLowerCase()}: ${stdout}`);
      return resolve();
    });
  });
}

function generatePrismaClient() {
  return runPrismaCommand({
    label: "Generando cliente de Prisma",
    command: "npx prisma generate"
  });
}

function syncSchema() {
  return runPrismaCommand({
    label: "Sincronizando esquema de Prisma (SQLite)",
    command: "npx prisma db push --skip-generate"
  });
}

async function bootstrap() {
  try {
    await generatePrismaClient();
  } catch (error) {
    console.error("❌ No se pudo iniciar la app por error en Prisma:", error);
    process.exit(1);
  }

  const app = require("./app");
  const { connectDb } = require("./config/db");

  // Escuchar primero para pasar health checks del deploy.
  const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);

    // Sincronizar esquema y luego conectar
    syncSchema()
      .then(() => connectDb())
      .then(() => {
        console.log("✅ Base de datos lista y conectada.");
      })
      .catch((error) => {
        console.error("❌ Error en el inicio de la base de datos:", error);
      });
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing server...");
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
}

bootstrap();

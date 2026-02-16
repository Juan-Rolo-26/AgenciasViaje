const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { execFile } = require("child_process");

function loadEnvironmentVariables() {
  const candidateFiles = [
    path.resolve(__dirname, "..", ".env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "..", "..", ".env")
  ];
  const visited = new Set();

  for (const envPath of candidateFiles) {
    if (visited.has(envPath)) {
      continue;
    }
    visited.add(envPath);
    if (!fs.existsSync(envPath)) {
      continue;
    }

    dotenv.config({ path: envPath });
    return envPath;
  }

  dotenv.config();
  return "";
}

const loadedEnvPath = loadEnvironmentVariables();
if (loadedEnvPath) {
  console.log(`📦 Variables de entorno cargadas desde ${loadedEnvPath}`);
} else {
  console.warn(
    "⚠️ No se encontró .env en rutas conocidas. Se usarán variables del sistema."
  );
}

const PORT = process.env.PORT || 3000;
const PROJECT_ROOT = path.resolve(__dirname, "..");
let PRISMA_CLI = "";

try {
  PRISMA_CLI = require.resolve("prisma/build/index.js");
} catch (error) {
  PRISMA_CLI = "";
}

function runPrismaCommand({ label, args }) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 ${label}...`);
    execFile(process.execPath, [PRISMA_CLI, ...args], { cwd: PROJECT_ROOT }, (error, stdout, stderr) => {
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
    args: ["generate"]
  });
}

function syncSchema() {
  return runPrismaCommand({
    label: "Sincronizando esquema de Prisma (SQLite)",
    args: ["db", "push", "--skip-generate"]
  });
}

async function bootstrap() {
  if (!PRISMA_CLI) {
    console.error(
      "❌ No se encontró Prisma CLI. Verificá que 'prisma' esté en dependencies."
    );
    process.exit(1);
  }

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

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

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

async function bootstrap() {
  const app = require("./app");
  const { connectDb } = require("./config/db");

  // Escuchar primero para pasar health checks del deploy.
  const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    connectDb()
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

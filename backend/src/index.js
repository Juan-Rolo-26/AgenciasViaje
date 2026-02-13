require("dotenv").config();
const app = require("./app");
const { connectDb } = require("./config/db");
const { exec } = require("child_process");

const PORT = process.env.PORT || 3000;

// Función para ejecutar migraciones automáticamente si no hay terminal
const runMigrations = () => {
  return new Promise((resolve, reject) => {
    console.log("🔄 Ejecutando migraciones de Prisma...");
    exec("npx prisma migrate deploy", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error en migraciones: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.log(`⚠️ Advertencia en migraciones: ${stderr}`);
      }
      console.log(`✅ Resultado de migraciones: ${stdout}`);
      resolve();
    });
  });
};

// Escuchar primero para pasar los health checks del despliegue y evitar el error 503
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);

  // Ejecutar migraciones y luego conectar
  runMigrations()
    .then(() => connectDb())
    .then(() => {
      console.log("✅ Base de datos lista y conectada.");
    })
    .catch((error) => {
      console.error("❌ Error en el inicio de la base de datos:", error);
    });
});

// Manejo de cierres limpios
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

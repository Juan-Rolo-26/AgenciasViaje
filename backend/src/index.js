require("dotenv").config();
const app = require("./app");
const { connectDb } = require("./config/db");

const PORT = process.env.PORT || 3000;

// Escuchar primero para pasar los health checks del despliegue y evitar el error 503
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);

  // Intentar conectar a la base de datos después de iniciar el servidor
  console.log("📡 Intentando conectar a la base de datos...");
  connectDb()
    .then(() => {
      console.log("✅ Conexión a la base de datos establecida correctamente.");
    })
    .catch((error) => {
      console.error("❌ Error CRÍTICO al conectar a la base de datos:", error);
      console.error("Detalles del error de base de datos:", JSON.stringify(error, null, 2));
      // No cerramos el proceso inmediatamente para permitir ver los logs en el panel de control
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

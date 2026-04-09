const path = require("path");
const prisma = require("../lib/prisma");

// Eliminamos la ejecución automática de migraciones en el arranque.
// En entornos de hosting compartido como Hostinger, esto puede causar timeouts (Error 500/503)
// porque el servidor web espera una respuesta rápida del proceso Node.
async function connectDb() {
  await prisma.$connect();
  console.log("✅ Conexión con Prisma establecida.");
}

module.exports = {
  connectDb,
  prisma
};


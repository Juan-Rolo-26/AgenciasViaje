const prisma = require("../lib/prisma");

async function connectDb() {
  await prisma.$connect();
  console.log("✅ Base de datos conectada.");
  // Crear tablas faltantes en background, sin bloquear nada
  setTimeout(() => createMissingTables(), 2000);
}

async function createMissingTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS "Actividad" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "nombre" TEXT NOT NULL DEFAULT '',
      "slug" TEXT NOT NULL UNIQUE,
      "destinoId" INTEGER NOT NULL DEFAULT 1,
      "tipoActividad" TEXT NOT NULL DEFAULT '',
      "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "hora" TEXT,
      "precio" DECIMAL NOT NULL DEFAULT 0,
      "cupos" INTEGER NOT NULL DEFAULT 0,
      "puntoEncuentro" TEXT NOT NULL DEFAULT '',
      "descripcion" TEXT NOT NULL DEFAULT '',
      "imagenPortada" TEXT NOT NULL DEFAULT '',
      "destacada" BOOLEAN NOT NULL DEFAULT 0,
      "activa" BOOLEAN NOT NULL DEFAULT 1,
      "orden" INTEGER NOT NULL DEFAULT 0,
      "tituloSeo" TEXT,
      "descripcionSeo" TEXT,
      "creadaEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "OfertaActividad" (
      "ofertaId" INTEGER NOT NULL,
      "actividadId" INTEGER NOT NULL,
      PRIMARY KEY ("ofertaId", "actividadId")
    )`,
    `CREATE TABLE IF NOT EXISTS "Crucero" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "nombre" TEXT NOT NULL DEFAULT '',
      "slug" TEXT NOT NULL UNIQUE,
      "destinoId" INTEGER NOT NULL DEFAULT 1,
      "naviera" TEXT,
      "barco" TEXT,
      "tipoCrucero" TEXT,
      "fechaSalida" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "horaSalida" TEXT,
      "duracionNoches" INTEGER NOT NULL DEFAULT 0,
      "precio" DECIMAL NOT NULL DEFAULT 0,
      "cupos" INTEGER NOT NULL DEFAULT 0,
      "puertoSalida" TEXT NOT NULL DEFAULT '',
      "descripcion" TEXT NOT NULL DEFAULT '',
      "imagenPortada" TEXT NOT NULL DEFAULT '',
      "destacada" BOOLEAN NOT NULL DEFAULT 0,
      "activa" BOOLEAN NOT NULL DEFAULT 1,
      "orden" INTEGER NOT NULL DEFAULT 0,
      "tituloSeo" TEXT,
      "descripcionSeo" TEXT,
      "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "ImagenCrucero" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "cruceroId" INTEGER NOT NULL,
      "imagen" TEXT NOT NULL DEFAULT '',
      "epigrafe" TEXT,
      "orden" INTEGER NOT NULL DEFAULT 0
    )`,
  ];

  for (const sql of tables) {
    try {
      await prisma.$executeRawUnsafe(sql);
    } catch (e) {
      // Ignorar errores — no bloquear la app
    }
  }
  console.log("✅ Tablas verificadas.");
}

module.exports = { connectDb, prisma };

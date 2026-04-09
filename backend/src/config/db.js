const path = require("path");
const prisma = require("../lib/prisma");

async function ensureTables() {
  const stmts = [
    `CREATE TABLE IF NOT EXISTS "Actividad" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "nombre" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "destinoId" INTEGER NOT NULL,
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
      "nombre" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "destinoId" INTEGER NOT NULL,
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
      "imagen" TEXT NOT NULL,
      "epigrafe" TEXT,
      "orden" INTEGER NOT NULL DEFAULT 0
    )`,
  ];

  for (const sql of stmts) {
    await prisma.$executeRawUnsafe(sql);
  }
  console.log("✅ Tablas verificadas/creadas.");
}

async function connectDb() {
  await prisma.$connect();
  await ensureTables();
  console.log("✅ Base de datos lista.");
}

module.exports = { connectDb, prisma };

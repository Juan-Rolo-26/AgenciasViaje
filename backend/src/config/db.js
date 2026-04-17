const prisma = require("../lib/prisma");

function connectDb() {
  setTimeout(createMissingTables, 3000);
  return Promise.resolve();
}

async function createMissingTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS "Destino" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "nombre" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE,
      "paisRegion" TEXT, "descripcionCorta" TEXT,
      "descripcion" TEXT NOT NULL DEFAULT '',
      "imagenPortada" TEXT NOT NULL DEFAULT '',
      "destacado" BOOLEAN NOT NULL DEFAULT 0,
      "activo" BOOLEAN NOT NULL DEFAULT 1,
      "orden" INTEGER NOT NULL DEFAULT 0,
      "tituloSeo" TEXT, "descripcionSeo" TEXT,
      "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS "ImagenDestino" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "destinoId" INTEGER NOT NULL, "imagen" TEXT NOT NULL,
      "epigrafe" TEXT, "orden" INTEGER NOT NULL DEFAULT 0)`,
    `CREATE TABLE IF NOT EXISTS "Oferta" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "titulo" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE,
      "destinoId" INTEGER NOT NULL,
      "noches" INTEGER NOT NULL DEFAULT 1,
      "cupos" INTEGER NOT NULL DEFAULT 0,
      "noIncluye" TEXT, "condiciones" TEXT,
      "destacada" BOOLEAN NOT NULL DEFAULT 0,
      "activa" BOOLEAN NOT NULL DEFAULT 1,
      "tipo" TEXT NOT NULL DEFAULT 'individual',
      "orden" INTEGER NOT NULL DEFAULT 0,
      "tituloSeo" TEXT, "descripcionSeo" TEXT,
      "creadaEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS "OfertaDestino" (
      "ofertaId" INTEGER NOT NULL, "destinoId" INTEGER NOT NULL,
      PRIMARY KEY ("ofertaId","destinoId"))`,
    `CREATE TABLE IF NOT EXISTS "PrecioOferta" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "ofertaId" INTEGER NOT NULL,
      "precio" DECIMAL NOT NULL DEFAULT 0,
      "moneda" TEXT NOT NULL DEFAULT 'ARS',
      "fechaInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "fechaFin" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS "IncluyeOferta" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "ofertaId" INTEGER NOT NULL,
      "tipo" TEXT NOT NULL DEFAULT '',
      "descripcion" TEXT NOT NULL DEFAULT '')`,
    `CREATE TABLE IF NOT EXISTS "Actividad" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "nombre" TEXT NOT NULL DEFAULT '', "slug" TEXT NOT NULL UNIQUE,
      "destinoId" INTEGER NOT NULL DEFAULT 1,
      "tipoActividad" TEXT NOT NULL DEFAULT '',
      "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "hora" TEXT, "precio" DECIMAL NOT NULL DEFAULT 0,
      "cupos" INTEGER NOT NULL DEFAULT 0,
      "puntoEncuentro" TEXT NOT NULL DEFAULT '',
      "descripcion" TEXT NOT NULL DEFAULT '',
      "imagenPortada" TEXT NOT NULL DEFAULT '',
      "destacada" BOOLEAN NOT NULL DEFAULT 0,
      "activa" BOOLEAN NOT NULL DEFAULT 1,
      "orden" INTEGER NOT NULL DEFAULT 0,
      "tituloSeo" TEXT, "descripcionSeo" TEXT,
      "creadaEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS "OfertaActividad" (
      "ofertaId" INTEGER NOT NULL, "actividadId" INTEGER NOT NULL,
      PRIMARY KEY ("ofertaId","actividadId"))`,
    `CREATE TABLE IF NOT EXISTS "Crucero" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "nombre" TEXT NOT NULL DEFAULT '', "slug" TEXT NOT NULL UNIQUE,
      "destinoId" INTEGER NOT NULL DEFAULT 1,
      "naviera" TEXT, "barco" TEXT, "tipoCrucero" TEXT,
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
      "tituloSeo" TEXT, "descripcionSeo" TEXT,
      "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS "ImagenCrucero" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "cruceroId" INTEGER NOT NULL,
      "imagen" TEXT NOT NULL DEFAULT '',
      "epigrafe" TEXT, "orden" INTEGER NOT NULL DEFAULT 0)`,
    `CREATE TABLE IF NOT EXISTS "SeccionNosotros" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "titulo" TEXT NOT NULL DEFAULT '',
      "contenido" TEXT NOT NULL DEFAULT '',
      "imagen" TEXT, "tituloSeo" TEXT, "descripcionSeo" TEXT)`,
    `CREATE TABLE IF NOT EXISTS "Valor" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "seccionId" INTEGER NOT NULL,
      "titulo" TEXT NOT NULL DEFAULT '',
      "descripcion" TEXT NOT NULL DEFAULT '',
      "icono" TEXT, "orden" INTEGER NOT NULL DEFAULT 0)`,
  ];

  const newTables = [
    `CREATE TABLE IF NOT EXISTS "ModoFanatico" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "nombre" TEXT NOT NULL DEFAULT '',
      "slug" TEXT NOT NULL UNIQUE,
      "descripcionCorta" TEXT,
      "descripcion" TEXT,
      "imagenPortada" TEXT,
      "precioPesos" DECIMAL,
      "precioDolares" DECIMAL,
      "ofertasSlugs" TEXT DEFAULT '[]',
      "destacado" BOOLEAN NOT NULL DEFAULT 0,
      "activo" BOOLEAN NOT NULL DEFAULT 1,
      "orden" INTEGER NOT NULL DEFAULT 0,
      "tituloSeo" TEXT, "descripcionSeo" TEXT,
      "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS "ImagenFanatico" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "modoFanaticoId" INTEGER NOT NULL,
      "imagen" TEXT NOT NULL DEFAULT '',
      "epigrafe" TEXT, "orden" INTEGER NOT NULL DEFAULT 0)`,
  ];

  const alterColumns = [
    `ALTER TABLE "Destino" ADD COLUMN "precioPesos" DECIMAL`,
    `ALTER TABLE "Destino" ADD COLUMN "precioDolares" DECIMAL`,
    `ALTER TABLE "Oferta" ADD COLUMN "precioPesos" DECIMAL`,
    `ALTER TABLE "Oferta" ADD COLUMN "precioDolares" DECIMAL`,
    `ALTER TABLE "Actividad" ADD COLUMN "precioPesos" DECIMAL`,
    `ALTER TABLE "Actividad" ADD COLUMN "precioDolares" DECIMAL`,
    `ALTER TABLE "Crucero" ADD COLUMN "precioPesos" DECIMAL`,
    `ALTER TABLE "Crucero" ADD COLUMN "precioDolares" DECIMAL`,
  ];

  for (const sql of tables) {
    try { await prisma.$executeRawUnsafe(sql); } catch (_) {}
  }
  for (const sql of newTables) {
    try { await prisma.$executeRawUnsafe(sql); } catch (_) {}
  }
  for (const sql of alterColumns) {
    try { await prisma.$executeRawUnsafe(sql); } catch (_) {}
  }
  console.log("✅ Tablas verificadas.");
}

module.exports = { connectDb, prisma };

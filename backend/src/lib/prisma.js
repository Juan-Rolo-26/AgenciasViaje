const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const DEFAULT_DATABASE_URL = "file:./prisma/dev.db";
const SQLITE_PROTOCOL = "file:";
const SQLITE_SNAPSHOT_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "prisma",
  "bootstrap.sqlite"
);

function normalizeDatabaseUrl(rawValue) {
  if (typeof rawValue !== "string") {
    return "";
  }

  let value = rawValue.trim();
  if (!value) {
    return "";
  }

  // En algunos paneles de deploy se pega la URL con comillas/backticks.
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith("`") && value.endsWith("`"))
  ) {
    value = value.slice(1, -1).trim();
  }

  return value;
}

function normalizeSqlitePath(value) {
  if (!value.startsWith(SQLITE_PROTOCOL)) {
    return value;
  }

  const rawPath = value.slice(SQLITE_PROTOCOL.length).trim();
  if (!rawPath) {
    return value;
  }

  if (rawPath.startsWith("/")) {
    return `file:${rawPath}`;
  }

  const backendRoot = path.resolve(__dirname, "..", "..");
  const relativePath = rawPath.startsWith("./") ? rawPath.slice(2) : rawPath;
  const resolvedPath =
    relativePath.includes("/") || relativePath.startsWith("prisma/")
      ? path.resolve(backendRoot, relativePath)
      : path.resolve(backendRoot, "prisma", relativePath);

  return `file:${resolvedPath}`;
}

function resolveSqliteFilePath(value) {
  if (!value.startsWith(SQLITE_PROTOCOL)) {
    return "";
  }

  const rawPath = value.slice(SQLITE_PROTOCOL.length).trim();
  if (!rawPath) {
    return "";
  }

  return rawPath.startsWith("/")
    ? rawPath
    : path.resolve(__dirname, "..", "..", rawPath);
}

function restoreSqliteSnapshotIfNeeded(dbPath) {
  if (!dbPath || fs.existsSync(dbPath)) {
    return false;
  }

  if (!fs.existsSync(SQLITE_SNAPSHOT_PATH)) {
    return false;
  }

  fs.copyFileSync(SQLITE_SNAPSHOT_PATH, dbPath);
  console.log(
    `SQLite restaurada desde snapshot versionada: ${path.relative(
      path.resolve(__dirname, "..", ".."),
      SQLITE_SNAPSHOT_PATH
    )}`
  );
  return true;
}

function ensureSqliteDatabaseFile(value) {
  if (!value.startsWith(SQLITE_PROTOCOL)) {
    return;
  }

  const dbPath = resolveSqliteFilePath(value);
  if (!dbPath) {
    return;
  }
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (restoreSqliteSnapshotIfNeeded(dbPath)) {
    return;
  }

  if (!fs.existsSync(dbPath)) {
    fs.closeSync(fs.openSync(dbPath, "w"));
  }
}

function detectProtocol(value) {
  const match = value.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  return match ? match[1] : "desconocido";
}

const configuredDatabaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
const rawDatabaseUrl = configuredDatabaseUrl || DEFAULT_DATABASE_URL;
const databaseUrl = normalizeSqlitePath(rawDatabaseUrl);

if (!databaseUrl.startsWith(SQLITE_PROTOCOL)) {
  const protocol = detectProtocol(databaseUrl);
  throw new Error(
    `DATABASE_URL incompatible: prisma/schema.prisma usa provider "sqlite" pero DATABASE_URL tiene protocolo "${protocol}". Usá file:./prisma/dev.db o cambiá el provider del schema para usar otro motor.`
  );
}

if (!configuredDatabaseUrl) {
  console.warn(
    `DATABASE_URL no estaba configurada. Se usará el valor por defecto ${DEFAULT_DATABASE_URL}`
  );
}

if (rawDatabaseUrl !== databaseUrl) {
  console.log(`DATABASE_URL ajustada a formato Prisma SQLite: ${databaseUrl}`);
}

try {
  ensureSqliteDatabaseFile(databaseUrl);
} catch (error) {
  console.warn("No se pudo preparar el archivo SQLite:", error.message);
}

process.env.DATABASE_URL = databaseUrl;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

module.exports = prisma;

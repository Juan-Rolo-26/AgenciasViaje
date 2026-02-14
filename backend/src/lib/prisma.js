const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const DEFAULT_DATABASE_URL = "file:./prisma/dev.db";

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
  if (!value.startsWith("file:")) {
    return value;
  }

  const rawPath = value.slice("file:".length).trim();
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

function ensureSqliteDatabaseFile(value) {
  if (!value.startsWith("file:")) {
    return;
  }

  const rawPath = value.slice("file:".length).trim();
  if (!rawPath) {
    return;
  }

  const dbPath = rawPath.startsWith("/")
    ? rawPath
    : path.resolve(__dirname, "..", "..", rawPath);
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.closeSync(fs.openSync(dbPath, "w"));
  }
}

const configuredDatabaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
const rawDatabaseUrl = configuredDatabaseUrl || DEFAULT_DATABASE_URL;
const databaseUrl = normalizeSqlitePath(rawDatabaseUrl);

if (!databaseUrl.startsWith("file:")) {
  throw new Error(
    "DATABASE_URL inválida para SQLite. Debe empezar con file: (ej: file:./prisma/dev.db)"
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

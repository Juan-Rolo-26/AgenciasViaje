const { PrismaClient } = require("@prisma/client");

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

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL no está configurada. Definila en las variables de entorno del servidor."
  );
}

if (!databaseUrl.startsWith("mysql://")) {
  throw new Error(
    "DATABASE_URL inválida. Debe empezar con mysql://"
  );
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

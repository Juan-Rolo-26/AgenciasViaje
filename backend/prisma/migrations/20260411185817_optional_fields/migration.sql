-- CreateTable
CREATE TABLE "Destino" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "paisRegion" TEXT,
    "descripcionCorta" TEXT,
    "descripcion" TEXT NOT NULL,
    "imagenPortada" TEXT NOT NULL,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "tituloSeo" TEXT,
    "descripcionSeo" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ImagenDestino" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destinoId" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,
    "epigrafe" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ImagenDestino_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Destino" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Oferta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "destinoId" INTEGER NOT NULL,
    "noches" INTEGER NOT NULL DEFAULT 1,
    "cupos" INTEGER NOT NULL DEFAULT 0,
    "noIncluye" TEXT,
    "condiciones" TEXT,
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "tipo" TEXT NOT NULL DEFAULT 'individual',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "tituloSeo" TEXT,
    "descripcionSeo" TEXT,
    "creadaEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Oferta_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Destino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OfertaDestino" (
    "ofertaId" INTEGER NOT NULL,
    "destinoId" INTEGER NOT NULL,

    PRIMARY KEY ("ofertaId", "destinoId"),
    CONSTRAINT "OfertaDestino_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OfertaDestino_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Destino" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrecioOferta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ofertaId" INTEGER NOT NULL,
    "precio" DECIMAL NOT NULL,
    "moneda" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL,
    CONSTRAINT "PrecioOferta_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IncluyeOferta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ofertaId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    CONSTRAINT "IncluyeOferta_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "destinoId" INTEGER NOT NULL,
    "tipoActividad" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "hora" TEXT,
    "precio" DECIMAL NOT NULL,
    "cupos" INTEGER NOT NULL DEFAULT 0,
    "puntoEncuentro" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagenPortada" TEXT NOT NULL,
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "tituloSeo" TEXT,
    "descripcionSeo" TEXT,
    "creadaEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Actividad_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Destino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OfertaActividad" (
    "ofertaId" INTEGER NOT NULL,
    "actividadId" INTEGER NOT NULL,

    PRIMARY KEY ("ofertaId", "actividadId"),
    CONSTRAINT "OfertaActividad_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OfertaActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "Actividad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Crucero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "destinoId" INTEGER,
    "naviera" TEXT,
    "barco" TEXT,
    "tipoCrucero" TEXT,
    "fechaSalida" DATETIME,
    "horaSalida" TEXT,
    "duracionNoches" INTEGER NOT NULL DEFAULT 0,
    "precio" DECIMAL NOT NULL DEFAULT 0,
    "cupos" INTEGER NOT NULL DEFAULT 0,
    "puertoSalida" TEXT,
    "descripcion" TEXT,
    "imagenPortada" TEXT,
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "tituloSeo" TEXT,
    "descripcionSeo" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Crucero_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Destino" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImagenCrucero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cruceroId" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,
    "epigrafe" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ImagenCrucero_cruceroId_fkey" FOREIGN KEY ("cruceroId") REFERENCES "Crucero" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SeccionNosotros" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagen" TEXT,
    "tituloSeo" TEXT,
    "descripcionSeo" TEXT
);

-- CreateTable
CREATE TABLE "Valor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seccionId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "icono" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Valor_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "SeccionNosotros" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Destino_slug_key" ON "Destino"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Oferta_slug_key" ON "Oferta"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_slug_key" ON "Actividad"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Crucero_slug_key" ON "Crucero"("slug");

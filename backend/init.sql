-- CreateTable
CREATE TABLE `Destino` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `paisRegion` VARCHAR(191) NULL,
    `descripcionCorta` VARCHAR(191) NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `imagenPortada` VARCHAR(191) NOT NULL,
    `destacado` BOOLEAN NOT NULL DEFAULT false,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `tituloSeo` VARCHAR(191) NULL,
    `descripcionSeo` VARCHAR(191) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Destino_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenDestino` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destinoId` INTEGER NOT NULL,
    `imagen` VARCHAR(191) NOT NULL,
    `epigrafe` VARCHAR(191) NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Oferta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `destinoId` INTEGER NOT NULL,
    `noches` INTEGER NOT NULL DEFAULT 1,
    `cupos` INTEGER NOT NULL DEFAULT 0,
    `noIncluye` VARCHAR(191) NULL,
    `condiciones` VARCHAR(191) NULL,
    `destacada` BOOLEAN NOT NULL DEFAULT false,
    `activa` BOOLEAN NOT NULL DEFAULT true,
    `tipo` VARCHAR(191) NOT NULL DEFAULT 'individual',
    `orden` INTEGER NOT NULL DEFAULT 0,
    `tituloSeo` VARCHAR(191) NULL,
    `descripcionSeo` VARCHAR(191) NULL,
    `creadaEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Oferta_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfertaDestino` (
    `ofertaId` INTEGER NOT NULL,
    `destinoId` INTEGER NOT NULL,

    PRIMARY KEY (`ofertaId`, `destinoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrecioOferta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ofertaId` INTEGER NOT NULL,
    `precio` DECIMAL(65, 30) NOT NULL,
    `moneda` VARCHAR(191) NOT NULL,
    `fechaInicio` DATETIME(3) NOT NULL,
    `fechaFin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncluyeOferta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ofertaId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actividad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `destinoId` INTEGER NOT NULL,
    `tipoActividad` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `hora` VARCHAR(191) NULL,
    `precio` DECIMAL(65, 30) NOT NULL,
    `cupos` INTEGER NOT NULL DEFAULT 0,
    `puntoEncuentro` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `imagenPortada` VARCHAR(191) NOT NULL,
    `destacada` BOOLEAN NOT NULL DEFAULT false,
    `activa` BOOLEAN NOT NULL DEFAULT true,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `tituloSeo` VARCHAR(191) NULL,
    `descripcionSeo` VARCHAR(191) NULL,
    `creadaEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Actividad_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfertaActividad` (
    `ofertaId` INTEGER NOT NULL,
    `actividadId` INTEGER NOT NULL,

    PRIMARY KEY (`ofertaId`, `actividadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeccionNosotros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `contenido` VARCHAR(191) NOT NULL,
    `imagen` VARCHAR(191) NULL,
    `tituloSeo` VARCHAR(191) NULL,
    `descripcionSeo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Valor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seccionId` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `icono` VARCHAR(191) NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImagenDestino` ADD CONSTRAINT `ImagenDestino_destinoId_fkey` FOREIGN KEY (`destinoId`) REFERENCES `Destino`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Oferta` ADD CONSTRAINT `Oferta_destinoId_fkey` FOREIGN KEY (`destinoId`) REFERENCES `Destino`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfertaDestino` ADD CONSTRAINT `OfertaDestino_ofertaId_fkey` FOREIGN KEY (`ofertaId`) REFERENCES `Oferta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfertaDestino` ADD CONSTRAINT `OfertaDestino_destinoId_fkey` FOREIGN KEY (`destinoId`) REFERENCES `Destino`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrecioOferta` ADD CONSTRAINT `PrecioOferta_ofertaId_fkey` FOREIGN KEY (`ofertaId`) REFERENCES `Oferta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncluyeOferta` ADD CONSTRAINT `IncluyeOferta_ofertaId_fkey` FOREIGN KEY (`ofertaId`) REFERENCES `Oferta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actividad` ADD CONSTRAINT `Actividad_destinoId_fkey` FOREIGN KEY (`destinoId`) REFERENCES `Destino`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfertaActividad` ADD CONSTRAINT `OfertaActividad_ofertaId_fkey` FOREIGN KEY (`ofertaId`) REFERENCES `Oferta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfertaActividad` ADD CONSTRAINT `OfertaActividad_actividadId_fkey` FOREIGN KEY (`actividadId`) REFERENCES `Actividad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Valor` ADD CONSTRAINT `Valor_seccionId_fkey` FOREIGN KEY (`seccionId`) REFERENCES `SeccionNosotros`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


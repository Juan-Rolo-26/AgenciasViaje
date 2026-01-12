const prisma = require("../lib/prisma");

async function listDestinos({ activos = true, lite = false } = {}) {
  const baseQuery = {
    where: activos ? { activo: true } : undefined,
    orderBy: [{ orden: "asc" }, { nombre: "asc" }]
  };

  if (lite) {
    return prisma.destino.findMany({
      ...baseQuery,
      select: {
        id: true,
        nombre: true,
        slug: true,
        paisRegion: true,
        descripcionCorta: true,
        descripcion: true,
        imagenPortada: true,
        destacado: true,
        orden: true,
        galeria: {
          select: {
            id: true,
            imagen: true,
            orden: true
          },
          orderBy: { orden: "asc" },
          take: 3
        }
      }
    });
  }

  return prisma.destino.findMany({
    ...baseQuery,
    include: {
      galeria: true
    }
  });
}

async function getDestinoById(id) {
  return prisma.destino.findUnique({
    where: { id },
    include: {
      galeria: true,
      actividades: true
    }
  });
}

async function getDestinoBySlug(slug) {
  return prisma.destino.findUnique({
    where: { slug },
    include: {
      galeria: true,
      actividades: true
    }
  });
}

async function createDestino(payload) {
  const { galeria, ...data } = payload;

  return prisma.destino.create({
    data: {
      ...data,
      galeria: galeria?.length
        ? {
            create: galeria.map((item) => ({
              imagen: item.imagen,
              epigrafe: item.epigrafe || null,
              orden: item.orden ?? 0
            }))
          }
        : undefined
    },
    include: {
      galeria: true
    }
  });
}

async function updateDestino(id, payload) {
  const { galeria, ...data } = payload;

  return prisma.$transaction(async (tx) => {
    const destino = await tx.destino.update({
      where: { id },
      data
    });

    if (galeria) {
      await tx.imagenDestino.deleteMany({ where: { destinoId: id } });
      if (galeria.length) {
        await tx.imagenDestino.createMany({
          data: galeria.map((item) => ({
            destinoId: id,
            imagen: item.imagen,
            epigrafe: item.epigrafe || null,
            orden: item.orden ?? 0
          }))
        });
      }
    }

    return getDestinoById(destino.id);
  });
}

async function deleteDestino(id) {
  return prisma.destino.delete({ where: { id } });
}

module.exports = {
  listDestinos,
  getDestinoById,
  getDestinoBySlug,
  createDestino,
  updateDestino,
  deleteDestino
};

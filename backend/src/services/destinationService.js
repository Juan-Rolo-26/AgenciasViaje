const prisma = require("../lib/prisma");

async function listDestinos({ activos = true, lite = false } = {}) {
  const baseQuery = {
    where: activos ? { activo: true } : undefined,
    orderBy: [{ orden: "asc" }, { nombre: "asc" }]
  };

  if (lite) {
    const rows = await prisma.destino.findMany({
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
        },
        ofertasPrincipales: {
          where: { activa: true },
          select: {
            precioPesos: true,
            precioDolares: true
          }
        },
        _count: {
          select: {
            ofertasPrincipales: true,
            ofertasSecundarias: true
          }
        }
      }
    });
    return rows.map((d) => {
      const { _count, ofertasPrincipales, ...rest } = d;
      // Find cheapest package price
      const withPesos = ofertasPrincipales.filter(o => o.precioPesos && Number(o.precioPesos) > 0);
      const withDolares = ofertasPrincipales.filter(o => o.precioDolares && Number(o.precioDolares) > 0);
      const minPrecioPesos = withPesos.length
        ? Math.min(...withPesos.map(o => Number(o.precioPesos)))
        : null;
      const minPrecioDolares = withDolares.length
        ? Math.min(...withDolares.map(o => Number(o.precioDolares)))
        : null;
      return {
        ...rest,
        hasOfertas:
          (_count.ofertasPrincipales || 0) + (_count.ofertasSecundarias || 0) > 0,
        minPrecioPesos,
        minPrecioDolares
      };
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

const prisma = require("../lib/prisma");

function normalizeArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

async function listOfertas({ activas = true, lite = false } = {}) {
  const baseQuery = {
    where: activas ? { activa: true } : undefined,
    orderBy: [{ orden: "asc" }, { creadaEn: "desc" }]
  };

  if (lite) {
    return prisma.oferta.findMany({
      ...baseQuery,
      select: {
        id: true,
        titulo: true,
        slug: true,
        destinoId: true,
        noches: true,
        cupos: true,
        noIncluye: true,
        condiciones: true,
        destacada: true,
        activa: true,
        tipo: true,
        orden: true,
        destino: {
          select: {
            id: true,
            nombre: true,
            slug: true,
            paisRegion: true,
            imagenPortada: true
          }
        },
        destinos: {
          select: {
            destinoId: true,
            destino: {
              select: {
                id: true,
                nombre: true,
                slug: true,
                paisRegion: true,
                imagenPortada: true
              }
            }
          }
        },
        actividades: {
          select: {
            actividadId: true,
            actividad: {
              select: {
                id: true,
                nombre: true,
                slug: true
              }
            }
          }
        },
        precios: {
          select: {
            id: true,
            fechaInicio: true,
            fechaFin: true
          }
        },
        incluyeItems: {
          select: {
            id: true,
            tipo: true,
            descripcion: true
          }
        }
      }
    });
  }

  return prisma.oferta.findMany({
    ...baseQuery,
    include: {
      destino: true,
      destinos: { include: { destino: true } },
      actividades: { include: { actividad: true } },
      precios: true,
      incluyeItems: true
    }
  });
}

async function getOfertaById(id) {
  return prisma.oferta.findUnique({
    where: { id },
    include: {
      destino: true,
      destinos: { include: { destino: true } },
      actividades: { include: { actividad: true } },
      precios: true,
      incluyeItems: true
    }
  });
}

async function getOfertaBySlug(slug) {
  return prisma.oferta.findUnique({
    where: { slug },
    include: {
      destino: true,
      destinos: { include: { destino: true } },
      actividades: { include: { actividad: true } },
      precios: true,
      incluyeItems: true
    }
  });
}

async function createOferta(payload) {
  const destinosIds = normalizeArray(payload.destinosIds);
  const actividadesIds = normalizeArray(payload.actividadesIds);
  const precios = normalizeArray(payload.precios);
  const incluyeItems = normalizeArray(payload.incluyeItems);

  return prisma.oferta.create({
    data: {
      titulo: payload.titulo,
      slug: payload.slug,
      destinoId: payload.destinoId,
      noches: payload.noches ?? 1,
      cupos: payload.cupos ?? 0,
      noIncluye: payload.noIncluye || null,
      condiciones: payload.condiciones || null,
      destacada: Boolean(payload.destacada),
      activa: payload.activa ?? true,
      orden: payload.orden ?? 0,
      tituloSeo: payload.tituloSeo || null,
      descripcionSeo: payload.descripcionSeo || null,
      destinos: destinosIds.length
        ? {
            create: destinosIds.map((destinoId) => ({
              destinoId
            }))
          }
        : undefined,
      actividades: actividadesIds.length
        ? {
            create: actividadesIds.map((actividadId) => ({
              actividadId
            }))
          }
        : undefined,
      precios: precios.length ? { create: precios } : undefined,
      incluyeItems: incluyeItems.length ? { create: incluyeItems } : undefined
    },
    include: {
      destino: true,
      destinos: { include: { destino: true } },
      actividades: { include: { actividad: true } },
      precios: true,
      incluyeItems: true
    }
  });
}

async function updateOferta(id, payload) {
  const destinosIds = payload.destinosIds ? normalizeArray(payload.destinosIds) : null;
  const actividadesIds = payload.actividadesIds ? normalizeArray(payload.actividadesIds) : null;
  const precios = payload.precios ? normalizeArray(payload.precios) : null;
  const incluyeItems = payload.incluyeItems ? normalizeArray(payload.incluyeItems) : null;

  return prisma.$transaction(async (tx) => {
    const oferta = await tx.oferta.update({
      where: { id },
      data: {
        titulo: payload.titulo,
        slug: payload.slug,
        destinoId: payload.destinoId,
        noches: payload.noches,
        cupos: payload.cupos,
        noIncluye: payload.noIncluye,
        condiciones: payload.condiciones,
        destacada: payload.destacada,
        activa: payload.activa,
        orden: payload.orden,
        tituloSeo: payload.tituloSeo,
        descripcionSeo: payload.descripcionSeo
      }
    });

    if (destinosIds) {
      await tx.ofertaDestino.deleteMany({ where: { ofertaId: id } });
      if (destinosIds.length) {
        await tx.ofertaDestino.createMany({
          data: destinosIds.map((destinoId) => ({ ofertaId: id, destinoId }))
        });
      }
    }

    if (actividadesIds) {
      await tx.ofertaActividad.deleteMany({ where: { ofertaId: id } });
      if (actividadesIds.length) {
        await tx.ofertaActividad.createMany({
          data: actividadesIds.map((actividadId) => ({
            ofertaId: id,
            actividadId
          }))
        });
      }
    }

    if (precios) {
      await tx.precioOferta.deleteMany({ where: { ofertaId: id } });
      if (precios.length) {
        await tx.precioOferta.createMany({
          data: precios.map((precio) => ({ ...precio, ofertaId: id }))
        });
      }
    }

    if (incluyeItems) {
      await tx.incluyeOferta.deleteMany({ where: { ofertaId: id } });
      if (incluyeItems.length) {
        await tx.incluyeOferta.createMany({
          data: incluyeItems.map((item) => ({ ...item, ofertaId: id }))
        });
      }
    }

    return getOfertaById(oferta.id);
  });
}

async function deleteOferta(id) {
  return prisma.oferta.delete({ where: { id } });
}

module.exports = {
  listOfertas,
  getOfertaById,
  getOfertaBySlug,
  createOferta,
  updateOferta,
  deleteOferta
};

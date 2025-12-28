const prisma = require("../lib/prisma");

async function listActividades({ activas = true } = {}) {
  return prisma.actividad.findMany({
    where: activas ? { activa: true } : undefined,
    orderBy: [{ orden: "asc" }, { fecha: "asc" }],
    include: { destino: true }
  });
}

async function getActividadById(id) {
  return prisma.actividad.findUnique({
    where: { id },
    include: { destino: true }
  });
}

async function getActividadBySlug(slug) {
  return prisma.actividad.findUnique({
    where: { slug },
    include: { destino: true }
  });
}

async function createActividad(payload) {
  return prisma.actividad.create({
    data: {
      ...payload,
      destinoId: payload.destinoId
    },
    include: { destino: true }
  });
}

async function updateActividad(id, payload) {
  return prisma.actividad.update({
    where: { id },
    data: payload,
    include: { destino: true }
  });
}

async function deleteActividad(id) {
  return prisma.actividad.delete({ where: { id } });
}

module.exports = {
  listActividades,
  getActividadById,
  getActividadBySlug,
  createActividad,
  updateActividad,
  deleteActividad
};

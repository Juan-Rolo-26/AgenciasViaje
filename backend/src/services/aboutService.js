const prisma = require("../lib/prisma");

async function listSecciones() {
  return prisma.seccionNosotros.findMany({
    include: { valores: true },
    orderBy: { id: "asc" }
  });
}

async function getSeccionById(id) {
  return prisma.seccionNosotros.findUnique({
    where: { id },
    include: { valores: true }
  });
}

async function createSeccion(payload) {
  const { valores, ...data } = payload;
  return prisma.seccionNosotros.create({
    data: {
      ...data,
      valores: valores?.length
        ? {
            create: valores.map((valor) => ({
              titulo: valor.titulo,
              descripcion: valor.descripcion,
              icono: valor.icono || null,
              orden: valor.orden ?? 0
            }))
          }
        : undefined
    },
    include: { valores: true }
  });
}

async function updateSeccion(id, payload) {
  const { valores, ...data } = payload;

  return prisma.$transaction(async (tx) => {
    const seccion = await tx.seccionNosotros.update({
      where: { id },
      data
    });

    if (valores) {
      await tx.valor.deleteMany({ where: { seccionId: id } });
      if (valores.length) {
        await tx.valor.createMany({
          data: valores.map((valor) => ({
            seccionId: id,
            titulo: valor.titulo,
            descripcion: valor.descripcion,
            icono: valor.icono || null,
            orden: valor.orden ?? 0
          }))
        });
      }
    }

    return getSeccionById(seccion.id);
  });
}

async function deleteSeccion(id) {
  return prisma.seccionNosotros.delete({ where: { id } });
}

module.exports = {
  listSecciones,
  getSeccionById,
  createSeccion,
  updateSeccion,
  deleteSeccion
};

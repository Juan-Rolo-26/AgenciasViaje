const prisma = require("../lib/prisma");

async function listCruceros({ activos = true, lite = false } = {}) {
  const baseQuery = {
    where: activos ? { activa: true } : undefined,
    orderBy: [{ orden: "asc" }, { fechaSalida: "asc" }]
  };

  if (lite) {
    return prisma.crucero.findMany({
      ...baseQuery,
      select: {
        id: true,
        nombre: true,
        slug: true,
        naviera: true,
        barco: true,
        tipoCrucero: true,
        fechaSalida: true,
        horaSalida: true,
        duracionNoches: true,
        precio: true,
        cupos: true,
        puertoSalida: true,
        descripcion: true,
        imagenPortada: true,
        destacada: true,
        destino: {
          select: {
            id: true,
            nombre: true,
            slug: true,
            paisRegion: true
          }
        },
        galeria: {
          orderBy: { orden: "asc" },
          select: {
            id: true,
            imagen: true,
            epigrafe: true,
            orden: true
          }
        }
      }
    });
  }

  return prisma.crucero.findMany({
    ...baseQuery,
    include: {
      destino: true,
      galeria: { orderBy: { orden: "asc" } }
    }
  });
}

async function getCruceroById(id) {
  return prisma.crucero.findUnique({
    where: { id },
    include: {
      destino: true,
      galeria: { orderBy: { orden: "asc" } }
    }
  });
}

async function getCruceroBySlug(slug) {
  return prisma.crucero.findUnique({
    where: { slug },
    include: {
      destino: true,
      galeria: { orderBy: { orden: "asc" } }
    }
  });
}

module.exports = {
  listCruceros,
  getCruceroById,
  getCruceroBySlug
};

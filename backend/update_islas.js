const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Actualizando Isla Margarita e Isla de Coche...');

  // 1. Isla Margarita
  const margarita = await prisma.destino.findFirst({
    where: {
      OR: [
        { slug: 'isla-margarita' },
        { nombre: { contains: 'Margarita' } }
      ]
    }
  });

  if (margarita) {
    await prisma.destino.update({
      where: { id: margarita.id },
      data: {
        imagenPortada: '/assets/destinos/isla_margarita.jpg'
      }
    });

    await prisma.imagenDestino.deleteMany({
      where: { destinoId: margarita.id }
    });

    await prisma.imagenDestino.createMany({
      data: [
        { destinoId: margarita.id, imagen: '/assets/destinos/isla_margarita1.jpg', epigrafe: 'Isla Margarita', orden: 1 },
        { destinoId: margarita.id, imagen: '/assets/destinos/isla_margarita2.jpg', epigrafe: 'Isla Margarita', orden: 2 },
        { destinoId: margarita.id, imagen: '/assets/destinos/isla_margarita3.jpg', epigrafe: 'Isla Margarita', orden: 3 }
      ]
    });
    console.log(`✅ Isla Margarita (ID ${margarita.id}) actualizada con éxito.`);
  } else {
    console.log('❌ No se encontró Isla Margarita');
  }

  // 2. Isla de Coche
  const coche = await prisma.destino.findFirst({
    where: {
      OR: [
        { slug: 'isla-de-coche' },
        { nombre: { contains: 'Coche' } }
      ]
    }
  });

  if (coche) {
    await prisma.destino.update({
      where: { id: coche.id },
      data: {
        imagenPortada: '/assets/destinos/isla_coche.jpg'
      }
    });

    await prisma.imagenDestino.deleteMany({
      where: { destinoId: coche.id }
    });

    await prisma.imagenDestino.createMany({
      data: [
        { destinoId: coche.id, imagen: '/assets/destinos/isla_coche1.jpg', epigrafe: 'Isla de Coche', orden: 1 },
        { destinoId: coche.id, imagen: '/assets/destinos/isla_coche2.jpg', epigrafe: 'Isla de Coche', orden: 2 },
        { destinoId: coche.id, imagen: '/assets/destinos/isla_coche3.jpeg', epigrafe: 'Isla de Coche', orden: 3 }
      ]
    });
    console.log(`✅ Isla de Coche (ID ${coche.id}) actualizada con éxito.`);
  } else {
    console.log('❌ No se encontró Isla de Coche');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

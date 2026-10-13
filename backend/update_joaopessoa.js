const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Actualizando destino João Pessoa...');

  const destino = await prisma.destino.findFirst({
    where: {
      OR: [
        { id: 216 },
        { slug: 'joao-pessoa-' },
        { slug: 'joao-pessoa' },
        { nombre: { contains: 'Pessoa' } }
      ]
    }
  });

  if (!destino) {
    console.error('❌ No se encontró el destino João Pessoa');
    return;
  }

  console.log(`Encontrado destino ID ${destino.id} (${destino.nombre})`);

  // Actualizar datos del destino y su imagen de portada
  const updated = await prisma.destino.update({
    where: { id: destino.id },
    data: {
      nombre: 'João Pessoa',
      slug: 'joao-pessoa',
      paisRegion: 'Brasil',
      imagenPortada: '/assets/destinos/joaopessoa.jpg'
    }
  });

  // Reemplazar galería
  await prisma.imagenDestino.deleteMany({
    where: { destinoId: destino.id }
  });

  await prisma.imagenDestino.createMany({
    data: [
      {
        destinoId: destino.id,
        imagen: '/assets/destinos/joaopessoa1.jpg',
        epigrafe: 'João Pessoa',
        orden: 1
      },
      {
        destinoId: destino.id,
        imagen: '/assets/destinos/joaopessoa2.jpg',
        epigrafe: 'João Pessoa',
        orden: 2
      },
      {
        destinoId: destino.id,
        imagen: '/assets/destinos/joaopessoa3.jpg',
        epigrafe: 'João Pessoa',
        orden: 3
      }
    ]
  });

  console.log(`✅ Destino João Pessoa (ID ${destino.id}) actualizado correctamente con su portada y galería.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

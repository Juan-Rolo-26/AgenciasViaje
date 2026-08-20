const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDestinations() {
    console.log("Buscando destinos...");

    // San Bernardo
    const sb = await prisma.destino.findFirst({ where: { nombre: { contains: 'bernardo' } } });
    if (sb) {
        await prisma.destino.update({
            where: { id: sb.id },
            data: { imagenPortada: '/assets/destinos/sanbernardo.jpg' }
        });
        await prisma.imagenDestino.deleteMany({ where: { destinoId: sb.id } });
        await prisma.imagenDestino.createMany({
            data: [
                { destinoId: sb.id, imagen: '/assets/destinos/sanbernardo.jpg', orden: 0 },
                { destinoId: sb.id, imagen: '/assets/destinos/sanbernardo2.jpg', orden: 1 },
                { destinoId: sb.id, imagen: '/assets/destinos/sanbernardo3.webp', orden: 2 },
                { destinoId: sb.id, imagen: '/assets/destinos/sanbernardo4.jpg', orden: 3 },
            ]
        });
        console.log("✅ San Bernardo actualizado correctamente.");
    } else {
        console.log("❌ Destino San Bernardo no encontrado.");
    }

    // Mar del Plata
    const mdp = await prisma.destino.findFirst({
        where: { OR: [{ nombre: { contains: 'Plata' } }, { nombre: { contains: 'plata' } }, { nombre: { contains: 'mardel' } }] }
    });
    if (mdp) {
        await prisma.destino.update({
            where: { id: mdp.id },
            data: { imagenPortada: '/assets/destinos/mardel.jpg' }
        });
        await prisma.imagenDestino.deleteMany({ where: { destinoId: mdp.id } });
        await prisma.imagenDestino.createMany({
            data: [
                { destinoId: mdp.id, imagen: '/assets/destinos/mardel.jpg', orden: 0 },
                { destinoId: mdp.id, imagen: '/assets/destinos/mardel2.jpg', orden: 1 },
                { destinoId: mdp.id, imagen: '/assets/destinos/mardel3.jpg', orden: 2 },
                { destinoId: mdp.id, imagen: '/assets/destinos/mardel4.jpg', orden: 3 },
            ]
        });
        console.log("✅ Mar del Plata actualizado correctamente.");
    } else {
        console.log("❌ Destino Mar del Plata no encontrado.");
    }
}

updateDestinations()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

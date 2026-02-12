
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const dests = await prisma.destino.findMany({
        where: {
            OR: [
                { paisRegion: 'Aruba' },
                { paisRegion: 'Curazao' },
                { paisRegion: 'Panamá' },
                { paisRegion: 'Australia' }
            ]
        },
        select: { nombre: true, paisRegion: true, activo: true }
    });
    console.log(dests);
}

check()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

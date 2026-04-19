const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const destinos = await prisma.destino.findMany({
        where: {
            OR: [
                { nombre: { contains: 'Jamaica' } },
                { nombre: { contains: 'Caimán' } },
                { nombre: { contains: 'Caiman' } }
            ]
        }
    });
    console.log('Found destinos:', JSON.stringify(destinos, null, 2));

    const regions = await prisma.destino.findMany({
        select: { paisRegion: true },
        distinct: ['paisRegion']
    });
    console.log('Available regions:', regions.map(r => r.paisRegion));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

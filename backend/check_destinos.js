const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const destinos = await prisma.destino.findMany({
        orderBy: { creadoEn: 'desc' },
        take: 10
    });
    console.log(JSON.stringify(destinos.map(d => ({ id: d.id, nombre: d.nombre })), null, 2));
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

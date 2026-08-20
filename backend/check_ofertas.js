const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const ofertas = await prisma.oferta.findMany({
        orderBy: { creadaEn: 'desc' },
        take: 10,
        include: { destino: true }
    });
    console.log(JSON.stringify(ofertas.map(o => ({ id: o.id, titulo: o.titulo, destino: o.destino?.nombre })), null, 2));
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

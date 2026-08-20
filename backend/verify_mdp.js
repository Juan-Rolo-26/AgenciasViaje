const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const mdp = await prisma.destino.findFirst({
        where: { nombre: 'Mar de Plata' },
        include: { galeria: true }
    });
    console.log(JSON.stringify(mdp, null, 2));
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

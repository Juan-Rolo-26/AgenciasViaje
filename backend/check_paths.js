const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const destinos = await prisma.destino.findMany({ take: 5 });
    console.log('Destinos:', destinos.map(d => d.imagenPortada));
}
main().catch(console.error).finally(() => prisma.$disconnect());

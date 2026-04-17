const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const results = await prisma.destino.findMany({
        select: { id: true, nombre: true }
    });
    results.forEach(r => console.log(r.id, r.nombre));
}

main().catch(console.error).finally(() => prisma.$disconnect());

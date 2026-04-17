const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const table = 'destino';
    const results = await prisma[table].findMany({
        where: {
            OR: [
                { nombre: { contains: 'Formosa' } },
                { slug: { contains: 'formosa' } }
            ]
        }
    });
    console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

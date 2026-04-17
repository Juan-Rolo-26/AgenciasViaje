const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const results = await prisma.incluyeOferta.findMany({
        where: {
            descripcion: { contains: 'Formosa (' }
        }
    });
    console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

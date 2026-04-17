const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const regions = await prisma.destino.findMany({
        select: { paisRegion: true },
        distinct: ['paisRegion']
    });
    console.log(JSON.stringify(regions, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());

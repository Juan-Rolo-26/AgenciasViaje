const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const destinos = await prisma.destino.findMany({
        select: { paisRegion: true }
    });
    const countries = new Set(destinos.map(d => d.paisRegion));
    console.log("Countries in DB:", Array.from(countries));
}
main().catch(console.error).finally(() => prisma.$disconnect());

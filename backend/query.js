const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: { db: { url: 'file:./prisma/dev.db' } }
});
async function main() {
    const o = await prisma.oferta.findFirst({ select: { id: true, noIncluye: true } });
    console.log("Single oferta:", o);
    const ct = await prisma.oferta.count({ where: { noIncluye: { not: "" } } });
    console.log("Count with non-empty noIncluye:", ct);
}
main().catch(console.error).finally(() => prisma.$disconnect());

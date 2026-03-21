const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({ datasources: { db: { url: 'file:./prisma/dev.db' } } });
async function main() {
    const o = await p.oferta.findMany({ where: { noIncluye: { not: '' } } });
    console.log("count of not empty:", o.length);
    const jsonArr = await p.oferta.findMany({ where: { noIncluye: '[]' } });
    console.log("count of []: ", jsonArr.length);
}
main().catch(console.error).finally(() => p.$disconnect());

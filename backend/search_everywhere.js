const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tables = ['destino', 'oferta', 'actividad', 'crucero', 'modoFanatico'];

    for (const table of tables) {
        const results = await prisma[table].findMany();
        results.forEach(res => {
            const name = res.nombre || res.titulo || '';
            if (name.includes('(')) {
                console.log(`[${table}] ID ${res.id}: ${name}`);
            }
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());

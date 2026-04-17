const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const models = ['destino', 'oferta', 'actividad', 'crucero', 'modoFanatico', 'incluyeOferta'];

    for (const model of models) {
        const results = await prisma[model].findMany();
        results.forEach(res => {
            for (const key in res) {
                if (typeof res[key] === 'string' && res[key].includes('(')) {
                    console.log(`[${model}] ID ${res.id} - ${key}: ${res[key]}`);
                }
            }
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());

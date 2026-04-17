const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const models = ['destino', 'oferta', 'actividad', 'crucero', 'modoFanatico'];

    for (const model of models) {
        const results = await prisma[model].findMany();
        for (const res of results) {
            const field = res.nombre ? 'nombre' : (res.titulo ? 'titulo' : null);
            if (field && res[field] && res[field].includes('(')) {
                const nuevoNombre = res[field].split('(')[0].trim();
                console.log(`[${model}] Actualizando "${res[field]}" a "${nuevoNombre}"...`);
                await prisma[model].update({
                    where: { id: res.id },
                    data: { [field]: nuevoNombre }
                });
            }
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());

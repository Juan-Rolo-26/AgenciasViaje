const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const allDestinos = await prisma.destino.findMany();
    for (const d of allDestinos) {
        for (const key in d) {
            if (typeof d[key] === 'string' && d[key].includes('(')) {
                console.log(`[Destino ${d.id}] ${key}: ${d[key]}`);
            }
        }
    }

    const allOfertas = await prisma.oferta.findMany();
    for (const o of allOfertas) {
        for (const key in o) {
            if (typeof o[key] === 'string' && o[key].includes('(')) {
                console.log(`[Oferta ${o.id}] ${key}: ${o[key]}`);
            }
        }
    }

    const allActividades = await prisma.actividad.findMany();
    for (const a of allActividades) {
        for (const key in a) {
            if (typeof a[key] === 'string' && a[key].includes('(')) {
                console.log(`[Actividad ${a.id}] ${key}: ${a[key]}`);
            }
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());

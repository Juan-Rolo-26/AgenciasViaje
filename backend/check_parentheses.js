const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Revisando Destinos ---');
    const destinos = await prisma.destino.findMany({ select: { id: true, nombre: true } });
    destinos.forEach(d => {
        if (d.nombre.includes('(')) console.log(`Destino [${d.id}]: ${d.nombre}`);
    });

    console.log('--- Revisando Ofertas ---');
    const ofertas = await prisma.oferta.findMany({ select: { id: true, titulo: true } });
    ofertas.forEach(o => {
        if (o.titulo.includes('(')) console.log(`Oferta [${o.id}]: ${o.titulo}`);
    });

    console.log('--- Revisando Cruceros ---');
    const cruceros = await prisma.crucero.findMany({ select: { id: true, nombre: true } });
    cruceros.forEach(c => {
        if (c.nombre.includes('(')) console.log(`Crucero [${c.id}]: ${c.nombre}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());

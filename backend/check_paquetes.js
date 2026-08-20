const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const destinos = await prisma.destino.findMany({
        where: {
            OR: [
                { nombre: { contains: 'San Bernardo' } },
                { nombre: { contains: 'Mar del Plata' } },
                { nombre: { contains: 'San bernardo' } },
                { nombre: { contains: 'Mar del plata' } },
                { nombre: { contains: 'mardel' } },
                { slug: { contains: 'san-bernardo' } },
                { slug: { contains: 'mar-del-plata' } }
            ]
        },
        include: { ofertasPrincipales: true }
    });

    const ofertas = await prisma.oferta.findMany({
        where: {
            OR: [
                { titulo: { contains: 'San Bernardo' } },
                { titulo: { contains: 'Mar del Plata' } },
                { titulo: { contains: 'San bernardo' } },
                { titulo: { contains: 'Mar del plata' } },
                { slug: { contains: 'san-bernardo' } },
                { slug: { contains: 'mar-del-plata' } },
                { slug: { contains: 'mardel' } }
            ]
        },
    });

    console.log("Destinos encontradas:");
    console.log(JSON.stringify(destinos, null, 2));
    console.log("\nOfertas encontradas:");
    console.log(JSON.stringify(ofertas, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

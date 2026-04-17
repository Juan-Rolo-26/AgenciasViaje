const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const destinos = await prisma.destino.findMany({
        where: {
            nombre: {
                contains: '('
            }
        }
    });

    console.log(`Encontrados ${destinos.length} destinos con paréntesis.`);

    for (const d of destinos) {
        const nuevoNombre = d.nombre.split('(')[0].trim();
        console.log(`Actualizando "${d.nombre}" a "${nuevoNombre}"...`);
        await prisma.destino.update({
            where: { id: d.id },
            data: { nombre: nuevoNombre }
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());

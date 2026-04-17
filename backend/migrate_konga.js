const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const destinoKonga = await prisma.destino.findUnique({
        where: { slug: "crucero-la-konga" },
        include: { galeria: true }
    });

    if (destinoKonga) {
        console.log("Found in Destino, migrating to Crucero...");

        await prisma.crucero.upsert({
            where: { slug: "crucero-la-konga" },
            update: {
                nombre: destinoKonga.nombre,
                descripcion: destinoKonga.descripcion,
                imagenPortada: destinoKonga.imagenPortada,
                naviera: "La Konga",
                galeria: {
                    deleteMany: {},
                    create: destinoKonga.galeria.map(g => ({ imagen: g.imagen, orden: g.orden }))
                }
            },
            create: {
                nombre: destinoKonga.nombre,
                slug: destinoKonga.slug,
                naviera: "La Konga",
                descripcion: destinoKonga.descripcion,
                imagenPortada: destinoKonga.imagenPortada,
                galeria: {
                    create: destinoKonga.galeria.map(g => ({ imagen: g.imagen, orden: g.orden }))
                }
            }
        });

        await prisma.destino.delete({
            where: { slug: "crucero-la-konga" }
        });

        console.log("Migrated successfully!");
    } else {
        console.log("Not found in Destino. Maybe already migrated?");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());

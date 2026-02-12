const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearPackages() {
    try {
        console.log('🗑️  Eliminando todos los paquetes de la base de datos...');

        // Eliminar todas las relaciones primero
        await prisma.ofertaDestino.deleteMany({});
        console.log('✅ Relaciones OfertaDestino eliminadas');

        await prisma.ofertaActividad.deleteMany({});
        console.log('✅ Relaciones OfertaActividad eliminadas');

        await prisma.incluyeOferta.deleteMany({});
        console.log('✅ Items incluidos eliminados');

        await prisma.precioOferta.deleteMany({});
        console.log('✅ Precios eliminados');

        // Finalmente eliminar las ofertas
        const result = await prisma.oferta.deleteMany({});
        console.log(`✅ ${result.count} paquetes eliminados exitosamente`);

        console.log('🎉 Base de datos limpiada - Todos los paquetes han sido eliminados');
    } catch (error) {
        console.error('❌ Error al eliminar paquetes:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

clearPackages()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

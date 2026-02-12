
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PACKAGES = [
    {
        slug: "mundial-kansas-1-partido",
        titulo: "Experiencia Mundial - Kansas (1 Partido)",
        descripcion: "🇦🇷 Experiencia Mundial – sin aéreo\n📍 Kansas | ⚽ 01 Partido",
        noches: 3,
        incluye: [
            { tipo: "traslado", descripcion: "Traslado HTL / Estadio / HTL" },
            { tipo: "alojamiento", descripcion: "3 noches" },
            { tipo: "entrada", descripcion: "Entrada" },
            { tipo: "asistencia", descripcion: "Asistencia al viajero" }
        ],
        precios: [
            // Hotel 3*
            { descripcion: "Hotel 3★ - Cat. 3", precio: 2990 },
            { descripcion: "Hotel 3★ - Cat. 2", precio: 3790 },
            { descripcion: "Hotel 3★ - Cat. 1", precio: 4490 },
            { descripcion: "Hotel 3★ - Single", precio: 890, esSuplemento: true },
            // Hotel 4*
            { descripcion: "Hotel 4★ - Cat. 3", precio: 3690 },
            { descripcion: "Hotel 4★ - Cat. 2", precio: 4490 },
            { descripcion: "Hotel 4★ - Cat. 1", precio: 5190 },
            { descripcion: "Hotel 4★ - Single", precio: 1290, esSuplemento: true }
        ],
        notas: "A estas tarifas se les debe agregar el 3,5% de gastos administrativos. Tarifas por persona en base doble salvo suplemento."
    },
    {
        slug: "mundial-dallas-2-partidos",
        titulo: "Experiencia Mundial - Dallas (2 Partidos)",
        descripcion: "🇦🇷 Experiencia Mundial – sin aéreo\n📍 Dallas | ⚽ 02 partidos",
        noches: 8,
        incluye: [
            { tipo: "traslado", descripcion: "Traslado HTL / Estadio / HTL" },
            { tipo: "kit", descripcion: "Kit del hincha" },
            { tipo: "alojamiento", descripcion: "8 noches" },
            { tipo: "entrada", descripcion: "Entrada" },
            { tipo: "asistencia", descripcion: "Asistencia al viajero" }
        ],
        precios: [
            // Hotel 3*
            { descripcion: "Hotel 3★ - Cat. 3", precio: 5990 },
            { descripcion: "Hotel 3★ - Cat. 2", precio: 6990 },
            { descripcion: "Hotel 3★ - Cat. 1", precio: 7990 },
            { descripcion: "Hotel 3★ - Single", precio: 2400, esSuplemento: true },
            // Hotel 4*
            { descripcion: "Hotel 4★ - Cat. 3", precio: 6690 },
            { descripcion: "Hotel 4★ - Cat. 2", precio: 7690 },
            { descripcion: "Hotel 4★ - Cat. 1", precio: 8690 },
            { descripcion: "Hotel 4★ - Single", precio: 3300, esSuplemento: true }
        ],
        notas: "A estas tarifas se les debe agregar el 3,5% de gastos administrativos."
    },
    {
        slug: "mundial-fase-grupos-3-partidos",
        titulo: "Experiencia Mundial - Fase de Grupos (3 Partidos)",
        descripcion: "🇦🇷 Experiencia Mundial – sin aéreo\n⚽ 03 partidos de fase de grupos\n📍 Kansas – Dallas – Dallas",
        noches: 13,
        incluye: [
            { tipo: "traslado", descripcion: "Traslado HTL / Estadio / HTL" },
            { tipo: "kit", descripcion: "Kit del hincha" },
            { tipo: "alojamiento", descripcion: "13 noches" },
            { tipo: "entrada", descripcion: "Entrada" },
            { tipo: "asistencia", descripcion: "Asistencia al viajero" },
            { tipo: "comida", descripcion: "1 cena especial" }
        ],
        precios: [
            // Hotel 3*
            { descripcion: "Hotel 3★ - Cat. 3", precio: 9990 },
            { descripcion: "Hotel 3★ - Cat. 2", precio: 11990 },
            { descripcion: "Hotel 3★ - Cat. 1", precio: 12990 },
            { descripcion: "Hotel 3★ - Single", precio: 3900, esSuplemento: true },
            // Hotel 4*
            { descripcion: "Hotel 4★ - Cat. 3", precio: 11880 },
            { descripcion: "Hotel 4★ - Cat. 2", precio: 13690 },
            { descripcion: "Hotel 4★ - Cat. 1", precio: 14690 },
            { descripcion: "Hotel 4★ - Single", precio: 5590, esSuplemento: true }
        ],
        notas: "A estas tarifas se les debe agregar el 3,5% de gastos administrativos."
    },
    {
        slug: "mundial-completa-aereo",
        titulo: "Experiencia Mundial - COMPLETA con Aéreo",
        descripcion: "🇦🇷 EXPERIENCIA COMPLETA\n📍Kansas – Dallas – Dallas | ⚽ 03 partidos de fase de grupos\n(Programa a requerir)",
        noches: 13,
        incluye: [
            { tipo: "aereo", descripcion: "Aéreo internacional" },
            { tipo: "traslado", descripcion: "Traslados IN/OUT hotel – estadio – hotel entre sedes" },
            { tipo: "kit", descripcion: "Kit del hincha" },
            { tipo: "alojamiento", descripcion: "Alojamiento por 13 noches" },
            { tipo: "entrada", descripcion: "Entrada a los partidos" },
            { tipo: "asistencia", descripcion: "Asistencia al viajero" },
            { tipo: "comida", descripcion: "1 cena especial" }
        ],
        precios: [
            // Hotel 3*
            { descripcion: "Hotel 3★ - Cat. 3", precio: 13990 },
            { descripcion: "Hotel 3★ - Cat. 2", precio: 15990 },
            { descripcion: "Hotel 3★ - Cat. 1", precio: 17990 },
            { descripcion: "Hotel 3★ - Single", precio: 3900, esSuplemento: true },
            // Hotel 4*
            { descripcion: "Hotel 4★ - Cat. 3", precio: 15290 },
            { descripcion: "Hotel 4★ - Cat. 2", precio: 17290 },
            { descripcion: "Hotel 4★ - Cat. 1", precio: 19290 },
            { descripcion: "Hotel 4★ - Single", precio: 5590, esSuplemento: true }
        ],
        notas: "A estas tarifas se les debe agregar el 3,5% de gastos administrativos."
    },
    {
        slug: "mundial-dallas-16avos",
        titulo: "Mundial - 3er Partido + 16avos",
        descripcion: "🇦🇷 3er partido en Dallas + 16avos\n⚽ 02 partidos\n(Programa a requerir)",
        noches: 8,
        incluye: [
            { tipo: "traslado", descripcion: "Traslado hotel / estadio / hotel" }, // Icon plane in original text but says traslado? Assuming Flight? "Traslado hotel / estadio / hotel" with plane icon... weird. I'll act as literal text.
            // Actually original text says: "✈️ Traslado hotel / estadio / hotel". That icon usually means flight. But text is transfer. I'll stick to transfer for now properly.
            { tipo: "traslado", descripcion: "Traslados hotel / estadio / hotel" },
            { tipo: "kit", descripcion: "Kit del hincha" },
            { tipo: "alojamiento", descripcion: "Alojamiento por 8 noches" },
            { tipo: "entrada", descripcion: "Entrada a los partidos" },
            { tipo: "asistencia", descripcion: "Asistencia al viajero" }
        ],
        precios: [
            // Hotel 3*
            { descripcion: "Hotel 3★ - Cat. 3", precio: 7990 },
            { descripcion: "Hotel 3★ - Cat. 2", precio: 8790 },
            { descripcion: "Hotel 3★ - Cat. 1", precio: 9490 },
            { descripcion: "Hotel 3★ - Single", precio: 2400, esSuplemento: true },
            // Hotel 4*
            { descripcion: "Hotel 4★ - Cat. 3", precio: 8690 },
            { descripcion: "Hotel 4★ - Cat. 2", precio: 9490 },
            { descripcion: "Hotel 4★ - Cat. 1", precio: 10190 },
            { descripcion: "Hotel 4★ - Single", precio: 330, esSuplemento: true } // Checked value 330 in original text
        ],
        notas: "A estas tarifas se les debe agregar el 3,5% de gastos administrativos."
    },
    {
        slug: "mundial-16avos",
        titulo: "Mundial - 16avos de final",
        descripcion: "🇺🇸 16avos de final\n⚽ 01 partidos\n(Programa a requerir)",
        noches: 3,
        incluye: [
            { tipo: "traslado", descripcion: "Traslado hotel / estadio / hotel" },
            { tipo: "alojamiento", descripcion: "Alojamiento por 3 noches" },
            { tipo: "entrada", descripcion: "Entrada al partido" },
            { tipo: "asistencia", descripcion: "Asistencia al viajero" }
        ],
        precios: [
            // Hotel 3*
            { descripcion: "Hotel 3★ - Cat. 3", precio: 5990 },
            { descripcion: "Hotel 3★ - Cat. 2", precio: 6990 },
            { descripcion: "Hotel 3★ - Cat. 1", precio: 7990 },
            { descripcion: "Hotel 3★ - Single", precio: 890, esSuplemento: true },
            // Hotel 4*
            { descripcion: "Hotel 4★ - Cat. 3", precio: 6390 },
            { descripcion: "Hotel 4★ - Cat. 2", precio: 7390 },
            { descripcion: "Hotel 4★ - Cat. 1", precio: 8390 },
            { descripcion: "Hotel 4★ - Single", precio: 1290, esSuplemento: true }
        ],
        notas: "A estas tarifas se les debe agregar el 3,5% de gastos administrativos."
    }
];

async function main() {
    console.log('Seeding Mundial packages...');

    // Ensure 'Estados Unidos' exists for relation (Most match locations)
    const usa = await prisma.destino.upsert({
        where: { slug: "estados-unidos" },
        update: {},
        create: {
            nombre: "Estados Unidos",
            slug: "estados-unidos",
            descripcion: "Destino Mundial",
            imagenPortada: "/assets/destinos/usa.jpg",
            paisRegion: "America"
        }
    });

    // Delete existing Mundial offers to avoid duplicates
    for (const pkg of PACKAGES) {
        await prisma.oferta.deleteMany({
            where: { slug: pkg.slug }
        });
    }
    // Also delete old "experiencia-mundial" if it exists
    await prisma.oferta.deleteMany({ where: { slug: "experiencia-mundial" } });


    for (const pkg of PACKAGES) {
        console.log(`Creating ${pkg.titulo}...`);

        // Construct Includes List
        const Includes = [];

        // Header includes (Programa)
        Includes.push({ tipo: "programa", descripcion: pkg.descripcion });

        // Dynamic Includes
        pkg.incluye.forEach(inc => {
            Includes.push({ tipo: inc.tipo, descripcion: inc.descripcion });
        });

        Includes.push({ tipo: "notas", descripcion: pkg.notas });

        // Format Prices for Conditions/Details Text
        const preciosList = pkg.precios.map(p => {
            const type = p.esSuplemento ? "Suplemento" : "Tarifa Final";
            return `${p.descripcion}: USD ${p.precio}`;
        }).join('\n');


        await prisma.oferta.create({
            data: {
                titulo: pkg.titulo,
                slug: pkg.slug,
                destinoId: usa.id,
                noches: pkg.noches,
                cupos: 20,
                condiciones: preciosList,
                incluyeItems: {
                    create: Includes.map(inc => ({
                        tipo: `detalle-${inc.tipo}`,
                        descripcion: inc.descripcion
                    }))
                },
                precios: {
                    create: pkg.precios.filter(p => !p.esSuplemento).map(p => ({
                        fechaInicio: new Date(),
                        fechaFin: new Date(),
                        precio: p.precio,
                        moneda: "USD",
                        // We are using description hack again? No, we removed description from schema.
                        // We just store Price. The frontend shows "Desde".
                        // Detailed pricing table is in 'condiciones' text or we would need a better schema.
                        // For now, these Price entries serve for the "Desde $X" logic.
                    }))
                }
            }
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

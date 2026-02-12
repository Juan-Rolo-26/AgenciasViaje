
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PACKAGES = [
    {
        slug: "f1-miami-2026",
        titulo: "Gran Premio de Miami",
        pais: "Estados Unidos",
        descripcion: "🇺🇸 MIAMI — Gran Premio de Miami",
        fechaGP: "1–3 de mayo",
        noches: 4,
        hotel: "Hotel 4* en Miami – Solo alojamiento",
        hotelFechas: "30 abril al 4 mayo",
        entrada: "Entrada 3 días al circuito",
        precios: [
            { categoria: "Beach Grandstand", neto: 4290, iva: 479, tarifa: 4769 },
            { categoria: "Tribuna Turn 1", neto: 5960, iva: 669, tarifa: 6629 },
            { categoria: "Tribuna Start/ Finish", neto: 6490, iva: 729, tarifa: 7219 },
            { categoria: "Tribuna Marina", neto: 4390, iva: 489, tarifa: 4879 },
            { categoria: "Tribuna Turn 18", neto: 5790, iva: 649, tarifa: 6439 },
        ],
        notas: "Tarifa por persona en base doble. Agregar 3.5% gastos administrativos."
    },
    {
        slug: "f1-las-vegas-2026",
        titulo: "Gran Premio de Las Vegas",
        pais: "Estados Unidos",
        descripcion: "🇺🇸 LAS VEGAS – Gran Premio de Las Vegas",
        fechaGP: "19 – 21 de noviembre",
        noches: 4,
        hotel: "Hotel Park MGM Las Vegas o similar – Sólo alojamiento",
        hotelFechas: "18 octubre al 22 noviembre",
        entrada: "Entrada viernes, sábado y domingo",
        precios: [
            { categoria: "General admission Heineken South Koval", neto: 3390, iva: 379, tarifa: 3769 },
            { categoria: "General Admission T mobile Sphere", neto: 3390, iva: 379, tarifa: 3769 },
            { categoria: "West Harmon Hamilton", neto: 3790, iva: 429, tarifa: 4219 },
            { categoria: "Sphere Grandstand", neto: 4590, iva: 519, tarifa: 5109 },
            { categoria: "Main Grandstand", neto: 5690, iva: 639, tarifa: 6329 },
        ],
        notas: "Tarifa por persona en base doble. Agregar 3.5% gastos administrativos."
    },
    {
        slug: "f1-monaco-2026",
        titulo: "Gran Premio de Mónaco",
        pais: "Mónaco",
        descripcion: "🇲🇨 MONACO – Gran Premio de Mónaco",
        fechaGP: "05 – 07 Junio",
        noches: 3,
        hotel: "Hotel 3* Campanile PRIME – Nice Airport o SIMILAR, solo alojamiento",
        hotelFechas: "5 al 8 junio",
        entrada: "Entrada al circuito",
        precios: [
            { categoria: "Sector Rocher 01 dia", neto: 1190, iva: 139, tarifa: 1329, moneda: "EUR" },
            { categoria: "Sector Rocher 02 días", neto: 1390, iva: 159, tarifa: 1549, moneda: "EUR" },
            { categoria: "Sector Rocher 03 días", neto: 1590, iva: 179, tarifa: 1769, moneda: "EUR" },
            { categoria: "Sector K 01 dia", neto: 2290, iva: 259, tarifa: 2549, moneda: "EUR" },
            { categoria: "Sector K 02 días", neto: 2790, iva: 319, tarifa: 3109, moneda: "EUR" },
            { categoria: "Sector K 03 días", neto: 2990, iva: 339, tarifa: 3329, moneda: "EUR" },
        ],
        notas: "Tarifa por persona en base doble. Agregar 3.5% gastos administrativos."
    },
    {
        slug: "f1-madrid-2026",
        titulo: "Gran Premio de Madrid",
        pais: "España",
        descripcion: "🇪🇸 MADRID – Gran Premio de Madrid",
        fechaGP: "11-13 Septiembre",
        noches: 3,
        hotel: "Hotel 3* Holiday Inn Alcorcon O SIMILAR con desayuno",
        hotelFechas: "11 al 14 septiembre",
        entrada: "Entrada al circuito",
        precios: [
            { categoria: "TRIBUNA SILVER 7", neto: 1890, iva: 219, tarifa: 2109, moneda: "EUR" },
            { categoria: "TRIBUNA SILVER 12", neto: 1860, iva: 209, tarifa: 2069, moneda: "EUR" },
            { categoria: "TRIBUNA SILVER 16", neto: 1890, iva: 219, tarifa: 2109, moneda: "EUR" },
            { categoria: "TRIBUNA SILVER 13", neto: 2190, iva: 249, tarifa: 2439, moneda: "EUR" },
            { categoria: "BRONCE 15", neto: 1790, iva: 199, tarifa: 1989, moneda: "EUR" },
        ],
        notas: "Tarifa por persona en base doble. Agregar 3.5% gastos administrativos."
    },
    {
        slug: "f1-monza-2026",
        titulo: "Gran Premio de Monza",
        pais: "Italia",
        descripcion: "🇮🇹 ITALIA – Gran Premio de Monza",
        fechaGP: "04-06 Septiembre",
        noches: 4,
        hotel: "Hotel 4* Novotel Linate O SIMILAR con desayuno",
        hotelFechas: "3 al 7 septiembre",
        entrada: "Entrada al Circuito 3 dias",
        extras: ["Traslado hotel circuito hotel"],
        precios: [
            { categoria: "General Admission Prato", neto: 1590, iva: 179, tarifa: 1769, moneda: "EUR" },
            { categoria: "Right lateral 26 A", neto: 3300, iva: 369, tarifa: 3669, moneda: "EUR" },
            { categoria: "Left lateral 4", neto: 2900, iva: 329, tarifa: 3229, moneda: "EUR" },
            { categoria: "Outer first variant B 8B", neto: 2900, iva: 329, tarifa: 3229, moneda: "EUR" },
        ],
        notas: "Tarifa por persona en base doble. Agregar 3.5% gastos administrativos."
    },
    {
        slug: "f1-silverstone-2026",
        titulo: "Gran Premio Silverstone",
        pais: "Gran Bretaña",
        descripcion: "🇬🇧 GRAN BRETAÑA – Gran Premio Silverstone",
        fechaGP: "03-05 Julio",
        noches: 3,
        hotel: "Hotel 4* Novotel Leicester O SIMILAR con desayuno",
        hotelFechas: "3 al 6 julio",
        entrada: "Entrada al Circuito 3 dias",
        precios: [
            { categoria: "General Admission", neto: 1499, iva: 167, tarifa: 1666, moneda: "EUR" },
            { categoria: "Abbey A", neto: 1990, iva: 221, tarifa: 2211, moneda: "EUR" },
            { categoria: "Hamilton Straight", neto: 2390, iva: 266, tarifa: 2656, moneda: "EUR" },
            { categoria: "Luffield", neto: 1990, iva: 221, tarifa: 2211, moneda: "EUR" },
            { categoria: "Vale", neto: 1890, iva: 210, tarifa: 2100, moneda: "EUR" },
            { categoria: "Woodcote", neto: 1995, iva: 222, tarifa: 2217, moneda: "EUR" },
        ],
        notas: "Tarifa por persona en base doble. Agregar 3.5% gastos administrativos."
    },
];

async function main() {
    console.log('Seeding F1 packages...');

    // Ensure 'Estados Unidos' exists for relation
    const usa = await prisma.destino.upsert({
        where: { slug: "estados-unidos" },
        update: {},
        create: {
            nombre: "Estados Unidos",
            slug: "estados-unidos",
            descripcion: "Destino F1",
            imagenPortada: "/assets/destinos/usa.jpg",
            paisRegion: "America"
        }
    });

    // Delete existing F1 offers to avoid duplicates
    for (const pkg of PACKAGES) {
        await prisma.oferta.deleteMany({
            where: { slug: pkg.slug }
        });
    }

    for (const pkg of PACKAGES) {
        console.log(`Creating ${pkg.titulo}...`);

        // Construct Includes List
        const Includes = [
            { tipo: "programa", descripcion: pkg.descripcion },
            { tipo: "fecha-gp", descripcion: pkg.fechaGP },
            { tipo: "hotel", descripcion: `${pkg.hotel} (${pkg.hotelFechas})` },
            { tipo: "entrada", descripcion: pkg.entrada },
            { tipo: "notas", descripcion: pkg.notas }
        ];

        if (pkg.extras) {
            pkg.extras.forEach(extra => Includes.push({ tipo: "servicios", descripcion: extra }));
        }

        // Add pricing table as "detalle-precios" specialized items essentially or just use the price model?
        // Using PrecioOferta is better but it doesn't have "Categoria".
        // I will store the pricing table as a JSON string in 'condiciones' OR abuse IncluyeOferta for now
        // Actually best way: Store as formatted text in "noIncluye" or "condiciones" to be parsed, 
        // OR create IncluyeOferta items like "Precio: Category - $XXX"

        // Let's formatting pricing as a special list in condiciones for now, or just multiple "detalle-precio" items
        const preciosList = pkg.precios.map(p => {
            const currency = p.moneda || "USD";
            return `TRIBUNA: ${p.categoria} | TARIFA FINAL: ${currency}${p.tarifa} (+IVA/Gastos)`;
        }).join('\n');


        await prisma.oferta.create({
            data: {
                titulo: pkg.titulo,
                slug: pkg.slug,
                destinoId: usa.id, // Linking all to USA or we should fetch generic destination 'Mundo'? USA is fine for placeholder
                noches: pkg.noches,
                cupos: 10,
                condiciones: preciosList, // Storing prices summary here
                incluyeItems: {
                    create: Includes.map(inc => ({
                        tipo: `detalle-${inc.tipo}`, // Prefixing for frontend detection
                        descripcion: inc.descripcion
                    }))
                },
                // Also create real Price objects for the "From" price (cheapest)
                precios: {
                    create: pkg.precios.map(p => ({
                        fechaInicio: new Date(), // Dummy date
                        fechaFin: new Date(),
                        precio: p.tarifa,
                        moneda: p.moneda || "USD",
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

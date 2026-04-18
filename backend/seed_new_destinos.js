const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = [
    {
        nombre: "Sao Paulo",
        slug: "sao-paulo",
        paisRegion: "Brasil",
        descripcion: "Vive la energía de Sao Paulo: la metrópoli que nunca se detiene y el corazón cultural de Sudamérica. Déjate atrapar por su arquitectura imponente, su oferta gastronómica de clase mundial y la vibrante vida artística de la Avenida Paulista. Un destino cosmopolita donde el lujo, los negocios y la cultura urbana se fusionan para ofrecer una experiencia intensa e inolvidable en la ciudad más grande de Brasil.",
        descripcionCorta: "Vive la energía de Sao Paulo: la metrópoli que nunca se detiene y el corazón cultural de Sudamérica.",
        imagenPortada: "/assets/destinos/saopablo.jpg",
        galeria: ["/assets/destinos/saopablo1.webp", "/assets/destinos/saopablo2.webp", "/assets/destinos/saopablo3.jpg"]
    },
    {
        nombre: "Termas de Río Hondo",
        slug: "termas-rio-hondo",
        paisRegion: "Argentina",
        descripcion: "Vive la energía de Termas de Río Hondo: la capital termal de Argentina y un santuario de bienestar. Disfruta de las propiedades curativas de sus aguas cálidas, relájate en sus spas de primer nivel y vive la adrenalina en su famoso Autódromo internacional. Un destino que combina el descanso absoluto con la calidez del norte argentino, ideal para renovar cuerpo y mente.",
        descripcionCorta: "Vive la energía de Termas de Río Hondo: la capital termal de Argentina y un santuario de bienestar.",
        imagenPortada: "/assets/destinos/termas.webp",
        galeria: ["/assets/destinos/termas1.webp", "/assets/destinos/termas2.jpg", "/assets/destinos/termas3.jpg"]
    },
    {
        nombre: "Termas de Arapey",
        slug: "termas-arapey",
        paisRegion: "Uruguay",
        descripcion: "Vive la energía de Termas de Arapey: el oasis de relax más antiguo y prestigioso de Uruguay. Rodeado de un entorno rural sereno, este destino te invita a sumergirte en piscinas de aguas termales cristalinas y disfrutar de resorts de lujo con todo incluido. El lugar perfecto para quienes buscan exclusividad, silencio y una conexión profunda con el bienestar natural.",
        descripcionCorta: "Vive la energía de Termas de Arapey: el oasis de relax más antiguo y prestigioso de Uruguay.",
        imagenPortada: "/assets/destinos/arapey.jpg",
        galeria: ["/assets/destinos/arapey1.jpg", "/assets/destinos/arapey2.jpg", "/assets/destinos/arapey3.jpg"]
    },
    {
        nombre: "Termas de Federación",
        slug: "termas-federacion",
        paisRegion: "Argentina",
        descripcion: "Vive la energía de Federación: un paraíso termal a orillas del Río Uruguay. Disfruta de un parque moderno con aguas que surgen desde las profundidades de la tierra, ideal para compartir en familia o en pareja. Un destino que combina jardines impecables, una costanera encantadora y la paz característica de Entre Ríos para una escapada renovadora.",
        descripcionCorta: "Vive la energía de Federación: un paraíso termal a orillas del Río Uruguay.",
        imagenPortada: "/assets/destinos/federacion.jpg",
        galeria: ["/assets/destinos/federacion1.jpg", "/assets/destinos/federacion2.jpg", "/assets/destinos/federacion3.jpg"]
    },
    {
        nombre: "Esquel",
        slug: "esquel-tulipanes",
        paisRegion: "Argentina",
        descripcion: "Vive la energía de Esquel: un rincón mágico de la Patagonia que estalla en colores cada primavera. Déjate maravillar por el espectacular Campo de Tulipanes, donde hileras infinitas de flores contrastan con los picos nevados de los Andes. Un destino de postal que combina la mística del Viejo Expreso Patagónico 'La Trochita' con la pureza de sus lagos y montañas.",
        descripcionCorta: "Vive la energía de Esquel: un rincón mágico de la Patagonia que estalla en colores cada primavera.",
        imagenPortada: "/assets/destinos/esquel.webp",
        galeria: ["/assets/destinos/esquel1.jpg", "/assets/destinos/esquel2.jpg", "/assets/destinos/esquel3.jpg"]
    },
    {
        nombre: "Natal",
        slug: "natal",
        paisRegion: "Brasil",
        descripcion: "Vive la energía de Natal: la 'Ciudad del Sol' y el reino de las dunas gigantes. Siente la adrenalina de recorrer los médanos de Genipabu en buggy, disfruta de sus playas de aguas cálidas y déjate sorprender por el mayor cajonero del mundo. Un destino luminoso y alegre donde la brisa constante y el sol eterno crean el escenario perfecto para unas vacaciones inolvidables.",
        descripcionCorta: "Vive la energía de Natal: la 'Ciudad del Sol' y el reino de las dunas gigantes.",
        imagenPortada: "/assets/destinos/natal.jpg",
        galeria: ["/assets/destinos/natal1.jpg", "/assets/destinos/natal2.jpg", "/assets/destinos/natal3.jpg"]
    },
    {
        nombre: "Pipa",
        slug: "pipa",
        paisRegion: "Brasil",
        descripcion: "Vive la energía de Pipa: el destino bohemio y chic que enamora a surfistas y viajeros del mundo. Camina bajo sus imponentes acantilados rojizos, báñate con delfines en la Bahía de los Golfinhos y vive noches mágicas en su calle principal llena de encanto. Un paraíso rústico y sofisticado a la vez, donde la naturaleza salvaje se mezcla con una vibra cosmopolita única.",
        descripcionCorta: "Vive la energía de Pipa: el destino bohemio y chic que enamora a surfistas y viajeros del mundo.",
        imagenPortada: "/assets/destinos/pipa.jpg",
        galeria: ["/assets/destinos/pipa1.jpg", "/assets/destinos/pipa2.webp", "/assets/destinos/pipa3.jpg"]
    },
    {
        nombre: "Capão da Canoa",
        slug: "capao-da-canoa",
        paisRegion: "Brasil",
        descripcion: "Vive la energía de Capão da Canoa: el clásico del verano en el litoral de Río Grande do Sul. Con sus extensas playas, su vibrante costanera y parques acuáticos de primer nivel, es el destino favorito para disfrutar en familia. Un lugar lleno de vida, movimiento y servicios, ideal para quienes buscan el pulso del verano brasileño a pocos kilómetros de la frontera.",
        descripcionCorta: "Vive la energía de Capão da Canoa: el clásico del verano en el litoral de Río Grande do Sul.",
        imagenPortada: "/assets/destinos/capao.jpeg",
        galeria: ["/assets/destinos/capao1.webp", "/assets/destinos/capao2.webp", "/assets/destinos/capao3.jpg"]
    },
    {
        nombre: "Mendoza",
        slug: "mendoza",
        paisRegion: "Argentina",
        descripcion: "Vive la energía de Mendoza: la capital mundial del vino y el imponente hogar del Aconcagua. Recorre bodegas boutique al pie de la Cordillera, disfruta de almuerzos entre viñedos y vive la aventura de sus ríos y montañas. Un destino que combina el placer de un buen Malbec con paisajes cordilleranos que quitan el aliento en cualquier época del año.",
        descripcionCorta: "Vive la energía de Mendoza: la capital mundial del vino y el imponente hogar del Aconcagua.",
        imagenPortada: "/assets/destinos/mendoza.jpg",
        galeria: ["/assets/destinos/mendoza1.jpg", "/assets/destinos/mendoza2.jpg", "/assets/destinos/mendoza3.jpg"]
    },
    {
        nombre: "La Rioja",
        slug: "la-rioja-talampaya",
        paisRegion: "Argentina",
        descripcion: "Vive la energía de La Rioja: una tierra de formaciones rocosas milenarias y leyendas vivas. Adéntrate en el colosal Parque Nacional Talampaya, con sus murallones rojos que custodian la historia de la tierra, y recorre la Cuesta de Miranda para vistas panorámicas únicas. Un destino de impacto visual absoluto donde el color de la montaña y el cielo azul profundo son protagonistas.",
        descripcionCorta: "Vive la energía de La Rioja: una tierra de formaciones rocosas milenarias y leyendas vivas.",
        imagenPortada: "/assets/destinos/larioja.webp",
        galeria: ["/assets/destinos/larioja1.jpg", "/assets/destinos/larioja2.jpg", "/assets/destinos/larioja3.webp"]
    },
    {
        nombre: "Formosa",
        slug: "formosa-banado-estrella",
        paisRegion: "Argentina",
        descripcion: "Vive la energía de Formosa: el secreto mejor guardado del Norte Argentino. Déjate asombrar por el Bañado de la Estrella, el tercer humedal más grande de Sudamérica, donde los 'champales' (árboles cubiertos de enredaderas) crean un paisaje surrealista sobre el agua. Un destino virgen y fascinante, ideal para los amantes de la fotografía de naturaleza y el avistaje de fauna silvestre.",
        descripcionCorta: "Vive la energía de Formosa: el secreto mejor guardado del Norte Argentino.",
        imagenPortada: "/assets/destinos/formosa.jpg",
        galeria: ["/assets/destinos/formosa1.jpeg", "/assets/destinos/formosa2.jpg", "/assets/destinos/formosa3.jpg"]
    },
    {
        nombre: "Corrientes",
        slug: "corrientes-esteros-ibera",
        paisRegion: "Argentina",
        descripcion: "Vive la energía de Corrientes: el corazón brillante de las aguas correntinas. Explora los Esteros del Iberá, un santuario de biodiversidad donde podrás ver yacarés, ciervos de los pantanos y carpinchos en su hábitat natural. Un destino de conexión pura con la naturaleza salvaje, navegaciones mágicas y la calidez de la cultura del chamamé.",
        descripcionCorta: "Vive la energía de Corrientes: el corazón brillante de las aguas correntinas.",
        imagenPortada: "/assets/destinos/corrientes.jpg",
        galeria: ["/assets/destinos/corrientes1.webp", "/assets/destinos/corrientes2.jpg", "/assets/destinos/corrientes3.jpg"]
    },
    {
        nombre: "Guatemala",
        slug: "guatemala",
        paisRegion: "Guatemala",
        descripcion: "Vive la energía de Guatemala: el corazón del mundo maya y una tierra de colores eternos. Desde la majestuosidad de las pirámides de Tikal rodeadas de selva, hasta el encanto colonial de Antigua y la belleza mística del Lago Atitlán custodiado por volcanes. Un destino cultural profundo, lleno de tradiciones vivas, mercados textiles vibrantes y paisajes que parecen de otro mundo.",
        descripcionCorta: "Vive la energía de Guatemala: el corazón del mundo maya y una tierra de colores eternos.",
        imagenPortada: "/assets/destinos/guatemala.webp",
        galeria: ["/assets/destinos/guatemala1.webp", "/assets/destinos/guatemala2.webp", "/assets/destinos/guatemala3.webp"]
    },
    {
        nombre: "Jamaica",
        slug: "jamaica",
        paisRegion: "Jamaica",
        descripcion: "Vive la energía de Jamaica: el corazón del ritmo, el reggae y los atardeceres dorados. Déjate cautivar por las famosas Cascadas del Río Dunn, relájate en las playas de arena blanca de Negril y siente la vibrante cultura local en Montego Bay. Un destino con alma propia que combina selvas exuberantes, una gastronomía llena de especias y esa filosofía de \"One Love\" que te invita a disfrutar de la vida con alegría y libertad.",
        descripcionCorta: "Vive la energía de Jamaica: el corazón del ritmo, el reggae y los atardeceres dorados.",
        imagenPortada: "/assets/destinos/Jamaica.jpg",
        galeria: ["/assets/destinos/Jamaica1.jpg", "/assets/destinos/Jamaica2.jpg", "/assets/destinos/jamaica3.jpg"]
    },
    {
        nombre: "Islas Caimán",
        slug: "islas-caiman",
        paisRegion: "Islas Caimán",
        descripcion: "Vive la energía de las Islas Caimán: el destino definitivo para el lujo y la exploración submarina. Sumérgete en las aguas cristalinas de la famosa Seven Mile Beach, vive la experiencia única de nadar con rayas en Stingray City y descubre algunos de los mejores arrecifes de coral del mundo. Un archipiélago sofisticado que combina servicios de primer nivel con una naturaleza virgen impresionante, ideal para quienes buscan exclusividad y tranquilidad total.",
        descripcionCorta: "Vive la energía de las Islas Caimán: el destino definitivo para el lujo y la exploración submarina.",
        imagenPortada: "/assets/destinos/islas-caiman.jpg",
        galeria: ["/assets/destinos/islas-caiman1.jpg", "/assets/destinos/islas-caiman2.jpg", "/assets/destinos/islas-caiman3.jpg"]
    }
];

async function main() {
    for (const item of data) {
        const { galeria, ...destinoData } = item;
        try {
            const created = await prisma.destino.upsert({
                where: { slug: destinoData.slug },
                update: {
                    ...destinoData,
                    galeria: {
                        deleteMany: {},
                        create: galeria.map((img, idx) => ({ imagen: img, orden: idx }))
                    }
                },
                create: {
                    ...destinoData,
                    galeria: {
                        create: galeria.map((img, idx) => ({ imagen: img, orden: idx }))
                    }
                }
            });
            console.log(`✅ Destino cargado: ${created.nombre}`);
        } catch (e) {
            console.error(`❌ Error en ${item.nombre}:`, e.message);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.ofertaActividad.deleteMany();
  await prisma.ofertaDestino.deleteMany();
  await prisma.precioOferta.deleteMany();
  await prisma.incluyeOferta.deleteMany();
  await prisma.actividad.deleteMany();
  await prisma.oferta.deleteMany();
  await prisma.imagenDestino.deleteMany();
  await prisma.destino.deleteMany();
  await prisma.valor.deleteMany();
  await prisma.seccionNosotros.deleteMany();

  const destinosData = [
    // ================= ARGENTINA =================
    {
      nombre: "Bariloche",
      slug: "bariloche",
      paisRegion: "Argentina",
      descripcionCorta: "Lagos, montañas y paisajes patagónicos.",
      descripcion:
        "Vive la energía de Bariloche: el paraíso de las montañas, los lagos cristalinos y el chocolate. Disfruta de la nieve en el Cerro Catedral, recorre el Circuito Chico con sus vistas mundiales y déjate encantar por la arquitectura alpina del Centro Cívico. Un destino que deslumbra en las cuatro estaciones con su mezcla perfecta de aventura y relax.",
      imagenPortada: "/assets/destinos/bari1.png",
      imagenes: [
        "/assets/destinos/bari2.jpg",
        "/assets/destinos/bari3.png",
        "/assets/destinos/bari4.jpg"
      ],
      destacado: true,
      orden: 1
    },
    {
      nombre: "El Calafate",
      slug: "el-calafate",
      paisRegion: "Argentina",
      descripcionCorta: "Glaciares imponentes y naturaleza extrema.",
      descripcion:
        "Vive la energía de El Calafate: la puerta de entrada al reino de los hielos milenarios. Maravíllate con la imponente presencia del Glaciar Perito Moreno, camina sobre sus grietas azules y navega entre témpanos gigantes en el Lago Argentino. Un destino de impacto visual absoluto en el corazón de la naturaleza más pura de la Patagonia.",
      imagenPortada: "/assets/destinos/calafate1.jpg",
      imagenes: [
        "/assets/destinos/calfat2.jpg",
        "/assets/destinos/calafate3.jpg",
        "/assets/destinos/calafate4.jpg"
      ],
      destacado: true,
      orden: 2
    },
    {
      nombre: "Cataratas del Iguazú",
      slug: "cataratas-del-iguazu",
      paisRegion: "Argentina",
      descripcionCorta: "Una de las maravillas naturales del mundo.",
      descripcion:
        "Vive la energía de las Cataratas del Iguazú: una de las siete maravillas naturales del mundo. Siente la potencia de la Garganta del Diablo, explora los senderos de la selva misionera y vive la adrenalina de navegar bajo los saltos de agua más impactantes del planeta. Un espectáculo de la naturaleza en su estado más puro y salvaje.",
      imagenPortada: "/assets/destinos/cata1.jpg",
      imagenes: [
        "/assets/destinos/cata2.jpg",
        "/assets/destinos/cata3.webp",
        "/assets/destinos/cata4.jpg"
      ],
      destacado: true,
      orden: 3
    },
    {
      nombre: "Ushuaia",
      slug: "ushuaia",
      paisRegion: "Argentina",
      descripcionCorta: "El fin del mundo y naturaleza fueguina.",
      descripcion:
        "Vive la energía de Ushuaia: el fascinante Fin del Mundo donde la Cordillera de los Andes se une al mar. Navega por el Canal Beagle, recorre los bosques del Parque Nacional Tierra del Fuego y vive la mística de la ciudad más austral del planeta. Un destino mágico que combina paisajes extremos con la exclusividad de la centolla y el cordero fueguino.",
      imagenPortada: "/assets/destinos/usuahia.jpg",
      imagenes: [
        "/assets/destinos/usuahia2.jpg",
        "/assets/destinos/usuahia3.webp",
        "/assets/destinos/usuahia4.jpg"
      ],
      destacado: true,
      orden: 4
    },
    {
      nombre: "Puerto Madryn",
      slug: "puerto-madryn",
      paisRegion: "Argentina",
      descripcionCorta: "Fauna marina y costas patagónicas.",
      descripcion:
        "Vive la energía de Puerto Madryn: el santuario natural de la Patagonia argentina. Déjate asombrar por el avistaje de la Ballena Franca Austral, descubre las colonias de pingüinos y vive la aventura única de bucear con lobos marinos. Un destino épico donde la fauna salvaje y el inmenso mar patagónico son los protagonistas.",
      imagenPortada: "/assets/destinos/puerto1.jpg",
      imagenes: [
        "/assets/destinos/puerto2.jpeg",
        "/assets/destinos/puerto3.jpg",
        "/assets/destinos/puerto4.jpg"
      ],
      destacado: true,
      orden: 5
    },

    // ================= BRASIL =================
    {
      nombre: "Río de Janeiro",
      slug: "rio-de-janeiro",
      paisRegion: "Brasil",
      descripcionCorta: "Playas icónicas y energía vibrante.",
      descripcion:
        "Vive la energía de Río de Janeiro: la Ciudad Maravillosa que vibra entre el mar y la montaña. Desde la mística del Cristo Redentor y el Pan de Azúcar hasta el ritmo del samba en sus calles y las playas legendarias de Copacabana e Ipanema. Un destino icónico que combina cultura, historia y una naturaleza exuberante sin igual.",
      imagenPortada: "/assets/destinos/rio1.jpg",
      imagenes: [
        "/assets/destinos/rio2.jpg",
        "/assets/destinos/rio3.jpg",
        "/assets/destinos/rio4.webp"
      ],
      destacado: true,
      orden: 6
    },
    {
      nombre: "Florianópolis",
      slug: "florianopolis",
      paisRegion: "Brasil",
      descripcionCorta: "Isla de playas y naturaleza.",
      descripcion:
        "Florianopolis es una isla con playas extensas, dunas y lagunas cristalinas. Combina surf, descanso y una escena gastronomica fresca y marina. El centro historico y los mercados muestran la cultura local. En temporada alta hay fiestas, deportes y paisajes increibles. Un destino completo para todo tipo de viajeros.",
      imagenPortada: "/assets/destinos/florianopolis1.png",
      imagenes: [
        "/assets/destinos/florianopolis2.jpg",
        "/assets/destinos/florianopolis3.jpg",
        "/assets/destinos/florianopolis4.JPG"
      ],
      destacado: true,
      orden: 7
    },
    {
      nombre: "Canasvieiras",
      slug: "canasvieiras",
      paisRegion: "Brasil",
      descripcionCorta: "Playa familiar y mar calmo.",
      descripcion:
        "Vive la energía de Canasvieiras: el epicentro del confort y la diversión en Florianópolis. Disfruta de sus playas de aguas calmas ideales para la familia, sus famosos paseos en barco pirata y una infraestructura completa donde te sentirás como en casa. El destino preferido para quienes buscan practicidad, servicios y sol en el sur de Brasil.",
      imagenPortada: "/assets/destinos/canasvieiras.webp",
      imagenes: [
        "/assets/destinos/Canasvieiras 1.jpg",
        "/assets/destinos/Canasvieras 2.jpg",
        "/assets/destinos/florianopolis2.jpg"
      ],
      destacado: true,
      orden: 8
    },
    {
      nombre: "Camboriú",
      slug: "camboriu",
      paisRegion: "Brasil",
      descripcionCorta: "Ciudad moderna frente al mar.",
      descripcion:
        "Camboriu combina playas urbanas con rascacielos y un skyline moderno. El teleferico lleva a miradores con vistas panoramicas. Hay vida nocturna, gastronomia variada y centros comerciales. La costanera invita a caminar y disfrutar del atardecer. Un destino dinamico para quienes buscan ciudad y mar.",
      imagenPortada: "/assets/destinos/camboriu1.jpg",
      imagenes: [
        "/assets/destinos/camboriu2.jpg",
        "/assets/destinos/camboriu3.jpg",
        "/assets/destinos/camboriu4.jpg"
      ],
      destacado: true,
      orden: 9
    },
    {
      nombre: "Bombinhas",
      slug: "bombinhas",
      paisRegion: "Brasil",
      descripcionCorta: "Playas cristalinas y tranquilidad.",
      descripcion:
        "Vive la energía de Bombinhas: la capital del buceo ecológico en Brasil. Déjate cautivar por sus playas de aguas transparentes y calmas, como Sepultura y Retiro dos Padres, rodeadas de una selva exuberante. Un destino paradisíaco, ideal para familias y amantes de la vida marina, que ofrece uno de los paisajes más biodiversos y hermosos del litoral catarinense.",
      imagenPortada: "/assets/destinos/bombhinas1.webp",
      imagenes: [
        "/assets/destinos/bombinhas2.jpg",
        "/assets/destinos/bombhinas3.jpeg",
        "/assets/destinos/bombhinas4.webp"
      ],
      destacado: false,
      orden: 10
    },
    {
      nombre: "Búzios",
      slug: "buzios",
      paisRegion: "Brasil",
      descripcionCorta: "Encanto y vida nocturna.",
      descripcion:
        "Vive la energía de Búzios: el balneario más glamuroso y encantador de la costa carioca. Disfruta de más de 20 playas de aguas cristalinas, recorre la sofisticada Rua das Pedras y déjate llevar por el estilo único que enamoró a Brigitte Bardot. El destino perfecto que combina el encanto rústico con la sofisticación internacional.",
      imagenPortada: "/assets/destinos/Buzios.webp",
      imagenes: [
        "/assets/destinos/buzios2.jpg",
        "/assets/destinos/buzios3.jpg",
        "/assets/destinos/buzios4.png"
      ],
      destacado: false,
      orden: 11
    },
    {
      nombre: "Ferrugem",
      slug: "ferrugem",
      paisRegion: "Brasil",
      descripcionCorta: "Naturaleza salvaje y surf.",
      descripcion:
        "Vive la energía de Ferrugem: la capital de la juventud y las mejores olas del sur brasileño. Famosa por sus atardeceres dorados sobre los canales y su vibrante ambiente nocturno, es el punto de encuentro ideal para quienes buscan sol, surf y diversión. Una playa rústica de arenas blancas y aguas cristalinas que captura la esencia más libre de Santa Catarina.",
      imagenPortada: "/assets/destinos/ferregum2.webp",
      imagenes: [
        "/assets/destinos/ferregum3.jpg",
        "/assets/destinos/ferregum4.webp",
        "/assets/destinos/ferregum5.jpg"
      ],
      destacado: false,
      orden: 12
    },
    {
      nombre: "Garopaba",
      slug: "garopaba",
      paisRegion: "Brasil",
      descripcionCorta: "Bahías protegidas y naturaleza.",
      descripcion:
        "Vive la energía de Garopaba: el refugio perfecto para los amantes de la naturaleza y el surf. Con su ambiente relajado y sus playas preservadas como Siriú y Ferrugem, este antiguo pueblo de pescadores ofrece el equilibrio ideal entre aventura y tranquilidad. Un destino rústico y encantador, famoso por sus dunas, sus ballenas francas en invierno y su vibra mística.",
      imagenPortada: "/assets/destinos/garapoba1.webp",
      imagenes: [
        "/assets/destinos/garapoba2.webp",
        "/assets/destinos/garapoba3.jpg",
        "/assets/destinos/garapoba4.webp"
      ],
      destacado: false,
      orden: 13
    },
    {
      nombre: "Laguna",
      slug: "laguna",
      paisRegion: "Brasil",
      descripcionCorta: "Playas amplias y naturaleza costera.",
      descripcion:
        "Laguna combina playas extensas, aguas tranquilas y un ritmo relajado junto al mar. Su entorno natural invita a desconectar, disfrutar de paseos costeros y vivir la esencia del litoral sur de Brasil. Un destino ideal para descansar en un ambiente simple y auténtico.",
      imagenPortada: "/assets/destinos/garapoba1.webp",
      imagenes: [
        "/assets/destinos/garapoba2.webp",
        "/assets/destinos/garapoba3.jpg",
        "/assets/destinos/garapoba4.webp"
      ],
      destacado: false,
      orden: 24
    },
    {
      nombre: "Itapema",
      slug: "itapema",
      paisRegion: "Brasil",
      descripcionCorta: "Balneario urbano y playas amplias.",
      descripcion:
        "Vive la energía de Itapema: la joya de la Costa Esmeralda que combina modernidad y aguas cristalinas. Disfruta de sus playas de arenas blancas, su sofisticada infraestructura y la vista 360° desde el Mirante do Encanto. El destino perfecto para quienes buscan confort, relax y atardeceres mágicos en un entorno elegante y familiar.",
      imagenPortada: "/assets/destinos/itapema1.jpg",
      imagenes: [
        "/assets/destinos/itapema3.jpg",
        "/assets/destinos/itapema4.jpg",
        "/assets/destinos/itapema5.webp"
      ],
      destacado: false,
      orden: 14
    },
    {
      nombre: "Torres",
      slug: "torres",
      paisRegion: "Brasil",
      descripcionCorta: "Acantilados y playas únicas.",
      descripcion:
        "Vive la energía de Torres: un destino imponente donde los acantilados de basalto se encuentran con el mar. Descubre la belleza del Parque de la Guarita y disfruta de las mejores vistas desde el Morro del Faro. Un destino de paisajes monumentales y naturaleza única, ideal para quienes buscan una estética impactante en el sur de Brasil.",
      imagenPortada: "/assets/destinos/torres1.jpg",
      imagenes: [
        "/assets/destinos/torres2.jpg",
        "/assets/destinos/torres3.jpg",
        "/assets/destinos/torres4.jpg"
      ],
      destacado: false,
      orden: 15
    },
    {
      nombre: "Porto Galinhas",
      slug: "porto-galinhas",
      paisRegion: "Brasil",
      descripcionCorta: "Piscinas naturales y mar turquesa.",
      descripcion:
        "Vive la energía de Porto de Galinhas: el paraíso de las piscinas naturales y los corales. Navega en las tradicionales jangadas, báñate en sus aguas cálidas color turquesa y descubre la vida vibrante de su pintoresca aldea. Un destino tropical de postal que ofrece la experiencia definitiva del Nordeste brasileño.",
      imagenPortada: "/assets/destinos/porto1.webp",
      imagenes: [
        "/assets/destinos/porto2.jpg",
        "/assets/destinos/porto3.webp",
        "/assets/destinos/porto4.webp"
      ],
      destacado: true,
      orden: 16
    },
    {
      nombre: "Cabo de Santo Agostinho",
      slug: "cabo-de-santo-agostinho",
      paisRegion: "Brasil",
      descripcionCorta: "Playas salvajes y paisajes naturales.",
      descripcion:
        "Vive la energía de Cabo de Santo Agostinho: un refugio de historia y bienestar rodeado de acantilados volcánicos. Disfruta de la famosa playa de Calhetas, vive la tradición de los baños de arcilla natural y explora ruinas coloniales frente al mar. El destino ideal para desconectarse y disfrutar de la belleza rústica de Pernambuco.",
      imagenPortada: "/assets/destinos/cabo2.jpg",
      imagenes: [
        "/assets/destinos/cabo3.jpg",
        "/assets/destinos/cabo4.webp",
        "/assets/destinos/cabo5.jpg"
      ],
      destacado: false,
      orden: 17
    },

    // ================= PERÚ =================
    {
      nombre: "Lima",
      slug: "lima",
      paisRegion: "Perú",
      descripcionCorta: "Capital gastronómica del Pacífico.",
      descripcion:
        "Vive la energía de Lima: la capital gastronómica de América que mira al Pacífico desde sus espectaculares acantilados. Descubre el encanto colonial de su centro histórico, la bohemia de Barranco y los sabores explosivos de sus mercados y restaurantes de clase mundial. Un destino donde la tradición prehispánica y la modernidad se fusionan en cada bocado.",
      imagenPortada: "/assets/destinos/lima1.jpg",
      imagenes: [
        "/assets/destinos/lima2.jpg",
        "/assets/destinos/lima3.png",
        "/assets/destinos/lima4.jpg"
      ],
      destacado: true,
      orden: 18
    },
    {
      nombre: "Cusco",
      slug: "cusco",
      paisRegion: "Perú",
      descripcionCorta: "Historia inca y cultura andina.",
      descripcion:
        "Vive la energía de Cusco: el Ombligo del Mundo y la capital arqueológica de América. Camina entre muros incas y balcones coloniales, descubre el encanto bohemio de San Blas y siente la fuerza espiritual de sus templos milenarios. Un destino lleno de mística que es el corazón palpitante de la historia andina.",
      imagenPortada: "/assets/destinos/cusco1.jpg",
      imagenes: [
        "/assets/destinos/cusco2.jpg",
        "/assets/destinos/cusco3.jpg",
        "/assets/destinos/cusco6.jpg"
      ],
      destacado: true,
      orden: 19
    },

    // ================= EUROPA =================
    {
      nombre: "París",
      slug: "paris",
      paisRegion: "Francia",
      descripcionCorta: "Romance, arte y arquitectura.",
      descripcion:
        "Vive la energía de París: la ciudad de la luz y el romanticismo por excelencia. Desde la majestuosidad de la Torre Eiffel y los tesoros del Louvre hasta los paseos bohemios por Montmartre y las orillas del Sena. Un destino que enamora con su arquitectura elegante, sus cafés con historia y esa atmósfera sofisticada que la convierte en el corazón cultural del mundo.",
      imagenPortada: "/assets/destinos/Paris1.webp",
      imagenes: [
        "/assets/destinos/paris2.jpg",
        "/assets/destinos/paris3.jpg",
        "/assets/destinos/paris4.jpg"
      ],
      destacado: true,
      orden: 20
    },
    {
      nombre: "Roma",
      slug: "roma",
      paisRegion: "Italia",
      descripcionCorta: "Historia milenaria y gastronomía.",
      descripcion:
        "Vive la energía de Roma: la Ciudad Eterna donde el tiempo parece haberse detenido. Camina entre las ruinas del imponente Coliseo, maravíllate con la espiritualidad del Vaticano y lanza una moneda en la Fontana di Trevi. Un destino que es un museo a cielo abierto, combinando historia milenaria, plazas vibrantes y la esencia de la mejor gastronomía italiana.",
      imagenPortada: "/assets/destinos/roma.jpg",
      imagenes: [
        "/assets/destinos/roma2.jpg",
        "/assets/destinos/roma3.jpg",
        "/assets/destinos/roma4.jpg"
      ],
      destacado: true,
      orden: 21
    },
    {
      nombre: "Madrid",
      slug: "madrid",
      paisRegion: "España",
      descripcionCorta: "Arte, cultura y vida urbana.",
      descripcion:
        "Vive la energía de Madrid: una capital vibrante que combina el esplendor imperial con una alegría de vivir contagiosa. Explora la elegancia del Palacio Real, disfruta del arte en el Museo del Prado y vive el pulso de la ciudad en la Gran Vía y sus famosas tabernas de tapas. Un destino lleno de luz, historia y una vida nocturna que nunca duerme.",
      imagenPortada: "/assets/destinos/madrid.jpeg",
      imagenes: [
        "/assets/destinos/mdrid2.jpg",
        "/assets/destinos/madrid3.jpg",
        "/assets/destinos/madrid4.jpeg"
      ],
      destacado: true,
      orden: 22
    },

    // ================= ESTADOS UNIDOS =================
    {
      nombre: "Estados Unidos",
      slug: "estados-unidos",
      paisRegion: "Estados Unidos",
      descripcionCorta: "Ciudades icónicas y paisajes diversos.",
      descripcion:
        "Vive la energía de Estados Unidos: el destino donde los sueños se hacen realidad. Desde las luces y rascacielos de Nueva York hasta la magia inigualable de los parques temáticos en Orlando y las playas art déco de Miami. Un país de contrastes infinitos que ofrece compras, entretenimiento de clase mundial y paisajes cinematográficos.",
      imagenPortada: "/assets/destinos/estados1.jpg",
      imagenes: [
        "/assets/destinos/estados2.jpg",
        "/assets/destinos/estados3.jpg",
        "/assets/destinos/estados4.webp"
      ],
      destacado: true,
      orden: 23
    }
  ];

  for (const destino of destinosData) {
    const created = await prisma.destino.create({
      data: {
        nombre: destino.nombre,
        slug: destino.slug,
        paisRegion: destino.paisRegion,
        descripcionCorta: destino.descripcionCorta,
        descripcion: destino.descripcion,
        imagenPortada: destino.imagenPortada,
        destacado: destino.destacado,
        orden: destino.orden
      }
    });

    await prisma.imagenDestino.createMany({
      data: destino.imagenes.map((img, index) => ({
        destinoId: created.id,
        imagen: img,
        epigrafe: destino.nombre,
        orden: index + 1
      }))
    });
  }

  const destinosList = await prisma.destino.findMany({ orderBy: { orden: "asc" } });
  const rio = destinosList.find((item) => item.slug === "rio-de-janeiro");
  const floripa = destinosList.find((item) => item.slug === "florianopolis");
  const canasvieiras = destinosList.find((item) => item.slug === "canasvieiras");
  const camboriu = destinosList.find((item) => item.slug === "camboriu");
  const bombinhas = destinosList.find((item) => item.slug === "bombinhas");
  const ferrugem = destinosList.find((item) => item.slug === "ferrugem");
  const garopaba = destinosList.find((item) => item.slug === "garopaba");
  const laguna = destinosList.find((item) => item.slug === "laguna");
  const itapema = destinosList.find((item) => item.slug === "itapema");
  const portoGalinhas = destinosList.find((item) => item.slug === "porto-galinhas");
  const torres = destinosList.find((item) => item.slug === "torres");
  const bariloche = destinosList.find((item) => item.slug === "bariloche");
  const calafate = destinosList.find((item) => item.slug === "el-calafate");
  const iguazu = destinosList.find((item) => item.slug === "cataratas-del-iguazu");
  const ushuaia = destinosList.find((item) => item.slug === "ushuaia");
  const puertoMadryn = destinosList.find((item) => item.slug === "puerto-madryn");
  const lima = destinosList.find((item) => item.slug === "lima");

  const actividades = await prisma.actividad.createMany({
    data: [
      {
        nombre: "Tour Cristo Redentor",
        slug: "tour-cristo-redentor",
        destinoId: rio.id,
        tipoActividad: "excursion",
        fecha: new Date("2025-07-10"),
        hora: "10:00",
        precio: "45000",
        cupos: 20,
        puntoEncuentro: "Hotel Copacabana Palace",
        descripcion: "Incluye traslado, guía local y entradas.",
        imagenPortada: "/assets/destinos/rio4.webp",
        destacada: true,
        orden: 1
      },
      {
        nombre: "Navegación por la isla",
        slug: "navegacion-isla-florianopolis",
        destinoId: floripa.id,
        tipoActividad: "excursion",
        fecha: new Date("2025-08-05"),
        hora: "14:00",
        precio: "52000",
        cupos: 18,
        puntoEncuentro: "Muelle central",
        descripcion: "Paseo en barco con paradas para baño y snorkel.",
        imagenPortada: "/assets/destinos/florianopolis3.jpg",
        destacada: true,
        orden: 2
      },
      {
        nombre: "Caminata por los morros",
        slug: "caminata-morros-garopaba",
        destinoId: garopaba.id,
        tipoActividad: "actividad",
        fecha: new Date("2025-08-18"),
        hora: "09:00",
        precio: "32000",
        cupos: 16,
        puntoEncuentro: "Centro de visitantes",
        descripcion: "Senderos panorámicos con vistas a la bahía.",
        imagenPortada: "/assets/destinos/garapoba3.jpg",
        destacada: false,
        orden: 3
      },
      {
        nombre: "Ruta gastronómica limeña",
        slug: "ruta-gastronomica-lima",
        destinoId: lima.id,
        tipoActividad: "tour",
        fecha: new Date("2025-09-12"),
        hora: "19:00",
        precio: "68000",
        cupos: 20,
        puntoEncuentro: "Barranco",
        descripcion: "Degustaciones y mercados tradicionales con guía local.",
        imagenPortada: "/assets/destinos/lima3.png",
        destacada: true,
        orden: 4
      },
      {
        nombre: "Avistaje de fauna en Puerto Madryn",
        slug: "avistaje-fauna-puerto-madryn",
        destinoId: puertoMadryn.id,
        tipoActividad: "excursion",
        fecha: new Date("2025-09-20"),
        hora: "10:30",
        precio: "75000",
        cupos: 22,
        puntoEncuentro: "Puerto local",
        descripcion: "Salida en barco para ver ballenas y lobos marinos.",
        imagenPortada: "/assets/destinos/puerto3.jpg",
        destacada: true,
        orden: 5
      },
      {
        nombre: "Navegación Canal Beagle",
        slug: "navegacion-canal-beagle",
        destinoId: ushuaia.id,
        tipoActividad: "excursion",
        fecha: new Date("2025-10-12"),
        hora: "11:00",
        precio: "82000",
        cupos: 18,
        puntoEncuentro: "Muelle turístico",
        descripcion: "Paisajes fueguinos y faro del fin del mundo.",
        imagenPortada: "/assets/destinos/usuahia3.webp",
        destacada: true,
        orden: 6
      },
      {
        nombre: "Paseo por piscinas naturales",
        slug: "paseo-piscinas-porto-galinhas",
        destinoId: portoGalinhas.id,
        tipoActividad: "actividad",
        fecha: new Date("2025-11-02"),
        hora: "09:30",
        precio: "61000",
        cupos: 24,
        puntoEncuentro: "Playa principal",
        descripcion: "Traslado y embarcación para descubrir los arrecifes.",
        imagenPortada: "/assets/destinos/porto3.webp",
        destacada: false,
        orden: 7
      }
    ]
  });

  await prisma.oferta.create({
    data: {
      titulo: "Camboriu Abril",
      slug: "camboriu-abril",
      destinoId: camboriu.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 1,
      condiciones: "Hotel Abril. Tarifa por persona en base doble.",
      destinos: {
        create: [{ destinoId: camboriu.id }]
      },
      precios: {
        create: [
          {
            precio: "549",
            moneda: "USD",
            fechaInicio: new Date("2026-04-01"),
            fechaFin: new Date("2026-04-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus semicama" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Coordinador en viaje y en destino" },
          { tipo: "servicio", descripcion: "Asistencia medico en destino" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Camboriu Marzo",
      slug: "camboriu-marzo",
      destinoId: camboriu.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 2,
      condiciones: "Hotel Sagres. Tarifa por persona en base doble.",
      destinos: {
        create: [{ destinoId: camboriu.id }]
      },
      precios: {
        create: [
          {
            precio: "649",
            moneda: "USD",
            fechaInicio: new Date("2026-03-01"),
            fechaFin: new Date("2026-03-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus semicama" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Coordinador en viaje y en destino" },
          { tipo: "servicio", descripcion: "Asistencia medico en destino" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Camboriu Febrero",
      slug: "camboriu-febrero",
      destinoId: camboriu.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 3,
      condiciones: "Hotel Sagres. Tarifa por persona en base doble.",
      destinos: {
        create: [{ destinoId: camboriu.id }]
      },
      precios: {
        create: [
          {
            precio: "699",
            moneda: "USD",
            fechaInicio: new Date("2026-02-01"),
            fechaFin: new Date("2026-02-28")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus semicama" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Coordinador en viaje y en destino" },
          { tipo: "servicio", descripcion: "Asistencia medico en destino" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Camboriu Enero",
      slug: "camboriu-enero",
      destinoId: camboriu.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 4,
      condiciones: "Hotel Sagres. Tarifa por persona en base doble.",
      destinos: {
        create: [{ destinoId: camboriu.id }]
      },
      precios: {
        create: [
          {
            precio: "749",
            moneda: "USD",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-01-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus semicama" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Coordinador en viaje y en destino" },
          { tipo: "servicio", descripcion: "Asistencia medico en destino" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Charter Camboriu",
      slug: "charter-camboriu",
      destinoId: camboriu.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 8,
      condiciones:
        "Aereos desde Cordoba con Flybondi. Salidas martes y sabados. +USD 177 impuestos.",
      destinos: {
        create: [{ destinoId: camboriu.id }]
      },
      precios: {
        create: [
          {
            precio: "1049",
            moneda: "USD",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-01-31")
          },
          {
            precio: "949",
            moneda: "USD",
            fechaInicio: new Date("2026-02-01"),
            fechaFin: new Date("2026-02-28")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aereo desde Cordoba (Flybondi)" },
          { tipo: "equipaje", descripcion: "Equipaje en bodega (15 kg)" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "servicio", descripcion: "Traslados in/out" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          { tipo: "alojamiento", descripcion: "Hotel Ilha da Madeira" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Charter Florianopolis",
      slug: "charter-florianopolis",
      destinoId: floripa.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 9,
      condiciones:
        "Aereos desde Cordoba con Flybondi. Salidas martes y sabados. +USD 177 impuestos.",
      destinos: {
        create: [{ destinoId: floripa.id }]
      },
      precios: {
        create: [
          {
            precio: "1149",
            moneda: "USD",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-01-31")
          },
          {
            precio: "1049",
            moneda: "USD",
            fechaInicio: new Date("2026-02-01"),
            fechaFin: new Date("2026-02-28")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aereo desde Cordoba (Flybondi)" },
          { tipo: "equipaje", descripcion: "Equipaje en bodega (15 kg)" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "servicio", descripcion: "Traslados in/out" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          { tipo: "alojamiento", descripcion: "Hotel Canasvieiras Internacional" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Bombinhas Salida Grupal",
      slug: "bombinhas-salida-grupal",
      destinoId: bombinhas.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 10,
      condiciones: "Salidas Nov 2025 - Abr 2026. Tarifa en base doble.",
      noIncluye: "Impuestos (RG 5617).",
      destinos: {
        create: [{ destinoId: bombinhas.id }]
      },
      precios: {
        create: [
          {
            precio: "590",
            moneda: "USD",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          },
          {
            precio: "769700",
            moneda: "ARS",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus grupal Mix o cama" },
          {
            tipo: "alojamiento",
            descripcion: "7 noches con regimen segun el hotel"
          },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          { tipo: "servicio", descripcion: "Coordinador de viaje" },
          { tipo: "servicio", descripcion: "Coordinador en destino y receptivo" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Camboriu Salida Grupal",
      slug: "camboriu-salida-grupal",
      destinoId: camboriu.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 11,
      condiciones: "Salidas Nov 2025 - Abr 2026. Tarifa en base doble.",
      noIncluye: "Impuestos (RG 5617).",
      destinos: {
        create: [{ destinoId: camboriu.id }]
      },
      precios: {
        create: [
          {
            precio: "590",
            moneda: "USD",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          },
          {
            precio: "769700",
            moneda: "ARS",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus grupal Mix o cama" },
          {
            tipo: "alojamiento",
            descripcion: "7 noches con regimen segun el hotel"
          },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          { tipo: "servicio", descripcion: "Coordinador de viaje" },
          { tipo: "servicio", descripcion: "Coordinador en destino y receptivo" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Ferrugem Salida Grupal",
      slug: "ferrugem-salida-grupal",
      destinoId: ferrugem.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 12,
      condiciones: "Salidas Nov 2025 - Abr 2026. Tarifa en base doble.",
      noIncluye: "Impuestos (RG 5617).",
      destinos: {
        create: [{ destinoId: ferrugem.id }]
      },
      precios: {
        create: [
          {
            precio: "510",
            moneda: "USD",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          },
          {
            precio: "673700",
            moneda: "ARS",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus grupal Mix o cama" },
          {
            tipo: "alojamiento",
            descripcion: "7 noches con regimen segun el hotel"
          },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          { tipo: "servicio", descripcion: "Coordinador de viaje" },
          { tipo: "servicio", descripcion: "Coordinador en destino y receptivo" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Florianopolis Salida Grupal",
      slug: "florianopolis-salida-grupal",
      destinoId: floripa.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 13,
      condiciones: "Salidas Nov 2025 - Abr 2026. Tarifa en base doble.",
      noIncluye: "Impuestos (RG 5617).",
      destinos: {
        create: [{ destinoId: floripa.id }]
      },
      precios: {
        create: [
          {
            precio: "417",
            moneda: "USD",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          },
          {
            precio: "559700",
            moneda: "ARS",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus grupal Mix o cama" },
          {
            tipo: "alojamiento",
            descripcion: "7 noches con regimen segun el hotel"
          },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          { tipo: "servicio", descripcion: "Coordinador de viaje" },
          { tipo: "servicio", descripcion: "Coordinador en destino y receptivo" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Garopaba Salida Grupal",
      slug: "garopaba-salida-grupal",
      destinoId: garopaba.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 14,
      condiciones: "Salidas Nov 2025 - Abr 2026. Tarifa en base doble.",
      noIncluye: "Impuestos (RG 5617).",
      destinos: {
        create: [{ destinoId: garopaba.id }]
      },
      precios: {
        create: [
          {
            precio: "690",
            moneda: "USD",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          },
          {
            precio: "917700",
            moneda: "ARS",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus grupal Mix o cama" },
          {
            tipo: "alojamiento",
            descripcion: "7 noches con regimen segun el hotel"
          },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          { tipo: "servicio", descripcion: "Coordinador de viaje" },
          { tipo: "servicio", descripcion: "Coordinador en destino y receptivo" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Laguna Salida Grupal",
      slug: "laguna-salida-grupal",
      destinoId: laguna.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 15,
      condiciones: "Salidas Nov 2025 - Abr 2026. Tarifa en base doble.",
      noIncluye: "Impuestos (RG 5617).",
      destinos: {
        create: [{ destinoId: laguna.id }]
      },
      precios: {
        create: [
          {
            precio: "480",
            moneda: "USD",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          },
          {
            precio: "638700",
            moneda: "ARS",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus grupal Mix o cama" },
          {
            tipo: "alojamiento",
            descripcion: "7 noches con regimen segun el hotel"
          },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          { tipo: "servicio", descripcion: "Coordinador de viaje" },
          { tipo: "servicio", descripcion: "Coordinador en destino y receptivo" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Torres Salida Grupal",
      slug: "torres-salida-grupal",
      destinoId: torres.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 16,
      condiciones: "Salidas Nov 2025 - Abr 2026. Tarifa en base doble.",
      noIncluye: "Impuestos (RG 5617).",
      destinos: {
        create: [{ destinoId: torres.id }]
      },
      precios: {
        create: [
          {
            precio: "717",
            moneda: "USD",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          },
          {
            precio: "939700",
            moneda: "ARS",
            fechaInicio: new Date("2025-11-01"),
            fechaFin: new Date("2026-04-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus grupal Mix o cama" },
          {
            tipo: "alojamiento",
            descripcion: "7 noches con regimen segun el hotel"
          },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          { tipo: "servicio", descripcion: "Coordinador de viaje" },
          { tipo: "servicio", descripcion: "Coordinador en destino y receptivo" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Canasvieiras Enero",
      slug: "canasvieiras-enero",
      destinoId: canasvieiras.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 4,
      condiciones: "Hotel Canasvieiras Internacional. Tarifa por persona en base doble.",
      destinos: {
        create: [{ destinoId: canasvieiras.id }]
      },
      precios: {
        create: [
          {
            precio: "849",
            moneda: "USD",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-01-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus semicama" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Coordinador en viaje y en destino" },
          { tipo: "servicio", descripcion: "Asistencia medico en destino" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Canasvieiras Febrero",
      slug: "canasvieiras-febrero",
      destinoId: canasvieiras.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 5,
      condiciones: "Hotel Canasvieiras Internacional. Tarifa por persona en base doble.",
      destinos: {
        create: [{ destinoId: canasvieiras.id }]
      },
      precios: {
        create: [
          {
            precio: "799",
            moneda: "USD",
            fechaInicio: new Date("2026-02-01"),
            fechaFin: new Date("2026-02-28")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus semicama" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Coordinador en viaje y en destino" },
          { tipo: "servicio", descripcion: "Asistencia medico en destino" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Canasvieiras Marzo",
      slug: "canasvieiras-marzo",
      destinoId: canasvieiras.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 6,
      condiciones: "Hotel Canasvieiras Internacional. Tarifa por persona en base doble.",
      destinos: {
        create: [{ destinoId: canasvieiras.id }]
      },
      precios: {
        create: [
          {
            precio: "699",
            moneda: "USD",
            fechaInicio: new Date("2026-03-01"),
            fechaFin: new Date("2026-03-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus semicama" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Coordinador en viaje y en destino" },
          { tipo: "servicio", descripcion: "Asistencia medico en destino" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Canasvieiras Abril",
      slug: "canasvieiras-abril",
      destinoId: canasvieiras.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 7,
      condiciones: "Hotel Canasvieiras Internacional. Tarifa por persona en base doble.",
      destinos: {
        create: [{ destinoId: canasvieiras.id }]
      },
      precios: {
        create: [
          {
            precio: "599",
            moneda: "USD",
            fechaInicio: new Date("2026-04-01"),
            fechaFin: new Date("2026-04-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus semicama" },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "comida", descripcion: "Desayuno y cena" },
          { tipo: "servicio", descripcion: "Coordinador en viaje y en destino" },
          { tipo: "servicio", descripcion: "Asistencia medico en destino" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Charter Camboriu 2026",
      slug: "charter-camboriu-2026",
      destinoId: camboriu.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 17,
      condiciones:
        "Charter flexi 2026. Tarifa en base doble. Entrega desde USD 343 + cuotas mensuales.",
      destinos: {
        create: [{ destinoId: camboriu.id }]
      },
      precios: {
        create: [
          {
            precio: "967",
            moneda: "USD",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-12-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          {
            tipo: "transporte",
            descripcion: "Vuelo charter directo Cordoba - Florianopolis"
          },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "alojamiento", descripcion: "Regimen segun hotel" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          {
            tipo: "equipaje",
            descripcion: "Incluye equipaje de mano y de bodega"
          }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Charter Porto de Galinhas y Maragogi 2026",
      slug: "charter-porto-galinhas-maragogi-2026",
      destinoId: portoGalinhas.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 18,
      condiciones:
        "Charter flexi 2026. Tarifa en base doble. Entrega desde USD 475 + cuotas mensuales.",
      destinos: {
        create: [{ destinoId: portoGalinhas.id }]
      },
      precios: {
        create: [
          {
            precio: "1387",
            moneda: "USD",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-12-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          {
            tipo: "transporte",
            descripcion: "Vuelo charter directo Cordoba - Recife"
          },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "alojamiento", descripcion: "Regimen segun hotel" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          {
            tipo: "equipaje",
            descripcion: "Incluye equipaje de mano y de bodega"
          }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Charter Florianopolis 2026",
      slug: "charter-florianopolis-2026",
      destinoId: floripa.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 19,
      condiciones:
        "Charter flexi 2026. Tarifa en base doble. Entrega desde USD 292 + cuotas mensuales.",
      destinos: {
        create: [{ destinoId: floripa.id }]
      },
      precios: {
        create: [
          {
            precio: "797",
            moneda: "USD",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-12-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          {
            tipo: "transporte",
            descripcion: "Vuelo charter directo Cordoba - Florianopolis"
          },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "alojamiento", descripcion: "Regimen segun hotel" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          {
            tipo: "equipaje",
            descripcion: "Incluye equipaje de mano y de bodega"
          }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Charter Ferrugem 2026",
      slug: "charter-ferrugem-2026",
      destinoId: ferrugem.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 20,
      condiciones:
        "Charter flexi 2026. Tarifa en base doble. Entrega desde USD 305 + cuotas mensuales.",
      destinos: {
        create: [{ destinoId: ferrugem.id }]
      },
      precios: {
        create: [
          {
            precio: "840",
            moneda: "USD",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-12-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          {
            tipo: "transporte",
            descripcion: "Vuelo charter directo Cordoba - Florianopolis"
          },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "alojamiento", descripcion: "Regimen segun hotel" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          {
            tipo: "equipaje",
            descripcion: "Incluye equipaje de mano y de bodega"
          }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Charter Bombinhas 2026",
      slug: "charter-bombinhas-2026",
      destinoId: bombinhas.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 21,
      condiciones:
        "Charter flexi 2026. Tarifa en base doble. Entrega desde USD 346 + cuotas mensuales.",
      destinos: {
        create: [{ destinoId: bombinhas.id }]
      },
      precios: {
        create: [
          {
            precio: "977",
            moneda: "USD",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-12-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          {
            tipo: "transporte",
            descripcion: "Vuelo charter directo Cordoba - Florianopolis"
          },
          { tipo: "alojamiento", descripcion: "7 noches de alojamiento" },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "alojamiento", descripcion: "Regimen segun hotel" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" },
          {
            tipo: "equipaje",
            descripcion: "Incluye equipaje de mano y de bodega"
          }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Patagonia Fantastica",
      slug: "patagonia-fantastica",
      destinoId: puertoMadryn.id,
      noches: 9,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 22,
      condiciones:
        "Salida grupal. Salidas Sep a Nov 2026. Tarifa en base doble. 4 cuotas cero interes.",
      destinos: {
        create: [
          { destinoId: puertoMadryn.id },
          { destinoId: calafate.id },
          { destinoId: ushuaia.id }
        ]
      },
      precios: {
        create: [
          {
            precio: "1439700",
            moneda: "ARS",
            fechaInicio: new Date("2026-09-01"),
            fechaFin: new Date("2026-11-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus coche cama" },
          {
            tipo: "alojamiento",
            descripcion: "9 noches de alojamiento en hoteles categoria turista"
          },
          { tipo: "comida", descripcion: "Regimen desayuno" },
          { tipo: "servicio", descripcion: "Excursiones" },
          {
            tipo: "servicio",
            descripcion: "Coordinador permanente y guias locales profesionales"
          },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Bariloche en mil colores",
      slug: "bariloche-en-mil-colores",
      destinoId: bariloche.id,
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 23,
      condiciones:
        "Salida grupal. Salidas Jul a Nov 2026. Tarifa en base doble. 4 cuotas cero interes.",
      destinos: {
        create: [{ destinoId: bariloche.id }]
      },
      precios: {
        create: [
          {
            precio: "679700",
            moneda: "ARS",
            fechaInicio: new Date("2026-07-01"),
            fechaFin: new Date("2026-11-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus cama" },
          {
            tipo: "alojamiento",
            descripcion: "4 noches de alojamiento con regimen segun hotel"
          },
          {
            tipo: "servicio",
            descripcion: "Visita a San Martin de los Andes"
          },
          { tipo: "servicio", descripcion: "Coordinador permanente" },
          { tipo: "servicio", descripcion: "Traslados in/out" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Cataratas Premium",
      slug: "cataratas-premium",
      destinoId: iguazu.id,
      noches: 3,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 24,
      condiciones:
        "Salida grupal. Salidas Jul a Dic 2026. Tarifa en base doble. 4 cuotas cero interes.",
      destinos: {
        create: [{ destinoId: iguazu.id }]
      },
      precios: {
        create: [
          {
            precio: "459700",
            moneda: "ARS",
            fechaInicio: new Date("2026-07-01"),
            fechaFin: new Date("2026-12-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus grupal coche cama" },
          { tipo: "alojamiento", descripcion: "3 noches de alojamiento" },
          { tipo: "comida", descripcion: "Regimen desayuno" },
          {
            tipo: "servicio",
            descripcion: "Excursiones incluidas (sin tickets de ingreso)"
          },
          {
            tipo: "servicio",
            descripcion: "Coordinador permanente y guias locales profesionales"
          },
          { tipo: "servicio", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Bariloche Aereo",
      slug: "bariloche-aereo-2026",
      destinoId: bariloche.id,
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 25,
      condiciones: "Salidas enero a junio 2026. Tarifa en base doble.",
      destinos: {
        create: [{ destinoId: bariloche.id }]
      },
      precios: {
        create: [
          {
            precio: "597000",
            moneda: "ARS",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-06-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aereo directo desde Cordoba" },
          { tipo: "alojamiento", descripcion: "4 noches de alojamiento" },
          { tipo: "comida", descripcion: "Regimen segun hotel" },
          { tipo: "servicio", descripcion: "Traslados in/out" },
          { tipo: "servicio", descripcion: "Excursiones en programa" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Cataratas Aereo",
      slug: "cataratas-aereo-2026",
      destinoId: iguazu.id,
      noches: 3,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 26,
      condiciones:
        "Salidas enero a marzo 2026. Tarifa en base doble. 3 o 4 noches.",
      destinos: {
        create: [{ destinoId: iguazu.id }]
      },
      precios: {
        create: [
          {
            precio: "497000",
            moneda: "ARS",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-03-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aereo directo desde Cordoba" },
          { tipo: "alojamiento", descripcion: "3 o 4 noches de alojamiento" },
          { tipo: "comida", descripcion: "Regimen desayuno" },
          { tipo: "servicio", descripcion: "Traslados in/out" },
          { tipo: "servicio", descripcion: "Excursiones en programa" }
        ]
      }
    }
  });

  await prisma.seccionNosotros.create({
    data: {
      titulo: "Sobre Topotours",
      contenido:
        "Somos un equipo de especialistas en viajes premium con foco en la atención personalizada.",
      imagen:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      valores: {
        create: [
          {
            titulo: "Asesoría dedicada",
            descripcion: "Te acompañamos en cada etapa del viaje.",
            icono: "✨",
            orden: 1
          },
          {
            titulo: "Calidad garantizada",
            descripcion: "Seleccionamos proveedores con estándares premium.",
            icono: "✔️",
            orden: 2
          }
        ]
      }
    }
  });
}

main()
  .catch((error) => {
    console.error("Error al ejecutar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

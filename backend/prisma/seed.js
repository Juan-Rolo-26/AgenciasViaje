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
        "Bariloche te recibe con lagos turquesa, cerros nevados y bosques que cambian de color todo el año. Recorre el centro, proba chocolates artesanales y navega el Nahuel Huapi. En invierno hay ski y nieve, en verano senderos, playas de lago y miradores. La gastronomia patagonica suma trucha, cordero y cerveza local. Ideal para escapadas romanticas o viajes en familia con aire puro.",
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
        "El Calafate es la puerta al Parque Nacional Los Glaciares y al imponente Perito Moreno. Pasea por pasarelas y miradores para sentir el crujido del hielo. Las navegaciones te acercan a glaciares menos conocidos y paisajes unicos. La ciudad suma artesanias, cordero patagonico y chocolate caliente. Es un destino perfecto para los amantes de la naturaleza extrema.",
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
        "Las Cataratas del Iguazu deslumbran con mas de 250 saltos de agua en plena selva subtropical. Los circuitos superior e inferior permiten verlas desde angulos increibles. El paseo a la Garganta del Diablo es una experiencia imperdible. La region ofrece fauna, senderos y cultura guarani. Un destino vibrante para viajar en pareja, con amigos o en familia.",
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
        "Ushuaia combina montanas, glaciares y el mitico Canal Beagle en el fin del mundo. Las navegaciones muestran lobos marinos, faros y paisajes fueguinos. Los trekkings del Parque Nacional Tierra del Fuego son inolvidables. La gastronomia local destaca centolla, merluza negra y chocolates. Un viaje ideal para aventureros y amantes del frio.",
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
        "Puerto Madryn es el corazon de la Peninsula Valdes y del avistaje de ballenas. Entre junio y diciembre se vive un espectaculo natural unico. Las excursiones incluyen colonias de pinguinos y lobos marinos. Sus playas tranquilas invitan a caminar y descansar frente al mar. Es perfecto para quienes buscan naturaleza y fauna.",
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
        "Rio de Janeiro mezcla playas iconicas, morros verdes y una energia que contagia. Sube al Pan de Azucar y al Cristo Redentor para vistas inolvidables. Copacabana e Ipanema invitan a caminar, tomar sol y sentir el ritmo carioca. La ciudad suma samba, mercados y una gastronomia llena de sabor. Ideal para viajes vibrantes y llenos de vida.",
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
        "Canasvieiras es una playa familiar con mar calmo y aguas tibias. Su paseo costero esta lleno de restaurantes y tiendas. Las excursiones cercanas incluyen playas mas tranquilas y miradores. Es ideal para viajar con ninos por su seguridad y servicios. Un rincon perfecto para descansar sin apuros.",
      imagenPortada: "/assets/destinos/canasvieiras.webp",
      imagenes: [
        "/assets/destinos/Canasvieiras 1.jpg",
        "/assets/destinos/Canasvieras 2.jpg",
        "/assets/destinos/inicio.jpg"
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
        "Bombinhas es famosa por sus aguas cristalinas y su ambiente tranquilo. Es uno de los mejores lugares de Brasil para snorkel y buceo. Las playas estan rodeadas de naturaleza y senderos suaves. La gastronomia destaca frutos de mar frescos y pescados locales. Ideal para desconectar y relajarse en familia.",
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
        "Buzios tiene playas paradisíacas, calles con encanto y una vida nocturna activa. La peninsula ofrece bahias tranquilas y otras con mas movimiento. Su centro es perfecto para pasear, comer y comprar. Los atardeceres en la costa son un clasico imperdible. Un destino romantico y con mucha personalidad.",
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
        "Ferrugem es una playa amplia con olas ideales para surf y bodyboard. Su entorno natural le da un aire mas salvaje y relajado. Los dias terminan con atardeceres increibles y buena musica. Es perfecto para viajeros jovenes que buscan desconexion. Un rincon simple, autentico y cercano a la naturaleza.",
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
        "Garopaba ofrece bahias protegidas, playas largas y senderos costeros. La aldea mantiene un espiritu tranquilo y acogedor. Hay miradores, lagunas y opciones para deportes acuaticos. La gastronomia local suma pescados frescos y platos caseros. Ideal para escapadas en pareja o en familia.",
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
      nombre: "Itapema",
      slug: "itapema",
      paisRegion: "Brasil",
      descripcionCorta: "Balneario urbano y playas amplias.",
      descripcion:
        "Itapema combina una moderna costanera con playas extensas y tranquilas. Su infraestructura turistica es completa y comoda. Es un excelente punto para recorrer otras playas cercanas. El ambiente es familiar y seguro durante todo el ano. Un destino perfecto para descansar con servicios.",
      imagenPortada: "/assets/destinos/itapema1.jpg",
      imagenes: [
        "/assets/destinos/itapema2.avif",
        "/assets/destinos/itapema3.jpg",
        "/assets/destinos/itapema4.jpg"
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
        "Torres se destaca por sus acantilados y formaciones rocosas unicas. Las playas son amplias y perfectas para caminatas largas. Hay miradores naturales que regalan vistas memorables. La ciudad suma ferias, gastronomia y paseos costeros. Un destino ideal para amantes de la naturaleza.",
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
        "Porto de Galinhas es famoso por sus piscinas naturales y mar turquesa. Los paseos en jangada permiten ver arrecifes y peces de colores. Las playas son calidas y agradables durante casi todo el ano. Hay buena hoteleria y restaurantes frente al mar. Un clasico del nordeste brasileno para relajarse.",
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
        "Cabo de Santo Agostinho ofrece playas menos concurridas y paisajes salvajes. Sus acantilados y miradores crean postales unicas. Es ideal para quienes buscan tranquilidad lejos de los grandes centros. La naturaleza se mezcla con historia y cultura local. Un destino diferente y autentico del nordeste.",
      imagenPortada: "/assets/destinos/cabo1.avif",
      imagenes: [
        "/assets/destinos/cabo2.jpg",
        "/assets/destinos/cabo3.jpg",
        "/assets/destinos/cabo4.webp"
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
        "Lima combina historia, gastronomia y acantilados frente al Pacifico. Sus barrios como Miraflores y Barranco son ideales para pasear. La cocina peruana es una experiencia en si misma. Museos, plazas y mercados completan la propuesta cultural. Perfecta para viajeros que aman comer bien y explorar.",
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
        "Cusco es el corazon del legado inca y la puerta a Machu Picchu. Sus calles de piedra y plazas coloniales son un viaje en el tiempo. El Valle Sagrado ofrece paisajes andinos y pueblos tradicionales. La cultura local se siente en cada mercado y festividad. Un destino imprescindible para amantes de la historia.",
      imagenPortada: "/assets/destinos/cusco1.jpg",
      imagenes: [
        "/assets/destinos/cusco2.jpg",
        "/assets/destinos/cusco3.jpg",
        "/assets/destinos/cusco4.avif"
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
        "Paris inspira con arte, arquitectura y rincones romanticos en cada barrio. La Torre Eiffel, el Louvre y Montmartre son clasicos imperdibles. Pasear por el Sena y sus puentes es parte del encanto. La gastronomia francesa suma cafes, panaderias y bistrot. Ideal para viajes culturales y romanticos.",
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
        "Roma es un museo a cielo abierto con historia en cada esquina. El Coliseo, el Foro y el Vaticano sorprenden a cada paso. Sus plazas y fuentes invitan a caminar sin apuro. La cocina italiana brilla con pastas, helados y vinos. Un destino perfecto para amantes de la historia y la comida.",
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
        "Madrid combina museos de clase mundial con una vida urbana vibrante. El Prado, el Retiro y la Gran Via son visitas obligadas. Sus barrios tienen personalidad, tapas y mucha energia. La ciudad invita a recorrerla a pie y disfrutar sus plazas. Ideal para viajes culturales y noches animadas.",
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
        "Estados Unidos ofrece ciudades iconicas y paisajes naturales espectaculares. Nueva York, Miami y Los Angeles son algunos de sus clasicos. Tambien hay parques nacionales que parecen de otro planeta. La oferta cultural y gastronomica es enorme y diversa. Un destino con opciones para todos los gustos.",
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
  const ferrugem = destinosList.find((item) => item.slug === "ferrugem");
  const garopaba = destinosList.find((item) => item.slug === "garopaba");
  const itapema = destinosList.find((item) => item.slug === "itapema");
  const portoGalinhas = destinosList.find((item) => item.slug === "porto-galinhas");
  const torres = destinosList.find((item) => item.slug === "torres");
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

  const actividadesList = await prisma.actividad.findMany();
  const cristo = actividadesList.find((item) => item.slug === "tour-cristo-redentor");
  const navegacionFloripa = actividadesList.find(
    (item) => item.slug === "navegacion-isla-florianopolis"
  );
  const paseoPorto = actividadesList.find(
    (item) => item.slug === "paseo-piscinas-porto-galinhas"
  );
  const canalBeagle = actividadesList.find(
    (item) => item.slug === "navegacion-canal-beagle"
  );

  await prisma.oferta.create({
    data: {
      titulo: "Escapada Río premium",
      slug: "escapada-rio-premium",
      destinoId: rio.id,
      noches: 6,
      cupos: 12,
      destacada: true,
      activa: true,
      orden: 1,
      condiciones: "Incluye vuelos directos y hotel 4 estrellas.",
      destinos: {
        create: [{ destinoId: rio.id }, { destinoId: floripa.id }]
      },
      actividades: {
        create: [{ actividadId: cristo.id }]
      },
      precios: {
        create: [
          {
            precio: "301802",
            moneda: "ARS",
            fechaInicio: new Date("2025-06-01"),
            fechaFin: new Date("2025-08-31")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aéreo ida y vuelta" },
          { tipo: "comida", descripcion: "Desayuno buffet" },
          { tipo: "servicio", descripcion: "Coordinador en destino" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Verano en Florianópolis",
      slug: "verano-florianopolis",
      destinoId: floripa.id,
      noches: 5,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 2,
      condiciones: "Paquete con traslados y hotel boutique.",
      destinos: {
        create: [{ destinoId: floripa.id }, { destinoId: canasvieiras.id }]
      },
      actividades: {
        create: [{ actividadId: navegacionFloripa.id }]
      },
      precios: {
        create: [
          {
            precio: "282282",
            moneda: "ARS",
            fechaInicio: new Date("2025-07-01"),
            fechaFin: new Date("2025-09-15")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aéreo con equipaje" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Aventura en Porto Galinhas",
      slug: "aventura-porto-galinhas",
      destinoId: portoGalinhas.id,
      noches: 6,
      cupos: 14,
      destacada: true,
      activa: true,
      orden: 3,
      condiciones: "Resort frente al mar con experiencias incluidas.",
      destinos: {
        create: [{ destinoId: portoGalinhas.id }]
      },
      actividades: {
        create: [{ actividadId: paseoPorto.id }]
      },
      precios: {
        create: [
          {
            precio: "789000",
            moneda: "ARS",
            fechaInicio: new Date("2025-09-01"),
            fechaFin: new Date("2025-11-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aéreo ida y vuelta" },
          { tipo: "servicio", descripcion: "Traslados en destino" },
          { tipo: "comida", descripcion: "Desayuno buffet" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Fin del mundo Ushuaia",
      slug: "fin-del-mundo-ushuaia",
      destinoId: ushuaia.id,
      noches: 5,
      cupos: 16,
      destacada: true,
      activa: true,
      orden: 4,
      condiciones: "Hotel boutique y navegación por el canal Beagle.",
      destinos: {
        create: [{ destinoId: ushuaia.id }]
      },
      actividades: {
        create: [{ actividadId: canalBeagle.id }]
      },
      precios: {
        create: [
          {
            precio: "654000",
            moneda: "ARS",
            fechaInicio: new Date("2025-06-15"),
            fechaFin: new Date("2025-09-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aéreo ida y vuelta" },
          { tipo: "servicio", descripcion: "Excursión Canal Beagle" },
          { tipo: "comida", descripcion: "Desayuno buffet" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Lima gastronómica",
      slug: "lima-gastronomica",
      destinoId: lima.id,
      noches: 4,
      cupos: 18,
      destacada: true,
      activa: true,
      orden: 5,
      condiciones: "Hotel céntrico y experiencias culinarias.",
      destinos: {
        create: [{ destinoId: lima.id }]
      },
      precios: {
        create: [
          {
            precio: "520000",
            moneda: "ARS",
            fechaInicio: new Date("2025-07-10"),
            fechaFin: new Date("2025-10-20")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "servicio", descripcion: "Tour gastronómico incluido" },
          { tipo: "comida", descripcion: "Degustación gourmet" },
          { tipo: "equipaje", descripcion: "Equipaje en cabina" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Costa de Puerto Madryn",
      slug: "costa-puerto-madryn",
      destinoId: puertoMadryn.id,
      noches: 4,
      cupos: 14,
      destacada: false,
      activa: true,
      orden: 6,
      condiciones: "Hotel con vista al mar y excursiones opcionales.",
      destinos: {
        create: [{ destinoId: puertoMadryn.id }]
      },
      precios: {
        create: [
          {
            precio: "410000",
            moneda: "ARS",
            fechaInicio: new Date("2025-06-01"),
            fechaFin: new Date("2025-09-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "servicio", descripcion: "Traslados aeropuerto-hotel" },
          { tipo: "transporte", descripcion: "Aéreo con equipaje" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Escapada Torres",
      slug: "escapada-torres",
      destinoId: torres.id,
      noches: 5,
      cupos: 22,
      destacada: true,
      activa: true,
      orden: 7,
      condiciones: "Hotel con vista al mar y recorridos costeros.",
      destinos: {
        create: [{ destinoId: torres.id }]
      },
      precios: {
        create: [
          {
            precio: "295000",
            moneda: "ARS",
            fechaInicio: new Date("2025-06-15"),
            fechaFin: new Date("2025-09-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Bus semi cama" },
          { tipo: "servicio", descripcion: "Asistencia al viajero" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Playas de Itapema",
      slug: "playas-itapema",
      destinoId: itapema.id,
      noches: 5,
      cupos: 18,
      destacada: false,
      activa: true,
      orden: 8,
      condiciones: "Hotel frente al mar con servicios completos.",
      destinos: {
        create: [{ destinoId: itapema.id }]
      },
      precios: {
        create: [
          {
            precio: "365000",
            moneda: "ARS",
            fechaInicio: new Date("2025-07-05"),
            fechaFin: new Date("2025-12-15")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "servicio", descripcion: "Traslados aeropuerto-hotel" },
          { tipo: "comida", descripcion: "Desayuno incluido" }
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

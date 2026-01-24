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
    {
      nombre: "Buenos Aires",
      slug: "buenos-aires",
      paisRegion: "Argentina",
      descripcionCorta: "Ciudad vibrante y clásica porteña.",
      descripcion:
        "Vive la energía de Buenos Aires: la vibrante capital que nunca duerme y el corazón cultural de Sudamérica. Desde el tango místico en las calles de San Telmo y el colorido de Caminito, hasta la elegancia europea de Recoleta y la modernidad de Puerto Madero. Una ciudad de contrastes inagotables, librerías históricas, una gastronomía de clase mundial y una vida nocturna que te invita a vivir la noche porteña en todo su esplendor.",
      imagenPortada: "/assets/destinos/buenos1.png",
      imagenes: [
        "/assets/destinos/buenos2.png",
        "/assets/destinos/buenos3.png",
        "/assets/destinos/buenos4.webp"
      ],
      destacado: true,
      orden: 6
    },
    {
      nombre: "Misiones",
      slug: "misiones",
      paisRegion: "Argentina",
      descripcionCorta: "Selva paranaense y cultura jesuítica.",
      descripcion:
        "Vive la energía de Misiones: la tierra colorada donde la selva paranaense despliega todo su esplendor. Déjate cautivar por las milenarias Ruinas Jesuíticas de San Ignacio Miní, asómbrate con los Saltos del Moconá y descubre el fascinante proceso de la yerba mate en sus establecimientos tradicionales. Un destino que es puro pulmón verde, lleno de biodiversidad, ríos rojizos y una cultura fronteriza llena de historia.",
      imagenPortada: "/assets/destinos/misiones2.png",
      imagenes: [
        "/assets/destinos/misiones3.png",
        "/assets/destinos/misiones4.jpg",
        "/assets/destinos/misiones2.png"
      ],
      destacado: true,
      orden: 7
    },
    {
      nombre: "Pinamar",
      slug: "pinamar",
      paisRegion: "Argentina",
      descripcionCorta: "Bosque y mar en equilibrio perfecto.",
      descripcion:
        "Vive la energía de Pinamar: el destino donde el bosque se encuentra con el mar en perfecta armonía. Disfruta de la exclusividad de sus balnearios, recorre sus avenidas arboladas y vive la aventura en los imponentes médanos del norte. Un destino que combina sofisticación, una vibrante propuesta comercial y la tranquilidad de sus pinos, ideal para quienes buscan un descanso con estilo y naturaleza.",
      imagenPortada: "/assets/destinos/pinamar1.png",
      imagenes: [
        "/assets/destinos/pinamar2.png",
        "/assets/destinos/pinamar3.png",
        "/assets/destinos/pinamar1.png"
      ],
      destacado: true,
      orden: 8
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
      nombre: "Canasvieiras",
      slug: "canasvieiras",
      paisRegion: "Brasil",
      descripcionCorta: "Playa familiar y mar calmo.",
      descripcion:
        "Vive la energía de Canasvieiras: el epicentro del confort y la diversión en Florianópolis. Disfruta de sus playas de aguas calmas ideales para la familia, sus famosos paseos en barco pirata y una infraestructura completa donde te sentirás como en casa. El destino preferido para quienes buscan practicidad, servicios y sol en el sur de Brasil.",
      imagenPortada: "/assets/destinos/canasvieras.webp",
      imagenes: [
        "/assets/destinos/Canasvieiras 1.jpg",
        "/assets/destinos/Canasvieras 2.jpg",
        "/assets/destinos/canasvieras.webp"
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
      imagenPortada: "/assets/destinos/bombhinas.webp",
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
      imagenPortada: "/assets/destinos/florianopolis1.png",
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
    },

    // ================= AFRICA =================
    {
      nombre: "Ciudad del Cabo",
      slug: "ciudad-del-cabo",
      paisRegion: "Sudáfrica",
      descripcionCorta: "Montaña, oceano y viñedos de clase mundial.",
      descripcion:
        "Vive la energía de Ciudad del Cabo: donde la majestuosa Table Mountain se encuentra con el océano. Disfruta de sus viñedos de clase mundial, visita la colonia de pingüinos en Boulders Beach y recorre la espectacular Península del Cabo. Un destino que combina sofisticación urbana, una historia profunda y paisajes naturales que quitan el aliento.",
      imagenPortada: "/assets/destinos/sudafrica1.jpg",
      imagenes: [
        "/assets/destinos/sudafrica2.jpg",
        "/assets/destinos/sudafrica3.png",
        "/assets/destinos/sudafrica4.jpg"
      ],
      destacado: true,
      orden: 25
    },
    {
      nombre: "Masái Mara",
      slug: "masai-mara",
      paisRegion: "Kenia",
      descripcionCorta: "Safari legendario y vida salvaje única.",
      descripcion:
        "Vive la energía de Kenia: el escenario de la Gran Migración y el corazón de la vida salvaje africana. Vive la emoción de un safari en el Masái Mara, descubre la cultura de las tribus locales y maravíllate con los amaneceres sobre la sabana rodeado de leones, elefantes y leopardos. La experiencia definitiva para los amantes de la naturaleza indómita.",
      imagenPortada: "/assets/destinos/kenia.jpg",
      imagenes: [
        "/assets/destinos/kenia.webp",
        "/assets/destinos/kenia3.webp",
        "/assets/destinos/kenia4.jpg"
      ],
      destacado: true,
      orden: 26
    },
    {
      nombre: "El Cairo",
      slug: "el-cairo",
      paisRegion: "Egipto",
      descripcionCorta: "Pirámides, historia milenaria y el Nilo.",
      descripcion:
        "Vive la energía de Egipto: un viaje en el tiempo a la cuna de las civilizaciones. Asómbrate ante la grandeza de las Pirámides de Giza y la Esfinge, navega por el legendario río Nilo y piérdete en los vibrantes mercados de El Cairo. Un destino místico donde los tesoros de los faraones y los templos milenarios cuentan la historia de la humanidad.",
      imagenPortada: "/assets/destinos/egipto.jpg",
      imagenes: [
        "/assets/destinos/egipto2.jpg",
        "/assets/destinos/egipto3.webp",
        "/assets/destinos/egipto4.jpg"
      ],
      destacado: true,
      orden: 27
    },
    {
      nombre: "Marrakech",
      slug: "marrakech",
      paisRegion: "Marruecos",
      descripcionCorta: "Zocos, palacios y magia del Sahara.",
      descripcion:
        "Vive la energía de Marrakech: la ciudad roja que despierta todos los sentidos. Déjate llevar por el caos fascinante de los zocos en la Medina, admira la arquitectura de sus palacios y vive la magia nocturna de la plaza Jemaa el-Fna. Un destino exótico que combina jardines secretos, especias aromáticas y la puerta de entrada a las dunas del desierto del Sahara.",
      imagenPortada: "/assets/destinos/marruecos.jpg",
      imagenes: [
        "/assets/destinos/marruecos2.jpg",
        "/assets/destinos/marruecos3.webp",
        "/assets/destinos/marruecos4.jpg"
      ],
      destacado: true,
      orden: 28
    },
    {
      nombre: "Zanzíbar",
      slug: "zanzibar",
      paisRegion: "Tanzania",
      descripcionCorta: "Playas turquesas y cultura suajili.",
      descripcion:
        "Vive la energía de Zanzíbar: el paraíso de las especias y las aguas turquesas del Océano Índico. Recorre las calles laberínticas de Stone Town, disfruta de playas de arena blanca infinita y sumérgete en arrecifes de coral llenos de vida. Un destino exótico y relajante que combina la cultura suajili con paisajes tropicales de ensueño.",
      imagenPortada: "/assets/destinos/tanzamia.webp",
      imagenes: [
        "/assets/destinos/tanzamia2.jpg",
        "/assets/destinos/tanzamia3.webp",
        "/assets/destinos/tanzamia4.jpg"
      ],
      destacado: true,
      orden: 29
    },

    // ================= ASIA =================
    {
      nombre: "Tokio",
      slug: "tokio",
      paisRegion: "Japón",
      descripcionCorta: "Futuro hipertecnológico y tradición urbana.",
      descripcion:
        "Vive la energía de Tokio: el equilibrio entre el futuro hipertecnológico y la tradición urbana. Explora el cruce de Shibuya, los templos de Asakusa y los barrios creativos de Harajuku, todo con una gastronomía de precisión y una cultura del respeto que sorprende en cada detalle. Un destino vibrante que combina innovación, orden y experiencias sensoriales inolvidables.",
      imagenPortada: "/assets/destinos/japon.webp",
      imagenes: [
        "/assets/destinos/japon2.webp",
        "/assets/destinos/japon3.webp",
        "/assets/destinos/japon4.jpeg"
      ],
      destacado: true,
      orden: 31
    },
    {
      nombre: "Dubái",
      slug: "dubai",
      paisRegion: "Emiratos Árabes",
      descripcionCorta: "Lujo futurista en medio del desierto.",
      descripcion:
        "Vive la energía de Dubái: la ciudad de los récords y el lujo sin límites en medio del desierto. Sorpréndete con la altura del Burj Khalifa, recorre islas artificiales con forma de palmera y disfruta de compras exclusivas en los centros comerciales más grandes del mundo. Un destino futurista que combina arquitectura de vanguardia con la mística de los safaris por las dunas doradas.",
      imagenPortada: "/assets/destinos/dubai.jpg",
      imagenes: [
        "/assets/destinos/dubai.webp",
        "/assets/destinos/dubai3.webp",
        "/assets/destinos/dubai4.jpg"
      ],
      destacado: true,
      orden: 32
    },
    {
      nombre: "Bali",
      slug: "bali",
      paisRegion: "Indonesia",
      descripcionCorta: "Espiritualidad, arrozales y playas soñadas.",
      descripcion:
        "Vive la energía de Bali: la isla de los dioses donde la espiritualidad y la naturaleza se fusionan. Explora los campos de arroz verdes de Ubud, purifícate en templos sagrados frente al mar y relájate en playas paradisíacas buscadas por surfistas de todo el mundo. Un destino místico que ofrece el refugio perfecto para el bienestar, el yoga y la aventura tropical.",
      imagenPortada: "/assets/destinos/bali1.jpg",
      imagenes: [
        "/assets/destinos/bali2.jpg",
        "/assets/destinos/bali3.webp",
        "/assets/destinos/bali4.webp"
      ],
      destacado: true,
      orden: 33
    },
    {
      nombre: "Beijing",
      slug: "beijing",
      paisRegion: "China",
      descripcionCorta: "Gran Muralla y herencia imperial.",
      descripcion:
        "Vive la energía de Beijing: la capital donde la historia imperial se encuentra con una modernidad vibrante. Camina sobre la legendaria Gran Muralla, descubre los secretos de la Ciudad Prohibida y explora los hutongs tradicionales. Un destino monumental que ofrece un viaje profundo por una de las civilizaciones más influyentes de la humanidad.",
      imagenPortada: "/assets/destinos/china2.jpg",
      imagenes: [
        "/assets/destinos/china3.jpg",
        "/assets/destinos/china4.jpg",
        "/assets/destinos/china2.jpg"
      ],
      destacado: true,
      orden: 34
    },
    {
      nombre: "Vietnam",
      slug: "vietnam",
      paisRegion: "Vietnam",
      descripcionCorta: "Bahías, historia y cultura vibrante.",
      descripcion:
        "Vive la energía de Vietnam: un destino de paisajes cinematográficos y una resiliencia inspiradora. Navega entre los gigantes de piedra de la Bahía de Ha Long, recorre las linternas mágicas de Hoi An y descubre el bullicio histórico de Ciudad Ho Chi Minh. Un viaje que cautiva por su naturaleza desbordante, su historia conmovedora y su exquisita cultura gastronómica.",
      imagenPortada: "/assets/destinos/vietnam.webp",
      imagenes: [
        "/assets/destinos/vietnam2.jpg",
        "/assets/destinos/vietnam3.jpg",
        "/assets/destinos/vietnam4.jpg"
      ],
      destacado: true,
      orden: 35
    },
    {
      nombre: "Maldivas",
      slug: "maldivas",
      paisRegion: "Maldivas",
      descripcionCorta: "Aguas turquesas y villas sobre el mar.",
      descripcion:
        "Vive la energía de Maldivas: el paraíso absoluto de aguas cristalinas y villas sobre el mar. Sumérgete en arrecifes de coral repletos de vida, disfruta de la privacidad total en islas de arena blanca y déjate llevar por el lujo de la desconexión total. El destino definitivo para quienes buscan el descanso más exclusivo en el corazón del Océano Índico.",
      imagenPortada: "/assets/destinos/maldivas1.webp",
      imagenes: [
        "/assets/destinos/maldivas2.jpg",
        "/assets/destinos/maldivas3.jpg",
        "/assets/destinos/maldivas4.jpg"
      ],
      destacado: true,
      orden: 36
    },
    {
      nombre: "India",
      slug: "india",
      paisRegion: "India",
      descripcionCorta: "Espiritualidad, palacios y colores vibrantes.",
      descripcion:
        "Vive la energía de India: una explosión de colores, aromas y espiritualidad que transforma a cada viajero. Desde la simetría perfecta del Taj Mahal y los palacios de los Maharajás en el Rajastán, hasta el misticismo del río Ganges en Benarés. Un destino intenso y fascinante que ofrece una conexión profunda con lo sagrado y lo humano.",
      imagenPortada: "/assets/destinos/india.webp",
      imagenes: [
        "/assets/destinos/india2.webp",
        "/assets/destinos/india3.webp",
        "/assets/destinos/india4.webp"
      ],
      destacado: true,
      orden: 37
    },

    // ================= EUROPA EXTRA =================
    {
      nombre: "Londres",
      slug: "londres",
      paisRegion: "Inglaterra",
      descripcionCorta: "Tradición monárquica y vanguardia global.",
      descripcion:
        "Vive la energía de Londres: la metrópoli donde la tradición monárquica se encuentra con la vanguardia global. Desde el icónico Big Ben y el Palacio de Buckingham hasta los mercados alternativos de Camden Town y los museos de clase mundial. Un destino cosmopolita y vibrante que marca tendencia en moda, arte y cultura en cada esquina de sus históricos barrios.",
      imagenPortada: "/assets/destinos/londres.jpg",
      imagenes: [
        "/assets/destinos/londres2.jpg",
        "/assets/destinos/londres3.jpeg",
        "/assets/destinos/londres4.jpg"
      ],
      destacado: true,
      orden: 38
    },
    {
      nombre: "Barcelona",
      slug: "barcelona",
      paisRegion: "España",
      descripcionCorta: "Gaudí, Mediterráneo y vida vibrante.",
      descripcion:
        "Vive la energía de Barcelona: la joya del Mediterráneo que deslumbra con el genio de Gaudí. Déjate sorprender por las formas imposibles de la Sagrada Familia, recorre las coloridas Ramblas y disfruta de la brisa marina en la Barceloneta. Un destino que combina playa, arquitectura modernista y una de las mejores escenas gastronómicas de Europa bajo el sol catalán.",
      imagenPortada: "/assets/destinos/barcelona.jpg",
      imagenes: [
        "/assets/destinos/barcelona2.webp",
        "/assets/destinos/barcelona3.webp",
        "/assets/destinos/barcelona4.webp"
      ],
      destacado: true,
      orden: 39
    },
    {
      nombre: "Praga",
      slug: "praga",
      paisRegion: "República Checa",
      descripcionCorta: "Historia bohemia y arquitectura medieval.",
      descripcion:
        "Vive la energía de Praga: la ciudad de las cien torres que parece salida de un cuento de hadas. Cruza el histórico Puente de Carlos al amanecer, explora el majestuoso Castillo de Praga y piérdete en las callejuelas medievales de su Ciudad Vieja. Un destino cargado de mística, historia bohemia y una arquitectura gótica y barroca que cautiva a cada paso.",
      imagenPortada: "/assets/destinos/praga.webp",
      imagenes: [
        "/assets/destinos/praga2.jpg",
        "/assets/destinos/praga3.jpg",
        "/assets/destinos/praga.webp"
      ],
      destacado: true,
      orden: 40
    },
    {
      nombre: "Atenas",
      slug: "atenas",
      paisRegion: "Grecia",
      descripcionCorta: "Acrópolis, historia antigua y vida mediterránea.",
      descripcion:
        "Vive la energía de Atenas: la cuna de la democracia y el pensamiento occidental. Contempla la majestuosidad del Partenón en la Acrópolis, recorre el pintoresco barrio de Plaka y descubre cómo la historia antigua convive con una vida urbana moderna y llena de sabor mediterráneo. El punto de partida ideal para una travesía inolvidable por las islas griegas.",
      imagenPortada: "/assets/destinos/atenas.jpg",
      imagenes: [
        "/assets/destinos/atenas2.webp",
        "/assets/destinos/atenas3.jpg",
        "/assets/destinos/atenas4.webp"
      ],
      destacado: true,
      orden: 41
    },
    {
      nombre: "Ámsterdam",
      slug: "amsterdam",
      paisRegion: "Países Bajos",
      descripcionCorta: "Canales, bicicletas y arte europeo.",
      descripcion:
        "Vive la energía de Ámsterdam: la ciudad de los canales, las bicicletas y la libertad. Disfruta de un paseo en barco por su red fluvial declarada Patrimonio de la Humanidad, visita la casa de Ana Frank y maravíllate con el arte de Van Gogh. Un destino acogedor y pintoresco que combina una rica historia comercial con un espíritu moderno y multicultural.",
      imagenPortada: "/assets/destinos/amsterdam.jpg",
      imagenes: [
        "/assets/destinos/amsterdam2.jpg",
        "/assets/destinos/amsterdam3.webp",
        "/assets/destinos/amsterdam4.jpg"
      ],
      destacado: true,
      orden: 42
    },
    {
      nombre: "Berlín",
      slug: "berlin",
      paisRegion: "Alemania",
      descripcionCorta: "Historia viva y creatividad urbana.",
      descripcion:
        "Vive la energía de Berlín: una capital que respira historia contemporánea y creatividad sin límites. Desde los restos del Muro de Berlín y la Puerta de Brandeburgo hasta su vibrante escena de arte urbano y música electrónica. Una ciudad resiliente y vanguardista que invita a explorar el pasado mientras se vive el futuro de Europa.",
      imagenPortada: "/assets/destinos/berlin1.jpg",
      imagenes: [
        "/assets/destinos/berlin2.jpg",
        "/assets/destinos/berlin3.jpg",
        "/assets/destinos/berlin4.jpeg"
      ],
      destacado: true,
      orden: 43
    },
    {
      nombre: "Florencia",
      slug: "florencia",
      paisRegion: "Italia",
      descripcionCorta: "Renacimiento, arte y Toscana.",
      descripcion:
        "Vive la energía de Florencia: la cuna del Renacimiento y un verdadero museo al aire libre. Admira el David de Miguel Ángel, contempla la cúpula de Brunelleschi y cruza el romántico Ponte Vecchio. Un destino que celebra la belleza y el arte en su máxima expresión, rodeado por los paisajes idílicos y los viñedos de la Toscana.",
      imagenPortada: "/assets/destinos/florencia.jpg",
      imagenes: [
        "/assets/destinos/florencia2.jpg",
        "/assets/destinos/florencia3.jpg",
        "/assets/destinos/florencia4.jpg"
      ],
      destacado: true,
      orden: 44
    },
    {
      nombre: "Lisboa",
      slug: "lisboa",
      paisRegion: "Portugal",
      descripcionCorta: "Fado, colinas y luz atlántica.",
      descripcion:
        "Vive la energía de Lisboa: la ciudad de las siete colinas bañada por la luz dorada del Tajo. Déjate llevar por el sonido melancólico del Fado en Alfama, recorre sus calles empinadas en los icónicos tranvías amarillos y disfruta de los famosos pasteles de Belém. Un destino auténtico y luminoso que mezcla tradición marinera con un estilo de vida relajado y moderno.",
      imagenPortada: "/assets/destinos/lisboa1.webp",
      imagenes: [
        "/assets/destinos/lisboa2.jpg",
        "/assets/destinos/lisboa3.webp",
        "/assets/destinos/lisboa4.webp"
      ],
      destacado: true,
      orden: 45
    },
    {
      nombre: "Punta Cana",
      slug: "punta-cana",
      paisRegion: "República Dominicana",
      descripcionCorta: "Playas caribeñas y resorts todo incluido.",
      descripcion:
        "Vive la energía de Punta Cana: el paraíso del descanso eterno y las playas de arena blanca infinita. Disfruta de la exclusividad de sus resorts todo incluido, sumérgete en aguas color turquesa y relájate bajo la sombra de cocoteros que se inclinan hacia el mar. Un destino diseñado para el placer, la diversión acuática y la desconexión total en el corazón del Caribe.",
      imagenPortada: "/assets/destinos/punta1.webp",
      imagenes: [
        "/assets/destinos/punta2.webp",
        "/assets/destinos/punta3.webp",
        "/assets/destinos/punta4.jpg"
      ],
      destacado: true,
      orden: 46
    },
    {
      nombre: "México (Riviera Maya)",
      slug: "mexico-riviera-maya",
      paisRegion: "México",
      descripcionCorta: "Cultura maya, cenotes y playas vibrantes.",
      descripcion:
        "Vive la energía de México: una explosión de cultura, color y sabores ancestrales. Desde las místicas ruinas mayas de Tulum y Chichén Itzá hasta la vibrante vida nocturna de Playa del Carmen. Un destino que lo tiene todo: playas paradisíacas, cenotes sagrados ocultos en la selva y una de las gastronomías más ricas y premiadas del mundo.",
      imagenPortada: "/assets/destinos/mexico1.webp",
      imagenes: [
        "/assets/destinos/mexico2.jpg",
        "/assets/destinos/mexico3.webp",
        "/assets/destinos/mexico4.webp"
      ],
      destacado: true,
      orden: 47
    },
    {
      nombre: "Bayahíbe",
      slug: "bayahibe",
      paisRegion: "República Dominicana",
      descripcionCorta: "Tranquilidad, buceo y la Isla Saona.",
      descripcion:
        "Vive la energía de Bayahíbe: la joya auténtica de la República Dominicana. Este encantador pueblo de pescadores es la puerta de entrada a la espectacular Isla Saona y ofrece los mejores puntos de buceo del país. Un destino ideal para quienes buscan tranquilidad, atardeceres dorados frente al mar y playas de aguas cristalinas y poco profundas.",
      imagenPortada: "/assets/destinos/bayahive1.webp",
      imagenes: [
        "/assets/destinos/bayahive2.jpg",
        "/assets/destinos/bayahive3.jpg",
        "/assets/destinos/bayahuve4.jpg"
      ],
      destacado: true,
      orden: 48
    },
    {
      nombre: "Costa Rica",
      slug: "costa-rica",
      paisRegion: "Costa Rica",
      descripcionCorta: "Aventura, biodiversidad y pura vida.",
      descripcion:
        "Vive la energía de Costa Rica: el santuario de la \"Pura Vida\" y la biodiversidad. Explora volcanes activos, deslízate en tirolesa por bosques nubosos y descubre playas vírgenes donde la selva toca el océano. Un destino pionero en ecoturismo que invita a conectar con la naturaleza salvaje, los perezosos y una paz que solo el paraíso verde puede ofrecer.",
      imagenPortada: "/assets/destinos/costarica1.jpg",
      imagenes: [
        "/assets/destinos/costarica2.jpg",
        "/assets/destinos/costarica3.webp",
        "/assets/destinos/costarica4.jpg"
      ],
      destacado: true,
      orden: 49
    },
    {
      nombre: "Santiago de Chile",
      slug: "santiago-de-chile",
      paisRegion: "Chile",
      descripcionCorta: "Ciudad andina, vinos y cultura urbana.",
      descripcion:
        "Vive la energía de Santiago de Chile: una metrópolis cosmopolita custodiada por los imponentes picos de la Cordillera de los Andes. Disfruta de sus viñedos de clase mundial a pocos minutos de la ciudad, recorre el bohemio barrio Bellavista y maravíllate con la arquitectura moderna de \"Sanhattan\". Un destino que combina cultura urbana, nieve y los mejores vinos del sur.",
      imagenPortada: "/assets/destinos/santiago1.jpg",
      imagenes: [
        "/assets/destinos/santiago2.jpg",
        "/assets/destinos/santiago3.webp",
        "/assets/destinos/santiago4.webp"
      ],
      destacado: true,
      orden: 50
    },
    {
      nombre: "Salvador de Bahía",
      slug: "salvador-de-bahia",
      paisRegion: "Brasil",
      descripcionCorta: "Historia colonial y ritmo afro-brasileño.",
      descripcion:
        "Vive la energía de Salvador de Bahía: el alma africana de Brasil y la capital de la alegría. Recorre las calles coloridas del Pelourinho, déjate llevar por el ritmo de los tambores de Olodum y siente la espiritualidad en la Iglesia de San Francisco. Un destino lleno de magia, historia colonial y una gastronomía única que mezcla sabores de dos continentes.",
      imagenPortada: "/assets/destinos/salvador1.jpg",
      imagenes: [
        "/assets/destinos/salvador2.jpg",
        "/assets/destinos/salvador3.jpeg",
        "/assets/destinos/salvador4.jpg"
      ],
      destacado: true,
      orden: 51
    },
    {
      nombre: "Maceió",
      slug: "maceio",
      paisRegion: "Brasil",
      descripcionCorta: "Aguas verdes y piscinas naturales.",
      descripcion:
        "Vive la energía de Maceió: el Caribe brasileño de aguas verdes y piscinas naturales. Maravíllate con el color increíble del mar en playas como Pajuçara y Ponta Verde, y disfruta de la tranquilidad de navegar en tradicionales balsas hacia los arrecifes de coral. Un destino luminoso, con una costanera encantadora y algunos de los paisajes costeros más bellos de Brasil.",
      imagenPortada: "/assets/destinos/maceio1.jpg",
      imagenes: [
        "/assets/destinos/maceio2.avif",
        "/assets/destinos/maceio3.webp",
        "/assets/destinos/maceio4.webp"
      ],
      destacado: true,
      orden: 52
    },
    {
      nombre: "Cuba",
      slug: "cuba",
      paisRegion: "Cuba",
      descripcionCorta: "Historia, música y playas clásicas.",
      descripcion:
        "Vive la energía de Cuba: un viaje en el tiempo lleno de música, historia y ron. Camina por las calles detenidas en los años 50 de La Habana Vieja, disfruta de la arena blanca y fina de Varadero y descubre la esencia del tabaco en los valles de Viñales. Un destino con alma propia, gente cálida y un ritmo que te invita a bailar bajo el sol caribeño.",
      imagenPortada: "/assets/destinos/cuba1.jpg",
      imagenes: [
        "/assets/destinos/cuba2.jpg",
        "/assets/destinos/cuba3.jpg",
        "/assets/destinos/cuba4.jpg"
      ],
      destacado: true,
      orden: 53
    },
    {
      nombre: "Colombia",
      slug: "colombia",
      paisRegion: "Colombia",
      descripcionCorta: "Café, caribe y ciudades vibrantes.",
      descripcion:
        "Vive la energía de Colombia: el país del realismo mágico donde el café y la alegría se encuentran. Desde el encanto colonial de Cartagena de Indias hasta los paisajes verdes del Eje Cafetero y la vibrante transformación de Medellín. Un destino de contrastes fascinantes, selvas exuberantes y la calidez inigualable de su gente.",
      imagenPortada: "/assets/destinos/colombia1.webp",
      imagenes: [
        "/assets/destinos/colombia2.webp",
        "/assets/destinos/colombia3.webp",
        "/assets/destinos/colombia4.png"
      ],
      destacado: true,
      orden: 54
    },
    {
      nombre: "Singapur",
      slug: "singapur",
      paisRegion: "Singapur",
      descripcionCorta: "Ciudad futurista, jardines y lujo.",
      descripcion:
        "Vive la energía de Singapur: la ciudad-estado del futuro donde la naturaleza y la tecnología conviven en perfecta armonía. Déjate asombrar por los jardines verticales de Gardens by the Bay, el lujo del Marina Bay Sands y la diversidad de sus barrios étnicos. Un destino impecable, vanguardista y multicultural que redefine el concepto de modernidad.",
      imagenPortada: "/assets/destinos/singapur1.webp",
      imagenes: [
        "/assets/destinos/singapur2.webp",
        "/assets/destinos/singapur3.jpg",
        "/assets/destinos/singapur4.webp"
      ],
      destacado: true,
      orden: 55
    },
    {
      nombre: "Japón",
      slug: "japon",
      paisRegion: "Japón",
      descripcionCorta: "Tradición, tecnología y estética perfecta.",
      descripcion:
        "Vive la energía de Japón: el fascinante contraste entre el neón futurista de Tokio y el silencio sagrado de los templos de Kioto. Descubre la elegancia de los antiguos samuráis, saborea la perfección del sushi artesanal y maravíllate con la simetría del Monte Fuji. Un destino que ofrece una experiencia cultural profunda, tecnológica y estéticamente perfecta.",
      imagenPortada: "/assets/destinos/japon1.jpg",
      imagenes: [
        "/assets/destinos/japon2.webp",
        "/assets/destinos/japon3.webp",
        "/assets/destinos/japon4.jpeg"
      ],
      destacado: true,
      orden: 56
    },
    {
      nombre: "Córdoba",
      slug: "cordoba",
      paisRegion: "Argentina",
      descripcionCorta: "Sierras, valles y cultura cordobesa.",
      descripcion:
        "Vive la energía de Córdoba: el corazón de las sierras argentinas con ríos cristalinos, pueblos con encanto y una historia que se respira en cada rincón. Desde los valles de Punilla y Calamuchita hasta la magia de Traslasierra y el Mar de Ansenuza, un destino ideal para combinar naturaleza, cultura y descanso.",
      imagenPortada: "/assets/destinos/punilla.jpg",
      imagenes: [
        "/assets/destinos/traslasierras1.jpg",
        "/assets/destinos/ansenuza.jpg",
        "/assets/destinos/calamuchita.jpg"
      ],
      destacado: true,
      orden: 57
    },
    {
      nombre: "Fórmula 1",
      slug: "formula-1",
      paisRegion: "Programas y eventos",
      descripcionCorta: "Grandes premios y experiencias únicas.",
      descripcion:
        "Viví la Fórmula 1 como un verdadero fanático: programas con entradas a los grandes premios, hoteles seleccionados y opciones para seguir cada carrera desde ubicaciones exclusivas.",
      imagenPortada: "/assets/destinos/f1.jpg",
      imagenes: [
        "/assets/destinos/f1b.jpg",
        "/assets/destinos/f13.webp",
        "/assets/destinos/f1.4.jpeg"
      ],
      destacado: true,
      orden: 58
    },
    {
      nombre: "Experiencia Mundial",
      slug: "experiencia-mundial",
      paisRegion: "Programas y eventos",
      descripcionCorta: "Paquetes mundialistas para hinchas.",
      descripcion:
        "Experiencias para vivir el Mundial con traslados, entradas, alojamiento y la emoción de cada partido. Programas flexibles con opciones de hoteles y servicios premium.",
      imagenPortada: "/assets/destinos/mundial.jpg",
      imagenes: [
        "/assets/destinos/mundial1.jpg",
        "/assets/destinos/mundial3.webp",
        "/assets/destinos/mundial.jpg"
      ],
      destacado: true,
      orden: 59
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
  const buzios = destinosList.find((item) => item.slug === "buzios");
  const buenosAires = destinosList.find((item) => item.slug === "buenos-aires");
  const misiones = destinosList.find((item) => item.slug === "misiones");
  const pinamar = destinosList.find((item) => item.slug === "pinamar");
  const formula1 = destinosList.find((item) => item.slug === "formula-1");
  const experienciaMundial = destinosList.find(
    (item) => item.slug === "experiencia-mundial"
  );
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
  const cordoba = destinosList.find((item) => item.slug === "cordoba");

  const actividades = await prisma.actividad.createMany({
    data: [
      {
        nombre: "Capilla del Monte - Valle de Punilla",
        slug: "capilla-del-monte-valle-de-punilla",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2025-06-14"),
        hora: "08:30",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos desde Córdoba, conociendo La Calera con su Usina Hidroeléctrica. Seguimos bordeando el río Suquía desembarcando en el Dique San Roque con su magnífica arquitectura en la que sobresale su embudo y su imponente murallón, como así también el moderno puente nuevo renovando el paisaje. Pasamos por Bialet Masse observando la capilla de San Placido y el Horno La Primera Argentina. Seguimos por RN 38 hasta llegar a Cosquín capital nacional del Folklore conociendo la Plaza Próspero Molina y en su lejanía el cerro Pan de Azúcar. Seguimos por Valle Hermoso con su Monumento a San Antonio de Padua y pasamos por la ex casa del Virrey Zevallos y luego llegamos a La Falda recorriendo la clásica Av. Edén hasta llegar al imponente hotel. Atravesamos Huerta Grande y Villa Giardino para arribar a la localidad de La Cumbre con sus antiguas y distinguidas residencias de estilo europeo y se observa el Cristo Redentor. Continuamos por Cruz Chica pasando por la puerta del Museo Manuel Mujica Láinez, Cruz Grande y visitamos Los Cocos con su complejo El Descanso y la aerosilla (opcionales). Seguimos hasta arribar a Capilla del Monte, al pie del místico cerro Uritorco, la calle techada y la llamativa figura de piedra conocida como el Zapato. Las últimas horas de la tarde nos encuentran observando el atardecer por el Camino del Cuadrado para regresar a Córdoba.`,
        imagenPortada: "/assets/destinos/punilla.jpg",
        destacada: true,
        orden: 1
      },
      {
        nombre: "Villa General Belgrano - Valle de Calamuchita",
        slug: "villa-general-belgrano-valle-de-calamuchita",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2025-06-21"),
        hora: "08:00",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos desde Córdoba por RP5 pasando por el gigantesco obelisco monumento a Myriam Steffor rumbo a Alta Gracia donde visitaremos los valiosos tesoros que heredó del pasado: la Iglesia y estancia Jesuítica de Alta Gracia, museo histórico nacional casa del Virrey Liniers, la torre del reloj público y su tajamar, Museo Casa de Ernesto "Che" Guevara. Continuamos por Anisacate, La Bolsa, La Serranita y Villa Ciudad de América acariciado por las aguas del lago y Dique Los Molinos donde haremos una degustación de salame y queso típico de la zona mientras observamos desde el mirador el imponente espejo. Continuamos con Villa General Belgrano, pueblo de raíces europeas y espíritu serrano, donde también realizaremos una degustación de cerveza artesanal. Regresamos por Los Reartes y por la costa noroeste del lago Los Molinos, Potrero de Garay, para luego retomar rumbo a Córdoba.`,
        imagenPortada: "/assets/destinos/calamuchita.jpg",
        destacada: true,
        orden: 2
      },
      {
        nombre: "Mina Clavero - Valle de Traslasierra",
        slug: "mina-clavero-valle-de-traslasierra",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2025-06-28"),
        hora: "07:30",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos de Córdoba por autopista Justiniano Posse a Carlos Paz, San Antonio de Arredondo, Mayú Sumaj, Icho Cruz y Cuesta Blanca, todos bordeando el río San Antonio. Luego comenzamos a recorrer el Camino de Altas Cumbres donde las vistas panorámicas se adueñan del paisaje. En el punto más alto del camino se encuentra el paraje El Cóndor; seguimos por la Pampa de Achala y el nacimiento del río Mina Clavero. Llegando al corazón del Valle de Traslasierra encontramos a Mina Clavero donde conoceremos el centro comercial, el balneario de los Elefantes, etc. Un pueblo que creció con el ejemplo solidario e idealista. Llegamos a Villa Cura Brochero pasando por su iglesia, su balneario y el museo Brocheriano. Continuamos por Nono donde se respira armonía y tradición al pie de los cerros Ñuñu, también el polifacético museo Rocsen y la fábrica de alfajores. Regresamos a Córdoba por el camino de Bosque Alegre con vistas de la Estación Terrena y el Observatorio Nacional que lleva el nombre de su camino.`,
        imagenPortada: "/assets/destinos/traslasierras1.jpg",
        destacada: true,
        orden: 3
      },
      {
        nombre: "Camino de la Historia - Estancias Jesuiticas",
        slug: "camino-de-la-historia-estancias-jesuiticas",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2025-07-05"),
        hora: "09:00",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos de Córdoba por RN 9 hasta llegar a Colonia Caroya, tierras impregnadas del espíritu y la pasión de los colonos italianos y famosa por sus salames artesanales. Allí visitaremos la Estancia Jesuítica Casa de Caroya, la primera de las seis que fundaron los jesuitas en las sierras cordobesas, y la Iglesia Nuestra Señora del Monserrat. Luego conocemos Jesús María, pueblo orgulloso de sus costumbres, donde se rinde homenaje a la patria entre relinchos y cantos de argentinidad con su Festival Nacional de Doma y Folklore y su escenario José Hernández, y la Estancia Jesuítica San Isidro Labrador, pionera en la elaboración del vino en la región. Continuamos hacia el norte donde las huellas se hacen evidentes: llegamos a la Posta de Sinsacate, la más grande y destacada del Camino Real, y el paraje de Barranca Yaco que recuerda la muerte del caudillo Facundo Quiroga para luego arribar donde se produce el encuentro de la sierra con el llano y la Estancia Santa Catalina, un paisaje serrano impregnado por la mística jesuítica. Seguimos bordeando las Sierras Chicas, pasando por las pintorescas localidades de Ascochinga, La Granja, Agua de Oro, Salsipuedes y Río Ceballos, regresando a Córdoba.`,
        imagenPortada: "/assets/destinos/camino.jpg",
        destacada: true,
        orden: 4
      },
      {
        nombre: "La Cumbrecita - Pueblo Peatonal",
        slug: "la-cumbrecita-pueblo-peatonal",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2025-07-12"),
        hora: "07:45",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos desde Córdoba por RP5 pasando por el gigantesco obelisco monumento a Myriam Steffor rumbo a Alta Gracia, Anisacate, La Bolsa, La Serranita y Villa Ciudad de América. Continuamos el recorrido por Potrero de Garay y el más serrano y autóctono pueblo en esa región de reminiscencia europea: Los Reartes. Desde allí a una pampa de altura ubicada entre los valles y los faldeos de las Sierras Grandes nos recibe Atos Pampa; pasamos también por una de las grandes cañadas del río Los Reartes con un gran puente que cruza su cauce y nos presenta a Inti Yaco. Luego Villa Berna, donde el aire delata un intenso perfume con notas de pino y extensos bosques exóticos. Llegamos a La Cumbrecita, una aldea de montaña que preserva su entorno natural como tesoro supremo, uno de los pocos pueblos peatonales del mundo donde visitaremos el balneario La Olla, la Capilla Ecuménica, el tradicional hotel La Cumbrecita, la cascada grande, etc. Luego conocemos el exótico, diferente, original y cautivante de raíces centroeuropeas y espíritus serranos Villa General Belgrano. Retomamos el camino por el límite sur de la región de Paravachasca donde el agua y las sierras crean formas cada día, el gran lago Los Molinos y su dique, y emprendemos el regreso a Córdoba.`,
        imagenPortada: "/assets/destinos/cumbrecita1.jpg",
        destacada: true,
        orden: 5
      },
      {
        nombre: "Alta Gracia / Carlos Paz - Combo x2 Calamuchita y Punilla",
        slug: "alta-gracia-carlos-paz-combo",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2025-07-19"),
        hora: "08:15",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos desde Córdoba por RP5 pasando por el gigantesco obelisco monumento a Myriam Steffor rumbo a Alta Gracia donde visitaremos los valiosos tesoros que heredó del pasado: la Iglesia y estancia Jesuítica de Alta Gracia, museo histórico nacional casa del Virrey Liniers, la torre del reloj público y su tajamar, la iglesia Nuestra Señora de la Merced, Museo Casa de Ernesto "Che" Guevara, el museo del célebre compositor musical Manuel de Falla, el Sierras Hotel con su historia legendaria y, junto a una pequeña caminata, llegamos al santuario cavado en la roca, la Gruta Nuestra Señora de Lourdes. Luego nos dirigimos por Falda del Carmen a la ciudad turística más importante de la provincia, Villa Carlos Paz, el destino soñado de quienes la elijen. Conoceremos el símbolo más popular y reconocido de la villa, el Reloj Cu Cu, uno de sus atractivos: la aerosilla y una visita a la fábrica artesanal de alfajores. Junto a su imponente espejo de agua, el lago San Roque con su costanera y, retomando por el camino de las 100 curvas, llegamos al Dique San Roque con su magnífica arquitectura en la que sobresale su embudo y su imponente murallón, como así también el moderno puente nuevo renovando el paisaje. La Calera es la que nos indica el regreso a la ciudad de Córdoba.`,
        imagenPortada: "/assets/destinos/altagracia1.jpg",
        destacada: true,
        orden: 6
      },
      {
        nombre: "Cerro Colorado - Región Norte",
        slug: "cerro-colorado-region-norte",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2025-07-26"),
        hora: "07:00",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos de Córdoba por RN 9 hasta llegar a Colonia Caroya, tierras impregnadas del espíritu y la pasión de los colonos italianos y famosa por sus salames artesanales. Seguimos por Jesús María, pueblo orgulloso de sus costumbres y donde se rinde homenaje a la patria entre relinchos y cantos de argentinidad con su Festival Nacional de Doma y Folklore. Continuamos hacia el norte donde las huellas se hacen evidentes: llegamos a la Posta de Sinsacate, la más grande y destacada del Camino Real, y el paraje de Barranca Yaco que recuerda la muerte del caudillo Facundo Quiroga. Luego, en acuarelas, óleos y acrílicos de prodigiosos artistas nos recibe Villa del Totoral; continuamos camino hacia Las Peñas y Simbolar y terminamos en el corazón del departamento Tulumba donde la llanura le gana protagonismo a las sierras: se levanta San José de la Dormida. Santa Elena, un lugar distinguido con colores diversos y formas sorprendentes donde el hombre primitivo dejó uno de sus legados más valiosos en suelo americano, y Don Atahualpa Yupanqui, el más grande poeta del folklore argentino, decidió inmortalizarse en su tierra, nos recibe Cerro Colorado. Conoceremos la Reserva Cultural Natural Cerro Colorado, el museo arqueológico y la casa museo de Atahualpa Yupanqui para luego retomar el viaje hacia Córdoba.`,
        imagenPortada: "/assets/destinos/cerrocolorado1.jpg",
        destacada: true,
        orden: 7
      },
      {
        nombre: "Mar de Ansenuza - Leyendas y Flamencos",
        slug: "mar-de-ansenuza-leyendas-y-flamencos",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2025-08-02"),
        hora: "09:00",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos desde Córdoba con rumbo a Monte Cristo y Río Primero, y si están con ganas de cruzarse con personajes de historietas y dibujos animados hay que hacer una parada en Santiago Temple. Siguiendo por la ciudad de las golosinas llegamos a Arroyito. Pasando por El Tío y en medio de los llanos donde abundan siembras diversas está Balnearia con el horizonte cercano al Mar de Ansenuza. Finalmente llegamos a orillas de ese gran mar, donde se despliegan colores a cada instante y se respira aire con perfume a sal: se levanta Miramar, la más grande laguna de agua salada de Sudamérica. Conoceremos, como un viejo trasatlántico encallado en sus costas con sus lujos oxidados por el aire salitroso, el Gran Hotel Viena que resguarda secretos y misterios. El criadero de coipos, avistaje de la más emblemática de las aves que habitan Ansenuza (los flamencos rosados) y un agradable paseo por los márgenes de la laguna para luego regresar a Córdoba.`,
        imagenPortada: "/assets/destinos/ansenuza.jpg",
        destacada: true,
        orden: 8
      },
      {
        nombre: "Villa Carlos Paz - Corazón de Córdoba",
        slug: "villa-carlos-paz-corazon-de-cordoba",
        destinoId: cordoba.id,
        tipoActividad: "Excursión medio día",
        fecha: new Date("2025-08-09"),
        hora: "09:30",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos desde Córdoba, conociendo La Calera con su Usina Hidroeléctrica. Seguimos bordeando el río Suquía desembarcando en el Dique San Roque con su magnífica arquitectura en la que sobresale su embudo y su imponente murallón, como así también el moderno puente nuevo renovando el paisaje. Luego tomamos el camino de las 100 curvas que bordea el gran espejo de agua llegando a la ciudad turística más importante de la provincia, Villa Carlos Paz, el destino soñado de quienes la elijen. Recorremos su centro comercial, el símbolo más popular y reconocido de la villa, el Reloj Cu Cu, el complejo aerosilla y una visita a la fábrica artesanal de alfajores. Regresamos a Córdoba por la autopista Justiniano Allende Posse.`,
        imagenPortada: "/assets/destinos/carlospaz1.webp",
        destacada: false,
        orden: 9
      },
      {
        nombre: "Alta Gracia - Jesuitas",
        slug: "alta-gracia-jesuitas",
        destinoId: cordoba.id,
        tipoActividad: "Excursión medio día",
        fecha: new Date("2025-08-16"),
        hora: "09:00",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos desde Córdoba por RP5 pasando por el gigantesco obelisco monumento a Myriam Steffor rumbo a Alta Gracia donde visitaremos los valiosos tesoros que heredó del pasado: la Iglesia y estancia Jesuítica de Alta Gracia, museo histórico nacional casa del Virrey Liniers, la torre del reloj público y su tajamar, la iglesia Nuestra Señora de la Merced, Museo Casa de Ernesto "Che" Guevara, el museo del célebre compositor musical Manuel de Falla, el Sierras Hotel con su historia legendaria y, junto a una pequeña caminata, llegamos al santuario cavado en la roca, la Gruta Nuestra Señora de Lourdes, para luego regresar a Córdoba.`,
        imagenPortada: "/assets/destinos/altagracia1.jpg",
        destacada: false,
        orden: 10
      },
      {
        nombre: "Jesús María - La del Camino Real",
        slug: "jesus-maria-camino-real",
        destinoId: cordoba.id,
        tipoActividad: "Excursión medio día",
        fecha: new Date("2025-08-23"),
        hora: "09:00",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos de Córdoba por RN 9 hasta llegar a Colonia Caroya, tierras impregnadas del espíritu y la pasión de los colonos italianos y famosa por sus salames artesanales. Allí visitaremos la Estancia Jesuítica Casa de Caroya, la primera de las seis que fundaron los jesuitas en las sierras cordobesas, y la Iglesia Nuestra Señora del Monserrat. Luego conocemos Jesús María, pueblo orgulloso de sus costumbres y donde se rinde homenaje a la patria entre relinchos y cantos de argentinidad con su Festival Nacional de Doma y Folklore y su escenario José Hernández, la Estancia Jesuítica San Isidro Labrador, pionera en la elaboración del vino en la región, y regresamos a Córdoba.`,
        imagenPortada: "/assets/destinos/jesusmaria1.jpg",
        destacada: false,
        orden: 11
      },
      {
        nombre: "Sierras Chicas - Región de la historia",
        slug: "sierras-chicas-region-de-la-historia",
        destinoId: cordoba.id,
        tipoActividad: "Excursión medio día",
        fecha: new Date("2025-08-30"),
        hora: "09:00",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos de Córdoba visitando quien supo conservar la tranquilidad de sus calles, la frescura del paisaje y la magia del río: nos abre las puertas La Calera, que guarda monumentos históricos como la capilla vieja y el molino doble. Pasamos por el Dique Mal Paso y bordeamos el cordón de las Sierras Chicas. Saldán con un puñado de casas sobre el lomo de sierras, Villa Allende sobre la ladera este del Cerro Pan de Azúcar y la iglesia Nuestra Señora del Carmen, Mendiolaza con su túnel de sombras en temporada estival y luego un manto de hojas sobre el asfalto. Llegamos a Unquillo que resguarda valiosos exponentes de la arquitectura de la primera década del siglo XX. Luego arribamos a Río Ceballos, con callecitas que suben y bajan hacia las sierras y arroyos, con su sagrado protector el Cristo Redentor desde lo alto del Cerro Ñu Porá y su vista panorámica. Para terminar en el Dique La Quebrada, la reserva hídrica natural, y regresamos a Córdoba.`,
        imagenPortada: "/assets/destinos/sierraschicas1.jpg",
        destacada: false,
        orden: 12
      },
      {
        nombre: "Paseo del Indio - La perla de las Sierras",
        slug: "paseo-del-indio-perla-de-las-sierras",
        destinoId: cordoba.id,
        tipoActividad: "Excursión medio día",
        fecha: new Date("2025-09-06"),
        hora: "08:30",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Salida desde Córdoba capital (traslado incluido)",
        descripcion: `Salimos desde Córdoba rumbo a la localidad de Capilla del Monte donde los amantes de la naturaleza disfrutamos de balnearios o senderismo por el río entre saltos y cuevas hasta llegar a la grieta donde escaparon aborígenes de la gran matanza. Es un paisaje único entre paredones de 300 metros de altura matizado por caídas de agua. Mostrándonos uno de los escenarios más imponentes de las sierras de Córdoba, del otro lado nos observa el gran Cerro Uritorco con toda su mística. Regresamos por Dolores conociendo el Molino de Eiffel, Flor de Durazno y La Capilla, para luego observar el atardecer por el gran Camino del Cuadrado con sus colores y ondas sobre las sierras para regresar a Córdoba.`,
        imagenPortada: "/assets/destinos/paseoindio1.jpg",
        destacada: false,
        orden: 13
      },
      {
        nombre: "Ruta del Vino de Córdoba",
        slug: "ruta-del-vino-de-cordoba",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2025-09-13"),
        hora: "10:00",
        precio: "61000",
        cupos: 20,
        puntoEncuentro: "Retiro coordinado en Córdoba Capital (traslado incluido)",
        descripcion:
          "Vive la energía de la Ruta del Vino: un viaje sensorial por los viñedos de altura y bodegas boutique de la provincia. Desde los premiados tintos de Colonia Caroya hasta las exclusivas cepas de Traslasierra y Calamuchita. Descubre la tradición vitivinícola cordobesa, maridando excelentes etiquetas con la mejor gastronomía local en entornos naturales inigualables. Incluye traslado ida y vuelta desde Córdoba Capital.",
        imagenPortada: "/assets/destinos/ruta2.jpg",
        destacada: true,
        orden: 14
      },
      {
        nombre: "Córdoba a tu medida",
        slug: "cordoba-a-tu-medida",
        destinoId: cordoba.id,
        tipoActividad: "Excursión a medida",
        fecha: new Date("2025-09-20"),
        hora: "09:00",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Coordinación previa con asesor (traslado incluido)",
        descripcion:
          "Diseñá tu visita ideal por Córdoba con un itinerario flexible y personalizado. Podés combinar sierras, city tour, bodegas, gastronomía regional y experiencias especiales. Coordinamos traslados, horarios y paradas para que disfrutes una escapada a medida con la mejor atención.",
        imagenPortada: "/assets/destinos/calamuchita2.jpg",
        destacada: true,
        orden: 15
      },
      {
        nombre: "Visita Córdoba a tu medida",
        slug: "visita-cordoba-a-tu-medida",
        destinoId: cordoba.id,
        tipoActividad: "Excursión a medida",
        fecha: new Date("2025-09-27"),
        hora: "08:00",
        precio: "0",
        cupos: 0,
        puntoEncuentro: "Coordinación previa con asesor (traslado incluido)",
        descripcion:
          "Armá tu día perfecto en Córdoba combinando varias excursiones en una misma jornada. Podés elegir city tour, sierras, bodegas o circuitos gastronómicos, y nuestros asesores te ayudan a diseñar la mejor ruta según tiempos, gustos y traslados. Ideal para quienes quieren aprovechar al máximo con un plan flexible.",
        imagenPortada: "/assets/destinos/punilla2.jpg",
        destacada: true,
        orden: 16
      }
    ]
  });

  const salidasGrupales = [
    {
      titulo: "Bombinhas Paquete",
      slug: "bombinhas-paquete",
      destinoId: bombinhas.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 1,
      condiciones: "Paquetes Nov 2025 - Abr 2026. Tarifa en base doble.",
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
    },
    {
      titulo: "Camboriu Paquete",
      slug: "camboriu-paquete",
      destinoId: camboriu.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 2,
      condiciones:
        "Salida en bus MIX con servicio a bordo. Habitaciones a compartir garantizadas. Cupos sujetos a disponibilidad.",
      destinos: {
        create: [{ destinoId: camboriu.id }]
      },
      precios: {
        create: [
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-01"),
            fechaFin: new Date("2026-02-01")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-08"),
            fechaFin: new Date("2026-02-08")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-15"),
            fechaFin: new Date("2026-02-15")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-22"),
            fechaFin: new Date("2026-02-22")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-03-01"),
            fechaFin: new Date("2026-03-01")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-03-08"),
            fechaFin: new Date("2026-03-08")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-03-15"),
            fechaFin: new Date("2026-03-15")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-03-22"),
            fechaFin: new Date("2026-03-22")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-03-29"),
            fechaFin: new Date("2026-03-29")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "detalle-programa", descripcion: "Sur de Brasil - Camboriu" },
          { tipo: "detalle-destino", descripcion: "Sur de Brasil - Camboriu" },
          { tipo: "detalle-transporte", descripcion: "Bus MIX, con servicio a bordo" },
          { tipo: "detalle-duracion", descripcion: "07 noches" },
          {
            tipo: "detalle-hotel",
            descripcion:
              "Bella Camboriu / Centromar / H / HM / Puca (hotelpuca.com.br) / Tropikalya Gold"
          },
          { tipo: "detalle-regimen", descripcion: "Desayuno" },
          {
            tipo: "detalle-media-pension",
            descripcion:
              "Media pensión opcional (Restaurante Dom Albero). Hoteles H y HM: media pensión en el hotel."
          },
          {
            tipo: "detalle-servicios",
            descripcion:
              "Asistencia médica incluida sin límite de edad."
          },
          {
            tipo: "detalle-servicios",
            descripcion: "Coordinación permanente."
          },
          {
            tipo: "detalle-salidas",
            descripcion:
              "Salidas: 01, 08, 15 y 22 de febrero; 01, 08, 15, 22 y 29 de marzo (Semana Santa)."
          },
          { tipo: "transporte", descripcion: "Bus MIX con servicio a bordo" },
          {
            tipo: "alojamiento",
            descripcion: "7 noches con régimen según hotel"
          },
          { tipo: "comida", descripcion: "Régimen desayuno" },
          {
            tipo: "servicio",
            descripcion: "Asistencia médica incluida sin límite de edad"
          },
          {
            tipo: "servicio",
            descripcion: "Coordinación permanente durante el viaje"
          }
        ]
      }
    },
    {
      titulo: "Combinado Búzios + Río de Janeiro",
      slug: "combinado-buzios-rio",
      destinoId: buzios.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 4,
      condiciones:
        "Salida aérea combinada. Cupos sujetos a disponibilidad. Los cupos aéreos incluyen estadía en cochera (hasta vehículos medianos).",
      destinos: {
        create: [{ destinoId: buzios.id }, { destinoId: rio.id }]
      },
      precios: {
        create: [
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-22"),
            fechaFin: new Date("2026-02-22")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "detalle-programa", descripcion: "Combinado" },
          { tipo: "detalle-destino", descripcion: "Búzios + Río de Janeiro" },
          { tipo: "detalle-duracion", descripcion: "08 días / 07 noches" },
          {
            tipo: "detalle-transporte",
            descripcion: "Aéreos volando por Aerolíneas Argentinas"
          },
          { tipo: "detalle-equipaje", descripcion: "Carry on" },
          {
            tipo: "detalle-hotel",
            descripcion: "La Foret (3N) + Oceano Copacabana Hotel (4N)"
          },
          { tipo: "detalle-regimen", descripcion: "Desayuno" },
          { tipo: "detalle-servicios", descripcion: "Trf in out + interhotel" },
          {
            tipo: "detalle-asistencia",
            descripcion: "Master plus Cobertura 40k"
          },
          {
            tipo: "detalle-salidas",
            descripcion: "Salidas: 22 de febrero"
          },
          { tipo: "transporte", descripcion: "Aéreos con Aerolíneas Argentinas" },
          {
            tipo: "alojamiento",
            descripcion: "7 noches: 3 en Búzios + 4 en Río de Janeiro"
          },
          { tipo: "comida", descripcion: "Régimen desayuno" },
          { tipo: "equipaje", descripcion: "Carry on incluido" },
          {
            tipo: "servicio",
            descripcion: "Traslados in/out y entre hoteles (interhotel)"
          },
          {
            tipo: "servicio",
            descripcion: "Asistencia al viajero Master Plus 40k"
          },
          {
            tipo: "itinerario-1",
            descripcion:
              "Día de salida: Comienza la experiencia. Nos reunimos en el punto de encuentro indicado, realizamos el check in y emprendemos el traslado hacia el destino."
          },
          {
            tipo: "itinerario-2",
            descripcion:
              "Estadía en destino: Viví cada momento con actividades y servicios incluidos. El itinerario puede variar según condiciones del viaje y preferencias del grupo."
          },
          {
            tipo: "itinerario-3",
            descripcion:
              "Día de regreso: Finaliza el viaje con el traslado de vuelta. Nuestro equipo acompaña el proceso para cerrar la experiencia con la misma calidad."
          }
        ]
      }
    },
    {
      titulo: "Ferrugem Paquete",
      slug: "ferrugem-paquete",
      destinoId: ferrugem.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 3,
      condiciones: "Paquetes Nov 2025 - Abr 2026. Tarifa en base doble.",
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
    },
    {
      titulo: "Garopaba Paquete",
      slug: "garopaba-paquete",
      destinoId: garopaba.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 5,
      condiciones: "Paquetes Nov 2025 - Abr 2026. Tarifa en base doble.",
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
    },
    {
      titulo: "Laguna Paquete",
      slug: "laguna-paquete",
      destinoId: laguna.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 6,
      condiciones: "Paquetes Nov 2025 - Abr 2026. Tarifa en base doble.",
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
    },
    {
      titulo: "Torres Paquete",
      slug: "torres-paquete",
      destinoId: torres.id,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 7,
      condiciones: "Paquetes Nov 2025 - Abr 2026. Tarifa en base doble.",
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
    },
    {
      titulo: "Buenos Aires",
      slug: "buenos-aires-aereo",
      destinoId: buenosAires.id,
      noches: 3,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 8,
      condiciones:
        "Salida aérea nacional. Habitaciones a compartir garantizadas (dobles o triples). Cupos sujetos a disponibilidad. Los cupos aéreos incluyen estadía en cochera.",
      destinos: {
        create: [{ destinoId: buenosAires.id }]
      },
      precios: {
        create: [
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-04-02"),
            fechaFin: new Date("2026-04-02")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-05-23"),
            fechaFin: new Date("2026-05-23")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-07-03"),
            fechaFin: new Date("2026-07-03")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "detalle-programa", descripcion: "Buenos Aires" },
          { tipo: "detalle-destino", descripcion: "Buenos Aires" },
          {
            tipo: "detalle-duracion",
            descripcion: "04 días / 03 noches - 03 días / 02 noches"
          },
          {
            tipo: "detalle-transporte",
            descripcion: "Aéreo desde Córdoba volando por Flybondi"
          },
          { tipo: "detalle-equipaje", descripcion: "12 kg" },
          { tipo: "detalle-hotel", descripcion: "HTL LUXOR" },
          { tipo: "detalle-regimen", descripcion: "Desayuno" },
          { tipo: "detalle-servicios", descripcion: "Trf in out + City" },
          {
            tipo: "detalle-asistencia",
            descripcion: "Nacional - Cobertura 2M"
          },
          {
            tipo: "detalle-salidas",
            descripcion: "Salidas: 02 de abril, 23 de mayo y 03 de julio"
          },
          { tipo: "transporte", descripcion: "Aéreos con Flybondi" },
          { tipo: "alojamiento", descripcion: "3 o 2 noches según salida" },
          { tipo: "comida", descripcion: "Régimen desayuno" },
          { tipo: "equipaje", descripcion: "Equipaje 12 kg" },
          {
            tipo: "servicio",
            descripcion: "Traslados in/out + City tour"
          },
          {
            tipo: "servicio",
            descripcion:
              "Coordinador SAVI: acompañamiento integral y asistencia personalizada durante todo el viaje."
          },
          {
            tipo: "servicio",
            descripcion: "Asistencia médica nacional con cobertura 2M"
          },
          {
            tipo: "itinerario-1",
            descripcion:
              "Día de salida — Comienza la experiencia. Nos reunimos en el punto de encuentro indicado para iniciar el viaje. Realizamos el check in correspondiente y emprendemos el traslado hacia el destino elegido."
          },
          {
            tipo: "itinerario-2",
            descripcion:
              "Estadía en destino — Viví cada momento. Durante la estadía podrás disfrutar de las actividades, servicios y atractivos incluidos en tu paquete. El itinerario puede variar según condiciones del viaje y preferencias del grupo."
          },
          {
            tipo: "itinerario-3",
            descripcion:
              "Día de regreso — Fin del viaje. Luego del check out y los procedimientos de regreso, emprendemos el retorno. Nuestro equipo te acompaña hasta el final del servicio."
          }
        ]
      }
    },
    {
      titulo: "Bañados de la Estrella",
      slug: "banados-de-la-estrella",
      destinoId: misiones.id,
      noches: 0,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 9,
      condiciones:
        "Habitación a compartir garantizada (dobles o triples). Parque Nacional El Impenetrable opcional. Adicional MAP (2 o 3 comidas) disponible.",
      destinos: {
        create: [{ destinoId: misiones.id }]
      },
      precios: {
        create: [
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-06-14"),
            fechaFin: new Date("2026-06-14")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-07-04"),
            fechaFin: new Date("2026-07-04")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-07-11"),
            fechaFin: new Date("2026-07-11")
          }
        ]
      },
      incluyeItems: {
        create: [
          {
            tipo: "detalle-programa",
            descripcion:
              "Bañados de la Estrella + Parque Nacional El Impenetrable"
          },
          {
            tipo: "detalle-destino",
            descripcion: "Resistencia - Ibarreta - Juan José Castelli"
          },
          {
            tipo: "detalle-duracion",
            descripcion: "6 días / 4 noches - 5 días / 3 noches"
          },
          { tipo: "detalle-transporte", descripcion: "Bus CAMA" },
          {
            tipo: "detalle-hotel",
            descripcion:
              "Hoteles a confirmar: Resistencia (Hotel Royal), Ibarreta (Dolce Maiten) y Juan José Castelli (Hotel Florencia)"
          },
          { tipo: "detalle-regimen", descripcion: "Desayuno" },
          {
            tipo: "detalle-excursiones",
            descripcion:
              "Panorámica en Corrientes + Fortín La Soledad (Bañados de la Estrella con navegación y cena especial)"
          },
          {
            tipo: "detalle-excursiones",
            descripcion:
              "Programa de 3 noches incluye Parque Nacional El Impenetrable"
          },
          {
            tipo: "detalle-asistencia",
            descripcion:
              "Universal Assistance Nacional - Cobertura UDA 2M (sin límite de edad)"
          },
          { tipo: "detalle-servicios", descripcion: "Coordinador permanente" },
          {
            tipo: "detalle-salidas",
            descripcion: "Salidas: 14 de junio; 04 y 11 de julio"
          },
          {
            tipo: "detalle-rutas",
            descripcion: "Ruta 1: Río Cuarto, Villa María, Rosario, Santa Fe"
          },
          {
            tipo: "detalle-rutas",
            descripcion: "Ruta 2: Córdoba, Villa María"
          },
          { tipo: "transporte", descripcion: "Bus CAMA" },
          { tipo: "alojamiento", descripcion: "4 o 3 noches según salida" },
          { tipo: "comida", descripcion: "Régimen desayuno" },
          {
            tipo: "servicio",
            descripcion: "Panorámica en Corrientes + Fortín La Soledad"
          },
          {
            tipo: "servicio",
            descripcion: "Programa 3 noches con El Impenetrable"
          },
          {
            tipo: "servicio",
            descripcion: "Coordinador permanente durante todo el viaje"
          },
          {
            tipo: "servicio",
            descripcion: "Asistencia médica Universal Assistance Nacional UDA 2M"
          },
          {
            tipo: "itinerario-1",
            descripcion:
              "Día de salida — Comienza la experiencia. Nos reunimos en el punto de encuentro indicado para iniciar el viaje. Realizamos el check in correspondiente y emprendemos el traslado hacia el destino elegido."
          },
          {
            tipo: "itinerario-2",
            descripcion:
              "Estadía en destino — Viví cada momento. Durante la estadía podrás disfrutar de las actividades, servicios y atractivos incluidos en tu paquete. El itinerario puede variar según condiciones del viaje."
          },
          {
            tipo: "itinerario-3",
            descripcion:
              "Día de regreso — Fin del viaje. Luego del check out y los procedimientos de regreso, emprendemos el retorno. Nuestro equipo te acompaña hasta el final del servicio."
          }
        ]
      }
    },
    {
      titulo: "Pinamar",
      slug: "pinamar",
      destinoId: pinamar.id,
      noches: 6,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 10,
      condiciones:
        "Habitación a compartir garantizada (dobles o triples). Cupos sujetos a disponibilidad.",
      destinos: {
        create: [{ destinoId: pinamar.id }]
      },
      precios: {
        create: [
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-01"),
            fechaFin: new Date("2026-02-01")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-06"),
            fechaFin: new Date("2026-02-06")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-13"),
            fechaFin: new Date("2026-02-13")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-20"),
            fechaFin: new Date("2026-02-20")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "detalle-programa", descripcion: "Pinamar" },
          { tipo: "detalle-destino", descripcion: "Pinamar" },
          { tipo: "detalle-duracion", descripcion: "07 noches / 06 noches" },
          {
            tipo: "detalle-transporte",
            descripcion: "Bus CAMA con servicio de snack a bordo"
          },
          { tipo: "detalle-hotel", descripcion: "Hotel Yarma" },
          { tipo: "detalle-servicios", descripcion: "Asistencia Médica" },
          {
            tipo: "detalle-servicios",
            descripcion: "Coordinación durante el viaje de ida y regreso"
          },
          {
            tipo: "detalle-salidas",
            descripcion:
              "Salidas: 01, 06, 13 y 20 de febrero. Salida especial 01/02 con 8 noches (regreso en bus)."
          },
          { tipo: "transporte", descripcion: "Bus CAMA con snack a bordo" },
          { tipo: "alojamiento", descripcion: "Hotel Yarma" },
          { tipo: "servicio", descripcion: "Asistencia médica incluida" },
          {
            tipo: "servicio",
            descripcion: "Coordinación durante ida y regreso"
          },
          {
            tipo: "itinerario-1",
            descripcion:
              "Día de salida — Comienza la experiencia. Nos reunimos en el punto de encuentro indicado para iniciar el viaje. Realizamos el check in correspondiente y emprendemos el traslado hacia el destino elegido."
          },
          {
            tipo: "itinerario-2",
            descripcion:
              "Estadía en destino — Viví cada momento. Durante la estadía podrás disfrutar de las actividades, servicios y atractivos incluidos en tu paquete. El itinerario puede variar según condiciones del viaje y preferencias del grupo."
          },
          {
            tipo: "itinerario-3",
            descripcion:
              "Día de regreso — Fin del viaje. Luego del check out y los procedimientos de regreso, emprendemos el retorno. Nuestro equipo te acompaña hasta el final del servicio."
          }
        ]
      }
    },
    {
      titulo: "Patagonia Fantastica",
      slug: "patagonia-fantastica",
      destinoId: puertoMadryn.id,
      noches: 9,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 8,
      condiciones:
        "Paquete grupal. Paquetes Sep a Nov 2026. Tarifa en base doble. 4 cuotas cero interes.",
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
    },
    {
      titulo: "Bariloche Aéreo 26",
      slug: "bariloche-aereo-26",
      destinoId: bariloche.id,
      noches: 6,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 9,
      condiciones:
        "Salida aérea a Bariloche. Promo especial 2x1 (solo aéreo) salida 24 de enero. Habitaciones a compartir garantizadas (dobles o triples). Cupos sujetos a disponibilidad. Los cupos aéreos incluyen estadía en cochera.",
      destinos: {
        create: [{ destinoId: bariloche.id }]
      },
      precios: {
        create: [
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-02-14"),
            fechaFin: new Date("2026-02-14")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-03-13"),
            fechaFin: new Date("2026-03-13")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-03-14"),
            fechaFin: new Date("2026-03-14")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-04-19"),
            fechaFin: new Date("2026-04-19")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-05-23"),
            fechaFin: new Date("2026-05-23")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-05-24"),
            fechaFin: new Date("2026-05-24")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-06-12"),
            fechaFin: new Date("2026-06-12")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-06-13"),
            fechaFin: new Date("2026-06-13")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-06-18"),
            fechaFin: new Date("2026-06-18")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-07-12"),
            fechaFin: new Date("2026-07-12")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "detalle-programa", descripcion: "Bariloche Aéreo 26" },
          {
            tipo: "detalle-destino",
            descripcion: "San Carlos de Bariloche"
          },
          {
            tipo: "detalle-duracion",
            descripcion: "07 días / 06 noches - 06 días / 05 noches"
          },
          {
            tipo: "detalle-transporte",
            descripcion: "Aéreo desde Córdoba volando por Aerolíneas Argentinas"
          },
          { tipo: "detalle-equipaje", descripcion: "Carry on" },
          {
            tipo: "detalle-hotel",
            descripcion: "Cadena Terra Cauchá / Kenton / Aspen / Eco Ski"
          },
          { tipo: "detalle-regimen", descripcion: "Desayuno" },
          { tipo: "detalle-excursiones", descripcion: "Trf in out" },
          {
            tipo: "detalle-asistencia",
            descripcion: "Nacional - Cobertura 2M"
          },
          {
            tipo: "detalle-salidas",
            descripcion:
              "Salidas: 14 de febrero; 13 y 14 de marzo; 19 de abril; 23 y 24 de mayo; 12, 13 y 18 de junio; 12 de julio"
          },
          {
            tipo: "transporte",
            descripcion: "Aéreos desde Córdoba con Aerolíneas Argentinas"
          },
          {
            tipo: "alojamiento",
            descripcion: "6 o 5 noches de alojamiento según salida"
          },
          { tipo: "comida", descripcion: "Régimen desayuno" },
          { tipo: "equipaje", descripcion: "Carry on incluido" },
          { tipo: "servicio", descripcion: "Traslados in/out" },
          {
            tipo: "servicio",
            descripcion: "Asistencia médica nacional con cobertura 2M"
          },
          {
            tipo: "itinerario-1",
            descripcion:
              "Día de salida — Comienza la experiencia. Nos reunimos en el punto de encuentro indicado para iniciar el viaje. Realizamos el check in correspondiente y emprendemos el traslado hacia el destino elegido. Nuestro equipo acompañará todo el proceso para que disfrutes desde el primer momento."
          },
          {
            tipo: "itinerario-2",
            descripcion:
              "Estadía en destino — Viví cada momento. Durante la estadía podrás disfrutar de las actividades, servicios y atractivos incluidos en tu paquete. El itinerario puede variar según condiciones del viaje y las preferencias del grupo, siempre priorizando tu seguridad y comodidad. Tiempo libre para aprovechar a tu manera y crear recuerdos únicos."
          },
          {
            tipo: "itinerario-3",
            descripcion:
              "Día de regreso — Fin del viaje, inicio de nuevos planes. Luego de los procedimientos de check out y embarque, emprendemos el retorno. Nuestro equipo te asistirá hasta el final del servicio. ¡Gracias por viajar con nosotros! Esperamos volver a acompañarte en tu próxima aventura."
          }
        ]
      }
    },
    {
      titulo: "Bariloche en mil colores",
      slug: "bariloche-en-mil-colores",
      destinoId: bariloche.id,
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 10,
      condiciones:
        "Paquete grupal. Paquetes Jul a Nov 2026. Tarifa en base doble. 4 cuotas cero interes.",
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
    },
    {
      titulo: "Cataratas Premium",
      slug: "cataratas-premium",
      destinoId: iguazu.id,
      noches: 3,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 11,
      condiciones:
        "Paquete grupal. Paquetes Jul a Dic 2026. Tarifa en base doble. 4 cuotas cero interes.",
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
    },
    {
      titulo: "Fórmula 1 por el mundo",
      slug: "formula-1-por-el-mundo",
      destinoId: formula1.id,
      noches: 0,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 12,
      condiciones: "Consultar por otras ubicaciones y horarios.",
      destinos: {
        create: [{ destinoId: formula1.id }]
      },
      precios: {
        create: [
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-05-01"),
            fechaFin: new Date("2026-05-03")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-06-05"),
            fechaFin: new Date("2026-06-07")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-07-03"),
            fechaFin: new Date("2026-07-05")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-09-04"),
            fechaFin: new Date("2026-09-06")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-09-11"),
            fechaFin: new Date("2026-09-13")
          },
          {
            precio: "0",
            moneda: "ARS",
            fechaInicio: new Date("2026-11-21"),
            fechaFin: new Date("2026-11-23")
          }
        ]
      },
      incluyeItems: {
        create: [
          {
            tipo: "detalle-programa",
            descripcion:
              "Miami — Gran Premio de Miami. Fecha del GP: 1-3 de mayo. 4 noches Hotel 4★ en Miami (30 abril al 4 mayo, solo alojamiento). Entradas 3 días al circuito."
          },
          {
            tipo: "detalle-tribunas",
            descripcion:
              "Miami — Tribunas: Beach Grandstand, Tribuna Turn 1, Tribuna Start/Finish, Tribuna Marina, Tribuna Turn 18."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "Las Vegas — Gran Premio de Las Vegas. Fecha del GP: 21-23 de noviembre. 4 noches Hotel Park MGM, Las Vegas (solo alojamiento del 18 al 22 de noviembre). Entradas viernes, sábado y domingo."
          },
          {
            tipo: "detalle-tribunas",
            descripcion:
              "Las Vegas — Tribunas: General admission Heineken South Koval, General admission T-Mobile Sphere, West Harmon Hamilton, Sphere Grandstand, Main Grandstand."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "Mónaco — Gran Premio de Mónaco. Fecha del GP: 5-7 de junio. 3 noches Hotel 3★ Campanile RIME - Nice Airport o similar (solo alojamiento del 5 al 8 de junio). Entrada al circuito."
          },
          {
            tipo: "detalle-tribunas",
            descripcion:
              "Mónaco — Sectores: Rocher (1, 2 o 3 días) y K (1, 2 o 3 días)."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "Madrid — Gran Premio de Madrid. Fecha del GP: 11-13 de septiembre. 3 noches Hotel 3★ Holiday Inn Alcorcón o similar con desayuno (11 al 14 de septiembre). Entrada al circuito."
          },
          {
            tipo: "detalle-tribunas",
            descripcion:
              "Madrid — Tribunas: Silver 7, Silver 12, Silver 16, Silver 13, Bronce 5."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "Italia — Gran Premio de Monza. Fecha del GP: 4-6 de septiembre. 4 noches Hotel 4★ Novotel Linate o similar con desayuno (3 al 7 de septiembre). Traslados al circuito y hotel. Entrada al circuito 3 días."
          },
          {
            tipo: "detalle-tribunas",
            descripcion:
              "Italia — Tribunas: General Admission Prato, Right lateral 26 A, Left lateral 26 A, Outer first variant B 8."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "Gran Bretaña — Gran Premio Silverstone. Fecha del GP: 3-5 de julio. 3 noches Hotel 4★ Novotel Leicester o similar con desayuno (3 al 6 de julio). Entrada al circuito 3 días."
          },
          {
            tipo: "detalle-tribunas",
            descripcion:
              "Gran Bretaña — Tribunas: General Admission, Abbey A, Hamilton Straight, Luffield, Vale, Woodcote."
          },
          {
            tipo: "detalle-notas",
            descripcion: "Consultar por otras ubicaciones y hoteles."
          },
          {
            tipo: "servicio",
            descripcion: "Entradas a los circuitos según programa."
          },
          {
            tipo: "alojamiento",
            descripcion: "Alojamiento en hoteles 3★/4★ según programa."
          },
          {
            tipo: "servicio",
            descripcion: "Programas sin aéreo (solo alojamiento)."
          },
          {
            tipo: "itinerario-1",
            descripcion:
              "Día de salida — Comienza la experiencia. Nos reunimos en el punto de encuentro indicado para iniciar el viaje. Realizamos el check in correspondiente y emprendemos el traslado hacia el destino elegido."
          },
          {
            tipo: "itinerario-2",
            descripcion:
              "Estadía en destino — Viví cada momento. Disfrutá de las actividades y del Gran Premio según el programa elegido. El itinerario puede variar según condiciones del viaje."
          },
          {
            tipo: "itinerario-3",
            descripcion:
              "Día de regreso — Fin del viaje. Luego del check out y los procedimientos de regreso, emprendemos el retorno. ¡Gracias por viajar con nosotros!"
          }
        ]
      }
    },
    {
      titulo: "Experiencia Mundial",
      slug: "experiencia-mundial",
      destinoId: experienciaMundial.id,
      noches: 0,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 13,
      condiciones:
        "Programas sujetos a disponibilidad. Fechas según fixture oficial.",
      destinos: {
        create: [{ destinoId: experienciaMundial.id }]
      },
      incluyeItems: {
        create: [
          {
            tipo: "detalle-programa",
            descripcion:
              "Experiencia Mundial (sin aéreo) — Kansas — 1 partido. Incluye traslados HTL/Estadio/HTL, 3 noches, entrada y asistencia al viajero."
          },
          {
            tipo: "detalle-entradas",
            descripcion:
              "Kansas — Tipo de entrada: Hotel 3★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual) y Hotel 4★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual)."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "Experiencia Mundial (sin aéreo) — Dallas — 2 partidos. Incluye traslados HTL/Estadio/HTL, kit del hincha, 8 noches, entradas y asistencia al viajero."
          },
          {
            tipo: "detalle-entradas",
            descripcion:
              "Dallas (2 partidos) — Tipo de entrada: Hotel 3★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual) y Hotel 4★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual)."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "Experiencia Mundial (sin aéreo) — 3 partidos de fase de grupos — Kansas / Dallas / Dallas. Incluye traslados HTL/Estadio/HTL, kit del hincha, 8 noches, entradas, asistencia al viajero y 1 cena especial."
          },
          {
            tipo: "detalle-entradas",
            descripcion:
              "Kansas + Dallas (3 partidos fase de grupos) — Tipo de entrada: Hotel 3★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual) y Hotel 4★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual)."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "Experiencia Completa — Kansas / Dallas / Dallas — 3 partidos de fase de grupos. Incluye aéreo internacional, traslados IN/OUT hotel - estadio - hotel entre sedes, kit del hincha, alojamiento por 13 noches, entradas, asistencia al viajero y 1 cena especial."
          },
          {
            tipo: "detalle-entradas",
            descripcion:
              "Experiencia Completa (3 partidos) — Tipo de entrada: Hotel 3★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual) y Hotel 4★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual)."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "3 partidos en Dallas + llaves. Incluye traslados hotel/estadio/hotel, kit del hincha, alojamiento por 8 noches, entradas y asistencia al viajero."
          },
          {
            tipo: "detalle-entradas",
            descripcion:
              "Dallas + llaves — Tipo de entrada: Hotel 3★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual) y Hotel 4★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual)."
          },
          {
            tipo: "detalle-programa",
            descripcion:
              "Llaves de final — 1 partido. Incluye traslados hotel/estadio/hotel, alojamiento por 3 noches, entrada al partido y asistencia al viajero."
          },
          {
            tipo: "detalle-entradas",
            descripcion:
              "Llaves de final — Tipo de entrada: Hotel 3★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual) y Hotel 4★ (Cat. 3 / Cat. 2 / Cat. 1 / Suplemento individual)."
          },
          {
            tipo: "detalle-salidas",
            descripcion: "Fechas según fixture oficial."
          },
          {
            tipo: "servicio",
            descripcion: "Traslados hotel/estadio/hotel según programa."
          },
          {
            tipo: "servicio",
            descripcion: "Entradas a los partidos según categoría."
          },
          {
            tipo: "alojamiento",
            descripcion: "Hoteles 3★ o 4★ según programa."
          },
          {
            tipo: "servicio",
            descripcion: "Kit del hincha (según programa)."
          },
          {
            tipo: "servicio",
            descripcion: "Asistencia al viajero."
          },
          {
            tipo: "itinerario-1",
            descripcion:
              "Día de salida — Comienza la experiencia. Nos reunimos en el punto de encuentro indicado para iniciar el viaje. Realizamos el check in correspondiente y emprendemos el traslado hacia el destino elegido."
          },
          {
            tipo: "itinerario-2",
            descripcion:
              "Estadía en destino — Viví cada momento. Disfrutá de los partidos y actividades incluidas según el programa elegido."
          },
          {
            tipo: "itinerario-3",
            descripcion:
              "Día de regreso — Fin del viaje. Luego del check out y los procedimientos de regreso, emprendemos el retorno. ¡Gracias por viajar con nosotros!"
          }
        ]
      }
    }
  ];

  for (const oferta of salidasGrupales) {
    await prisma.oferta.create({ data: oferta });
  }

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

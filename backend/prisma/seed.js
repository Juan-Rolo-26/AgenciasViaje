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
      titulo: "Charter Porto de Galinhas 2026",
      slug: "charter-porto-galinhas-2026",
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

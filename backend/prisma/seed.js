const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const PAYMENT_RESERVATION_HEADING_KEYWORDS = [
  "condiciones de reserva y formas de pago",
  "condiciones de reserva",
  "reserva y pagos",
  "formas de pago",
  "metodos de pago",
  "medios de pago"
];
const MARKDOWN_HEADING_PATTERN = /^\s{0,3}(#{1,6})\s+(.*)$/;
const PRICE_AMOUNT_PATTERN = /(?:\$|u\$s|usd|ars|r\$)\s*[\d.,]+/i;
const PRICE_KEYWORD_PATTERN =
  /\b(?:dbl|sgl|slg|tpl|chd|neto|iva|impuesto|impuestos|precio|precios|tarifa|tarifas|total|final)\b/i;
const BUTACA_ADDON_PATTERN =
  /\bbutaca\b.*\b(cama|panoramica|cafetera)\b|\b(cama|panoramica|cafetera)\b.*\bbutaca\b/i;

function normalizeMarkdownText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function stripMarkdownSectionsByKeywords(markdown, keywords) {
  if (!markdown) return "";

  const normalizedKeywords = (keywords || [])
    .map((keyword) => normalizeMarkdownText(keyword).trim())
    .filter(Boolean);

  if (!normalizedKeywords.length) return String(markdown);

  const lines = String(markdown).split("\n");
  const output = [];
  let skipLevel = null;

  for (const line of lines) {
    const headingMatch = line.match(MARKDOWN_HEADING_PATTERN);

    if (skipLevel !== null) {
      if (headingMatch) {
        const currentLevel = headingMatch[1].length;
        if (currentLevel <= skipLevel) {
          skipLevel = null;
        } else {
          continue;
        }
      } else {
        continue;
      }
    }

    if (headingMatch) {
      const headingLevel = headingMatch[1].length;
      const headingText = normalizeMarkdownText(headingMatch[2]);
      if (normalizedKeywords.some((keyword) => headingText.includes(keyword))) {
        skipLevel = headingLevel;
        continue;
      }
    }

    output.push(line);
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function stripEmptyMarkdownHeadings(markdown) {
  if (!markdown) return "";

  const lines = String(markdown).split("\n");
  const headingIndexes = [];

  lines.forEach((line, index) => {
    if (MARKDOWN_HEADING_PATTERN.test(line)) headingIndexes.push(index);
  });

  const keep = new Array(lines.length).fill(true);

  for (let i = 0; i < headingIndexes.length; i += 1) {
    const start = headingIndexes[i] + 1;
    const end = i + 1 < headingIndexes.length ? headingIndexes[i + 1] : lines.length;
    const hasContent = lines.slice(start, end).some((line) => line.trim());
    if (!hasContent) {
      keep[headingIndexes[i]] = false;
    }
  }

  return lines
    .filter((_, index) => keep[index])
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function removePaymentReservationSections(markdown) {
  return stripMarkdownSectionsByKeywords(
    markdown,
    PAYMENT_RESERVATION_HEADING_KEYWORDS
  );
}

function hasPriceSignals(text) {
  if (!text) return false;
  const value = String(text);
  const normalized = normalizeMarkdownText(value);

  return (
    PRICE_AMOUNT_PATTERN.test(value) ||
    PRICE_AMOUNT_PATTERN.test(normalized) ||
    PRICE_KEYWORD_PATTERN.test(normalized) ||
    BUTACA_ADDON_PATTERN.test(normalized)
  );
}

function stripMarkdownLinesWithPriceSignals(markdown) {
  if (!markdown) return "";

  const stripped = String(markdown)
    .split("\n")
    .filter((line) => !hasPriceSignals(line))
    .join("\n");

  return stripEmptyMarkdownHeadings(stripped);
}

function sanitizeOfertaText(markdown) {
  if (!markdown) return "";
  const withoutPaymentSections = removePaymentReservationSections(markdown);
  return stripMarkdownLinesWithPriceSignals(withoutPaymentSections);
}

function sanitizeIncluyeItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item) return null;

      const nextTipo = stripMarkdownLinesWithPriceSignals(item.tipo || "");
      const nextDescripcion = stripMarkdownLinesWithPriceSignals(item.descripcion || "");

      if (!nextTipo && !nextDescripcion) return null;
      if (!nextDescripcion) return null;

      return {
        ...item,
        tipo: nextTipo || item.tipo || "Servicio",
        descripcion: nextDescripcion
      };
    })
    .filter(Boolean);
}

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
        "/assets/destinos/misiones1 (2).png",
        "/assets/destinos/misiones3.png",
        "/assets/destinos/misiones4.jpg"
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
        "/assets/destinos/pinamar3.png"
      ],
      destacado: true,
      orden: 8
    },
    {
      nombre: "Salta",
      slug: "salta",
      paisRegion: "Argentina",
      descripcionCorta: "Colonial, valles y tradición folclórica.",
      descripcion:
        "Vive la energía de Salta, la Linda: una ciudad que enamora con su arquitectura colonial perfectamente preservada y su alma de peña folclórica. Recorre la Plaza 9 de Julio, sube al Cerro San Bernardo para una vista panorámica única y déjate llevar por la magia de los Valles Calchaquíes. Un destino donde el vino torrontés de Cafayate, la historia del Tren a las Nubes y la hospitalidad de su gente crean un viaje inolvidable para todos los sentidos.",
      imagenPortada: "/assets/destinos/salta1.jpg",
      imagenes: [
        "/assets/destinos/salta.jpg",
        "/assets/destinos/salta2.jpg",
        "/assets/destinos/salta4.jpg"
      ],
      destacado: true,
      orden: 68
    },
    {
      nombre: "Jujuy",
      slug: "jujuy",
      paisRegion: "Argentina",
      descripcionCorta: "Quebradas, cerros de colores y salinas.",
      descripcion:
        "Vive la energía de Jujuy: un lienzo de colores naturales que desafía la imaginación. Descubre la majestuosidad de la Quebrada de Humahuaca, maravíllate con el Cerro de los Siete Colores en Purmamarca y explora la inmensidad blanca de las Salinas Grandes. Un destino de raíces profundas, donde los mercados artesanales, las tradiciones milenarias y paisajes como las Serranías del Hornocal te conectan con la esencia más pura de la Puna argentina.",
      imagenPortada: "/assets/destinos/jujuy1.webp",
      imagenes: [
        "/assets/destinos/jujuy.jpg",
        "/assets/destinos/jujuy2.jpg",
        "/assets/destinos/jujuy3.jpg"
      ],
      destacado: true,
      orden: 69
    },
    {
      nombre: "Las Grutas",
      slug: "las-grutas",
      paisRegion: "Argentina",
      descripcionCorta: "Aguas cálidas y acantilados patagónicos.",
      descripcion:
        "Vive la energía de Las Grutas: el paraíso de aguas cálidas en pleno corazón de la Patagonia. Descubre sus famosas cuevas naturales excavadas en los acantilados por el mar y disfruta de playas extensas de arenas blancas y aguas cristalinas. Con un microclima privilegiado que invita al relax y la aventura náutica, Las Grutas es el destino ideal para quienes buscan la combinación perfecta entre la paz del océano y la calidez de un balneario único en el sur argentino.",
      imagenPortada: "/assets/destinos/lasgrutas.jpg",
      imagenes: [
        "/assets/destinos/lasgrutas2.jpg",
        "/assets/destinos/lasgrutas3.jpg",
        "/assets/destinos/lasgrutas4.webp"
      ],
      destacado: true,
      orden: 70
    },
    {
      nombre: "Perito Moreno",
      slug: "perito-moreno",
      paisRegion: "Argentina",
      descripcionCorta: "Glaciar imponente y naturaleza patagónica.",
      descripcion:
        "Vive la energía del Glaciar Perito Moreno: un gigante de hielo milenario que te dejará sin aliento. Maravíllate con sus paredes de un azul profundo que se elevan más de 60 metros sobre el Lago Argentino y vive la adrenalina de escuchar el estruendo de sus desprendimientos naturales. Ya sea recorriendo sus pasarelas con vistas panorámicas únicas o navegando frente a sus torres de hielo, este monumento natural es una de las experiencias más puras y poderosas que la naturaleza puede ofrecer en el corazón de la Patagonia.",
      imagenPortada: "/assets/destinos/peritomoreno1.jpg",
      imagenes: [
        "/assets/destinos/peritomoreno2.jpg",
        "/assets/destinos/peritomoreno3.jpg",
        "/assets/destinos/peritomoreno4.jpg"
      ],
      destacado: true,
      orden: 71
    },
    {
      nombre: "Neuquén",
      slug: "neuquen",
      paisRegion: "Argentina",
      descripcionCorta: "Ruta de los lagos y paisajes patagónicos.",
      descripcion:
        "Vive la energía de Neuquén: el portal de entrada a una tierra de contrastes infinitos y naturaleza indómita. Descubre la majestuosidad de la Ruta de los Siete Lagos, maravíllate con la inmensidad del Volcán Lanín y recorre los valles donde alguna vez habitaron los dinosaurios más grandes del mundo. Un destino que combina la sofisticación de sus ciudades, la calidez de sus aldeas de montaña y paisajes que van desde estepas milenarias hasta bosques de araucarias prehistóricas.",
      imagenPortada: "/assets/destinos/neuquen.jpg",
      imagenes: [
        "/assets/destinos/neuquen2.jpg",
        "/assets/destinos/neuquen3.jpg",
        "/assets/destinos/neuquen4.jpg"
      ],
      destacado: true,
      orden: 72
    },

    // ================= BRASIL =================
    {
      nombre: "Río de Janeiro",
      slug: "rio-de-janeiro",
      paisRegion: "Brasil",
      descripcionCorta: "Playas icónicas y energía vibrante.",
      descripcion:
        "Vive la energía de Río de Janeiro: la Ciudad Maravillosa que vibra entre el mar y la montaña. Desde la mística del Cristo Redentor y el Pan de Azúcar hasta el ritmo del samba en sus calles y las playas legendarias de Copacabana e Ipanema. Un destino icónico que combina cultura, historia y una naturaleza exuberante sin igual.",
      imagenPortada: "/assets/destinos/rio_new.png",
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
        "/assets/destinos/Canasvieras 2.jpg"
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
        "Vive la energía de Balneário Camboriú: el Miami brasileño que deslumbra con su skyline de rascacielos frente al mar. Disfruta de sus playas urbanas de arena fina, sube al famoso teleférico Parque Unipraias para vistas panorámicas de 360°, y vive la modernidad de su costanera llena de vida. Un destino vibrante que combina playa, gastronomía internacional, centros comerciales de primer nivel y una vida nocturna que nunca duerme. Ideal para quienes buscan la energía de una ciudad cosmopolita con el encanto del litoral catarinense.",
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
      nombre: "Bombas",
      slug: "bombas",
      paisRegion: "Brasil",
      descripcionCorta: "Playa familiar y costanera moderna.",
      descripcion:
        "Vive la energía de Bombas: el refugio ideal para la familia en el sur de Brasil. Disfruta de una playa de arenas blancas y aguas mansas, perfectas para nadar y practicar deportes náuticos. Con su moderna costanera renovada, ideal para caminatas al atardecer, y una infraestructura completa de servicios y gastronomía, Bombas ofrece el equilibrio perfecto entre la serenidad del mar y la comodidad urbana.",
      imagenPortada: "/assets/destinos/bombas.jpg",
      imagenes: [
        "/assets/destinos/Bombas2.jpg",
        "/assets/destinos/Bombas3.jpg",
        "/assets/destinos/Bombas4.jpg"
      ],
      destacado: false,
      orden: 11
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
    {
      nombre: "Maragogi",
      slug: "maragogi",
      paisRegion: "Brasil",
      descripcionCorta: "Caribe brasileño y piscinas naturales.",
      descripcion:
        "Vive la energía de Maragogi: el verdadero Caribe del Nordeste brasileño. Déjate maravillar por sus famosas \"Galés\", piscinas naturales de aguas turquesas y cristalinas que se forman entre arrecifes de coral a pocos kilómetros de la costa. Un destino paradisíaco de arenas blancas y cocoteros infinitos, ideal para quienes buscan sumergirse en un acuario natural y disfrutar de la paz absoluta en un entorno tropical virgen.",
      imagenPortada: "/assets/destinos/maragoggi.jpeg",
      imagenes: [
        "/assets/destinos/maragoggi1.jpg",
        "/assets/destinos/maragoggi2.jpg",
        "/assets/destinos/maragoggi3.jpg"
      ],
      destacado: true,
      orden: 18
    },
    {
      nombre: "Angra dos Reis",
      slug: "angra-dos-reis",
      paisRegion: "Brasil",
      descripcionCorta: "Islas verdes y aguas cristalinas.",
      descripcion:
        "Vive la energía de Angra dos Reis: un universo de islas verdes y aguas cristalinas en el corazón de la Costa Verde. Navega por sus bahías legendarias, descubre playas vírgenes accesibles solo por mar y sumérgete en la rica biodiversidad de la Ilha Grande. Un destino náutico de primer nivel que combina el lujo de sus resorts con la aventura de explorar un paraíso tropical donde la selva abraza al océano en cada una de sus 365 islas.",
      imagenPortada: "/assets/destinos/angra1.jpg",
      imagenes: [
        "/assets/destinos/angra2.jpg",
        "/assets/destinos/angra3.webp",
        "/assets/destinos/angra4.jpg"
      ],
      destacado: true,
      orden: 19
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
        "Vive la energía de Roma: la Ciudad Eterna donde el tiempo parece haberse detenido. Camina entre las ruinas del imponente Coliseo, maravíllate con la espiritualidad del Vaticano y vive la tradición de la Fontana di Trevi. Un destino que es un museo a cielo abierto, combinando historia milenaria, plazas vibrantes y la esencia de la mejor gastronomía italiana.",
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
      imagenPortada: "/assets/destinos/madrid.jpg",
      imagenes: [
        "/assets/destinos/madrid2.jpg",
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
        "/assets/destinos/china4.jpg"
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
        "/assets/destinos/londres2.webp",
        "/assets/destinos/londres3.jpg",
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
        "/assets/destinos/praga3.jpg"
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
      nombre: "México",
      slug: "mexico",
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
      nombre: "Costa Dorada (Australia)",
      slug: "costa-dorada",
      paisRegion: "Australia",
      descripcionCorta: "Surf, playas doradas y entretenimiento.",
      descripcion:
        "Vive la energía de la Costa Dorada: el paraíso de los surfistas y el entretenimiento bajo el sol australiano. Disfruta de kilómetros de playas doradas, olas perfectas en Surfers Paradise y una vibrante vida nocturna rodeada de rascacielos frente al mar. Un destino que combina parques temáticos de clase mundial, selvas tropicales cercanas y una atmósfera moderna y relajada que captura la esencia pura del verano eterno.",
      imagenPortada: "/assets/destinos/costadorada1.jpg",
      imagenes: [
        "/assets/destinos/costadorada2.jpg",
        "/assets/destinos/costadorada3.jpg",
        "/assets/destinos/costadorada4.webp"
      ],
      destacado: true,
      orden: 83
    },
    {
      nombre: "Cancún",
      slug: "cancun",
      paisRegion: "México",
      descripcionCorta: "Caribe turquesa y resorts de lujo.",
      descripcion:
        "Vive la energía de Cancún: el portal de entrada al mundo maya y las aguas más azules del Caribe. Disfruta de una infraestructura hotelera de lujo, playas de arena blanca que parecen talco y una vida nocturna legendaria. Un destino que te permite combinar el relax total en sus resorts con la exploración de arrecifes de coral, cenotes sagrados y la majestuosidad de las zonas arqueológicas cercanas.",
      imagenPortada: "/assets/destinos/cancun1.webp",
      imagenes: [
        "/assets/destinos/cancun2.jpg",
        "/assets/destinos/cancun3.jpg",
        "/assets/destinos/cancun4.jpg"
      ],
      destacado: true,
      orden: 84
    },
    {
      nombre: "Aruba",
      slug: "aruba",
      paisRegion: "Aruba",
      descripcionCorta: "Sol eterno y playas serenas.",
      descripcion:
        "Vive la energía de Aruba: la \"Isla Feliz\" donde el sol brilla todo el año y la brisa marina te acompaña siempre. Camina por la famosa Eagle Beach, asómbrate con sus paisajes desérticos llenos de cactus frente al océano y disfruta de una cultura multicultural encantadora. Un destino seguro, sofisticado y de aguas calmas, ideal para quienes buscan el equilibrio perfecto entre lujo, romance y aventura.",
      imagenPortada: "/assets/destinos/aruba1.jpg",
      imagenes: [
        "/assets/destinos/aruba2.jpg",
        "/assets/destinos/aruba3.png",
        "/assets/destinos/aruba4.webp"
      ],
      destacado: true,
      orden: 85
    },
    {
      nombre: "Curazao",
      slug: "curazao",
      paisRegion: "Curazao",
      descripcionCorta: "Caribe holandés y colores vibrantes.",
      descripcion:
        "Vive la energía de Curazao: una joya del Caribe con alma europea y colores vibrantes. Recorre las icónicas fachadas coloniales de Willemstad, Patrimonio de la Humanidad, y descubre caletas escondidas de aguas turquesas entre acantilados. Un destino que enamora con su mezcla única de herencia holandesa, playas vírgenes ideales para el snorkel y una atmósfera auténtica y relajada.",
      imagenPortada: "/assets/destinos/curazao1.webp",
      imagenes: [
        "/assets/destinos/curazao2.jpg",
        "/assets/destinos/curazao3.webp",
        "/assets/destinos/curazao4.webp"
      ],
      destacado: true,
      orden: 86
    },
    {
      nombre: "Panamá",
      slug: "panama",
      paisRegion: "Panamá",
      descripcionCorta: "Canal, historia y compras internacionales.",
      descripcion:
        "Vive la energía de Panamá: el puente del mundo donde la ingeniería moderna se cruza con la selva virgen. Maravíllate con el Canal de Panamá, recorre el casco antiguo lleno de historia colonial y disfruta de un paraíso de compras internacionales. Un destino de contrastes fascinantes que ofrece desde islas paradisíacas en Bocas del Toro hasta el skyline más impresionante de Centroamérica.",
      imagenPortada: "/assets/destinos/panama1.jpg",
      imagenes: [
        "/assets/destinos/panama2.jpg",
        "/assets/destinos/panama3.webp",
        "/assets/destinos/panama4.webp"
      ],
      destacado: true,
      orden: 87
    },
    {
      nombre: "Playa del Carmen",
      slug: "playa-del-carmen",
      paisRegion: "México",
      descripcionCorta: "Quinta Avenida y Riviera Maya.",
      descripcion:
        "Vive la energía de Playa del Carmen: el corazón vibrante de la Riviera Maya. Camina por la famosa Quinta Avenida con su mezcla inmejorable de tiendas, bares y cultura, y disfruta de sus clubes de playa con vista al azul turquesa del Caribe. Un destino cosmopolita y estratégico que combina el encanto de un pueblo costero con la sofisticación moderna, ideal para explorar los parques naturales, los cenotes y la mística de las ruinas mayas cercanas.",
      imagenPortada: "/assets/destinos/playadelcarmen1.webp",
      imagenes: [
        "/assets/destinos/playadelcarmen2.jpg",
        "/assets/destinos/playadelcarmen3.jpg",
        "/assets/destinos/playadelcarmen4.jpg"
      ],
      destacado: true,
      orden: 88
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
      nombre: "Punta del Este",
      slug: "punta-del-este",
      paisRegion: "Uruguay",
      descripcionCorta: "Playa, glamour y la perla del Atlántico.",
      descripcion:
        "Vive la energía de Punta del Este: el epicentro del glamour y la sofisticación en el Atlántico. Desde la icónica escultura de 'Los Dedos' en la Playa Brava hasta los atardeceres mágicos en Casapueblo. Disfruta de sus puertos deportivos, sus tiendas de lujo en la Calle 20 y la vibrante vida nocturna de La Barra. Un destino de clase mundial que combina playas serenas con la mejor gastronomía y una arquitectura de vanguardia que enamora a visitantes de todo el mundo.",
      imagenPortada: "/assets/destinos/puntadeleste1.jpg",
      imagenes: [
        "/assets/destinos/puntadeleste2.jpg",
        "/assets/destinos/puntadeleste3.png",
        "/assets/destinos/puntadeleste4.jpg"
      ],
      destacado: true,
      orden: 3
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
        "/assets/destinos/mundia2.jpg",
        "/assets/destinos/mundial3.webp"
      ],
      destacado: true,
      orden: 59
    },
    {
      nombre: "La Finalisima",
      slug: "la-finalisima",
      paisRegion: "Programas y eventos",
      descripcionCorta: "El duelo definitivo entre campeones.",
      descripcion:
        "Vive la energía de La Finalisima: el duelo definitivo entre los dueños del fútbol. Sé testigo del choque histórico entre el Campeón de América y el Campeón de Europa en una batalla épica por la supremacía mundial. Un evento único, cargado de mística y estrellas internacionales, donde la pasión de las hinchadas y el prestigio continental se encuentran en un solo partido para coronar al mejor de los mejores. ¡Una oportunidad irrepetible para vivir la historia del fútbol desde la tribuna!",
      imagenPortada: "/assets/destinos/finalisima.png",
      imagenes: [
        "/assets/destinos/finalisima2.png",
        "/assets/destinos/finalisima3.png",
        "/assets/destinos/finalisima4.png"
      ],
      destacado: true,
      orden: 60
    },
    {
      nombre: "Bolivia",
      slug: "bolivia",
      paisRegion: "Bolivia",
      descripcionCorta: "Paisajes surrealistas y tradiciones andinas.",
      descripcion:
        "Vive la energía de Bolivia: un destino de paisajes surrealistas y tradiciones ancestrales que laten en lo más alto de los Andes. Déjate maravillar por la inmensidad del Salar de Uyuni, donde el cielo y la tierra se confunden, y navega por las aguas sagradas del Lago Titicaca. Desde la vibrante y vertiginosa La Paz con sus teleféricos, hasta la historia colonial de Sucre y Potosí, Bolivia te invita a un viaje auténtico al corazón de la cultura sudamericana.",
      imagenPortada: "/assets/destinos/bolivia1.jpg",
      imagenes: [
        "/assets/destinos/bolivia2.jpg",
        "/assets/destinos/bolivia3.webp",
        "/assets/destinos/bolivia4.jpg"
      ],
      destacado: true,
      orden: 66
    },
    {
      nombre: "Madrid",
      slug: "madrid",
      paisRegion: "España",
      descripcionCorta: "Arte, historia y vida nocturna vibrante.",
      descripcion: "La capital española, famosa por sus museos, el Palacio Real y su inagotable energía.",
      imagenPortada: "/assets/destinos/madrid.jpg",
      imagenes: [
        "/assets/destinos/madrid2.jpg",
        "/assets/destinos/madrid3.jpg",
        "/assets/destinos/madrid4.jpeg"
      ],
      destacado: true,
      orden: 70
    },
    {
      nombre: "Barcelona",
      slug: "barcelona",
      paisRegion: "España",
      descripcionCorta: "Arquitectura de Gaudí y playas mediterráneas.",
      descripcion: "Una ciudad cosmopolita conocida por su arte y arquitectura, la Sagrada Familia y el Parque Güell.",
      imagenPortada: "/assets/destinos/barcelona.jpg",
      imagenes: [
        "/assets/destinos/barcelona2.jpg",
        "/assets/destinos/barcelona3.jpg",
        "/assets/destinos/barcelona4.webp"
      ],
      destacado: true,
      orden: 71
    },
    {
      nombre: "París",
      slug: "paris",
      paisRegion: "Francia",
      descripcionCorta: "La ciudad de la luz y el amor.",
      descripcion: "Hogar de la Torre Eiffel, el Louvre y la moda mundial, París es un centro global de arte y cultura.",
      imagenPortada: "/assets/destinos/Paris1.webp",
      imagenes: [
        "/assets/destinos/paris2.jpg",
        "/assets/destinos/paris3.jpg",
        "/assets/destinos/paris4.jpg"
      ],
      destacado: true,
      orden: 72
    },
    {
      nombre: "Londres",
      slug: "londres",
      paisRegion: "Reino Unido",
      descripcionCorta: "Historia real y modernidad icónica.",
      descripcion: "Desde el Big Ben hasta el London Eye, Londres es una metrópolis diversa llena de historia.",
      imagenPortada: "/assets/destinos/londres.jpg",
      imagenes: [
        "/assets/destinos/londres2.jpg",
        "/assets/destinos/londres3.jpeg",
        "/assets/destinos/londres4.jpg"
      ],
      destacado: true,
      orden: 73
    },
    {
      nombre: "Venecia",
      slug: "venecia",
      paisRegion: "Italia",
      descripcionCorta: "Canales románticos y arquitectura única.",
      descripcion: "La ciudad de los canales, famosa por sus góndolas, la Plaza de San Marcos y su atmósfera única.",
      imagenPortada: "/assets/destinos/venecia.jpg",
      imagenes: [
        "/assets/destinos/venecia2.jpg",
        "/assets/destinos/venecia3.jpg"
      ],
      destacado: true,
      orden: 74
    },
    {
      nombre: "Florencia",
      slug: "florencia",
      paisRegion: "Italia",
      descripcionCorta: "Cuna del Renacimiento.",
      descripcion: "Hogar de obras maestras del arte y la arquitectura renacentista, como el Duomo y el David de Miguel Ángel.",
      imagenPortada: "/assets/destinos/florencia.jpg",
      imagenes: [
        "/assets/destinos/florencia2.jpg",
        "/assets/destinos/florencia3.jpg",
        "/assets/destinos/florencia4.jpg"
      ],
      destacado: true,
      orden: 75
    },
    {
      nombre: "Roma",
      slug: "roma",
      paisRegion: "Italia",
      descripcionCorta: "La Ciudad Eterna.",
      descripcion: "Capital de Italia, famosa por su historia antigua, el Coliseo y la Ciudad del Vaticano.",
      imagenPortada: "/assets/destinos/roma.jpg",
      imagenes: [
        "/assets/destinos/roma2.jpg",
        "/assets/destinos/roma3.jpg",
        "/assets/destinos/roma4.jpg"
      ],
      destacado: true,
      orden: 76
    },
    {
      nombre: "Catamarca",
      slug: "catamarca",
      paisRegion: "Argentina",
      descripcionCorta: "Paisajes lunares y horizontes infinitos en la Puna.",
      descripcion: "Vive la energía de Catamarca: un destino de paisajes lunares y horizontes infinitos en el corazón de la Puna. Déjate asombrar por el blanco radiante del Campo de Piedra Pómez, recorre la mística Ruta del Adobe y maravíllate con la inmensidad de los Seis Miles, las cumbres más altas de los Andes. Un viaje al silencio y la grandeza de la naturaleza, donde los volcanes, las lagunas de colores y la calidez de sus pueblos te ofrecen una experiencia de aventura y paz absoluta.",
      imagenPortada: "/assets/destinos/catamarca1.jpg",
      imagenes: [
        "/assets/destinos/catamarca2.jpg",
        "/assets/destinos/catamarca3.jpg",
        "/assets/destinos/catamarca4.jpg"
      ],
      destacado: true,
      orden: 80
    },
    {
      nombre: "Turquía",
      slug: "turquia",
      paisRegion: "Turquía",
      descripcionCorta: "Oriente y Occidente en perfecta armonía.",
      descripcion:
        "Vive la energía de Turquía: el puente mágico donde Oriente se abraza con Occidente. Déjate cautivar por la majestuosidad de las mezquitas de Estambul, navega por el Bósforo y descubre los paisajes lunares de Capadocia desde un globo al amanecer. Un destino que despierta todos los sentidos con sus bazares aromáticos, sus ciudades subterráneas y una historia que respira en cada rincón, desde los palacios otomanos hasta las ruinas de Éfeso.",
      imagenPortada: "/assets/destinos/turquia.jpg",
      imagenes: [
        "/assets/dubai.jpg",
        "/assets/destinos/turquia2.jpg",
        "/assets/destinos/turquia3.jpg",
        "/assets/destinos/turquia4.jpg"
      ],
      destacado: true,
      orden: 81
    },
    {
      nombre: "Islas Griegas",
      slug: "islas-griegas",
      paisRegion: "Grecia",
      descripcionCorta: "Cúpulas azules y atardeceres sobre el Egeo.",
      descripcion:
        "Vive la energía de las Islas Griegas: un paraíso de casas blancas y cúpulas azules que brillan sobre el mar Egeo. Disfruta de los atardeceres legendarios de Santorini, la vibrante vida nocturna de Mykonos y la rica historia de Creta. Un destino de ensueño donde el tiempo se detiene entre aguas cristalinas, playas de arena volcánica y la calidez de la hospitalidad mediterránea en su máxima expresión.",
      imagenPortada: "/assets/destinos/islasgriegas1.webp",
      imagenes: [
        "/assets/destinos/islasgriegas2.jpg",
        "/assets/destinos/islasgriegas3.jpg",
        "/assets/destinos/islasgriegas4.webp"
      ],
      destacado: true,
      orden: 82
    }
  ];

  for (const destino of destinosData) {
    const created = await prisma.destino.upsert({
      where: { slug: destino.slug },
      update: {
        nombre: destino.nombre,
        paisRegion: destino.paisRegion,
        descripcionCorta: destino.descripcionCorta,
        descripcion: destino.descripcion,
        imagenPortada: destino.imagenPortada,
        destacado: destino.destacado,
        orden: destino.orden
      },
      create: {
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

    // Delete existing images to avoid duplicates or stale data
    await prisma.imagenDestino.deleteMany({
      where: { destinoId: created.id }
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
  const finalisima = destinosList.find((item) => item.slug === "la-finalisima");
  const canasvieiras = destinosList.find((item) => item.slug === "canasvieiras");
  const camboriu = destinosList.find((item) => item.slug === "camboriu");
  const bombinhas = destinosList.find((item) => item.slug === "bombinhas");
  const ferrugem = destinosList.find((item) => item.slug === "ferrugem");
  const garopaba = destinosList.find((item) => item.slug === "garopaba");
  const laguna = destinosList.find((item) => item.slug === "laguna");
  const itapema = destinosList.find((item) => item.slug === "itapema");
  const portoGalinhas = destinosList.find((item) => item.slug === "porto-galinhas");
  const angra = destinosList.find((item) => item.slug === "angra-dos-reis");
  const torres = destinosList.find((item) => item.slug === "torres");
  const bariloche = destinosList.find((item) => item.slug === "bariloche");
  const neuquen = destinosList.find((item) => item.slug === "neuquen");
  const calafate = destinosList.find((item) => item.slug === "el-calafate");
  const iguazu = destinosList.find((item) => item.slug === "cataratas-del-iguazu");
  const ushuaia = destinosList.find((item) => item.slug === "ushuaia");
  const puertoMadryn = destinosList.find((item) => item.slug === "puerto-madryn");
  const lima = destinosList.find((item) => item.slug === "lima");
  const cordoba = destinosList.find((item) => item.slug === "cordoba");
  const peritoMoreno = destinosList.find((item) => item.slug === "perito-moreno");
  const santiagoChile = destinosList.find((item) => item.slug === "santiago-de-chile");
  const maragogi = destinosList.find((item) => item.slug === "maragogi");
  const caboSantoAgostinho = destinosList.find((item) => item.slug === "cabo-de-santo-agostinho");
  const colombia = destinosList.find((item) => item.slug === "colombia");
  const mexico = destinosList.find((item) => item.slug === "mexico");
  const cuba = destinosList.find((item) => item.slug === "cuba");
  const salta = destinosList.find((item) => item.slug === "salta");
  const jujuy = destinosList.find((item) => item.slug === "jujuy");
  const lasGrutas = destinosList.find((item) => item.slug === "las-grutas");

  const cusco = destinosList.find((item) => item.slug === "cusco");
  const bolivia = destinosList.find((item) => item.slug === "bolivia");
  const madrid = destinosList.find((item) => item.slug === "madrid");
  const barcelona = destinosList.find((item) => item.slug === "barcelona");
  const paris = destinosList.find((item) => item.slug === "paris");
  const londres = destinosList.find((item) => item.slug === "londres");
  const venecia = destinosList.find((item) => item.slug === "venecia");
  const florencia = destinosList.find((item) => item.slug === "florencia");
  const roma = destinosList.find((item) => item.slug === "roma");
  const amsterdam = destinosList.find((item) => item.slug === "amsterdam");
  const costaRica = destinosList.find((item) => item.slug === "costa-rica");
  const turquia = destinosList.find((item) => item.slug === "turquia");
  const islasGriegas = destinosList.find((item) => item.slug === "islas-griegas");
  const dubai = destinosList.find((item) => item.slug === "dubai");
  const praga = destinosList.find((item) => item.slug === "praga");

  const actividades = await prisma.actividad.createMany({
    data: [
      {
        nombre: "Capilla del Monte - Valle de Punilla",
        slug: "capilla-del-monte-valle-de-punilla",
        destinoId: cordoba.id,
        tipoActividad: "Excursión día completo",
        fecha: new Date("2026-06-14"),
        hora: "08:30",
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
        fecha: new Date("2026-06-21"),
        hora: "08:00",
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
        fecha: new Date("2026-06-28"),
        hora: "07:30",
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
        fecha: new Date("2026-07-05"),
        hora: "09:00",
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
        fecha: new Date("2026-07-12"),
        hora: "07:45",
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
        fecha: new Date("2026-07-19"),
        hora: "08:15",
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
        fecha: new Date("2026-07-26"),
        hora: "07:00",
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
        fecha: new Date("2026-08-02"),
        hora: "09:00",
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
        fecha: new Date("2026-08-09"),
        hora: "09:30",
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
        fecha: new Date("2026-08-16"),
        hora: "09:00",
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
        fecha: new Date("2026-08-23"),
        hora: "09:00",
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
        fecha: new Date("2026-08-30"),
        hora: "09:00",
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
        fecha: new Date("2026-09-06"),
        hora: "08:30",
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
        fecha: new Date("2026-09-13"),
        hora: "10:00",
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
        fecha: new Date("2026-09-20"),
        hora: "09:00",
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
        fecha: new Date("2026-09-27"),
        hora: "08:00",
        cupos: 0,
        puntoEncuentro: "Coordinación previa con asesor (traslado incluido)",
        descripcion:
          "Armá tu día perfecto en Córdoba combinando varias excursiones en una misma jornada. Podés elegir city tour, sierras, bodegas o circuitos gastronómicos, y nuestros asesores te ayudan a diseñar la mejor ruta según tiempos, gustos y traslados. Ideal para quienes quieren aprovechar al máximo con un plan flexible.",
        imagenPortada: "/assets/destinos/punilla2.jpg",
        destacada: true,
        orden: 16
      }
    ].map((actividad) => ({ ...actividad, precio: "0" }))
  });

  const salidasGrupales = [
    {
      titulo: "Viaje a Balneário Camboriú - 7 Noches",
      slug: "balneario-camboriu-7-noches",
      destinoId: null, // Se asignará después de encontrar Camboriú
      noches: 7,
      cupos: 45,
      destacada: true,
      activa: true,
      orden: 1,
      noIncluye: `
• Servicio a bordo del bus (comidas y bebidas durante el viaje)
• Excursiones opcionales no mencionadas en el programa
• Gastos personales y propinas
• Seguro de cancelación (disponible como extra)
      `.trim(),
      condiciones: `
## Condiciones del Viaje

### Cancelaciones
• Las cancelaciones están sujetas a las condiciones generales de la agencia
• Se recomienda contratar seguro de cancelación para mayor tranquilidad
• Los reembolsos dependerán de la anticipación con que se realice la cancelación

### Documentación Necesaria
• DNI vigente (para menores, autorización notarial si viajan sin ambos padres)
• Pasaporte al día si se planean excursiones a países limítrofes
• Certificado de vacunación COVID-19 (según normativas vigentes)

### Condiciones Generales
• Los servicios están sujetos a disponibilidad al momento de la reserva
• La agencia se reserva el derecho de modificar itinerarios por razones de fuerza mayor
• Rigen las condiciones generales de agencias de viajes según normativa vigente
• Consultar por descuentos para grupos familiares
      `.trim(),
      destinos: {
        create: [] // Se llenará con el ID de Camboriú
      },
      incluyeItems: {
        create: [
          {
            tipo: "Transporte",
            descripcion: "Viaje en bus moderno semicama o cama (según opción elegida) con salida desde terminal de ómnibus"
          },
          {
            tipo: "Transporte",
            descripcion: "Traslados incluidos desde la terminal de bus hasta el hotel en destino"
          },
          {
            tipo: "Alojamiento",
            descripcion: "7 noches de alojamiento en hotel seleccionado (opciones: Hotel Sagres, Hotel Ilha da Madeira, Hotel Dos Açores u otros de categoría similar)"
          },
          {
            tipo: "Comidas",
            descripcion: "Desayunos diarios incluidos en el hotel (buffet o continental según establecimiento)"
          },
          {
            tipo: "Comidas",
            descripcion: "Cenas en restaurantes seleccionados durante la estadía (cantidad según plan contratado)"
          },
          {
            tipo: "Asistencia",
            descripcion: "Coordinador de viaje durante todo el trayecto y en destino para asistencia permanente"
          },
          {
            tipo: "Asistencia",
            descripcion: "Asistencia al viajero en destino con cobertura AssistCard (incluye ronda médica en hoteles seleccionados)"
          },
          {
            tipo: "Servicios",
            descripcion: "Información turística y asesoramiento sobre actividades y excursiones opcionales en destino"
          }
        ]
      },
    },
    {
      titulo: "Descubrí Canasvieiras - 7 Noches en Florianópolis",
      slug: "canasvieiras-7-noches",
      destinoId: null, // Se asignará después de encontrar Canasvieiras
      noches: 7,
      cupos: 45,
      destacada: true,
      activa: true,
      orden: 2,
      noIncluye: `
• Servicio a bordo del bus (disponible como opcional)
• Excursiones opcionales en destino
• Gastos personales y propinas
• Bebidas alcohólicas durante las comidas
• Actividades turísticas no especificadas en el programa
      `.trim(),
      condiciones: `
## Condiciones del Viaje

## Información General del Viaje

**Documentación Requerida:** DNI o pasaporte vigente. Menores deben viajar con autorización si no van con ambos padres. Llevar copia de documentos importantes.

**Recomendaciones:** Llevar protector solar de alto factor, ropa de playa y casual, calzado cómodo, repelente de mosquitos y medicación personal. Canasvieiras es una zona turística segura, tomar precauciones habituales con pertenencias.

**Conectividad:** Wi-Fi disponible en hoteles y comercios. Se recomienda contratar roaming o chip local para datos móviles.

**Nota:** Todos los servicios están sujetos a disponibilidad. Las condiciones pueden variar según la temporada. Los itinerarios y servicios pueden sufrir modificaciones por razones operativas.
      `.trim(),
      destinos: {
        create: [] // Se llenará con el ID de Canasvieiras
      },
      incluyeItems: {
        create: [
          {
            tipo: "Transporte",
            descripcion: "Salida en bus moderno semicama o cama con aire acondicionado"
          },
          {
            tipo: "Transporte",
            descripcion: "Traslados inn/out desde y hacia el alojamiento en Canasvieiras"
          },
          {
            tipo: "Alojamiento",
            descripcion: "7 noches de hospedaje en hotel seleccionado (Canasvieiras Internacional o Almare)"
          },
          {
            tipo: "Comida",
            descripcion: "Desayuno buffet incluido todos los días"
          },
          {
            tipo: "Comida",
            descripcion: "Cena incluida todos los días con menú variado"
          },
          {
            tipo: "Servicio",
            descripcion: "Coordinador de viaje que acompaña al grupo durante todo el trayecto"
          },
          {
            tipo: "Servicio",
            descripcion: "Coordinador en destino disponible para consultas y asistencia"
          },
          {
            tipo: "Servicio",
            descripcion: "Asistencia al viajero AssistCard con cobertura médica"
          },
          {
            tipo: "Servicio",
            descripcion: "Ronda médica en destino para mayor tranquilidad"
          }
        ]
      },
    },
    {
      titulo: "Verano en Bombas y Bombinhas - 7 Noches",
      slug: "bombas-bombinhas-7-noches",
      destinoId: null, // Se asignará después
      noches: 7,
      cupos: 40,
      destacada: true,
      activa: true,
      orden: 3,
      noIncluye: `
• Servicio a bordo del bus
• Comidas no especificadas en el régimen
• Gastos personales y propinas
• Tours opcionales no mencionados
      `.trim(),
      condiciones: `
## Condiciones del Viaje

### Cancelaciones
• Recomendamos consultar políticas específicas al momento de reservar.

## Información Útil
• **Clima**: Verano cálido, ideal para playa.
• **Actividades**: Snorkel, buceo, caminatas, vida nocturna y gastronomía de mar.
• **Recomendaciones**: Llevar protector solar, ropa ligera y calzado cómodo para caminar.
      `.trim(),
      destinos: {
        create: [] // Se llenará con el ID
      },
      incluyeItems: {
        create: [
          {
            tipo: "Transporte",
            descripcion: "Viaje en bus unidades modernas (semicama o cama según disponibilidad)"
          },
          {
            tipo: "Traslado",
            descripcion: "Traslados in/out desde y hacia el alojamiento"
          },
          {
            tipo: "Alojamiento",
            descripcion: "7 noches de alojamiento en Bombas/Bombinhas (Residencial Bahia do Sonho, Apart Hotel Vila do Centro, Hotel Bora Bora u otros)"
          },
          {
            tipo: "Régimen",
            descripcion: "Pensión según hotel (Desayuno o Sin Pensión)"
          },
          {
            tipo: "Asistencia",
            descripcion: "Coordinador de viaje y asistencia al viajero en destino"
          },
          {
            tipo: "Opcional",
            descripcion: "Butaca cama + comidas en ruta (consultar)"
          }
        ]
      },
    },
    {
      titulo: "Descubrí Punta del Este - 7 Noches",
      slug: "punta-del-este-7-noches",
      destinoId: null, // Se asignará después
      noches: 7,
      cupos: 40,
      destacada: true,
      activa: true,
      orden: 4,
      noIncluye: `
• Cenas u otros servicios fuera de lo estipulado en el régimen.
• Gastos de índole personal, propinas y excursiones opcionales no contratadas.
      `.trim(),
      condiciones: `
## Condiciones del Viaje

### Cancelaciones
• Las condiciones generales de cancelación y cambios aplican según las normas de la agencia.

## Información Útil
• **Actividades**: Visitar Playa Mansa y Playa Brava, recorrer la zona del Puerto, conocer la escultura de La Mano, disfrutar de la vida nocturna y la gastronomía local.
• **Temporada**: Verano con clima ideal para playa (Diciembre a Marzo).
      `.trim(),
      destinos: {
        create: [] // Se llenará con el ID
      },
      incluyeItems: {
        create: [
          {
            tipo: "Transporte",
            descripcion: "Transporte en bus desde el punto de partida hasta Punta del Este y regreso (unidades semicama)"
          },
          {
            tipo: "Comidas",
            descripcion: "Snack y cena a bordo ofrecidos como beneficio durante el viaje sin costo extra"
          },
          {
            tipo: "Traslado",
            descripcion: "Traslados in/out desde el lugar de llegada hasta el alojamiento"
          },
          {
            tipo: "Alojamiento",
            descripcion: "7 noches de alojamiento en hoteles seleccionados (Aqua Punta, Bravo Hotel, Concorde Hotel u otros según disponibilidad)"
          },
          {
            tipo: "Régimen",
            descripcion: "Desayuno diario incluido"
          },
          {
            tipo: "Asistencia",
            descripcion: "Asistencia médica en destino incluida para mayor tranquilidad"
          }
        ]
      },
    },
    {
      titulo: "Experiencia Mundial – Fútbol y Playa – México",
      slug: "mundial-futbol-playa-mexico",
      destinoId: null, // Se asignará después
      noches: 13,
      cupos: 40,
      destacada: true,
      activa: true,
      orden: 5,
      noIncluye: `
• Comidas no especificadas
• Propinas y gastos personales
• Entradas a otros eventos no mencionados
      `.trim(),
      condiciones: `
## Itinerario de Partidos y Sedes

**Argentina vs Argelia**
📍 16 de junio – Kansas

**Argentina vs Austria**
📍 22 de junio – Dallas

**Argentina vs Jordania**
📍 27 de junio – Dallas

### Itinerario detallado
• **16 de Junio**: Partido en Kansas.
• **17 de Junio**: Kansas → Cancún.
• **21 de Junio**: Cancún → Dallas.
• **22 de Junio**: Partido en Dallas.
• **22 de Junio**: Dallas → Cancún.
• **27 de Junio**: Cancún → Dallas.
• **27 de Junio**: Partido en Dallas.
*(Entre partido y partido, regresaremos a Cancún y volveremos a la ciudad del partido el día correspondiente)*

### Información del Viaje
• **Día 1**: Salida e inicio de la experiencia. Check-in y traslado.
• **Estadía**: Disfrutá de actividades, playa y fútbol.
• **Regreso**: Check-out y retorno asistido por nuestro equipo.

      `.trim(),
      destinos: {
        create: [] // Se llenará con el ID
      },
      incluyeItems: {
        create: [
          {
            tipo: "Aéreo",
            descripcion: "Aéreo internacional incluido"
          },
          {
            tipo: "Traslado",
            descripcion: "Traslados IN/OUT y HTL / ESTADIO / HTL"
          },
          {
            tipo: "Traslado",
            descripcion: "Traslados ENTRE SEDES (Kansas - Dallas - Cancún)"
          },
          {
            tipo: "Alojamiento",
            descripcion: "13 noches de alojamiento (Kansas – Cancún – Dallas)"
          },
          {
            tipo: "Entrada",
            descripcion: "Entradas a los 03 partidos de fase de grupos"
          },
          {
            tipo: "Asistencia",
            descripcion: "Asistencia al viajero incluida"
          }
        ]
      },
    },
    {
      titulo: "F1 Miami - Gran Premio 2026",
      slug: "f1-miami-2026",
      destinoId: null,
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 10,
      noIncluye: "Aéreos no incluidos. Gastos administrativos (3.5%).",
      condiciones: `
## Programa: MIAMI – Gran Premio de Miami 🇺🇸
**Fecha del GP**: 1–3 de mayo
**Alojamiento**: 4 noches Hotel 4★ (30 abril - 4 mayo)
**Entradas**: 3 días al circuito

      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Alojamiento", descripcion: "4 noches Hotel 4* en Miami (Solo alojamiento)" },
          { tipo: "Entrada", descripcion: "Entrada 3 días al circuito (según categoría)" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Llegada y Alojamiento" },
          { tipo: "Itinerario-2", descripcion: "Días 2-3: Prácticas y Clasificación" },
          { tipo: "Itinerario-3", descripcion: "Día 4: Gran Premio (Carrera)" },
          { tipo: "Itinerario-4", descripcion: "Día 5: Check-out y Regreso" }
        ]
      },
    },
    {
      titulo: "F1 Las Vegas - Gran Premio 2026",
      slug: "f1-las-vegas-2026",
      destinoId: null,
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 11,
      noIncluye: "Aéreos no incluidos. Gastos administrativos (3.5%).",
      condiciones: `
## Programa: LAS VEGAS – Gran Premio de Las Vegas 🇺🇸
**Fecha del GP**: 19 – 21 de noviembre
**Alojamiento**: 4 noches Hotel Park MGM o similar (18 - 22 noviembre)
**Entradas**: Viernes, sábado y domingo

      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Alojamiento", descripcion: "4 noches Hotel Park MGM o similar (Solo alojamiento)" },
          { tipo: "Entrada", descripcion: "Entrada 3 días (Viernes, Sábado, Domingo)" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Llegada y Alojamiento" },
          { tipo: "Itinerario-2", descripcion: "Días 2-3: Prácticas y Clasificación Nocturna" },
          { tipo: "Itinerario-3", descripcion: "Día 4: Gran Premio Las Vegas" },
          { tipo: "Itinerario-4", descripcion: "Día 5: Check-out y Regreso" }
        ]
      },
    },
    {
      titulo: "F1 Mónaco - Gran Premio 2026",
      slug: "f1-monaco-2026",
      destinoId: null,
      noches: 3,
      cupos: 15,
      destacada: true,
      activa: true,
      orden: 12,
      noIncluye: "Aéreos no incluidos. Gastos administrativos (3.5%).",
      condiciones: `
## Programa: MONACO – Gran Premio de Mónaco 🇲🇨
**Fecha del GP**: 05 – 07 Junio
**Alojamiento**: 3 noches Hotel 3★ Campanile PRIME (Nice) o similar (5 - 8 junio)
**Entradas**: Acceso al circuito según sector

• **Sector Rocher (1 día)**: €1,329
• **Sector Rocher (2 días)**: €1,549
• **Sector Rocher (3 días)**: €1,769
• **Sector K (1 día)**: €2,549
• **Sector K (2 días)**: €3,109
• **Sector K (3 días)**: €3,329
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Alojamiento", descripcion: "3 noches Hotel 3* en Nice (Solo alojamiento)" },
          { tipo: "Entrada", descripcion: "Entrada al circuito según sector elegido" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Llegada y Alojamiento en Niza" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Clasificación en Mónaco" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Gran Premio de Mónaco" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Check-out y Regreso" }
        ]
      },
    },
    {
      titulo: "F1 Madrid - Gran Premio 2026",
      slug: "f1-madrid-2026",
      destinoId: null,
      noches: 3,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 13,
      noIncluye: "Aéreos no incluidos. Gastos administrativos (3.5%).",
      condiciones: `
## Programa: MADRID – Gran Premio de Madrid 🇪🇸
**Fecha del GP**: 11-13 Septiembre
**Alojamiento**: 3 noches Hotel 3★ Holiday Inn Alcorcon o similar (11 - 14 septiembre)
**Entradas**: Acceso al circuito

• **Tribuna Silver 7/16**: €2,109
• **Tribuna Silver 12**: €2,069
• **Tribuna Silver 13**: €2,439
• **Bronce 15**: €1,989
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Alojamiento", descripcion: "3 noches con desayuno incluido" },
          { tipo: "Entrada", descripcion: "Entrada al circuito (Tribuna seleccionada)" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Llegada a Madrid y Check-in" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Prácticas y Clasificación" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Gran Premio de Madrid" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Check-out y Regreso" }
        ]
      },
    },
    {
      titulo: "F1 Monza - Gran Premio de Italia 2026",
      slug: "f1-monza-2026",
      destinoId: null,
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 14,
      noIncluye: "Aéreos no incluidos. Gastos administrativos (3.5%).",
      condiciones: `
## Programa: ITALIA – Gran Premio de Monza 🇮🇹
**Fecha del GP**: 04-06 Septiembre
**Alojamiento**: 4 noches Hotel 4★ Novotel Linate o similar (3 - 7 septiembre)
**Entradas**: 3 días al circuito

• **General Admission**: €1,769
• **Right Lateral 26A**: €3,669
• **Left Lateral 4 / Outer 8B**: €3,229
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Alojamiento", descripcion: "4 noches con desayuno incluido" },
          { tipo: "Traslado", descripcion: "Traslado hotel - circuito - hotel" },
          { tipo: "Entrada", descripcion: "Entrada 3 días al circuito" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Llegada a Milán y Check-in" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Prácticas Libres" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Clasificación en Monza" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Gran Premio de Italia" },
          { tipo: "Itinerario-5", descripcion: "Día 5: Check-out y Regreso" }
        ]
      },
    },
    {
      titulo: "F1 Silverstone - Gran Bretaña 2026",
      slug: "f1-silverstone-2026",
      destinoId: null,
      noches: 3,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 15,
      noIncluye: "Aéreos no incluidos. Gastos administrativos (3.5%).",
      condiciones: `
## Programa: GRAN BRETAÑA – Gran Premio Silverstone 🇬🇧
**Fecha**: 03-05 Julio
**Alojamiento**: 3 noches Hotel 4★ Novotel Leicester o similar (3 - 6 julio)
**Entradas**: 3 días al circuito

• **General Admission**: €1,666
• **Abbey A / Luffield**: €2,211
• **Hamilton Straight**: €2,656
• **Vale**: €2,100
• **Woodcote**: €2,217
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Alojamiento", descripcion: "3 noches con desayuno incluido" },
          { tipo: "Entrada", descripcion: "Entrada 3 días al circuito" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Llegada y Check-in" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Clasificación en Silverstone" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Gran Premio de Gran Bretaña" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Check-out y Regreso" }
        ]
      },
    },
    {
      titulo: "F1 Sao Paulo - Gran Premio 2026",
      slug: "f1-sao-paulo-2026",
      destinoId: null, // Will be linked via script logic safely
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 16,
      noIncluye: "Gastos personales.",
      condiciones: `
## Programa: Fórmula 1 Sao Paulo 🇧🇷
**Fecha**: 05 de noviembre de 2026
**Destino**: Sao Paulo
**Duración**: 05 Días / 04 Noches
**Transporte**: Aéreos desde COR por LA
**Equipaje**: Carry on
**Hotel**: Hotel 3* Summit Paulista 3* o similar
**Régimen**: Desayuno

**Sector G (20L)**

**Sector A – RQ**

**Sector H – RQ**

### Consultar por otros sectores
• SECTOR M, D, B, ORANGE TREE
• PIT TOP CLUB, GRAND PRIX CLUB, PADDOCK CLUB
      `.trim(),
      destinos: { create: [] }, // Will be handled by the seed script logic
      incluyeItems: {
        create: [
          { tipo: "Alojamiento", descripcion: "04 noches en Hotel 3* Summit Paulista o similar" },
          { tipo: "Transporte", descripcion: "Aéreos desde COR por LA (Carry on incluido)" },
          { tipo: "Régimen", descripcion: "Desayuno incluido" },
          { tipo: "Entrada", descripcion: "SECTOR G (viernes, sábado y domingo)" },
          { tipo: "Traslado", descripcion: "Traslados In/Out y al circuito (Viernes, Sábado y Domingo)" },
          { tipo: "Servicio", descripcion: "Kit de regalo" },
          { tipo: "Servicio", descripcion: "Coordinación en destino" },
          { tipo: "Asistencia", descripcion: "Universal Assistance Value 80K sin limite de edad" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Salida - Comienza la experiencia. Reunión en punto de encuentro." },
          { tipo: "Itinerario-2", descripcion: "Día 2-4: Estadía en destino - Viví cada momento. Actividades y GP de Brasil." },
          { tipo: "Itinerario-3", descripcion: "Día 5: Regreso - Fin del viaje." }
        ]
      },
    },
    {
      titulo: "Paquete Turístico – Laguna, Brasil en Bus 2026",
      slug: "laguna-brasil-bus-2026",
      destinoId: null,
      noches: 7,
      cupos: 40,
      destacada: true,
      activa: true,
      orden: 16,
      noIncluye: `
• Servicio de comidas en ruta (salvo especificación contraria)
• Bebidas en las comidas
• Excursiones opcionales no detalladas
• Gastos personales y propinas
      `.trim(),
      condiciones: `
## Laguna, Brasil: Naturaleza y Relax

Laguna es una ciudad costera ubicada en Santa Catarina, Brasil, reconocida por sus hermosas playas, ambiente tranquilo y naturaleza junto al mar. Es ideal para vacaciones de verano con familias y amigos, combinando descanso en la playa, deportes acuáticos y turismo costero.

### Fechas y Duración
El paquete se ofrece con salidas específicas durante los meses de **enero, febrero, marzo y abril 2026**.
La duración típica del programa es de **10 días y 7 noches**, con alojamiento en destino incluido durante ese período.

### Transporte y Coordinación
Viajamos en **bus grupal tipo Mix o Cama**, con opción de butaca cama disponible bajo petición.
Contamos con **coordinador de viaje** que acompaña desde la salida hasta el regreso.
Incluye traslados de ingreso y egreso en destino (terminal - hotel).

### Alojamiento y Régimen
El programa incluye **7 noches de alojamiento** en hoteles seleccionados con **régimen de media pensión** (desayuno y cena, o similar).
Hoteles previstos (o similares):
• **Hotel Renascença**
• **Hotel Atlántico Sul**

### Servicios Opcionales
• Butaca Cama para mayor confort en el viaje.
• Asistencia médica adicional para mayores de edad.
• Butacas panorámicas o con servicios especiales (cafetera, etc).

### Condiciones de Reserva
• Cancelaciones sujetas a políticas del operador.

### Información Útil
• **Documentación**: DNI tarjeta vigente o Pasaporte. Menores con autorización si corresponde.
• **Equipaje**: Respetar pesos y medidas estándar de bus.
• **Destino**: Laguna ofrece playas extensas, avistaje de delfines y un centro histórico encantador.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus grupal Mix o Cama (ida y vuelta)" },
          { tipo: "Alojamiento", descripcion: "7 noches en hotel seleccionado (Renascença, Atlántico Sul o similar)" },
          { tipo: "Régimen", descripcion: "Media pensión (Desayuno y cena/comida según hotel)" },
          { tipo: "Traslados", descripcion: "Traslados in/out en destino" },
          { tipo: "Asistencia", descripcion: "Coordinador permanente y asistencia al viajero AC35 (Ene-Mar)" }
        ]
      },
    },
    {
      titulo: "Ferrugem en Bus – Temporada 2026",
      slug: "ferrugem-bus-2026",
      destinoId: null,
      noches: 7,
      cupos: 40,
      destacada: true,
      activa: true,
      orden: 17,
      noIncluye: `
• Comidas no especificadas (almuerzos, cenas sin régimen)
• Bebidas en las comidas
• Excursiones opcionales
• Gastos personales y propinas
      `.trim(),
      condiciones: `
## Descripción general del paquete
Programa grupal en bus con duración de **10 días y 7 noches** en destino.
Viaje organizado con transporte, alojamiento y servicios coordinados para disfrutar de las playas de Ferrugem.

### Incluye
• **Transporte**: Bus grupal Mix o Cama como transporte principal.
• **Alojamiento**: Estadía completa en destino durante todo el programa (7 noches).
• **Régimen**: Según hotel seleccionado (según disponibilidad).
• **Traslados**: Ingreso y egreso en destino (terminal - posada).
• **Asistencia**: Coordinador permanente en viaje y receptivo en destino. Asistencia al viajero incluida.

### Fechas de salida 2026
Salidas programadas desde **febrero a diciembre 2026**.
Consultar fechas específicas de salida para cada mes.

### Hotelería
Opciones de alojamiento disponibles (sujeto a disponibilidad):
• **Pousada Do Boto**
• **Pousada Baleia Franca**
• **Pousada Ilha Mar**
• **La Ferrugem Suites**

### Detalles operativos
• **Salidas**: Desde Córdoba, Rosario, Santa Fe, Paraná y ciudades sobre RN 19 y RN 9 (Consultar puntos de ascenso).
• **Horarios**: Salidas programadas por la tarde/noche. Desde Rosario puede ser madrugada siguiente.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus grupal Mix o Cama" },
          { tipo: "Alojamiento", descripcion: "7 noches en posada seleccionada" },
          { tipo: "Régimen", descripcion: "Según hotel (Desayuno opcional)" },
          { tipo: "Traslados", descripcion: "Traslados in/out en destino" },
          { tipo: "Asistencia", descripcion: "Coordinador y asistencia al viajero" }
        ]
      },
    },
    {
      titulo: "Bombinhas en Bus – Temporada 2026",
      slug: "bombinhas-bus-2026",
      destinoId: null,
      noches: 7,
      cupos: 40,
      destacada: true,
      activa: true,
      orden: 18,
      noIncluye: `
• Comidas no especificadas
• Bebidas en las comidas
• Excursiones opcionales
• Gastos personales y propinas
      `.trim(),
      condiciones: `
## Descripción del paquete
Este paquete incluye un viaje en **bus grupal** con duración de **10 días y 7 noches** a Bombinhas, Brasil.
Ofrece transporte, alojamiento, coordinación completa y servicios inclusivos durante todo el recorrido.

### Incluye
• **Asistencia**: Asistencia al viajero incluida durante la estadía.
• **Transporte**: Bus grupal Mix o Cama para todo el recorrido.
• **Coordinación**: Coordinador en viaje y atención en destino para acompañar al grupo.
• **Alojamiento**: Estadía completa en destino durante las 7 noches del programa.
• **Régimen**: Según el hotel seleccionado (según disponibilidad).
• **Traslados**: Traslados de ingreso y egreso desde y hacia los alojamientos.

### Disponibilidad de salidas 2026
Este programa está disponible con salidas durante **febrero 2026 hasta diciembre 2026**, con múltiples opciones cada mes adaptadas a la temporada de verano y otoño.

### Hoteles disponibles
Opciones de alojamiento (sujeto a disponibilidad):
• **Pousada Mar Azul** – alojamiento con desayuno.
• **Mar Azul Flat** – alojamiento con desayuno.
• **Vila do Centro** – alojamiento con desayuno y opciones familiares.
• **HSH Bombinhas** – alojamiento con media pensión.

### Operativa del viaje
• **Origen**: El origen del viaje es desde Córdoba, Rosario, Santa Fe, Paraná y ciudades sobre RN 9 y RN 19.
• **Horarios**: Las salidas desde Rosario se realizan en la noche o madrugada previa al viaje.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus grupal Mix o Cama" },
          { tipo: "Alojamiento", descripcion: "7 noches en hotel seleccionado" },
          { tipo: "Régimen", descripcion: "Según hotel (Desayuno o Media Pensión)" },
          { tipo: "Traslados", descripcion: "Traslados in/out en destino" },
          { tipo: "Asistencia", descripcion: "Coordinador y asistencia al viajero" }
        ]
      },
    },
    {
      titulo: "Cataratas – Foz do Iguaçu – Temporada 2026",
      slug: "cataratas-foz-2026",
      destinoId: null,
      noches: 3,
      cupos: 40,
      destacada: true,
      activa: true,
      orden: 19,
      noIncluye: `
• Comidas no especificadas
• Bebidas en las comidas
• Entradas a parques nacionales
• Gastos personales y propinas
      `.trim(),
      condiciones: `
## Descripción del paquete
Este paquete incluye un viaje a **Cataratas del Iguazú (Foz do Iguaçu)**, diseñado para quienes desean conocer una de las maravillas naturales más impresionantes del mundo.
El programa tiene una duración en destino de **3 noches** y ofrece la oportunidad de explorar tanto el lado brasileño como el argentino.

### Incluye
• **Estadía**: Alojamiento en destino durante las 3 noches del programa (según régimen seleccionado).
• **Traslados**: Ingreso y egreso incluidos según la modalidad del programa.
• **Asistencia**: Asistencia al viajero con cobertura médica completas durante todo el viaje.

### Disponibilidad de salidas 2026
Las salidas para este paquete están disponibles desde **febrero de 2026 hasta diciembre de 2026**, con múltiples posibilidades dentro de ese período según programación operativa.

### Servicios principales
• **Coordinación**: Acompañamiento permanente y guías locales.
• **Transporte**: Bus semi-cama o cama de última generación (según opción elegida).
• **Excursiones**: Visita a Cataratas Argentinas y Brasileñas (entradas no incluidas).

### Excursiones Incluidas
• **Yerbatera**: Recorrido por la Ruta de la Yerba Mate para conocer el proceso productivo y realizar degustaciones.

### Excursiones Opcionales
• **Ruinas de San Ignacio**: Visita a las reducciones jesuíticas fundadas en 1609 (Patrimonio de la Humanidad).
• **Minas de Wanda**: Recorrido por yacimientos de piedras naturales.
• **Paseo Catamarán Iguazú**: Navegación por la triple frontera al atardecer.
• **Parque Nacional Iguazú (Argentina)**: Recorrido por pasarelas superior, inferior y Garganta del Diablo.
• **Gran Aventura**: Paseo náutico y selvático, navegando los rápidos del río Iguazú.
• **Visita a Ciudad del Este**: Tour de compras en la zona franca de Paraguay.
• **Parque Nacional do Iguaçu (Brasil)**: Vistas panorámicas de los saltos desde el lado brasileño.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus grupal Mix o Cama" },
          { tipo: "Alojamiento", descripcion: "3 noches en Foz do Iguaçu" },
          { tipo: "Traslados", descripcion: "Traslados y excursiones a Cataratas Arg/Bra" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero incluida" }
        ]
      },
    },
    {
      titulo: "Patagonia Fantástica 2026 - 9 Noches",
      slug: "patagonia-fantastica-2026",
      destinoId: null,
      noches: 9,
      cupos: 40,
      destacada: true,
      activa: true,
      orden: 21,
      noIncluye: `
• Extras no especificados.
• Entradas a parques nacionales, reservas o museos no indicados.
• Comidas no especificadas.
      `.trim(),
      condiciones: `
## Patagonia Fantástica

**Duración:** 14 Días - 9 Noches
**Salidas:** 10 Abril y 30 Mayo 2026
**Inicio:** Córdoba (Embarques en Río Cuarto y Santa Rosa)
**Régimen:** Desayuno

### El programa incluye:
• Bus Coche cama salida desde Córdoba, embarques en Río Cuarto y Santa Rosa.
• 9 noches de alojamiento en Hoteles Categoría Turista con desayuno:
  - 2 noches Puerto Madryn
  - 3 noches en El Calafate
  - 3 noches en Ushuaia
  - 1 noche en Puerto Madryn (De Regreso)
• Excursiones Incluidas:
  - Mini City tour Madryn
  - Península Valdés hasta Puerto Pirámides
  - Parque Nacional Los Glaciares (sin tickets de ingreso)
  - Parque Nacional Tierra del Fuego (sin tickets de ingreso)
  - Visita a Las Grutas
• Coordinador permanente y guías locales profesionales.
• Traslados de ingreso y egreso
• Asistencia al viajero

### Hoteles Previstos
• **Opción 1:** Hotel Las Maras + Hotel Kalken + Hotel Costa Ushuaia
• **Opción 2:** Hotel Las Maras + Hotel Kapenke + Hotel Costa Ushuaia

### Itinerario
**Día 1:** SALIDA
**Día 2:** PUERTO MADRYN
**Día 3:** PUERTO MADRYN
**Día 4:** PUERTO MADRYN-EL CALAFATE
**Día 5:** EL CALAFATE
**Día 6:** EL CALAFATE
**Día 7:** EL CALAFATE
**Día 8:** EL CALAFATE-USHUAIA
**Día 9:** USHUAIA
**Día 10:** USHUAIA
**Día 11:** USHUAIA-PUERTO MADRYN
**Día 12:** PUERTO MADRYN
**Día 13:** PUERTO MADRYN-CÓRDOBA
**Día 14:** CÓRDOBA

### Excursiones Opcionales

**PUERTO MADRYN**
• Lobería Punta Loma
• Avistaje Fauna Marina en Puerto Pirámides
• Pingüinera Punta Tombo

**CALAFATE**
• City Tour
• Safari Náutico
• El Chaltén
• Todo Glaciares

**USHUAIA**
• Navegación Canal de Beagle
• City Tour Ushuaia con Almuerzo de Cordero Fueguino
• Tren del Fin del Mundo
• Cárcel del Fin del Mundo
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Bus", descripcion: "Bus Coche cama salida desde Córdoba" },
          { tipo: "Alojamiento", descripcion: "9 noches de alojamiento con desayuno" },
          { tipo: "Excursión", descripcion: "Península Valdés, PN Los Glaciares, PN Tierra del Fuego" },
          { tipo: "Excursión", descripcion: "Visita a Las Grutas, Mini City Tour Madryn" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Asistencia", descripcion: "Coordinador y asistencia al viajero" }
        ]
      },
    },
    {
      titulo: "El Calafate y Ushuaia 2026 - 6 Noches",
      slug: "calafate-ushuaia-2026",
      destinoId: null,
      noches: 6,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 22,
      noIncluye: `
• Extras no especificados en el programa.
• Servicios adicionales.
      `.trim(),
      condiciones: `
## El Calafate y Ushuaia 2026

**Duración:** 6 Noches
**Salidas:** 13 y 20 Enero, 5 y 17 Febrero, 12 y 18 Marzo 2026
**Inicio:** Córdoba

### El programa incluye:
• Aéreos desde Córdoba cupos confirmados con Flybondi.
• 6 noches de Alojamiento con régimen según hotel:
  - 3 noches en El Calafate
  - 3 noches en Ushuaia
• Traslado de Ingreso y Egreso.
• Asistencia al Viajero.

### Excursiones incluidas (Sin tickets de ingreso a parques):
• Parque Nacional Los Glaciares
• Parque Nacional Tierra del Fuego

### Hoteles Previstos
• **Opción 1:** Hotel Kalken + Hotel Costa Ushuaia
• **Opción 2:** Hotel Kapenke + Hotel Costa Ushuaia

### Equipaje Incluido
• **De mano:** 1 pieza de hasta 6 kg (30x20x40cm) para ubicar bajo el asiento.
• **En bodega:** 1 pieza de hasta 12 kg (máx. 158 cm lineales).
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreos desde Córdoba con Flybondi" },
          { tipo: "Alojamiento", descripcion: "6 noches (3 en Calafate, 3 en Ushuaia)" },
          { tipo: "Traslados", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "Excursión", descripcion: "PN Los Glaciares y PN Tierra del Fuego" },
          { tipo: "Equipaje", descripcion: "Bodega 12kg + Mano 6kg" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero" }
        ]
      },
    },
    {
      titulo: "Bariloche Aéreo",
      slug: "bariloche-aereo-2026",
      destinoId: null,
      noches: 6,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 20,
      noIncluye: `
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## Bariloche Aéreo '26

**Destino:** San Carlos de Bariloche  
**Duración:** 07 días / 06 noches – 06 días / 05 noches  
**Transporte:** Aéreo desde Córdoba (Aerolíneas Argentinas)  
**Equipaje:** Carry on  
**Hotel:** Cadena Tierra Gaucha / Kenton  
**Régimen:** Desayuno  
**Excursiones:** Trf in/out  
**Asistencia Médica:** Nacional – Cobertura 2M  

### Salidas 2026
• **14 Febrero**  
• **13 y 31 Marzo**  
• **9 Abril (AR Carry)**  
• **19 Abril (AR Carry)**  
• **23 Mayo (FO 12kg)**  
• **24 Mayo (AR Carry)**  
• **13 y 18 Junio (FO 12kg)**  

### Consultas
Consultar valores por fecha y disponibilidad.  

🛎️ Habitación a compartir GARANTIZADA  
🚗 Cupos aéreos incluyen estadía en cochera (sujeto a disponibilidad).  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo desde Córdoba con Aerolíneas Argentinas" },
          { tipo: "Equipaje", descripcion: "Carry on" },
          { tipo: "Alojamiento", descripcion: "Cadena Tierra Gaucha / Kenton" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Traslados", descripcion: "Transfer in/out" },
          { tipo: "Asistencia", descripcion: "Cobertura nacional 2M" },
          { tipo: "Detalle-Salidas", descripcion: "14 Febrero; 13 y 31 Marzo; 9 y 19 Abril (AR Carry); 23 Mayo (FO 12kg); 24 Mayo (AR Carry); 13 y 18 Junio (FO 12kg)" }
        ]
      },
    }
  ];

  // Asignar los destinoId a los paquetes
  const bombas = destinosList.find((item) => item.slug === "bombas");
  const puntadeleste = destinosList.find((item) => item.slug === "punta-del-este");
  const f1 = destinosList.find((item) => item.slug === "formula-1");
  const catamarcaDest = destinosList.find((item) => item.slug === "catamarca"); // Assuming catamarca destination exists or we link to null?
  // `misiones` ya está definido arriba con el resto de destinos.

  for (const paquete of salidasGrupales) {
    if (paquete.titulo.includes("Camboriu")) {
      paquete.destinoId = camboriu.id;
    } else if (paquete.titulo.includes("Canasvieiras")) {
      paquete.destinoId = canasvieiras.id;
    } else if (paquete.titulo.includes("Rio de Janeiro")) {
      paquete.destinoId = rio.id;
    } else if (paquete.titulo.includes("Cataratas")) {
      const cataratas = destinosList.find((item) => item.slug === "cataratas-del-iguazu");
      if (cataratas) paquete.destinoId = cataratas.id;
    } else if (paquete.slug.includes("banados-estrella")) {
      if (misiones) paquete.destinoId = misiones.id;
    } else if (paquete.slug.includes("catamarca")) {
      if (catamarcaDest) paquete.destinoId = catamarcaDest.id;
    } else if (paquete.titulo.includes("F1") || paquete.titulo.includes("Fórmula 1")) {
      if (f1) paquete.destinoId = f1.id;
    }

  }

  const extraPaquetes = [
    // ================= PAQUETES CHARTER 2026 =================
    {
      titulo: "Charter Aéreo Porto de Galinhas 2026",
      slug: "charter-porto-galinhas-2026",
      destinoId: null,
      noches: 7,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 23,
      noIncluye: `
• Gastos personales y propinas
• Tours opcionales no detallados
      `.trim(),
      condiciones: `
## Charter Aéreo Porto de Galinhas

**Duración:** 7 Noches
**Salidas:** 6, 13, 20 y 27 Febrero; 6 Marzo 2026
**Inicio:** Córdoba (Aéreo directo)

### El programa incluye:
• Aéreos desde Córdoba con Flybondi
• 7 Noches de Alojamiento
• Traslados de ingreso y egreso
• Asistencia al viajero AC35

**ENERO / FEBRERO**

### Adicionales Traslados (Opcional)
• *Consultar por otras localidades.*

### Equipaje Incluido
• **De mano:** 10 kg (Carry on + Bolso de mano).
• **Bodega:** 1 pieza de hasta 15 kg (Máx 158 cm lineales).
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo charter directo desde Córdoba" },
          { tipo: "Alojamiento", descripcion: "7 noches según hotel seleccionado" },
          { tipo: "Traslados", descripcion: "Traslados IN/OUT en destino" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero AC35" },
          { tipo: "Equipaje", descripcion: "Bodega 15kg + Mano 10kg" }
        ]
      },
    },
    {
      titulo: "Charter Aéreo Maragogi 2026",
      slug: "charter-maragogi-2026",
      destinoId: null,
      noches: 7,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 24,
      noIncluye: `
• Gastos personales
• Excursiones opcionales
      `.trim(),
      condiciones: `
## Charter Aéreo Maragogi

**Duración:** 7 Noches
**Salidas:** 6, 13, 20 y 27 Febrero; 6 Marzo 2026
**Inicio:** Córdoba (Aéreo directo)

### El programa incluye:
• Aéreos desde Córdoba con Flybondi
• 7 Noches de Alojamiento
• Traslados de ingreso y egreso
• Asistencia al viajero AC35

**ENERO / FEBRERO**

### Adicionales Traslados (Opcional)
• *Consultar por otras localidades.*

### Equipaje Incluido
• **De mano:** 10 kg (Carry on + Bolso de mano).
• **Bodega:** 1 pieza de hasta 15 kg.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo charter directo desde Córdoba" },
          { tipo: "Alojamiento", descripcion: "7 noches (Praia Dourada o Grand Oca)" },
          { tipo: "Traslados", descripcion: "Traslados IN/OUT" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero AC35" },
          { tipo: "Equipaje", descripcion: "Bodega 15kg + Mano 10kg" }
        ]
      },
    },
    {
      titulo: "Charter Aéreo Cabo de Santo Agostinho 2026",
      slug: "charter-cabo-santo-agostinho-2026",
      destinoId: null,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 25,
      noIncluye: `
• Gastos personales
      `.trim(),
      condiciones: `
## Charter Cabo de Santo Agostinho

**Duración:** 7 Noches
**Salidas:** 6, 13, 20 y 27 Febrero; 6 Marzo 2026
**Inicio:** Córdoba (Aéreo directo)

### El programa incluye:
• Aéreos desde Córdoba con Flybondi
• 7 Noches de Alojamiento en Vila Galé Cabo
• Traslados de ingreso y egreso
• Asistencia al viajero AC35

**ENERO / FEBRERO**

### Adicionales Traslados (Opcional)

### Equipaje Incluido
• **De mano:** 10 kg (Carry on + Bolso de mano).
• **Bodega:** 1 pieza de hasta 15 kg.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo charter directo desde Córdoba" },
          { tipo: "Alojamiento", descripcion: "7 noches en Vila Galé Cabo" },
          { tipo: "Régimen", descripcion: "All Inclusive" },
          { tipo: "Traslados", descripcion: "Traslados IN/OUT" },
          { tipo: "Equipaje", descripcion: "Bodega 15kg + Mano 10kg" }
        ]
      },
    }
  ];
  salidasGrupales.push(...extraPaquetes);

  const moreCharters = [
    {
      titulo: "Charter Aéreo Buzios 2026",
      slug: "charter-buzios-2026",
      destinoId: null,
      noches: 7,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 26,
      noIncluye: `
• Gastos personales
      `.trim(),
      condiciones: `
## Charter Aéreo Búzios

**Duración:** 7 Noches
**Salidas:** 2 y 9 Febrero 2026
**Inicio:** Córdoba (Aéreo Flybondi a GIG + Traslado)

### El programa incluye:
• Aéreos desde Córdoba con Flybondi (Destino GIG)
• 7 Noches de Alojamiento
• Traslados de ingreso y egreso
• Asistencia al viajero AC35

**FEBRERO**
• **POSADA AFRIKA**: Consultar
• **POSADA DOS REIS**: Consultar

### Adicionales Traslados (Opcional)

### Equipaje Incluido
• **De mano:** 10 kg (Carry on + Bolso de mano).
• **Bodega:** 1 pieza de hasta 15 kg.

### Flexi Charter
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo charter Córdoba - Rio (GIG)" },
          { tipo: "Alojamiento", descripcion: "7 noches en Búzios" },
          { tipo: "Traslados", descripcion: "Transfer Aeropuerto GIG - Búzios - Aeropuerto" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero AC35" },
          { tipo: "Equipaje", descripcion: "Bodega 15kg + Mano 10kg" }
        ]
      },
    },
    {
      titulo: "Charter Aéreo Rio de Janeiro 2026",
      slug: "charter-rio-2026",
      destinoId: null,
      noches: 7,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 27,
      noIncluye: `
• Gastos personales
      `.trim(),
      condiciones: `
## Charter Aéreo Rio de Janeiro

**Duración:** 7 Noches
**Salidas:** 2 y 9 Febrero 2026
**Inicio:** Córdoba (Aéreo Flybondi)

### El programa incluye:
• Aéreos desde Córdoba con Flybondi
• 7 Noches de Alojamiento
• Traslados de ingreso y egreso
• Asistencia al viajero AC35

**FEBRERO**
• **POUSADA GIRASSOL**: Consultar

### Adicionales Traslados (Opcional)

### Equipaje Incluido
• **De mano:** 10 kg (Carry on + Bolso de mano).
• **Bodega:** 1 pieza de hasta 15 kg.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo charter Córdoba - Rio (GIG)" },
          { tipo: "Alojamiento", descripcion: "7 noches en Rio de Janeiro" },
          { tipo: "Traslados", descripcion: "Traslados IN/OUT" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero AC35" },
          { tipo: "Equipaje", descripcion: "Bodega 15kg + Mano 10kg" }
        ]
      },
    },
    {
      titulo: "Charter Aéreo Angra dos Reis 2026",
      slug: "charter-angra-2026",
      destinoId: null,
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 28,
      noIncluye: `
• Gastos personales
      `.trim(),
      condiciones: `
## Charter Aéreo Angra dos Reis

**Duración:** 7 Noches
**Salidas:** 2 y 9 Febrero 2026
**Inicio:** Córdoba (Aéreo Flybondi a GIG + Traslado)

### El programa incluye:
• Aéreos desde Córdoba con Flybondi (Destino GIG)
• 7 Noches de Alojamiento
• Traslados de ingreso y egreso (Regular)
• Asistencia al viajero AC35

**FEBRERO**

### Adicionales Traslados (Opcional)

### Equipaje Incluido
• **De mano:** 10 kg (Carry on + Bolso de mano).
• **Bodega:** 1 pieza de hasta 15 kg.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo charter Córdoba - Rio (GIG)" },
          { tipo: "Alojamiento", descripcion: "7 noches en Angra" },
          { tipo: "Traslados", descripcion: "Transfer Aeropuerto GIG - Angra - Aeropuerto" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero AC35" },
          { tipo: "Equipaje", descripcion: "Bodega 15kg + Mano 10kg" }
        ]
      },
    }
  ];
  salidasGrupales.push(...moreCharters);

  const torresPackage = [
    {
      titulo: "Torres y Gramado 2026",
      slug: "torres-y-gramado-2026",
      destinoId: null, // Will be linked to Torres
      tipo: "grupal",
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 30,
      noIncluye: `
• Entradas a parques no mencionadas
      `.trim(),
      condiciones: `
## Torres y Gramado 2026

**Duración:** 07 Días | 04 Noches
**Bus:** CAMA (Ultima Generación, bar a bordo, snack y bebidas)
**Salidas:** 30 Marzo 2026 (Semana Santa)

### El programa incluye:
• Bus Cama desde Córdoba (Última Generación).
• Servicio de bar a bordo.
• 04 Noches de Alojamiento (02 en Torres + 02 en Gramado).
• Régimen Media Pensión:
  - Gramado: 2 noches Buffet Completo.
  - Torres: Media Pensión en Hotel A Furninha.
• Coordinador permanente.
• Asistencia Médica: Universal Assistance (Sin Limite de Edad).

### Hoteles Previstos:
• **Gramado:** Hotel Ski Gramado (Matriz)
• **Torres:** Hotel A Furninha

### Excursiones Incluidas:
• City Tour Gramado y Canela COMPLETO:
  - Porticos de Entrada y Calle techada
  - Lago Negro
  - Mini Mundo
  - Fabrica de Chocolate
  - Catedral de Pedra
  - Parque Caracol (sin ingresos)

### Itinerario
**Día 1 - Salida:**
Nos reunimos en el punto de encuentro indicado para iniciar el viaje. Realizamos el check-in correspondiente y emprendemos el traslado hacia el destino elegido con servicio a bordo.

**Día 2 - Llegada y Alojamiento:**
Llegada a destino, alojamiento en hotel seleccionado. Tiempo para comenzar a disfrutar.

**Días 3 al 6 - Estadía en destino:**
Disfrute de la estadía combinada entre la playa de Torres y el encanto de las sierras en Gramado. Realizaremos el City Tour completo por Gramado y Canela visitando los principales atractivos. Días libres para playa o paseos opcionales.

**Día 7 - Regreso:**
Luego de los procedimientos de check-out y embarque, emprendemos el retorno. Nuestro equipo te asistirá hasta el final del servicio.

      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus Cama Última Generación" },
          { tipo: "Alojamiento", descripcion: "4 Noches (2 Torres / 2 Gramado)" },
          { tipo: "Régimen", descripcion: "Media Pensión" },
          { tipo: "Excursiones", descripcion: "City Tour Gramado y Canela" },
          { tipo: "Asistencia", descripcion: "Universal Assistance Sin Límite" },
          { tipo: "Coordinador", descripcion: "Permanente" }
        ]
      },
    }
  ];
  salidasGrupales.push(...torresPackage);

  const catamarcaPackage = [
    {
      titulo: "Catamarca y Ruta del Adobe",
      slug: "catamarca-ruta-adobe-2026",
      destinoId: null, // Will be linked to Catamarca
      tipo: "grupal",
      noches: 5,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 31,
      noIncluye: `
• Entradas a sitios turísticos (Ruinas de Shincal, Termas, etc.)
• Excursiones opcionales:
  - Salar de Antofalla ($125,000)
  - Balcón de Pissis ($150,000)
      `.trim(),
      condiciones: `
## Catamarca y Ruta del Adobe

**Duración:** 07 Días – 05 Noches
**Transporte:** Bus Cama
**Salidas:** 24 Abril 2026

### El programa incluye:
• Bus Cama desde Córdoba.
• 05 Noches de Alojamiento.
• Régimen MAP (Media Pensión).
• Habitación a compartir GARANTIZADA.
• Asistencia Médica Nacional 2M.

### Hoteles Previstos:
• **Antofagasta:** Hostería Municipal Antofagasta (2 noches)
• **Belén:** Hotel Belén (1 noche)
• **Fiambalá:** Hotel San Francisco Fiambalá (2 noches)

### Excursiones Incluidas:
• **Campo de Piedra Pómez:** Paisaje surrealista de origen volcánico.
• **Ruinas de Shincal:** Visita al sitio arqueológico inca (sin entrada).
• **Termas de Fiambalá:** Ascenso incluido (sin entrada).
• **Ruta del Adobe:** Recorrido por las construcciones históricas.

### Itinerario
**Día 1 - Salida:**
Nos reunimos en el punto de encuentro indicado para iniciar el viaje. Realizamos el check-in correspondiente y emprendemos el traslado hacia Catamarca.

**Día 2 - Llegada y Alojamiento:**
Llegada a destino, alojamiento en el primer punto del recorrido (Antofagasta o según logística). Tiempo para aclimatarse.

**Días 3 al 6 - Recorrido:**
Durante estos días realizaremos el circuito completo visitando el Campo de Piedra Pómez, las Ruinas de Shincal en Londres, la famosa Ruta del Adobe y el relax en las Termas de Fiambalá.

**Día 7 - Regreso:**
Luego de los procedimientos de check-out, emprendemos el retorno a casa llevando los recuerdos de la Puna.

• *Opción Single:* $1,347,929
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus CAMA" },
          { tipo: "Alojamiento", descripcion: "5 Noches (2 Antofagasta, 1 Belén, 2 Fiambalá)" },
          { tipo: "Régimen", descripcion: "Media Pensión (MAP)" },
          { tipo: "Excursiones", descripcion: "Piedra Pómez, Shincal, Ruta Adobe, Termas" },
          { tipo: "Asistencia", descripcion: "Cobertura Nacional 2M" },
          { tipo: "Coordinador", descripcion: "Permanente" }
        ]
      },
    }
  ];
  salidasGrupales.push(...catamarcaPackage);

  const banadosPackage = [
    {
      titulo: "Bañados de la Estrella",
      slug: "banados-estrella-2026",
      destinoId: null, // Will be linked to Misiones as requested
      tipo: "grupal",
      noches: 4, // 3 or 4, setting 4 as max
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 32,
      noIncluye: `
• Parque Nacional El Impenetrable (opcional $125.000)
• Adicional MAP (3 comidas $80.000 / 2 comidas $55.000)
• Comidas no especificadas
      `.trim(),
      condiciones: `
## Bañados de la Estrella

**Programa:** Bañado de la Estrella, y Parque Nacional “El Impenetrable”
**Destino:** Resistencia – Ibarreta – Juan Jose Castelli
**Duración:** 6 Días, y 4 Noches / 5 Días, y 3 Noches
**Transporte:** Bus CAMA
**Salidas:** 14 Junio, 04 y 11 Julio 2026
**Régimen:** Desayuno

### Hoteles a confirmar
• **Resistencia:** Hotel Royal (o Covadonga)
• **Ibarreta:** Doña Melitona (o similar)
• **Juan Jose Castelli:** Hotel Florencia

### Excursiones
• Panorámica en Corrientes
• Fortin La Soledad (Bañados La Estrella) con Navegación y cena Especial
• Programa de 03 noches incluye “El Impenetrable”

### Servicios
• Coordinador Permanente
• Asistencia Médica: Universal Assistance Nacional – Cobertura UA 2M (sin límite de edad)

**14 Jun (3 noches - Desayuno y una Cena)**

**04 y 11 Jul (4 noches - Desayuno y una Cena)**

*🛎️ Habitación a compartir GARANTIZADA.*
*Las habitaciones garantizadas a compartir podrán ser dobles o triples.*

### Opcionales
• Parque Nacional El Impenetrable – $125.000

### Rutas
• Ruta 1: Rio Cuarto, Villa Maria, Rosario, Santa Fe
• Ruta 2: Cordoba, Villa Maria

### Itinerario
**Día 1 — Día de salida: Comienza la experiencia**
Nos reunimos en el punto de encuentro indicado para iniciar el viaje. Realizamos el check-in correspondiente y emprendemos el traslado hacia el destino elegido. Nuestro equipo acompaña todo el proceso para que disfrutes desde el primer momento.

**Día 2 — Estadía en destino: Viví cada momento**
Durante la estadía podrás disfrutar de las actividades, servicios y atractivos incluidos en tu paquete. El itinerario puede variar según condiciones del viaje y las preferencias del grupo, siempre priorizando tu seguridad y comodidad. Tiempo libre para aprovechar a tu manera y crear recuerdos únicos.

**Día 3 — Día de regreso: Fin del viaje, inicio de nuevos planes**
Luego de los procedimientos de check-out y embarque, emprendemos el retorno. Nuestro equipo te asistirá hasta el final del servicio. ¡Gracias por viajar con nosotros! Esperamos volver a acompañarte en tu próxima aventura.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus CAMA" },
          { tipo: "Alojamiento", descripcion: "Hoteles a confirmar (Royal / Doña Melitona / Florencia)" },
          { tipo: "Régimen", descripcion: "Desayuno y una Cena" },
          { tipo: "Excursiones", descripcion: "Panorámica Corrientes, Fortin La Soledad, Navegación" },
          { tipo: "Asistencia", descripcion: "Universal Assistance Nacional UA 2M" },
          { tipo: "Coordinador", descripcion: "Permanente" }
        ]
      },
    }
  ];
  salidasGrupales.push(...banadosPackage);

  const caminosDelNortePackage = [
    {
      titulo: "Caminos del Norte",
      slug: "caminos-del-norte-2026",
      destinoId: null, // Se asigna a Salta y se agrega Jujuy como extra
      tipo: "grupal",
      noches: 5,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 33,
      noIncluye: `
• Servicios no detallados en el programa
• Extras de butaca (semi-cama o cama)
      `.trim(),
      condiciones: `
## Caminos del Norte

**Destino:** Caminos del Norte (Salta + Jujuy)
**Transporte:** Bus CAMA con servicio de bar a bordo
**Duración:** 03 o 05 noches
**Hotel:** Apart Carlos I, III, IV
**Régimen:** Media Pensión en el hotel
**Servicios:** Asistencia médica incluida, coordinación permanente

### Excursiones incluidas
• Visita a Cafayate con visita a Bodega
• Quebrada de Las Conchas
• City tour en Salta
• Quebrada de Humahuaca (Purmamarca - Tilcara - Humahuaca)

### Butacas y menores
• Solo Butaca Semi-Cama: $200.000  
• Solo Butaca Cama: $250.000  
• Menor 0 a 2 años sin butaca + asistencia médica: $15.000  
• De 3 años: solo butaca + asistencia (sin servicio en el hotel)  
• Desde 4 años abona como adulto  

### Embarque y notas
• Embarque: consultar ruta (salida desde Córdoba y valor del traslado)  
• Habitaciones garantizadas a compartir pueden ser dobles o triples  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus CAMA con bar a bordo" },
          { tipo: "Alojamiento", descripcion: "Apart Carlos I, III, IV (03 o 05 noches)" },
          { tipo: "Régimen", descripcion: "Media Pensión (MAP)" },
          { tipo: "Servicios", descripcion: "Coordinación permanente" },
          { tipo: "Asistencia", descripcion: "Asistencia médica incluida" },
          { tipo: "Excursiones", descripcion: "Cafayate + Bodega, Quebrada de Las Conchas, City en Salta, Quebrada de Humahuaca" },
          { tipo: "Detalle-Salidas", descripcion: "13 Feb (Carnaval), 14 Mar, 01 Abr (Semana Santa), 09 May, 17 Jun (Feriado)" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...caminosDelNortePackage);

  const lasGrutasPackage = [
    {
      titulo: "Las Grutas 2026",
      slug: "las-grutas-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 5,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 34,
      noIncluye: `
• Adicional butaca panorámica o cafetera
• Servicios no detallados
      `.trim(),
      condiciones: `
## Las Grutas 2026

**Duración:** 08 días | 5 noches (según salida)
**Transporte:** Bus MIX con servicio a bordo, snack y bebidas
**Hotel:** Antares / Acantilados
**Régimen:** Desayuno + Media Pensión
**Servicios:** Coordinador durante todo el circuito
**Asistencia Médica:** Universal Assistance (sin límite de edad)

### Salidas 2026
• 04, 11, 18 y 25 Ene  
• 01, 08, 13 (Carnaval), 18, 23 y 28 Feb  
• 05 y 15 Mar  
• 01 Abr (Semana Santa)  

### Adicionales
• Butaca Panorámica: $40.000  
• Butaca Cafetera: $35.000  

### Menores
• 0 a 2 años (obligatorio asistencia médica): $20.000  
• 0 a 2 años (butaca semi-cama + asistencia): $200.000  
• 3 años (butaca semi-cama + asistencia): $200.000  

### Rutas
Paraná – Santa Fe – Rosario – Armstrong – Villa María – RIO (e intermedios)

### Notas
Habitaciones garantizadas a compartir pueden ser dobles o triples.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus MIX con snack y bebidas" },
          { tipo: "Alojamiento", descripcion: "Hotel Antares / Acantilados (5 noches según salida)" },
          { tipo: "Régimen", descripcion: "Desayuno + Media Pensión" },
          { tipo: "Servicios", descripcion: "Coordinador durante todo el circuito" },
          { tipo: "Asistencia", descripcion: "Universal Assistance (sin límite de edad)" },
          { tipo: "Detalle-Salidas", descripcion: "04, 11, 18 y 25 Ene; 01, 08, 13, 18, 23 y 28 Feb; 05 y 15 Mar; 01 Abr (Semana Santa)" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...lasGrutasPackage);

  const maravillasLitoralPackage = [
    {
      titulo: "Maravillas del Litoral",
      slug: "maravillas-litoral-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 4,
      cupos: 25,
      destacada: true,
      activa: true,
      orden: 35,
      noIncluye: `
• Entradas a parques y atractivos no indicados
• Navegación Saltos de Mocona (opcional)
• Adicionales de butaca (Cama/Panorámica/Cafetera)
      `.trim(),
      condiciones: `
## Maravillas del Litoral

**Programa:** Maravillas de Litoral, Iguazú, Iberá y Saltos del Moconá  
**Destino:** Cataratas del Iguazú, Esteros del Iberá y Saltos de Moconá  
**Duración:** 6 Días y 4 Noches  
**Transporte:** Bus MIX  
**Hotel:** Iguazú Ñamandú Guazú + Posadas Bagu Urbano  
**Régimen:** Media Pensión  
**Servicios:** Coordinador permanente  
**Asistencia médica:** Universal Assistance Nacional – Cobertura 2M (sin límite de edad)

### Excursiones incluidas
• Portal Galarza Parque Iberá (desayuno, infusión, tortas fritas, navegación, sendero autoguiado, merienda)  
• Traslado a Parque Nacional Iguazú (sin entradas)  
• Traslado a Ruinas de San Ignacio y Minas de Wanda (sin entradas)  
• Traslado al Soberbio para Saltos de Moconá (navegación no incluida, sujeto a clima)

**20 Abril 2026 – 4 noches**  

### Adicionales
• Butaca CAMA: $95.000  
• Butaca PANORÁMICA: $75.000  
• Butaca CAFETERA: $55.000  

### Rutas
• Ruta 1: Río Cuarto, Villa María, Rosario, Santa Fe  
• Ruta 2: Córdoba, Río Tercero, Villa María  

### Notas
🛎️ Habitación a compartir GARANTIZADA  
Habitaciones garantizadas a compartir pueden ser dobles o triples.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus MIX con servicio a bordo" },
          { tipo: "Alojamiento", descripcion: "2 noches Iguazú Ñamandú Guazú + 2 noches Posadas Bagu Urbano" },
          { tipo: "Régimen", descripcion: "Media Pensión" },
          { tipo: "Servicios", descripcion: "Coordinador permanente" },
          { tipo: "Asistencia", descripcion: "Universal Assistance Nacional 2M" },
          { tipo: "Excursiones", descripcion: "Iberá (Portal Galarza), PN Iguazú, San Ignacio y Wanda, Saltos del Moconá" },
          { tipo: "Detalle-Salidas", descripcion: "20 Abril 2026" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...maravillasLitoralPackage);

  const puertoMadrynPackage = [
    {
      titulo: "Puerto Madryn \"Playas Patagónicas\"",
      slug: "puerto-madryn-playas-patagonicas-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 5,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 36,
      noIncluye: `
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## Puerto Madryn "Playas Patagónicas"

**Destino:** Puerto Madryn  
**Transporte:** Bus CAMA con servicio a bordo  
**Duración:** 04 o 05 noches  
**Régimen:** Desayuno (Media Pensión opcional en restaurante del hotel)  
**Servicios:** Asistencia médica incluida, coordinación permanente  

### Excursiones incluidas
• Punta Perdices “El Caribe Patagónico” (ida)  
• Rawson – Playa Unión (avistaje de toninas opcional)  
• Día de playa en Puerto Pirámides  

### Servicios incluidos
• Playzone en Puerto Madryn  
• Servicio de playa (1 sombrilla por habitación para toda la estadía)  

**24 Enero 2026 (3 noches)**  
• FAMILY PLAN 1 (2 adultos + 1 menor 3-10 años, hab triple): $545.900  

**01 Abril 2026 (3 noches)**  
• FAMILY PLAN 1 (2 adultos + 1 menor 3-10 años, hab triple): $545.900  

### Media pensión opcional (salidas de enero)
• 04 comidas: $80.000 por pasajero  
• 05 comidas: $100.000 por pasajero  

### Adicionales
• Menor 0 a 2 años (asistencia médica obligatoria): $280.000  

### Ruta
Paraná – Santa Fe – Rosario – Villa María – Río Cuarto e intermedios

### Notas
Habitaciones garantizadas a compartir pueden ser dobles o triples.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje.
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus CAMA con servicio a bordo" },
          { tipo: "Alojamiento", descripcion: "Hotel Bahía Madryn (04 o 05 noches según salida)" },
          { tipo: "Régimen", descripcion: "Desayuno (Media Pensión opcional)" },
          { tipo: "Servicios", descripcion: "Coordinación permanente + Playzone + servicio de playa" },
          { tipo: "Asistencia", descripcion: "Asistencia médica incluida" },
          { tipo: "Excursiones", descripcion: "Punta Perdices, Rawson/Playa Unión, Puerto Pirámides" },
          { tipo: "Detalle-Salidas", descripcion: "24 Enero y 01 Abril 2026" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...puertoMadrynPackage);

  const visitandoNortePackage = [
    {
      titulo: "Visitando el Norte",
      slug: "visitando-norte-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 6,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 37,
      noIncluye: `
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## Visitando el Norte

**Destino:** Visitando el Norte Argentino  
**Transporte:** Bus MIX con servicio de snack a bordo  
**Duración:** 08 días | 06 noches  
**Hoteles:** Cafayate (Hotel Emperador, 1 noche) • Salta (Apart Carlos, 3 noches) • Tilcara (Cadena Turismo Tilcara, 2 noches)  
**Régimen:** Media Pensión  
**Servicios:** Asistencia médica incluida • Coordinación permanente  

### Excursiones
• Quebrada de los Sosa  
• Visita a bodega  
• Quebrada de las Conchas  
• City en Salta  
• Salinas Grandes, Purmamarca y Quebrada de Humahuaca (2 días)  
🛎️ Habitación a compartir GARANTIZADA

### Adicionales
• Solo Butaca Semi-Cama: $200.000  
• Menor 0 a 2 años sin butaca + asistencia médica: $15.000  

### Embarque y notas
Consultar ruta, embarque desde Córdoba y valor del traslado.  
Habitaciones garantizadas a compartir pueden ser dobles o triples.  

### Itinerario (resumen)
**Día 1:** Embarque / Noche a bordo / Cafayate  
**Día 2:** Cuesta de los Sosa - Tafí del Valle - Cafayate  
**Día 3:** Cafayate - Salta (City tour)  
**Día 4:** Salta (Opcional Cachi)  
**Día 5:** Salta (Opcional San Antonio de los Cobres)  
**Día 6:** Salta - Purmamarca y Salinas Grandes - Tilcara  
**Día 7:** Tilcara - Humahuaca (Opcional Hornocal)  
**Día 8:** Tilcara - Tucumán - Regreso  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus MIX con snack a bordo" },
          { tipo: "Alojamiento", descripcion: "06 noches (Cafayate 1, Salta 3, Tilcara 2)" },
          { tipo: "Régimen", descripcion: "Media Pensión (MAP)" },
          { tipo: "Servicios", descripcion: "Coordinación permanente" },
          { tipo: "Asistencia", descripcion: "Asistencia médica incluida" },
          { tipo: "Excursiones", descripcion: "Sosa, bodega, Conchas, City Salta, Salinas Grandes, Purmamarca y Humahuaca" },
          { tipo: "Detalle-Salidas", descripcion: "01 Febrero, 01 Marzo, 11 Abril, 25 Abril, 23 Mayo 2026" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Embarque / Noche a bordo / Cafayate" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Cuesta de los Sosa / Tafí del Valle / Cafayate" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Cafayate / Salta City Tour" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Salta / Opcional Cachi" },
          { tipo: "Itinerario-5", descripcion: "Día 5: Salta / Opcional San Antonio de los Cobres" },
          { tipo: "Itinerario-6", descripcion: "Día 6: Salta / Purmamarca y Salinas Grandes / Tilcara" },
          { tipo: "Itinerario-7", descripcion: "Día 7: Tilcara / Humahuaca / Opcional Hornocal" },
          { tipo: "Itinerario-8", descripcion: "Día 8: Tilcara / Tucumán / Noche a bordo" }
        ]
      },
    }
  ];
  salidasGrupales.push(...visitandoNortePackage);

  const barilocheVlaPackage = [
    {
      titulo: "Bariloche y Villa La Angostura",
      slug: "bariloche-villa-la-angostura-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 6,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 38,
      noIncluye: `
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## Bariloche y Villa La Angostura

**Programa:** Combinado Aéreo  
**Destino:** San Carlos de Bariloche – Villa La Angostura  
**Duración:** 07 días / 06 noches – 06 días / 05 noches  
**Transporte:** Aéreo desde Córdoba (Aerolíneas Argentinas)  
**Equipaje:** Carry on  
**Hoteles:** BRC Cadena Tierra Gaucha • VLA Posta Los Colonos  
**Régimen:** Desayuno  
**Excursiones:** Traslados in/out + Camino de los Siete Lagos  
**Asistencia Médica:** Nacional – Cobertura 2M  

🛎️ Habitación a compartir GARANTIZADA  
🚗 Cupos aéreos incluyen estadía en cochera (sujeto a disponibilidad, hasta vehículos medianos).  

Consultar valores por fecha (ver tabla completa).  

Las habitaciones garantizadas a compartir podrán ser dobles o triples.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde Córdoba (Aerolíneas Argentinas)" },
          { tipo: "Equipaje", descripcion: "Carry on" },
          { tipo: "Alojamiento", descripcion: "BRC Cadena Tierra Gaucha + VLA Posta Los Colonos" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Excursiones", descripcion: "Traslados in/out + Camino de los Siete Lagos" },
          { tipo: "Asistencia", descripcion: "Cobertura Nacional 2M" },
          { tipo: "Servicios", descripcion: "Cupos aéreos incluyen cochera (sujeto a disponibilidad)" },
          { tipo: "Detalle-Salidas", descripcion: "14 Febrero; 13 y 31 Marzo; 19 Abril (AR Carry); 23 Mayo (FO 12kg); 24 Mayo (Carry); 13 y 18 Junio (FO 12kg)" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...barilocheVlaPackage);

  const buenosAiresPackage = [
    {
      titulo: "Buenos Aires",
      slug: "buenos-aires-aereo-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 3,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 39,
      noIncluye: `
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## Buenos Aires

**Programa:** Buenos Aires  
**Destino:** Buenos Aires  
**Duración:** 04 días / 03 noches – 03 días / 02 noches  
**Transporte:** Aéreo desde Córdoba (Flybondi)  
**Equipaje:** 12KG  
**Hotel:** HR Luxor  
**Régimen:** Desayuno  
**Excursiones:** Traslados in/out + City  
**Asistencia Médica:** Nacional – Cobertura 2M  

### Coordinador SAVI
SAVI (Servicio de Asistencia al Viajero) brinda acompañamiento integral antes, durante y después del viaje.  

**02 Abril (3 noches):**  

**23 Mayo (2 noches):**  

🛎️ Habitación a compartir GARANTIZADA  
🚗 Cupos aéreos incluyen estadía en cochera (sujeto a disponibilidad, hasta vehículos medianos).  
Las habitaciones garantizadas a compartir podrán ser dobles o triples.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde Córdoba (Flybondi)" },
          { tipo: "Equipaje", descripcion: "12KG" },
          { tipo: "Alojamiento", descripcion: "Hotel HR Luxor" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Excursiones", descripcion: "Traslados in/out + City" },
          { tipo: "Asistencia", descripcion: "Cobertura Nacional 2M" },
          { tipo: "Servicios", descripcion: "Coordinador SAVI" },
          { tipo: "Detalle-Salidas", descripcion: "13 Marzo 2026" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...buenosAiresPackage);

  const peritoMorenoPackage = [
    {
      titulo: "Capillas de Mármol",
      slug: "capillas-de-marmol-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 5,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 40,
      noIncluye: `
• Ingresos a sitios no indicados
• Excursiones opcionales (Monte Zeballos, Ea La Ascensión)
      `.trim(),
      condiciones: `
## Capillas de Mármol

**Destino:** Perito Moreno  
**Duración:** 06 días / 05 noches – 05 días / 04 noches  
**Transporte:** Aéreo desde Córdoba (Aerolíneas Argentinas)  
**Equipaje:** Carry on  
**Hotel:** Cueva de las Manos  
**Régimen:** Desayuno  
**Excursiones:** Traslados Comodoro–Perito Moreno / Cueva de las Manos con guía / Capillas de Mármol (navegación, guía, coffee break y almuerzo) / Traslado Perito–Comodoro  
**Asistencia Médica:** Universal Assistance Nacional – Cobertura 1.3M  

🛎️ Habitación a compartir GARANTIZADA  
🚗 Cupos aéreos incluyen estadía en cochera (sujeto a disponibilidad, hasta vehículos medianos).  

Consultar valores por fecha (ver tabla completa).  

Las habitaciones garantizadas a compartir podrán ser dobles o triples.  

### Itinerario (resumen)
**Día 1:** Córdoba / Comodoro Rivadavia / Perito Moreno  
**Día 2:** Perito Moreno / Cueva de las Manos  
**Día 3:** Perito Moreno / Capillas de Mármol  
**Día 4:** Perito Moreno / Opcional Monte Zeballos  
**Día 5:** Perito Moreno / Opcional Ea La Ascensión y Los Antiguos  
**Día 6:** Perito Moreno / Comodoro Rivadavia / Córdoba  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde Córdoba (Aerolíneas Argentinas)" },
          { tipo: "Equipaje", descripcion: "Carry on" },
          { tipo: "Alojamiento", descripcion: "Hotel Cueva de las Manos (04/05 noches)" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Excursiones", descripcion: "Cueva de las Manos + Capillas de Mármol (navegación)" },
          { tipo: "Asistencia", descripcion: "Universal Assistance Nacional 1.3M" },
          { tipo: "Detalle-Salidas", descripcion: "21 Marzo y 01 Abril 2026" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Córdoba / Comodoro / Perito Moreno" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Cueva de las Manos" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Capillas de Mármol" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Opcional Monte Zeballos" },
          { tipo: "Itinerario-5", descripcion: "Día 5: Opcional Ea La Ascensión y Los Antiguos" },
          { tipo: "Itinerario-6", descripcion: "Día 6: Regreso a Córdoba" }
        ]
      },
    }
  ];
  salidasGrupales.push(...peritoMorenoPackage);

  const cruceLagosPackage = [
    {
      titulo: "Cruce de Lagos",
      slug: "cruce-de-lagos-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 6,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 41,
      noIncluye: `
• Servicios no detallados en el programa
• Ingresos a parques (si corresponde)
      `.trim(),
      condiciones: `
## Cruce de Lagos 26

**Programa:** Cruce de Lagos 26  
**Destinos:** San Carlos de Bariloche – Puerto Montt  
**Duración:** 07 días / 06 noches (01 BRC + 03 PMT – 02 BRC)  
**Transporte:** Aerolíneas Argentinas  
**Equipaje:** Carry On  
**Hoteles:** BRC Cadena Tierra Gaucha – PMC Hotel Gran Pacifico  
**Régimen:** Desayuno  
**Excursiones:** Traslados in/out + traslados a puertos + catamaranes + panorámica en Puerto Varas con Frutillar + PN Vicente Pérez Rosales  
**Asistencia Médica:** Nacional – Cobertura 1.3M + Master Basic 25k (Chile)  

🛎️ Habitación a compartir GARANTIZADA  
🚗 Cupos aéreos incluyen estadía en cochera (sujeto a disponibilidad, hasta vehículos medianos).  

**13 Marzo (referencial):**  

Las habitaciones garantizadas a compartir podrán ser dobles o triples.  

### Itinerario
**Día 1:** Córdoba / Bariloche  
**Día 2:** Bariloche / Cruce de Lagos / Puerto Montt  
**Día 3:** Puerto Montt / Puerto Varas y Frutillar  
**Día 4:** Puerto Montt / Saltos del Petrohué / Cruce de Lagos / Bariloche  
**Día 5:** Opcional San Martín de los Andes / Camino de los 7 Lagos  
**Día 6:** Opcional Cerro Tronador  
**Día 7:** Bariloche / Córdoba  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo Aerolíneas Argentinas" },
          { tipo: "Equipaje", descripcion: "Carry On" },
          { tipo: "Alojamiento", descripcion: "BRC Cadena Tierra Gaucha + PMC Hotel Gran Pacifico" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Excursiones", descripcion: "Cruce de Lagos + Puerto Varas / Frutillar + PN Vicente Pérez Rosales" },
          { tipo: "Asistencia", descripcion: "Cobertura 1.3M + Master Basic 25k (Chile)" },
          { tipo: "Detalle-Salidas", descripcion: "Abril 2026 hasta Mayo 2026" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Córdoba / Bariloche" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Cruce de Lagos / Puerto Montt" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Puerto Varas y Frutillar" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Regreso a Bariloche" },
          { tipo: "Itinerario-5", descripcion: "Día 5: Opcional S. M. de los Andes" },
          { tipo: "Itinerario-6", descripcion: "Día 6: Opcional Cerro Tronador" },
          { tipo: "Itinerario-7", descripcion: "Día 7: Regreso a Córdoba" }
        ]
      },
    }
  ];
  salidasGrupales.push(...cruceLagosPackage);

  const glampingNubesPackage = [
    {
      titulo: "Experiencia Glamping Entre las Nubes",
      slug: "glamping-entre-las-nubes-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 42,
      noIncluye: `
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## 🌄 Experiencia Glamping Entre las Nubes

**Destino:** Salta – Tilcara – Pueblo Viejo  
**Duración:** 04 días / 03 noches – 05 días / 04 noches  
**Transporte:** Aéreos desde COR (FO o AR)  
**Equipaje:** FO 12kg / AR Carry  
**Régimen:** SLA (Media Pensión) + Tilcara (Desayuno) + Glamping Pueblo Viejo (Pensión completa)  
**Excursiones:** Según programa e Iruya + caminata guiada al pueblo ancestral  
**Asistencia Médica:** Universal Assistance 2M  
**Coordinador:** SAVI  

🛎️ Habitación a compartir GARANTIZADA  
Las habitaciones garantizadas a compartir podrán ser dobles o triples.  

**24 Abril / 23 Mayo / 13 y 18 Junio**  
03 noches SLA – Cadena Apart Carlos (MAP) + 01 noche Tilcara (DES) + 01 noche Pueblo Viejo (Pensión completa)  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde COR (FO o AR)" },
          { tipo: "Equipaje", descripcion: "FO 12kg / AR Carry" },
          { tipo: "Alojamiento", descripcion: "SLA Apart Carlos + Tilcara + Glamping Pueblo Viejo" },
          { tipo: "Régimen", descripcion: "Media Pensión + Pensión Completa en Glamping" },
          { tipo: "Excursiones", descripcion: "Iruya + caminata guiada al pueblo ancestral" },
          { tipo: "Asistencia", descripcion: "Universal Assistance 2M" },
          { tipo: "Servicios", descripcion: "Coordinador SAVI" },
          { tipo: "Detalle-Salidas", descripcion: "24 Abril, 23 Mayo, 13 y 18 Junio 2026" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...glampingNubesPackage);

  const neuquenCaviahuePackage = [
    {
      titulo: "Neuquén y Caviahue",
      slug: "neuquen-caviahue-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 43,
      noIncluye: `
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## Neuquén y Caviahue

**Destino:** Neuquén – Caviahue  
**Duración:** 05 días / 04 noches  
**Transporte:** Aéreo desde Córdoba (Flybondi)  
**Equipaje:** Ver por salida  
**Hoteles:** NQN El Cortijo – CAV Nieve del Cerro / Lago Caviahue  
**Régimen:** Desayuno  
**Excursiones:** Transfer in/out en Neuquén y Caviahue + Termas de Copahue con guía  
**Asistencia Médica:** Universal Assistance Nacional – Cobertura 1.3M  

🛎️ Habitación a compartir GARANTIZADA  
🚗 Cupos aéreos incluyen estadía en cochera (sujeto a disponibilidad, hasta vehículos medianos).  

**01 Abril (NQN El Cortijo / CAV Nieve del Cerro)**  

**13 Febrero – 01 Abril (NQN El Cortijo / CAV Lago Caviahue)**  

Las habitaciones garantizadas a compartir podrán ser dobles o triples.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde Córdoba (Flybondi)" },
          { tipo: "Equipaje", descripcion: "Ver por salida" },
          { tipo: "Alojamiento", descripcion: "NQN El Cortijo + CAV Nieve del Cerro / Lago Caviahue" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Excursiones", descripcion: "Transfers in/out + Termas de Copahue con guía" },
          { tipo: "Asistencia", descripcion: "Universal Assistance 1.3M" },
          { tipo: "Detalle-Salidas", descripcion: "01 Abril; 13 Febrero – 01 Abril 2026" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...neuquenCaviahuePackage);

  const descubriendoSurPackage = [
    {
      titulo: "Descubriendo el Sur",
      slug: "descubriendo-el-sur-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 6,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 44,
      noIncluye: `
• Entradas a parques y atractivos no indicados
      `.trim(),
      condiciones: `
## Combinado Ushuaia y Calafate

**Destino:** Ushuaia y Calafate / Calafate y Ushuaia  
**Duración:** 07 días / 06 noches – 08 días / 7 noches  
**Transporte:** Aéreos desde Córdoba (Aerolíneas Argentinas)  
**Equipaje:** Carry on (13 Mar 15kg)  
**Régimen:** Desayuno  
**Excursiones:** Traslados in/out + PN Tierra del Fuego + PN Los Glaciares (sin entradas)  
**Asistencia Médica:** Universal Assistance Nacional – Cobertura 2M  
**Coordinador:** SAVI  

🛎️ Habitación a compartir GARANTIZADA  
🚗 Cupos aéreos incluyen estadía en cochera (sujeto a disponibilidad, hasta vehículos medianos).  

**09 Febrero (03N FTE Glaciares + 04N USH Monaco):**  
• DBL $1.499.109 | SLG $2.094.349  

**13 Febrero (03N USH Monaco + 03N FTE Glaciares):**  
• DBL $1.414.089 | SLG $1.931.259  

**20 Marzo (03N FTE Kapenke + 03N USH Monaco):**  
• DBL/TPL $1.330.629 | SLG $1.807.299  

**CHD todas las fechas:** $822.189  

Las habitaciones garantizadas a compartir podrán ser dobles o triples.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde Córdoba (Aerolíneas Argentinas)" },
          { tipo: "Equipaje", descripcion: "Carry on (13 Mar 15kg)" },
          { tipo: "Alojamiento", descripcion: "Ushuaia + Calafate (según salida)" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Excursiones", descripcion: "PN Tierra del Fuego + PN Los Glaciares (sin entradas)" },
          { tipo: "Asistencia", descripcion: "Universal Assistance Nacional 2M" },
          { tipo: "Servicios", descripcion: "Coordinador SAVI" },
          { tipo: "Detalle-Salidas", descripcion: "09 y 16 Enero; 09 y 13 Febrero; 20 Marzo 2026" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...descubriendoSurPackage);

  const descubriendoChilePackage = [
    {
      titulo: "Descubriendo Chile",
      slug: "descubriendo-chile-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 6,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 45,
      noIncluye: `
• Entradas no incluidas (Saltos de Petrohué y Lago Todos Los Santos)
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## Descubriendo Chile

**Programa:** Descubriendo Chile  
**Transporte:** Bus MIX o CAMA con servicio de bar a bordo  
**Duración:** 10 Días | 6 Noches + 1 noche a bordo  
**Hoteles:** Santa Lucía/Libertador (Santiago) • Gran Pacífico (Puerto Montt) • Turismo Patagonia/Crismalu (San Martín de los Andes)  
**Régimen:** Media Pensión  
**Servicios:** Asistencia médica incluida, coordinación permanente  
**Excursiones:** Viña del Mar–Reñaca–Valparaíso, City Tour Santiago, Pucón, Frutillar, Saltos de Petrohué y Lago Todos Los Santos (sin entrada), City Tour Puerto Montt, Camino de los 7 Lagos  

Ruta: Paraná – Santo Tomé – Santa Fé – Arocena – Coronda – San Lorenzo – Rosario – Carcarañá – Cañada de Gómez – Armstrong (e intermedios)  

Las habitaciones garantizadas a compartir podrán ser dobles o triples.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus MIX o CAMA con servicio de bar a bordo" },
          { tipo: "Alojamiento", descripcion: "Santiago + Puerto Montt + San Martín de los Andes" },
          { tipo: "Régimen", descripcion: "Media Pensión" },
          { tipo: "Servicios", descripcion: "Asistencia médica y coordinación permanente" },
          { tipo: "Excursiones", descripcion: "Viña del Mar, Valparaíso, Santiago, Pucón, Frutillar, Saltos de Petrohué, Lago Todos Los Santos, Puerto Montt, 7 Lagos" },
          { tipo: "Detalle-Salidas", descripcion: "11 Enero, 22 Febrero, 15 Marzo – 11 Abril 2026" },
          { tipo: "Itinerario-1", descripcion: "Día de salida — Comienza la experiencia" },
          { tipo: "Itinerario-2", descripcion: "Estadía en destino — Viví cada momento" },
          { tipo: "Itinerario-3", descripcion: "Día de regreso — Fin del viaje" }
        ]
      },
    }
  ];
  salidasGrupales.push(...descubriendoChilePackage);

  const costaRicaMaximoPackage = [
    {
      titulo: "Costa Rica al Máximo",
      slug: "costa-rica-al-maximo-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 46,
      noIncluye: `
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## Costa Rica al Máximo

**Destino:** Costa Rica  
**Duración:** 08 días / 07 noches  
**Transporte:** Aéreos desde COR (LATAM)  
**Equipaje:** Equipaje de mano  
**Hotel:** Según programa  
**Régimen:** Según programa  
**Excursiones:** Según programa  
**Asistencia Médica:** Master Plus Cobertura 40k  

**02 Junio 2026**  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde COR (LATAM)" },
          { tipo: "Equipaje", descripcion: "Equipaje de mano" },
          { tipo: "Alojamiento", descripcion: "Según programa" },
          { tipo: "Régimen", descripcion: "Según programa" },
          { tipo: "Excursiones", descripcion: "Según programa" },
          { tipo: "Asistencia", descripcion: "Master Plus Cobertura 40k" },
          { tipo: "Detalle-Salidas", descripcion: "02 Junio 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...costaRicaMaximoPackage);

  const esenciasCentroeuropeasPackage = [
    {
      titulo: "Esencias Centroeuropeas",
      slug: "esencias-centroeuropeas-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 14,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 47,
      noIncluye: `
• Excursiones opcionales y traslados no indicados
• Gastos personales y bebidas
      `.trim(),
      condiciones: `
## Esencias Centroeuropeas

**Duración:** 14 noches  
**Transporte:** Aéreo Buenos Aires/Ámsterdam/Buenos Aires (Air France/KLM)  
**Vuelos:** Horarios locales sujetos a modificación  
**Equipaje:** 01 maleta de 23kg  
**Alojamiento:** Hoteles categoría X  
**Incluye:** Traslados con asistencia en inglés, entradas y visitas según programa, guía de habla hispana  
**Asistencia Médica:** Assist Card 100k  

**16 Junio 2026**  

Paquete promocional: sin cambios ni devoluciones.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo BA/Ámsterdam/BA (Air France/KLM)" },
          { tipo: "Equipaje", descripcion: "1 maleta de 23kg" },
          { tipo: "Alojamiento", descripcion: "Hoteles categoría X" },
          { tipo: "Servicios", descripcion: "Traslados con asistencia en inglés" },
          { tipo: "Excursiones", descripcion: "Entradas y visitas según programa" },
          { tipo: "Guía", descripcion: "Guía de habla hispana" },
          { tipo: "Asistencia", descripcion: "Assist Card 100k" },
          { tipo: "Detalle-Salidas", descripcion: "16 Junio 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...esenciasCentroeuropeasPackage);

  const europaMaximoPackage = [
    {
      titulo: "Europa al Máximo: Londres – Madrid",
      slug: "europa-al-maximo-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 19,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 48,
      noIncluye: `
• Excursiones opcionales y traslados no indicados
• Bebidas y gastos personales
      `.trim(),
      condiciones: `
## Colección Europa: Londres – Madrid (Grupal MD)

**Duración:** 21 días / 19 noches  
**Vuelo internacional:** Aéreo desde COR por UX  
**Equipaje:** Carry + 23kg  
**Destinos y noches:**  
• 3 Londres • 3 París • 1 Frankfurt • 1 Zúrich • 1 Múnich • 1 Venecia • 3 Roma • 1 Florencia • 1 Costa Azul • 1 Barcelona • 3 Madrid  

**Incluye:** Traslado de llegada, guía acompañante todo el recorrido, desayuno diario, autocar de lujo, visitas en Londres/París/Roma/Florencia/Madrid con guías locales, audioguía, seguro turístico y traslados de salida.  
**Asistencia al viajero:**  
• Salida 16 de mayo: no incluida (ver opcionales)  
• Salida 19 de septiembre: incluida  

Value 80k  

**16 Mayo 2026**  

**19 Septiembre 2026**  

Paquete promocional: sin cambios ni devoluciones.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde COR (UX)" },
          { tipo: "Equipaje", descripcion: "Carry + 23kg" },
          { tipo: "Alojamiento", descripcion: "Hoteles según programa (Europa)" },
          { tipo: "Régimen", descripcion: "Desayuno diario" },
          { tipo: "Servicios", descripcion: "Guía acompañante + autocar + audioguía" },
          { tipo: "Excursiones", descripcion: "Visitas en Londres, París, Roma, Florencia y Madrid" },
          { tipo: "Asistencia", descripcion: "Seguro turístico (según salida)" },
          { tipo: "Detalle-Salidas", descripcion: "16 Mayo 2026 y 19 Septiembre 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...europaMaximoPackage);

  const joyasBalcanicasPackage = [
    {
      titulo: "Joyas Balcánicas",
      slug: "joyas-balcanicas-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 15,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 49,
      noIncluye: `
• Excursiones opcionales y traslados no indicados
• Gastos personales, bebidas, almuerzos y cenas
      `.trim(),
      condiciones: `
## Joyas Balcánicas I

**Duración:** 15 noches  
**Transporte:** Aéreo BA/Bucarest/Belgrado/BA (Air France/KLM)  
**Equipaje:** 01 maleta de 23kg  
**Alojamiento:** Hoteles categoría X  
**Incluye:** Traslados con asistencia, excursiones según itinerario, guía en español  
**Asistencia Médica:** Assist Card 100k  

**13 Agosto 2026**  

Paquete promocional: sin cambios ni devoluciones.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo BA/Bucarest/Belgrado/BA (Air France/KLM)" },
          { tipo: "Equipaje", descripcion: "1 maleta de 23kg" },
          { tipo: "Alojamiento", descripcion: "Hoteles categoría X" },
          { tipo: "Servicios", descripcion: "Traslados con asistencia" },
          { tipo: "Excursiones", descripcion: "Excursiones según itinerario" },
          { tipo: "Guía", descripcion: "Guía de habla hispana" },
          { tipo: "Asistencia", descripcion: "Assist Card 100k" },
          { tipo: "Detalle-Salidas", descripcion: "13 Agosto 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...joyasBalcanicasPackage);

  const turquiaIslasGriegasPackage = [
    {
      titulo: "Turquía e Islas Griegas",
      slug: "turquia-islas-griegas-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 12,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 50,
      noIncluye: `
• Excursiones opcionales, gastos personales y bebidas
• Traslados no indicados o en días diferentes
      `.trim(),
      condiciones: `
## Turquía e Islas Griegas

**Duración:** 15 días / 12 noches  
**Transporte:** Aéreos desde Ezeiza (KLM)  
**Equipaje:** 01 maleta de 23kg  
**Alojamiento:** Hoteles categoría Platino 4★/5★  
**Incluye:** Pasaje aéreo, 12 noches según régimen, traslados con asistencia, visitas según programa  
**Asistencia Médica:** Assist Card 100k  

**11 Junio 2026**  

Paquete promocional: sin cambios ni devoluciones.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde EZE (KLM)" },
          { tipo: "Equipaje", descripcion: "1 maleta de 23kg" },
          { tipo: "Alojamiento", descripcion: "Hoteles Platino 4★/5★" },
          { tipo: "Servicios", descripcion: "Traslados con asistencia" },
          { tipo: "Excursiones", descripcion: "Visitas según programa" },
          { tipo: "Asistencia", descripcion: "Assist Card 100k" },
          { tipo: "Detalle-Salidas", descripcion: "11 Junio 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...turquiaIslasGriegasPackage);

  const turquiaDubaiPackage = [
    {
      titulo: "Turquía y Dubái",
      slug: "turquia-dubai-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 14,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 51,
      noIncluye: `
• Excursiones opcionales, gastos personales y bebidas
• Traslados no indicados o en días diferentes
      `.trim(),
      condiciones: `
## Turquía y Dubái

**Duración:** 16 días / 14 noches  
**Transporte:** Aéreos desde Ezeiza (Emirates)  
**Equipaje:** 01 maleta de 23kg  
**Alojamiento:** Hoteles categoría Platino 4★/5★  
**Incluye:** Pasaje aéreo, 14 noches según régimen, traslados con asistencia, excursiones según programa  
**Asistencia Médica:** Assist Card 100k  

**17 Abril 2026** (salida a requerir, disponible hasta 01 Marzo 2026)  

Paquete promocional: sin cambios ni devoluciones.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde EZE (Emirates)" },
          { tipo: "Equipaje", descripcion: "1 maleta de 23kg" },
          { tipo: "Alojamiento", descripcion: "Hoteles Platino 4★/5★" },
          { tipo: "Servicios", descripcion: "Traslados con asistencia" },
          { tipo: "Excursiones", descripcion: "Visitas según programa" },
          { tipo: "Asistencia", descripcion: "Assist Card 100k" },
          { tipo: "Detalle-Salidas", descripcion: "17 Abril 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...turquiaDubaiPackage);

  const turquiaIslasDubaiPackage = [
    {
      titulo: "Turquía, Islas Griegas y Dubái",
      slug: "turquia-islas-griegas-dubai-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 17,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 52,
      noIncluye: `
• Excursiones opcionales, gastos personales y bebidas
      `.trim(),
      condiciones: `
## Turquía, Islas Griegas y Dubái

**Duración:** 19 días / 17 noches  
**Transporte:** Aéreos desde Ezeiza (Emirates)  
**Equipaje:** 01 maleta de 23kg  
**Alojamiento:** Hoteles categoría Platino 4★/5★  
**Incluye:** Pasaje aéreo, 17 noches según régimen, traslados con asistencia, visitas según programa  
**Asistencia Médica:** Assist Card 100k  

**04 Mayo 2026**  

**13 Julio 2026**  

Paquete promocional: sin cambios ni devoluciones.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Aéreo desde EZE (Emirates)" },
          { tipo: "Equipaje", descripcion: "1 maleta de 23kg" },
          { tipo: "Alojamiento", descripcion: "Hoteles Platino 4★/5★" },
          { tipo: "Servicios", descripcion: "Traslados con asistencia" },
          { tipo: "Excursiones", descripcion: "Visitas según programa" },
          { tipo: "Asistencia", descripcion: "Assist Card 100k" },
          { tipo: "Detalle-Salidas", descripcion: "04 Mayo 2026 y 13 Julio 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...turquiaIslasDubaiPackage);

  /* Regular Packages Definition */
  const regularPackages = [
    {
      titulo: "Finalissima 2026",
      slug: "finalisima-2026",
      destinoId: null,
      noches: 4,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 28,
      noIncluye: `
• Servicios no detallados en el programa
      `.trim(),
      condiciones: `
## 🏆 FINALÍSIMA 2026 – MARZO
ARGENTINA vs ESPAÑA

### Programa con aéreo (charter argentino)
Incluye ✈️ Vuelo charter • 🏨 Alojamiento 5★ • 🎟️ Entrada categoría 1 • 🚌 Traslados IN/OUT y hotel–estadio–hotel • 🌙 4 noches en Qatar  

### Programa sin aéreo
Incluye 🏨 Alojamiento 5★ con desayuno • 🎟️ Entrada categoría 1 • 🚌 Traslados hotel–estadio–hotel • 🌙 3 noches en Qatar  

### Aéreo desde Madrid
Incluye ✈️ Aéreo desde MAD (Qatar Airways) • 🏨 Alojamiento 5★ con desayuno • 🎟️ Entrada categoría 1 • 🚌 Traslados hotel–estadio–hotel • 🌙 3 noches en Qatar  

Estimativo de salida: 24 de marzo por la noche o 25 de marzo por la madrugada.  

### Itinerario
**Día 1 — Día de salida:** Comienza la experiencia.  
**Día 2 — Estadía en destino:** Viví cada momento.  
**Día 3 — Día de regreso:** Fin del viaje, inicio de nuevos planes.  
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Charter argentino / opción sin aéreo / opción desde MAD" },
          { tipo: "Alojamiento", descripcion: "Hotel 5★ con desayuno" },
          { tipo: "Entrada", descripcion: "Entrada categoría 1" },
          { tipo: "Traslados", descripcion: "Traslados hotel–estadio–hotel" },
          { tipo: "Servicios", descripcion: "Paquetes con 3 o 4 noches en Qatar" },
          { tipo: "Detalle-Salidas", descripcion: "Marzo 2026 (24-25 estimativo)" }
        ]
      },
    },
    {
      titulo: "Porto de Galinhas - Vuelo Regular 2026",
      slug: "porto-galinhas-regular-2026",
      destinoId: null,
      noches: 7,
      cupos: 30,
      destacada: true,
      activa: true,
      orden: 29,
      noIncluye: `
• Gastos personales y propinas
• Equipaje en bodega (consultar costo adicional)
      `.trim(),
      condiciones: `
## Porto de Galinhas desde Córdoba

**Duración:** 7 Noches
**Salidas:** 31 Marzo, 11 Abril, 18 Abril, 10 Mayo 2026
**Inicio:** Córdoba (Vuelo Regular)

### El programa incluye:
• Aéreos desde Córdoba en vuelo regular
• 7 Noches de Alojamiento
• Traslados de ingreso y egreso
• Asistencia al viajero AC35

### Hoteles Previstos
• **Porto 2 Life**

### Equipaje Incluido
• **De mano:** 10 kg (Carry on + Bolso de mano).
• *Nota: La suma de ambos no debe superar los 10kg.*
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo Regular desde Córdoba" },
          { tipo: "Alojamiento", descripcion: "7 noches en Porto 2 Life" },
          { tipo: "Traslados", descripcion: "Traslados IN/OUT" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero AC35" },
          { tipo: "Equipaje", descripcion: "De mano hasta 10kg" }
        ]
      },
    }
  ];
  salidasGrupales.push(...regularPackages);

  /* Colombia Packages Definition */
  const colombiaPackages = [
    {
      titulo: "Cartagena & San Andrés 2026",
      slug: "cartagena-san-andres-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 8,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 30,
      noIncluye: `
• Servicios adicionales no especificados
      `.trim(),
      condiciones: `
## Cartagena & San Andrés - Cupos OK LATAM

**Duración:** 8 Noches
**Inicio:** Córdoba
**Salida:** 2026 (Cupos confirmados)

### El programa incluye:
• Aéreos desde Córdoba con LATAM (Cupos OK)
• 8 Noches de Alojamiento (3 en Cartagena + 5 en San Andrés)
• Traslados de ingreso y egreso
• Régimen de comidas: Todo Incluido
• Asistencia al Viajero AC35

### Hoteles Previstos
• **Decameron Cartagena / Decameron San Luis**
• **Decameron Cartagena / Decameron Marazul**
• **Decameron Cartagena / Decameron Maryland**
• **Decameron Cartagena / Decameron Isleño**

### Equipaje Incluido
• **Artículo personal:** (45x35x20cm, máx 3kg)
• **Equipaje de mano (Carry on):** (55x35x25cm, máx 10kg)
• **Equipaje en bodega:** (Máx 158cm lineales, máx 23kg)
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreos LATAM desde Córdoba (Cupos OK)" },
          { tipo: "Alojamiento", descripcion: "3 noches en Cartagena" },
          { tipo: "Alojamiento", descripcion: "5 noches en San Andrés" },
          { tipo: "Régimen", descripcion: "Todo Incluido" },
          { tipo: "Traslados", descripcion: "Traslados IN/OUT" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero AC35" },
          { tipo: "Equipaje", descripcion: "Bodega 23kg + Carry On 10kg + Mochila" }
        ]
      },
    },
    {
      titulo: "Colombia con Aromas de Café 2026",
      slug: "colombia-aromas-cafe-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 10,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 31,
      noIncluye: `
• Extras no especificados
      `.trim(),
      condiciones: `
## Colombia con Aromas de Café - Salida Grupal

**Duración:** 11 Días / 10 Noches
**Salidas:** 10 de Mayo, 8 de Julio 2026
**Inicio:** Córdoba (Bogotá / Pereira / San Andrés)

### El programa incluye:
• Aéreo desde Córdoba con LATAM
• 3 noches en Bogotá (Desayuno) + City Tour El Dorado y Monserrate + Mina de Sal
• 2 noches en Pereira (Desayuno) + Tour Finca de Café
• 5 noches en San Andrés (All Inclusive) + Vuelta a la Isla
• Traslados, Guía privado en español y Coordinador permanente
• Asistencia al viajero AC60

### Hoteles Previstos
• **Bogotá:** BH Mercure
• **Pereira:** Finca Hotel Yerbabuena
• **San Andrés:** GHL Relax

### Equipaje Incluido
• **Artículo personal:** (45x35x20cm, máx 3kg)
• **Equipaje de mano:** 10 kg
• **Equipaje en bodega:** 23 kg

### Itinerario Resumido
• **Día 1:** Llegada a Bogotá
• **Día 2:** Bogotá - City Tour
• **Día 3:** Bogotá - Mina de Sal
• **Día 4:** Vuelo a Pereira - Finca Cafetera
• **Día 5:** Pereira - Día Libre
• **Día 6:** Vuelo a San Andrés
• **Día 7:** San Andrés - Vuelta a la Isla
• **Día 8-11:** San Andrés (Playa y descanso)

### Adicionales Traslados (Opcional)
• **Santa Fe:** U$D 87
• **Sunchales, Rafaela, Esperanza:** U$D 67
• **San Francisco:** U$D 57
• **Rosario:** U$D 90
• **Villa María:** U$D 57
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreos LATAM desde Córdoba" },
          { tipo: "Alojamiento", descripcion: "3n Bogotá + 2n Pereira + 5n San Andrés" },
          { tipo: "Régimen", descripcion: "Desayuno (Bogotá/Pereira) + All Inclusive (San Andrés)" },
          { tipo: "Excursión", descripcion: "City Tour, Mina de Sal, Finca Cafetera, Vuelta a la Isla" },
          { tipo: "Asistencia", descripcion: "Asist. AC60 + Coordinador permanente" },
          { tipo: "Equipaje", descripcion: "Bodega 23kg + Carry On 10kg" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Llegada a Bogotá" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Bogotá - City tour el Dorado" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Bogotá – Mina de Sal y Zipaquirá" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Bogotá / Pereira (Eje Cafetero) City Tour Finca del Café" },
          { tipo: "Itinerario-5", descripcion: "Día 5: Pereira - Día Libre" },
          { tipo: "Itinerario-6", descripcion: "Día 6: Pereira / Isla de San Andrés" },
          { tipo: "Itinerario-7", descripcion: "Día 7: San Andrés - Vuelta a la Isla" },
          { tipo: "Itinerario-8", descripcion: "Día 8-11: San Andrés (Playa y relax)" }
        ]
      },
    }
  ];
  salidasGrupales.push(...colombiaPackages);

  /* Mexico Packages Definition */
  const mexicoPackages = [
    {
      titulo: "México a su tiempo 2026 – Grupal",
      slug: "mexico-a-su-tiempo-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 11,
      cupos: 15,
      destacada: true,
      activa: true,
      orden: 20,
      noIncluye: `
• Extras no especificados en el programa.
• Propinas a camaristas, guías y conductores
• Servicios adicionales
• Comidas y bebidas no especificadas
• Entradas no detalladas
• Tasas turísticas a abonar en destino
      `.trim(),
      condiciones: `
## México a su tiempo 2026 – Grupal

**Duración:** 12 Días 11 Noches
**Inicio:** Córdoba
**Salidas:** 5 Agosto

### El programa incluye:
• Aéreo desde Córdoba con LATAM
• Alojamiento de tipo categoría turista con régimen según hotel
• 4 noches en Ciudad de México con Desayuno
• 1 noche es Taxco con Desayuno
• 6 noches en Playa del Carmen con All Inclusive
• Traslados de ingreso y egreso
• Excursiones según programa: City Tour, Basílica, Pirámides, Cuernavaca y Taxco
• Coordinador permanente y guías locales
• Asistencia al viajero AC-60

### Hoteles Previstos (o similares)
• **CIUDAD DE MÉXICO:** ROYAL REFORMA (4 noches)
• **TAXCO:** AGUA ESCONDIDA (1 noche)
• **PLAYA DEL CARMEN:** THE REEF PLAYACAR (6 noches)

### Nota Importante
Salida grupal acompañada por un coordinador desde el inicio del itinerario. Si el grupo no llegase al mínimo de 15 pasajeros para el acompañamiento, 360Regional Tour Operador asignará personal en el Aeropuerto de salida para despachar el grupo y nuestro receptivo en destino dará asistencia.

### Itinerario
• **Día 1:** Córdoba - México
• **Día 2:** México - Visita de Ciudad de México
• **Día 3:** México - Basílica de Guadalupe y Pirámides de Teotihuacan
• **Día 4:** México - Cuernavaca y Taxco
• **Día 5:** Día libre en Taxco - Regreso a la Ciudad de México
• **Día 6:** México - Playa del Carmen en la Riviera Maya
• **Día 7-11:** Playa del Carmen (Días de playa)
• **Día 12:** Playa del Carmen - Córdoba
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo desde Córdoba con LATAM" },
          { tipo: "Alojamiento", descripcion: "4n CDMX + 1n Taxco + 6n Playa del Carmen" },
          { tipo: "Régimen", descripcion: "Desayuno (CDMX/Taxco) + All Inclusive (Playa)" },
          { tipo: "Excursiones", descripcion: "City Tour, Basílica, Pirámides, Cuernavaca, Taxco" },
          { tipo: "Traslados", descripcion: "Traslados de ingreso, egreso e inter-hoteles" },
          { tipo: "Asistencia", descripcion: "Asistencia AC-60 + Coordinador permanente" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Córdoba - México" },
          { tipo: "Itinerario-2", descripcion: "Día 2: México - Visita de Ciudad de México" },
          { tipo: "Itinerario-3", descripcion: "Día 3: México - Basílica de Guadalupe y Pirámides" },
          { tipo: "Itinerario-4", descripcion: "Día 4: México - Cuernavaca y Taxco" },
          { tipo: "Itinerario-5", descripcion: "Día 5: Taxco - Regreso a CDMX" },
          { tipo: "Itinerario-6", descripcion: "Día 6: México - Playa del Carmen" },
          { tipo: "Itinerario-7", descripcion: "Día 7-11: Playa del Carmen" },
          { tipo: "Itinerario-8", descripcion: "Día 12: Playa del Carmen - Córdoba" }
        ]
      },
    }
  ];
  salidasGrupales.push(...mexicoPackages);

  /* Cuba Packages Definition */
  const cubaPackages = [
    {
      titulo: "Chárter Aéreo a Cuba",
      slug: "charter-aereo-cuba",
      destinoId: null,
      tipo: "paquete",
      noches: 8,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 32,
      noIncluye: `
• Extras no especificados en el programa.
      `.trim(),
      condiciones: `
## Chárter Aéreo a Cuba

**Duración:** 8 Noches
**Inicio:** Córdoba
**Salidas:** 04 y 18 Enero, 01 y 15 Febrero 2026

### El programa incluye:
• Aéreo desde COR
• Alojamiento por 8 noches
• Régimen All inclusive
• Traslados de ingreso y egreso
• Asistencia al viajero

### Hoteles posibles
• **STARFISH CAYO LARGO**
• **VILLA LINDA MAR**
• **MEMORIES CAYO LARGO**
• **SANCTUARY CAYO LARGO**

### Equipaje Incluido
• **Equipaje de mano:** Mochila, cartera o bolso de hasta 5 kg
• **Equipaje en bodega:** 1 pieza por pasajero de hasta 15kg (máx 158 cm lineales)

### Servicios Adicionales
• Consultar por excursiones opcionales extra
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo desde COR" },
          { tipo: "Alojamiento", descripcion: "8 noches de estadía" },
          { tipo: "Régimen", descripcion: "All inclusive" },
          { tipo: "Traslados", descripcion: "Traslados de ingreso y egreso" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero" },
          { tipo: "Equipaje", descripcion: "Bodega 15kg + Mano 5kg" },
          { tipo: "Fechas", descripcion: "04 y 18 Enero, 01 y 15 Febrero 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...cubaPackages);

  /* Peru Packages Definition */
  const peruPackages = [
    {
      titulo: "Perú Aéreo Grupal",
      slug: "peru-aereo-grupal-2026",
      destinoId: null,
      tipo: "grupal",
      noches: 9,
      cupos: 25,
      destacada: true,
      activa: true,
      orden: 33,
      noIncluye: `
• Extras no especificados en el programa.
• Servicios adicionales
      `.trim(),
      condiciones: `
## Perú Aéreo Grupal

**Duración:** 10 Días / 9 Noches
**Salidas desde Córdoba:** 9 Abril, 10 Mayo, 20 Junio, 4 y 8 Julio 2026
**Salidas desde Rosario:** 10 Mayo, 21 Junio*, 8 Julio** 2026
**Régimen:** Desayuno

### El programa incluye:
• Aéreo desde Córdoba, Rosario, Mendoza y Buenos Aires con LATAM
• Alojamiento de tipo categoría turista con desayuno
• Traslados de Ingreso y Egreso
• Guía privado en idioma español
• Excursiones según programa
• Bus turístico Cusco Puno con almuerzo
• Entrada y visita guiada a la Ciudadela de Machu Picchu
• Tickets de tren Expedition
• Entradas de ingreso a atractivos mencionados en el itinerario
• Coordinador permanente y Asistencia al viajero

### Itinerario de Alojamiento (9 Noches)
• **Lima:** 2 Noches *
• **Cusco:** 2 Noches
• **Valle Sagrado:** 1 Noche
• **Aguas Calientes (Machu Picchu):** 1 Noche
• **Cusco:** 1 Noche
• **Puno:** 2 Noches

### Equipaje Incluido
• **Artículo personal:** (45x35x20cm, máx 3kg) debajo del asiento.
• **Equipaje de mano (Carry on):** (55x35x25cm, máx 10kg).
• **Equipaje en bodega:** (Máx 158cm lineales, máx 23kg).

### Itinerario Detallado
• **DÍA 1:** LLEGADA A LIMA
• **DÍA 2:** LIMA – VISITA A LA CIUDAD Y MUSEO LARCO
• **DÍA 3:** LIMA - CUSCO
• **DÍA 4:** CUSCO - City tour & Ruinas cercanas
• **DÍA 5:** CUSCO - VALLE SAGRADO
• **DÍA 6:** VALLE SAGRADO - AGUAS CALIENTES - Machu Picchu
• **DÍA 7:** AGUAS CALIENTES - CUSCO
• **DÍA 8:** CUSCO – PUNO - Ruta del Sol
• **DÍA 9:** PUNO - Visita a las Islas Uros & Taquile en el Lago Titicaca
• **DÍA 10:** PUNO - REGRESO
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreos LATAM desde COR/ROS/MDZ/BUE" },
          { tipo: "Alojamiento", descripcion: "2n Lima + 3n Cusco + 1n Valle + 1n Aguas Calientes + 2n Puno" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Excursiones", descripcion: "City Tours, Machu Picchu, Valle Sagrado, Ruta del Sol, Uros & Taquile" },
          { tipo: "Traslados", descripcion: "Todos los traslados y tren Expedition incluidos" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero + Coordinador" },
          { tipo: "Equipaje", descripcion: "Bodega 23kg + Carry On 10kg + Mochila" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Llegada a Lima" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Lima - City Tour" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Lima - Cusco" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Cusco - City Tour" },
          { tipo: "Itinerario-5", descripcion: "Día 5: Valle Sagrado" },
          { tipo: "Itinerario-6", descripcion: "Día 6: Machu Picchu" },
          { tipo: "Itinerario-7", descripcion: "Día 7: Aguas Calientes - Cusco" },
          { tipo: "Itinerario-8", descripcion: "Día 8: Ruta del Sol" },
          { tipo: "Itinerario-9", descripcion: "Día 9: Lago Titicaca" }
        ]
      },
    },
    {
      titulo: "Perú y Bolivia 2026",
      slug: "peru-y-bolivia-2026",
      destinoId: null, // Will be set to Bolivia logic
      tipo: "grupal",
      noches: 13,
      cupos: 25,
      destacada: true,
      activa: true,
      orden: 34,
      noIncluye: `
• Entradas
• Extras no especificados en el programa.
• Propinas a camaristas, guías y conductores
• Servicios adicionales
      `.trim(),
      condiciones: `
## Perú y Bolivia 2026

**Duración:** 13 Noches
**Inicio:** Córdoba
**Salidas:** 15 Mayo, 3 y 17 Julio

### El programa incluye:
• Bus Cama desde Córdoba. Obligatorio sistema rotativo de asientos.
• 13 Noches de Alojamiento con Desayuno, hoteles Categoría Turista.
• 1 noche en Tilcara
• 1 noche en Uyuni
• 1 noche en Puno
• 4 noches en Cusco
• 1 noche en Aguas Calientes
• 2 noches en Copacabana
• 2 noches en La Paz
• 1 noche en San Salvador de Jujuy
• 13 Comidas incluidas (pueden variar de orden en itinerario)
• Coordinador permanente y guías locales profesionales
• Asistencia al Viajero AC60
• Servicios en Privado

### Traslados, visitas y excursiones:
• Tilcara y Purmamarca
• Salar de Uyuni
• Visita nocturna al salar
• Navegacion Isla de los Uros
• City Tour en Cusco y ruinas aledañas
• Valle Sagrado de los Incas
• Machu Pichu en tren (no incluye entrada)
• Copacabana, Tiwanaku, La Paz

### Adicional traslados desde:
• **Santa Fe:** U$D 87
• **Sunchales, Rafaela, Esperanza:** U$D 67
• **San Francisco:** U$D 57
• **Rosario:** U$D 90
• **Villa Maria:** U$D 57

### Nota Importante: Ingreso a Machu Picchu
Ingreso a Machu Picchu: solo se puede confirmar con los datos completos de los pasajeros y reserva confirmada. Una vez emitidos podremos informar el horario de la visita y horarios. Considerar que una vez emitidos no están sujetos a cambios ni devoluciones.

Con el fin de preservar el Santuario Histórico de Machu Picchu, el Ministerio de Cultura ha dispuesto reducir el número de visitantes diarios. Se recomienda realizar la compra inmediata de entradas. No habrá reembolsos ni modificaciones.

### Itinerario
**DÍA 1:** SALIDA DESDE CORDOBA
**DÍA 2:** QUEBRADA DE HUMAHUCA – PURMAMARCA - TILCARA
**DÍA 3:** TILCARA -LA QUIACA - TUPIZA – UYUNI
**DÍA 4:** UYUNI - SALAR DE UYUNI
**DÍA 5:** DESAGUADERO-PUNO
**DÍA 6:** PUNO-CUSCO
**DÍA 7:** CUSCO - SACSAYHUAMAN - CORICANCHA - QENQO - PUCA PUCARA
**DÍA 8:** CUSCO - VALLE SAGRADO - OLLANTAYTAMBO - AGUAS CALIENTES
**DÍA 9:** MACHU PICCHU – CUSCO
**DÍA 10:** CUSCO
**DÍA 11:** CUSCO - COPACABANA.
**DÍA 12:** COPACABANA - ISLA DEL SOL.
**DÍA 13:** COPACABANA – LA PAZ
**DÍA 14:** LA PAZ
**DÍA 15:** LA PAZ - VILLAZÓN
**DÍA 16:** VILLAZÓN - SAN SALVADOR DE JUJUY
**DÍA 17:** SAN SALVADOR DE JUJUY - CÓRDOBA
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Transporte", descripcion: "Bus Cama desde Córdoba" },
          { tipo: "Alojamiento", descripcion: "13 Noches con desayuno" },
          { tipo: "Régimen", descripcion: "13 Comidas incluidas" },
          { tipo: "Excursiones", descripcion: "Salar de Uyuni, Machu Picchu, Isla de los Uros y más" },
          { tipo: "Asistencia", descripcion: "Asistencia al Viajero AC60" },
          { tipo: "Coordinador", descripcion: "Permanente y guías locales" },
          { tipo: "Detalle-Salidas", descripcion: "15 Mayo, 3 y 17 Julio" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Salida desde Córdoba" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Quebrada de Humahuaca - Purmamarca - Tilcara" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Tilcara - La Quiaca - Tupiza - Uyuni" },
          { tipo: "Itinerario-4", descripcion: "Día 4: Uyuni - Salar de Uyuni" },
          { tipo: "Itinerario-5", descripcion: "Día 5: Desaguadero - Puno" },
          { tipo: "Itinerario-6", descripcion: "Día 6: Puno - Cusco" },
          { tipo: "Itinerario-7", descripcion: "Día 7: Cusco - City Tour y Ruinas" },
          { tipo: "Itinerario-8", descripcion: "Día 8: Valle Sagrado - Aguas Calientes" },
          { tipo: "Itinerario-9", descripcion: "Día 9: Machu Picchu - Cusco" },
          { tipo: "Itinerario-10", descripcion: "Día 10: Cusco Libre" },
          { tipo: "Itinerario-11", descripcion: "Día 11: Cusco - Copacabana" },
          { tipo: "Itinerario-12", descripcion: "Día 12: Copacabana - Isla del Sol" },
          { tipo: "Itinerario-13", descripcion: "Día 13: Copacabana - La Paz" },
          { tipo: "Itinerario-14", descripcion: "Día 14: La Paz City Tour" },
          { tipo: "Itinerario-15", descripcion: "Día 15: La Paz - Villazón" },
          { tipo: "Itinerario-16", descripcion: "Día 16: Villazón - San Salvador de Jujuy" },
          { tipo: "Itinerario-17", descripcion: "Día 17: Llegada a Córdoba" }
        ]
      },
    }
  ];
  salidasGrupales.push(...peruPackages);

  /* Europe Packages Definition */
  const europaPackages = [
    {
      titulo: "Europa a Su Tiempo 2026 – Grupal",
      slug: "europa-a-su-tiempo-2026",
      destinoId: null, // Will be linked to Madrid or another main hub
      tipo: "grupal",
      noches: 21,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 35,
      noIncluye: `
• Almuerzos y cenas no especificados en el programa.
• Paseos y excursiones extras no especificadas.
• Entradas no detalladas.
• Bebidas en las comidas.
• Tasas turísticas a abonar en destino.
      `.trim(),
      condiciones: `
## Europa a Su Tiempo 2026 – Grupal

**Duración:** 24 Días / 21 Noches
**Inicio:** Córdoba - Buenos Aires
**Salida:** 07 Mayo 2026

### El programa incluye:
• Aéreo desde Córdoba o Buenos Aires con Air Europa
• 21 noches de alojamiento con desayuno:
  - 3 noches en Madrid
  - 3 noches en Barcelona
  - 3 noches en Paris
  - 3 noches en Londres
  - 3 noches en Mestre
  - 2 noches en Florencia
  - 4 noches en Roma
• Bus Autocar exclusivo para todo el Grupo en España e Italia.
• Guiado privado en idioma español en todo el recorrido.
• Vuelo Interno de Londres a Venecia.
• Tickets de Tren de Alta Velocidad (Barcelona – Paris, Paris – Londres).
• 02 Comidas Incluidas (Cena Bienvenida y Cena Despedida).
• 03 Cenas en Mestre.
• Coordinador permanente y guías locales.
• Asistencia al viajero.

### Excursiones Incluidas:
• Visitas panorámicas (City Tour) en: Madrid, Barcelona, Paris, Londres, Venecia, Florencia, Roma.
• Terraza Panorámica en Venecia y Paseo en Góndola.
• Sky Garden en Londres.
• Ingreso Coliseo / Foro Romano.
• Basílica de San Pedro.
• Viajes en Metro / Underground.

### Equipaje Incluido:
• **Artículo personal:** hasta 3kg (45x35x20cm).
• **Equipaje de mano (carry on):** hasta 10kg (55x35x25cm).
• **Equipaje en bodega:** hasta 23kg (158cm lineales).

### Hoteles Previstos (o similares):
• Madrid: Hotel Agumar
• Barcelona: Hotel Catalonia Ramblas
• Paris: Hotel Cittadines Tour Eiffel
• Londres: Royal National
• Mestre: Hotel Mercure Marghera
• Florencia: Hotel B&B Firenze City Center
• Roma: Hotel Exe Domus Aurea

### Itinerario
**DÍA 1:** Córdoba - Madrid
**DÍA 2:** Madrid + Cena en Chueca
**DÍA 3:** Madrid City Tour + Parque del Retiro
**DÍA 4:** Madrid - Toledo
**DÍA 5:** Madrid – Zaragoza – Barcelona
**DÍA 6:** Barcelona – Villa Olimpica – Flamenco & Tapas
**DÍA 7:** Barcelona Parc Guell – Montjuic
**DÍA 8:** Barcelona – Paris – Paseo Nocturno
**DÍA 9:** París – City Tour – Torre Eiffel
**DÍA 10:** París Versalles - Montmartre
**DÍA 11:** Paris – Londres
**DÍA 12:** Londres – City Tour
**DÍA 13:** Londres Tower Bridge – Londres Antigua
**DÍA 14:** Londres – Venecia (Mestre)
**DÍA 15:** Venecia / Sirmione / Verona / Venecia
**DÍA 16:** Venecia – City Tour – Terraza
**DÍA 17:** Venecia – Padua – Florencia
**DÍA 18:** Florencia – City Tour
**DÍA 19:** Florencia – Pisa – Asís – Roma
**DÍA 20:** Roma – City Tour
**DÍA 21:** Roma – Coliseo Romano
**DÍA 22:** Roma – Vaticano
**DÍA 23:** Roma
**DÍA 24:** Fin de los servicios
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Desde COR/BUE con Air Europa" },
          { tipo: "Alojamiento", descripcion: "21 Noches con desayuno" },
          { tipo: "Transporte", descripcion: "Bus Autocar Exclusivo / Trenes / Vuelos" },
          { tipo: "Excursiones", descripcion: "City Tours, Coliseo, Góndola, Versalles y más" },
          { tipo: "Comidas", descripcion: "Cena Bienvenida, Despedida y 3 en Mestre" },
          { tipo: "Coordinador", descripcion: "Permanente en español" },
          { tipo: "Asistencia", descripcion: "Asistencia al viajero incluida" },
          { tipo: "Equipaje", descripcion: "Bodega 23kg + Carry On 10kg + Mochila" },
          { tipo: "Detalle-Salidas", descripcion: "07 Mayo 2026" },
          { tipo: "Itinerario-1", descripcion: "Día 1: Vuelo Córdoba - Madrid" },
          { tipo: "Itinerario-2", descripcion: "Día 2: Llegada a Madrid" },
          { tipo: "Itinerario-3", descripcion: "Día 3: Madrid City Tour" },
          { tipo: "Itinerario-5", descripcion: "Día 5: Madrid - Barcelona" },
          { tipo: "Itinerario-8", descripcion: "Día 8: Barcelona - París" },
          { tipo: "Itinerario-11", descripcion: "Día 11: París - Londres" },
          { tipo: "Itinerario-14", descripcion: "Día 14: Londres - Venecia" },
          { tipo: "Itinerario-19", descripcion: "Día 19: Florencia - Roma" },
          { tipo: "Itinerario-24", descripcion: "Día 24: Regreso" }
        ]
      },
    }
  ];
  salidasGrupales.push(...europaPackages);

  /* New Packages: Aruba and Bayahibe */
  const newCaribbeanPackages = [
    {
      titulo: "Paquete a Aruba desde Córdoba",
      slug: "aruba-desde-cordoba-2026",
      destinoId: null, // Will be linked via script logic safely
      tipo: "paquete",
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 53,
      noIncluye: "Consultar diferencia por pasajeros mayores de 74 años.",
      condiciones: `
## Paquete a Aruba desde Córdoba
**Desde:** Córdoba
**Meses de Salida:** mayo 2026
**Cantidad de noches:** 7 noches

### ✅ INCLUYE
✈️ Pasaje aéreo directo Córdoba / Aruba / Córdoba volando con Aerolíneas Argentinas. Incluye carry on.
🚍 Traslados Aeropuerto - Hotel - Aeropuerto en servicio regular.
🏨 Alojamiento por 7 noches en Aruba sin pensión, en base doble.
🩺 Asistencia al viajero Assist Card AC150 FULL (hasta 74 años cumplidos).

**ORIGEN:** COR
**DESTINO:** AUA (Aruba)
**FECHA SALIDA:** MAYO
**ALOJAMIENTO:** EAGLE ARUBA RESORT & CASINO 3★
**CATEGORÍA Y REGIMEN:** PREMIUM S/COMIDAS
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Aéreo directo Córdoba / Aruba / Córdoba (Aerolíneas Argentinas)" },
          { tipo: "Equipaje", descripcion: "Incluye Carry On" },
          { tipo: "Traslados", descripcion: "Aeropuerto - Hotel - Aeropuerto (Regular)" },
          { tipo: "Alojamiento", descripcion: "7 noches en Eagle Aruba Resort & Casino 3★" },
          { tipo: "Régimen", descripcion: "Sin Comidas" },
          { tipo: "Asistencia", descripcion: "Assist Card AC150 FULL (hasta 74 años)" },
          { tipo: "Salidas", descripcion: "Mayo 2026" }
        ]
      },
    },
    {
      titulo: "Paquete a Bayahíbe desde Córdoba",
      slug: "bayahibe-desde-cordoba-2026",
      destinoId: null, // Will be linked via script logic safely
      tipo: "paquete",
      noches: 8,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 54,
      noIncluye: "Consultar diferencia por pasajeros mayores de 74 años.",
      condiciones: `
## Paquete a Bayahíbe desde Córdoba
**Desde:** Córdoba
**Meses de Salida:** abril 2026, mayo 2026, junio 2026
**Cantidad de noches:** 8 noches

### ✅ INCLUYE
✈️ Vuelo a Punta Cana con LATAM Airlines, incluye carry on y 1 equipaje en bodega.
🚍 Traslados in-out regulares compartidos.
🏨 Alojamiento en Bayahíbe con all inclusive.
🩺 Asistencia al viajero Assist Card AC150 FULL.

**17/04/2026**

**01/05/2026**

**12/06/2026**

      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Vuelo a Punta Cana (LATAM) con equipaje en bodega" },
          { tipo: "Traslados", descripcion: "Traslados in-out regulares" },
          { tipo: "Alojamiento", descripcion: "8 noches con All Inclusive" },
          { tipo: "Asistencia", descripcion: "Assist Card AC150 FULL" },
          { tipo: "Salidas", descripcion: "Abril, Mayo y Junio 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...newCaribbeanPackages);

  /* New Packages: Cancun and Costa Dorada */
  const moreCaribbeanPackages = [
    {
      titulo: "Paquete a Cancún desde Córdoba",
      slug: "cancun-desde-cordoba-2026",
      destinoId: null, // Linked via logic
      tipo: "paquete",
      noches: 8,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 55,
      noIncluye: "Consultar diferencia por pasajeros mayores de 74 años.",
      condiciones: `
## Paquete a Cancún desde Córdoba
**Desde:** Córdoba
**Meses de Salida:** marzo 2026
**Cantidad de noches:** 8 noches

### ✅ INCLUYE
✈️ Vuelo con LATAM Airlines, incluye carry on y 1 equipaje en bodega.
🚍 Traslados in-out regulares compartidos.
🏨 Alojamiento en Cancún con régimen según se indica.
🩺 Asistencia al viajero Assist Card AC150 FULL.

**ALOFT CANCÚN 4★ (Aloft, Desayuno)**

**FLAMINGO CANCÚN RESORT 4★ (Standard, All Inclusive)**

**OCCIDENTAL COSTA CANCÚN 4★ (Standard, All Inclusive)**

**HOTEL RIU PALACE PENINSULA 5★ (Junior Suite, All Inclusive)**

      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Vuelo con LATAM Airlines (Carry On + Bodega)" },
          { tipo: "Traslados", descripcion: "Traslados in-out regulares" },
          { tipo: "Alojamiento", descripcion: "8 noches en Cancún" },
          { tipo: "Asistencia", descripcion: "Assist Card AC150 FULL" },
          { tipo: "Salidas", descripcion: "Marzo 2026" }
        ]
      },
    },
    {
      titulo: "Paquete a Costa Dorada desde Córdoba",
      slug: "costa-dorada-desde-cordoba-2026",
      destinoId: null, // Linked via logic
      tipo: "paquete",
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 56,
      noIncluye: "Consultar diferencia por pasajeros mayores de 74 años.",
      condiciones: `
## Paquete a Costa Dorada desde Córdoba
**Desde:** Córdoba
**Meses de Salida:** mayo 2026, junio 2026
**Cantidad de noches:** 7 noches

### ✅ INCLUYE
✈️ Pasaje aéreo a Puerto Plata desde Córdoba volando con COPA Airlines - Incluye carry on.
🚍 Traslados in-out en servicio regular compartido.
🏨 Alojamiento por 7 noches en Costa Dorada con all inclusive, en base doble.
🩺 Asistencia al viajero Assist Card AC150 FULL.

**ORIGEN:** COR
**DESTINO:** POP (Puerto Plata)
**FECHA SALIDA:** MAYO y JUNIO
**ALOJAMIENTO:** IBEROSTAR WAVES COSTA DORADA 5★
**CATEGORÍA Y REGIMEN:** PREMIUM C/ALL INCLUSIVE
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Vuelo a Puerto Plata con COPA Airlines (Carry On)" },
          { tipo: "Traslados", descripcion: "Traslados in-out regulares" },
          { tipo: "Alojamiento", descripcion: "7 noches en Iberostar Waves Costa Dorada 5★" },
          { tipo: "Régimen", descripcion: "All Inclusive" },
          { tipo: "Asistencia", descripcion: "Assist Card AC150 FULL" },
          { tipo: "Salidas", descripcion: "Mayo y Junio 2026" }
        ]
      },
    },
    {
      titulo: "Paquete a Curazao desde Córdoba",
      slug: "curazao-desde-cordoba-2026",
      destinoId: null, // Logic will handle
      tipo: "paquete",
      noches: 8,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 57,
      noIncluye: "Consultar diferencia por pasajeros mayores de 74 años.",
      condiciones: `
## Paquete a Curazao desde Córdoba
**Desde:** Córdoba
**Meses de Salida:** mayo 2026
**Cantidad de noches:** 8 noches

### ✅ INCLUYE
✈️ Pasaje aéreo Córdoba / Curazao / Córdoba volando con COPA Airlines - Incluye carry on.
🚍 Traslados Aeropuerto - Hotel – Aeropuerto en servicio regular.
🏨 Alojamiento por 8 noches en Curazao con all inclusive, en base doble.
🩺 Asistencia al viajero Assist Card AC150 FULL (hasta 74 años inclusive).

**ORIGEN:** COR
**DESTINO:** CUR (Curazao)
**FECHA SALIDA:** MAYO
**ALOJAMIENTO:** SUNSCAPE CURACAO RESORT SPA & CASINO 4★
**CATEGORÍA Y REGIMEN:** DELUXE GARDEN VIEW C/ALL INCLUSIVE
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Vuelo COPA Airlines (Carry On)" },
          { tipo: "Traslados", descripcion: "Traslados Aeropuerto - Hotel - Aeropuerto" },
          { tipo: "Alojamiento", descripcion: "8 noches en Sunscape Curacao Resort Spa & Casino 4★" },
          { tipo: "Régimen", descripcion: "All Inclusive" },
          { tipo: "Asistencia", descripcion: "Assist Card AC150 FULL" },
          { tipo: "Salidas", descripcion: "Mayo 2026" }
        ]
      },
    },
    {
      titulo: "Paquete a Los Cabos & Panamá desde Córdoba",
      slug: "loscabos-panama-desde-cordoba-2026",
      destinoId: null, // Logic will handle
      tipo: "paquete",
      noches: 7,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 58,
      noIncluye: "Consultar diferencia por pasajeros mayores de 74 años.",
      condiciones: `
## Paquete a Los Cabos & Panamá desde Córdoba
**Desde:** Córdoba
**Meses de Salida:** marzo 2026, abril 2026
**Cantidad de noches:** 7 noches (5 en Los Cabos + 2 en Panamá)

### ✅ INCLUYE
✈️ Pasaje aéreo Córdoba / Los Cabos - Panamá / Córdoba volando con COPA Airlines. Incluye carry on.
🚍 Traslados Aeropuerto - Hotel - Aeropuerto en servicio regular.
🏨 Alojamiento en base doble por 5 noches en Los Cabos con all inclusive y 2 noches en Panamá con desayuno.
📌 Excursión en Panamá: City Tour y Canal de Panamá (4 horas) en servicio compartido.
🩺 Asistencia al viajero Assist Card AC150 FULL (hasta 74 años inclusive).

**MARZO y ABRIL**
• **Los Cabos:** HOTEL RIU SANTA FE 5★ (Vista Jardin C/ All Inclusive)
• **Panamá:** VICTORIA HOTEL & SUITES 4★ (Desayuno)

      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Vuelo COPA Airlines (Carry On)" },
          { tipo: "Traslados", descripcion: "Traslados in-out regulares" },
          { tipo: "Alojamiento", descripcion: "5n Los Cabos (All Inc) + 2n Panamá (Desayuno)" },
          { tipo: "Excursión", descripcion: "Panamá: City Tour y Canal de Panamá (4hs)" },
          { tipo: "Asistencia", descripcion: "Assist Card AC150 FULL" },
          { tipo: "Salidas", descripcion: "Marzo y Abril 2026" }
        ]
      },
    },
    {
      titulo: "Paquete a Playa del Carmen desde Córdoba",
      slug: "playadelcarmen-desde-cordoba-2026",
      destinoId: null, // Logic will handle
      tipo: "paquete",
      noches: 8,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 59,
      noIncluye: "Consultar diferencia por pasajeros mayores de 74 años.",
      condiciones: `
## Paquete a Playa del Carmen desde Córdoba
**Desde:** Córdoba
**Meses de Salida:** marzo 2026
**Cantidad de noches:** 8 noches

### ✅ INCLUYE
✈️ Vuelo a Cancún con LATAM Airlines, incluye carry on y 1 equipaje en bodega.
🚍 Traslados in-out regulares compartidos.
🏨 Alojamiento en Playa del Carmen con régimen según se indica.
🩺 Asistencia al viajero Assist Card AC150 FULL.

**HOTEL RIU TEQUILA 5★ (Standard, All Inclusive)**

**VIVA WYNDHAM MAYA 4★ (Superior, All Inclusive)**

**RIU PLAYACAR 5★ (Standard, All Inclusive)**

**SANDOS PLAYACAR 5★ (Platinum King JR Suite, Solo Adultos, All Inclusive)**

      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Vuelo a Cancún LATAM (Carry On + Bodega)" },
          { tipo: "Traslados", descripcion: "Traslados in-out regulares" },
          { tipo: "Alojamiento", descripcion: "8 noches en Playa del Carmen" },
          { tipo: "Excursión", descripcion: "All Inclusive" },
          { tipo: "Asistencia", descripcion: "Assist Card AC150 FULL" },
          { tipo: "Salidas", descripcion: "Marzo 2026" }
        ]
      },
    },
    {
      titulo: "Paquete a Punta Cana desde Córdoba",
      slug: "puntacana-desde-cordoba-2026",
      destinoId: null, // Logic will handle
      tipo: "paquete",
      noches: 8,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 60,
      noIncluye: "Consultar diferencia por pasajeros mayores de 74 años.",
      condiciones: `
## Paquete a Punta Cana desde Córdoba
**Desde:** Córdoba
**Meses de Salida:** abril 2026, mayo 2026, junio 2026
**Cantidad de noches:** 8 noches

### ✅ INCLUYE
✈️ Vuelo con LATAM Airlines, incluye carry on y 1 equipaje en bodega.
🚍 Traslados in-out regulares compartidos.
🏨 Alojamiento en Punta Cana con all inclusive.
🩺 Asistencia al viajero Assist Card AC150 FULL.

**17/04/2026**

**01/05/2026**

**12/06/2026**

      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Vuelo LATAM (Carry On + Bodega)" },
          { tipo: "Traslados", descripcion: "Traslados in-out regulares" },
          { tipo: "Alojamiento", descripcion: "8 noches All Inclusive" },
          { tipo: "Asistencia", descripcion: "Assist Card AC150 FULL" },
          { tipo: "Salidas", descripcion: "Abril, Mayo y Junio 2026" }
        ]
      },
    },
    {
      titulo: "Paquete a Salvador de Bahía desde Córdoba",
      slug: "salvador-bahia-desde-cordoba-2026",
      destinoId: null, // Logic will handle
      tipo: "paquete",
      noches: 8,
      cupos: 20,
      destacada: true,
      activa: true,
      orden: 61,
      noIncluye: "Consultar diferencia por pasajeros mayores de 74 años.",
      condiciones: `
## Paquete a Salvador de Bahía desde Córdoba
**Desde:** Córdoba
**Meses de Salida:** abril 2026
**Cantidad de noches:** 8 noches

### ✅ INCLUYE
✈️ Pasaje aéreo Córdoba / Salvador de Bahía / Córdoba volando con LATAM Airlines - Incluye carry on.
🚍 Traslados Aeropuerto - Hotel - Aeropuerto en servicio regular.
🏨 Alojamiento por 8 noches en Salvador de Bahía con desayuno, en base doble.
🩺 Asistencia al viajero de Assist Card AC150 FULL (hasta 74 años cumplidos).

**ORIGEN:** COR
**DESTINO:** SSA (Salvador)
**FECHA SALIDA:** ABRIL
**ALOJAMIENTO:** GRANDE HOTEL DA BARRA 4★
**CATEGORÍA Y REGIMEN:** STANDARD C/DESAYUNO
      `.trim(),
      destinos: { create: [] },
      incluyeItems: {
        create: [
          { tipo: "Aéreo", descripcion: "Vuelo LATAM (Carry On)" },
          { tipo: "Traslados", descripcion: "Traslados in-out regulares" },
          { tipo: "Alojamiento", descripcion: "8 noches en Grande Hotel da Barra 4★" },
          { tipo: "Régimen", descripcion: "Desayuno" },
          { tipo: "Asistencia", descripcion: "Assist Card AC150 FULL" },
          { tipo: "Salidas", descripcion: "Abril 2026" }
        ]
      },
    }
  ];
  salidasGrupales.push(...moreCaribbeanPackages);

  const catamarca = destinosList.find((item) => item.slug === "catamarca");
  const cancun = destinosList.find((item) => item.slug === "cancun");

  const uniqueSalidas = [];
  const seenSlugs = new Set();
  for (const oferta of salidasGrupales) {
    if (!oferta?.slug) continue;
    if (seenSlugs.has(oferta.slug)) continue;
    seenSlugs.add(oferta.slug);
    uniqueSalidas.push(oferta);
  }

  const salidasGrupalesWhitelist = new Set([
    "mexico-a-su-tiempo-2026",
    "cartagena-san-andres-2026",
    "colombia-aromas-cafe-2026",
    "peru-aereo-grupal-2026",
    "peru-y-bolivia-2026",
    "europa-a-su-tiempo-2026",
    "costa-rica-al-maximo-2026",
    "esencias-centroeuropeas-2026",
    "europa-al-maximo-2026",
    "joyas-balcanicas-2026",
    "turquia-islas-griegas-2026",
    "turquia-dubai-2026",
    "turquia-islas-griegas-dubai-2026"
  ]);

  for (const oferta of uniqueSalidas) {
    let hasFebrero = false;
    let hasMarzo = false;
    let skipOferta = false;

    if (oferta.incluyeItems && Array.isArray(oferta.incluyeItems.create)) {
      const salidasItem = oferta.incluyeItems.create.find(item => {
        const t = (item.tipo || "").toLowerCase();
        return t.includes("salida") || t.includes("fecha");
      });

      if (salidasItem && salidasItem.descripcion) {
        const descLower = salidasItem.descripcion.toLowerCase();
        hasFebrero = descLower.includes("febrero") || descLower.includes("feb");
        hasMarzo = descLower.includes("marzo") || descLower.includes("mar");

        if (hasFebrero && !hasMarzo) {
          skipOferta = true;
        }

        if (hasFebrero && hasMarzo) {
          let newDesc = salidasItem.descripcion.replace(/(?:\d{1,2}(?:,\s*\d{1,2})*(?:\s*y\s*\d{1,2})*\s*(?:de\s*)?)?(febrero|feb\b)(?:\s*(?:de\s*)?\d{4})?(?:\s*\([^)]*\))?/gi, "");
          newDesc = newDesc.replace(/\s+/g, ' ');
          newDesc = newDesc.replace(/^[,\s;iy.\-]+|[,\s;iy.\-]+$/g, '');
          newDesc = newDesc.replace(/\s*[;,](\s*[;,])+\s*/g, ', ');
          newDesc = newDesc.replace(/\s*,\s*y\s*/gi, ' y ');
          salidasItem.descripcion = newDesc.trim();
        }
      }
    }

    if (skipOferta) continue;

    // Limpieza de información no deseada
    oferta.condiciones = "";
    oferta.noIncluye = "";

    const allowedKeywords = [
      "transporte", "equipaje", "excursion", "alojamiento",
      "regimen", "comida", "desayuno", "cena", "pension",
      "traslado", "hotel", "aereo", "vuelo", "salida", "fecha", "asistencia", "seguro"
    ];

    if (oferta.incluyeItems && Array.isArray(oferta.incluyeItems.create)) {
      oferta.incluyeItems.create = oferta.incluyeItems.create.filter(item => {
        const typeAndDesc = ((item.tipo || "") + " " + (item.descripcion || "")).toLowerCase();
        return allowedKeywords.some(kw => typeAndDesc.includes(kw)) && !typeAndDesc.includes("itinerario");
      });
    }

    const shouldBeGrupal = salidasGrupalesWhitelist.has(oferta.slug);
    oferta.tipo = shouldBeGrupal ? "grupal" : "individual";
    if (oferta.slug === "mexico-a-su-tiempo-2026" && mexico) {
      oferta.destinoId = mexico.id;
      if (cancun) {
        oferta.destinos = {
          create: [
            { destinoId: cancun.id }
          ]
        };
      }
    }
    if (oferta.slug === "catamarca-ruta-adobe-2026" && catamarca) {
      oferta.destinoId = catamarca.id;
    }
    if (oferta.slug === "charter-aereo-cuba" && cuba) {
      oferta.destinoId = cuba.id;
    }
    if (oferta.slug === "peru-aereo-grupal-2026" && lima) {
      oferta.destinoId = lima.id;
      if (cusco) {
        oferta.destinos = {
          create: [
            { destinoId: cusco.id }
          ]
        };
      }
    }
    if (oferta.slug === "peru-y-bolivia-2026" && bolivia) {
      oferta.destinoId = bolivia.id;
      if (cusco) {
        oferta.destinos = {
          create: [
            { destinoId: cusco.id }
          ]
        };
      }
    }
    if (oferta.slug === "europa-a-su-tiempo-2026" && madrid) {
      oferta.destinoId = madrid.id;
      oferta.destinos = {
        create: [
          { destinoId: barcelona ? barcelona.id : undefined },
          { destinoId: paris ? paris.id : undefined },
          { destinoId: londres ? londres.id : undefined },
          { destinoId: venecia ? venecia.id : undefined },
          { destinoId: florencia ? florencia.id : undefined },
          { destinoId: roma ? roma.id : undefined }
        ].filter(d => d.destinoId)
      };
    }
    if (oferta.slug === "europa-al-maximo-2026" && madrid) {
      oferta.destinoId = madrid.id;
      oferta.destinos = {
        create: [
          { destinoId: londres ? londres.id : undefined },
          { destinoId: paris ? paris.id : undefined },
          { destinoId: venecia ? venecia.id : undefined },
          { destinoId: roma ? roma.id : undefined },
          { destinoId: florencia ? florencia.id : undefined },
          { destinoId: barcelona ? barcelona.id : undefined }
        ].filter(d => d.destinoId)
      };
    }
    if (oferta.slug === "joyas-balcanicas-2026" && praga) {
      oferta.destinoId = praga.id;
    }
    if (oferta.slug === "turquia-islas-griegas-2026" && turquia) {
      oferta.destinoId = turquia.id;
      oferta.destinos = {
        create: [
          { destinoId: islasGriegas ? islasGriegas.id : undefined }
        ].filter(d => d.destinoId)
      };
    }
    if (oferta.slug === "turquia-dubai-2026" && turquia) {
      oferta.destinoId = turquia.id;
      oferta.destinos = {
        create: [
          { destinoId: dubai ? dubai.id : undefined }
        ].filter(d => d.destinoId)
      };
    }
    if (oferta.slug === "turquia-islas-griegas-dubai-2026" && turquia) {
      oferta.destinoId = turquia.id;
      oferta.destinos = {
        create: [
          { destinoId: islasGriegas ? islasGriegas.id : undefined },
          { destinoId: dubai ? dubai.id : undefined }
        ].filter(d => d.destinoId)
      };
    }
    // Link Bañados to Misiones
    const misionesDest = destinosList.find((item) => item.slug === "misiones") ||
      destinosList.find((item) =>
        item.slug.includes("cataratas") ||
        item.slug.includes("iguazu")
      ) ||
      destinosList[0];

    if (oferta.slug === "banados-estrella-2026") {
      oferta.destinoId = misionesDest.id;
    }
    if (oferta.slug === "balneario-camboriu-7-noches" && camboriu) {
      oferta.destinoId = camboriu.id;
    }
    if (oferta.slug === "torres-y-gramado-2026" && torres) {
      oferta.destinoId = torres.id;
    }
    if (oferta.slug === "canasvieiras-7-noches" && canasvieiras) {
      oferta.destinoId = canasvieiras.id;
    }
    if (oferta.slug === "bombas-bombinhas-7-noches" && bombas) {
      oferta.destinoId = bombas.id;
    }
    if (oferta.slug === "punta-del-este-7-noches" && puntadeleste) {
      oferta.destinoId = puntadeleste.id;
    }
    if (oferta.slug.startsWith("f1-") && f1) {
      oferta.destinoId = f1.id;
    }
    if (oferta.slug === "mundial-futbol-playa-mexico" && experienciaMundial) {
      oferta.destinoId = experienciaMundial.id;
    }
    if (oferta.slug === "finalisima-2026" && finalisima) {
      oferta.destinoId = finalisima.id;
    }
    if (oferta.slug === "laguna-brasil-bus-2026" && laguna) {
      oferta.destinoId = laguna.id;
    }
    if (oferta.slug === "ferrugem-bus-2026" && ferrugem) {
      oferta.destinoId = ferrugem.id;
    }
    if (oferta.slug === "bombinhas-bus-2026" && bombinhas) {
      oferta.destinoId = bombinhas.id;
    }
    if (oferta.slug === "cataratas-foz-2026" && iguazu) {
      oferta.destinoId = iguazu.id;
    }
    if (oferta.slug === "maravillas-litoral-2026" && iguazu) {
      oferta.destinoId = iguazu.id;
    }
    if (oferta.slug === "puerto-madryn-playas-patagonicas-2026" && puertoMadryn) {
      oferta.destinoId = puertoMadryn.id;
    }
    if (oferta.slug === "visitando-norte-2026" && salta) {
      oferta.destinoId = salta.id;
      if (jujuy) {
        oferta.destinos = {
          create: [
            { destinoId: jujuy.id }
          ]
        };
      }
    }
    if (oferta.slug === "patagonia-fantastica-2026" && bariloche) {
      oferta.destinoId = bariloche.id;
    }
    if (oferta.slug === "bariloche-aereo-2026" && bariloche) {
      oferta.destinoId = bariloche.id;
    }
    if (oferta.slug === "bariloche-villa-la-angostura-2026" && bariloche) {
      oferta.destinoId = bariloche.id;
    }
    if (oferta.slug === "buenos-aires-aereo-2026" && buenosAires) {
      oferta.destinoId = buenosAires.id;
    }
    if (oferta.slug === "capillas-de-marmol-2026" && peritoMoreno) {
      oferta.destinoId = peritoMoreno.id;
    }
    if (oferta.slug === "cruce-de-lagos-2026" && bariloche) {
      oferta.destinoId = bariloche.id;
    }
    if (oferta.slug === "glamping-entre-las-nubes-2026" && salta) {
      oferta.destinoId = salta.id;
      if (jujuy) {
        oferta.destinos = {
          create: [
            { destinoId: jujuy.id }
          ]
        };
      }
    }
    if (oferta.slug === "neuquen-caviahue-2026" && neuquen) {
      oferta.destinoId = neuquen.id;
    }
    if (oferta.slug === "descubriendo-el-sur-2026" && calafate) {
      oferta.destinoId = calafate.id;
      if (ushuaia) {
        oferta.destinos = {
          create: [
            { destinoId: ushuaia.id }
          ]
        };
      }
    }
    if (oferta.slug === "descubriendo-chile-2026" && santiagoChile) {
      oferta.destinoId = santiagoChile.id;
    }
    if (oferta.slug === "costa-rica-al-maximo-2026" && costaRica) {
      oferta.destinoId = costaRica.id;
    }
    if (oferta.slug === "esencias-centroeuropeas-2026" && amsterdam) {
      oferta.destinoId = amsterdam.id;
    }
    if (oferta.slug === "calafate-ushuaia-2026" && calafate && ushuaia) {
      oferta.destinoId = calafate.id;
      oferta.destinos = {
        create: [
          { destinoId: ushuaia.id }
        ]
      };
    }
    if (oferta.slug === "charter-porto-galinhas-2026" && portoGalinhas) {
      oferta.destinoId = portoGalinhas.id;
    }
    if (oferta.slug === "charter-maragogi-2026" && maragogi) {
      oferta.destinoId = maragogi.id;
    }
    if (oferta.slug === "charter-cabo-santo-agostinho-2026" && caboSantoAgostinho) {
      oferta.destinoId = caboSantoAgostinho.id;
    }
    if (oferta.slug === "charter-buzios-2026" && buzios) {
      oferta.destinoId = buzios.id;
    }
    if (oferta.slug === "charter-rio-2026" && rio) {
      oferta.destinoId = rio.id;
    }
    if (oferta.slug === "charter-angra-2026" && angra) {
      oferta.destinoId = angra.id;
    }
    if (oferta.slug === "porto-galinhas-regular-2026" && portoGalinhas) {
      oferta.destinoId = portoGalinhas.id;
    }
    if (oferta.slug.startsWith("cartagena-san-andres") && colombia) {
      oferta.destinoId = colombia.id;
    }
    if (oferta.slug === "colombia-aromas-cafe-2026" && colombia) {
      oferta.destinoId = colombia.id;
    }
    if (oferta.slug === "caminos-del-norte-2026" && salta) {
      oferta.destinoId = salta.id;
      if (jujuy) {
        oferta.destinos = {
          create: [
            { destinoId: jujuy.id }
          ]
        };
      }
    }
    if (oferta.slug === "las-grutas-2026" && lasGrutas) {
      oferta.destinoId = lasGrutas.id;
    }
    if (oferta.slug === "las-grutas-2026" && lasGrutas) {
      oferta.destinoId = lasGrutas.id;
    }
    // Logic for new packages
    if (oferta.slug === "aruba-desde-cordoba-2026") {
      const arubaDest = destinosList.find(d => d.slug === "aruba");
      if (arubaDest) oferta.destinoId = arubaDest.id;
    }
    if (oferta.slug === "bayahibe-desde-cordoba-2026") {
      const bayahibeDest = destinosList.find(d => d.slug === "bayahibe") ||
        destinosList.find(d => d.nombre?.toLowerCase().includes("bayahibe")) ||
        destinosList.find(d => d.slug === "republica-dominicana");
      if (bayahibeDest) oferta.destinoId = bayahibeDest.id;
    }
    if (oferta.slug === "cancun-desde-cordoba-2026") {
      const cancunDest = destinosList.find(d => d.slug === "cancun") || destinosList.find(d => d.slug === "mexico");
      if (cancunDest) oferta.destinoId = cancunDest.id;
    }
    if (oferta.slug === "costa-dorada-desde-cordoba-2026") {
      const costaDest = destinosList.find(d => d.slug === "costa-dorada") ||
        destinosList.find(d => d.nombre?.toLowerCase().includes("costa dorada")) ||
        destinosList.find(d => d.nombre?.toLowerCase().includes("puerto plata")) ||
        destinosList.find(d => d.slug === "republica-dominicana");
      if (costaDest) oferta.destinoId = costaDest.id;
    }
    if (oferta.slug === "curazao-desde-cordoba-2026") {
      const curazaoDest = destinosList.find(d => d.slug === "curazao");
      if (curazaoDest) oferta.destinoId = curazaoDest.id;
    }
    if (oferta.slug === "loscabos-panama-desde-cordoba-2026") {
      const losCabosDest = destinosList.find(d => d.slug === "los-cabos") || destinosList.find(d => d.slug === "mexico");
      if (losCabosDest) oferta.destinoId = losCabosDest.id;

      const panamaDest = destinosList.find(d => d.slug === "panama");
      if (panamaDest) {
        oferta.destinos = {
          create: [
            { destinoId: panamaDest.id }
          ]
        };
      }
    }

    if (oferta.slug === "playadelcarmen-desde-cordoba-2026") {
      const playaDest = destinosList.find(d => d.slug === "playa-del-carmen") ||
        destinosList.find(d => d.nombre?.toLowerCase().includes("playa del carmen")) ||
        destinosList.find(d => d.slug === "mexico");
      if (playaDest) oferta.destinoId = playaDest.id;
    }
    if (oferta.slug === "puntacana-desde-cordoba-2026") {
      const puntaDest = destinosList.find(d => d.slug === "punta-cana") ||
        destinosList.find(d => d.slug === "republica-dominicana");
      if (puntaDest) oferta.destinoId = puntaDest.id;
    }
    if (oferta.slug === "salvador-bahia-desde-cordoba-2026") {
      const salvadorDest = destinosList.find(d => d.slug === "salvador-de-bahia") ||
        destinosList.find(d => d.slug === "brasil");
      if (salvadorDest) oferta.destinoId = salvadorDest.id;
    }

    // Fallback if destinoId is null after all checks
    if (!oferta.destinoId) {
      // Find 'otros' or first available as fallback to prevent crash
      const fallbackDest = destinosList[0];
      if (fallbackDest) oferta.destinoId = fallbackDest.id;
    }

    if (!oferta.destinoId) {
      console.error(`Skipping oferta ${oferta.slug} because no destination matches`);
      continue;
    }

    oferta.condiciones = sanitizeOfertaText(oferta.condiciones) || null;
    oferta.noIncluye = stripMarkdownLinesWithPriceSignals(oferta.noIncluye) || null;

    if (Array.isArray(oferta.incluyeItems?.create)) {
      oferta.incluyeItems.create = sanitizeIncluyeItems(oferta.incluyeItems.create);
    }

    const existingOferta = await prisma.oferta.findUnique({
      where: { slug: oferta.slug }
    });
    if (existingOferta) {
      if (existingOferta.tipo !== oferta.tipo || oferta.destinoId !== existingOferta.destinoId) {
        await prisma.oferta.update({
          where: { slug: oferta.slug },
          data: {
            tipo: oferta.tipo,
            destacada: oferta.destacada,
            activa: oferta.activa,
            orden: oferta.orden,
            destinoId: oferta.destinoId
          }
        });
      }
      continue;
    }
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

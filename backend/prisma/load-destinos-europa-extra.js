const path = require("path");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const prisma = new PrismaClient();

const destinos = [
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

async function main() {
  for (const destino of destinos) {
    const record = await prisma.destino.upsert({
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

    await prisma.imagenDestino.deleteMany({ where: { destinoId: record.id } });
    await prisma.imagenDestino.createMany({
      data: destino.imagenes.map((imagen, index) => ({
        destinoId: record.id,
        imagen,
        epigrafe: destino.nombre,
        orden: index + 1
      }))
    });
  }
}

main()
  .catch((error) => {
    console.error("Error al cargar destinos:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

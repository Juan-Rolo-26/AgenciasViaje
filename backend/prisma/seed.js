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

  const destinos = await prisma.destino.createMany({
    data: [
      {
        nombre: "Río de Janeiro",
        slug: "rio-de-janeiro",
        paisRegion: "Brasil",
        descripcionCorta: "Playas icónicas, morros y energía inagotable.",
        descripcion:
          "Río combina paisajes naturales con cultura vibrante, samba y miradores inolvidables.",
        imagenPortada: "/assets/destinos/rio1.jpg",
        destacado: true,
        orden: 1
      },
      {
        nombre: "Florianópolis",
        slug: "florianopolis",
        paisRegion: "Brasil",
        descripcionCorta: "Isla con playas tranquilas y naturaleza exuberante.",
        descripcion:
          "Una escapada ideal para combinar descanso, gastronomía y deportes acuáticos.",
        imagenPortada: "/assets/destinos/florianopolis1.png",
        destacado: true,
        orden: 2
      },
      {
        nombre: "Canasvieiras",
        slug: "canasvieiras",
        paisRegion: "Brasil",
        descripcionCorta: "Playa familiar con mar calmo y paseo costero.",
        descripcion:
          "Arena suave, aguas templadas y servicios completos para un descanso sin apuros.",
        imagenPortada: "/assets/destinos/inicio.jpg",
        destacado: true,
        orden: 3
      },
      {
        nombre: "Ferrugem",
        slug: "ferrugem",
        paisRegion: "Brasil",
        descripcionCorta: "Postales salvajes y ambiente relajado.",
        descripcion:
          "Ideal para surf, atardeceres y un ritmo costero más tranquilo.",
        imagenPortada: "/assets/destinos/ferregum2.webp",
        destacado: false,
        orden: 4
      },
      {
        nombre: "Garopaba",
        slug: "garopaba",
        paisRegion: "Brasil",
        descripcionCorta: "Playas extensas y bahías protegidas.",
        descripcion:
          "Naturaleza, senderos y un mar cristalino para disfrutar en familia.",
        imagenPortada: "/assets/destinos/garapoba1.webp",
        destacado: false,
        orden: 5
      },
      {
        nombre: "Itapema",
        slug: "itapema",
        paisRegion: "Brasil",
        descripcionCorta: "Balneario con costa urbana y servicios completos.",
        descripcion:
          "Avenida costera, gastronomía y playas amplias para disfrutar todo el día.",
        imagenPortada: "/assets/destinos/itapema1.jpg",
        destacado: false,
        orden: 6
      },
      {
        nombre: "Porto Galinhas",
        slug: "porto-galinhas",
        paisRegion: "Brasil",
        descripcionCorta: "Piscinas naturales y aguas turquesa.",
        descripcion:
          "Un clásico del nordeste con mar cálido, arrecifes y paisajes paradisíacos.",
        imagenPortada: "/assets/destinos/porto1.webp",
        destacado: true,
        orden: 7
      },
      {
        nombre: "Torres",
        slug: "torres",
        paisRegion: "Brasil",
        descripcionCorta: "Acantilados, miradores y playas amplias.",
        descripcion:
          "Escenarios naturales únicos para caminatas, fotografía y deportes al aire libre.",
        imagenPortada: "/assets/destinos/torres1.jpg",
        destacado: false,
        orden: 8
      },
      {
        nombre: "Ushuaia",
        slug: "ushuaia",
        paisRegion: "Argentina",
        descripcionCorta: "Naturaleza patagónica y fin del mundo.",
        descripcion:
          "Montañas, glaciares y navegación en el canal Beagle en un destino único.",
        imagenPortada: "/assets/destinos/usuahia.jpg",
        destacado: true,
        orden: 9
      },
      {
        nombre: "Puerto Madryn",
        slug: "puerto-madryn",
        paisRegion: "Argentina",
        descripcionCorta: "Fauna marina y playas tranquilas.",
        descripcion:
          "Avistaje de ballenas, pingüinos y paisajes costeros en la Patagonia atlántica.",
        imagenPortada: "/assets/destinos/puerto1.jpg",
        destacado: true,
        orden: 10
      },
      {
        nombre: "Lima",
        slug: "lima",
        paisRegion: "Perú",
        descripcionCorta: "Capital gastronómica con vistas al Pacífico.",
        descripcion:
          "Barrancos históricos, acantilados y sabores únicos en cada barrio.",
        imagenPortada: "/assets/destinos/lima1.jpg",
        destacado: false,
        orden: 11
      },
      {
        nombre: "Camboya",
        slug: "camboya",
        paisRegion: "Tailandia",
        descripcionCorta: "Templos, cultura milenaria y paisajes exóticos.",
        descripcion:
          "Un viaje entre historia, mercados y experiencias culturales inolvidables.",
        imagenPortada: "/assets/destinos/tai1.webp",
        destacado: false,
        orden: 12
      }
    ]
  });

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
  const camboya = destinosList.find((item) => item.slug === "camboya");

  await prisma.imagenDestino.createMany({
    data: [
      {
        destinoId: rio.id,
        imagen: "/assets/destinos/rio2.jpg",
        epigrafe: "Vista panorámica de la ciudad",
        orden: 1
      },
      {
        destinoId: rio.id,
        imagen: "/assets/destinos/rio3.jpg",
        epigrafe: "Playas de Río",
        orden: 2
      },
      {
        destinoId: rio.id,
        imagen: "/assets/destinos/rio4.webp",
        epigrafe: "Cristo Redentor",
        orden: 3
      },
      {
        destinoId: floripa.id,
        imagen: "/assets/destinos/florianopolis2.jpg",
        epigrafe: "Costa en Florianópolis",
        orden: 1
      },
      {
        destinoId: floripa.id,
        imagen: "/assets/destinos/florianopolis3.jpg",
        epigrafe: "Playas urbanas",
        orden: 2
      },
      {
        destinoId: floripa.id,
        imagen: "/assets/destinos/florianopolis4.JPG",
        epigrafe: "Atardecer en la costa",
        orden: 3
      },
      {
        destinoId: canasvieiras.id,
        imagen: "/assets/destinos/inicio.jpg",
        epigrafe: "Playa principal",
        orden: 1
      },
      {
        destinoId: canasvieiras.id,
        imagen: "/assets/destinos/florianopolis2.jpg",
        epigrafe: "Costa tranquila",
        orden: 2
      },
      {
        destinoId: canasvieiras.id,
        imagen: "/assets/destinos/florianopolis3.jpg",
        epigrafe: "Paseo costero",
        orden: 3
      },
      {
        destinoId: canasvieiras.id,
        imagen: "/assets/destinos/florianopolis4.JPG",
        epigrafe: "Atmósfera playera",
        orden: 4
      },
      {
        destinoId: ferrugem.id,
        imagen: "/assets/destinos/ferregum3.jpg",
        epigrafe: "Paisajes de Ferrugem",
        orden: 1
      },
      {
        destinoId: ferrugem.id,
        imagen: "/assets/destinos/ferregum4.webp",
        epigrafe: "Playas abiertas",
        orden: 2
      },
      {
        destinoId: ferrugem.id,
        imagen: "/assets/destinos/ferregum5.jpg",
        epigrafe: "Atardecer en Ferrugem",
        orden: 3
      },
      {
        destinoId: garopaba.id,
        imagen: "/assets/destinos/garapoba2.webp",
        epigrafe: "Bahías de Garopaba",
        orden: 1
      },
      {
        destinoId: garopaba.id,
        imagen: "/assets/destinos/garapoba3.jpg",
        epigrafe: "Vista aérea",
        orden: 2
      },
      {
        destinoId: garopaba.id,
        imagen: "/assets/destinos/garapoba4.webp",
        epigrafe: "Costa cristalina",
        orden: 3
      },
      {
        destinoId: itapema.id,
        imagen: "/assets/destinos/itapema2.avif",
        epigrafe: "Costanera de Itapema",
        orden: 1
      },
      {
        destinoId: itapema.id,
        imagen: "/assets/destinos/itapema3.jpg",
        epigrafe: "Playas amplias",
        orden: 2
      },
      {
        destinoId: itapema.id,
        imagen: "/assets/destinos/itapema4.jpg",
        epigrafe: "Vista panorámica",
        orden: 3
      },
      {
        destinoId: portoGalinhas.id,
        imagen: "/assets/destinos/porto2.jpg",
        epigrafe: "Piscinas naturales",
        orden: 1
      },
      {
        destinoId: portoGalinhas.id,
        imagen: "/assets/destinos/porto3.webp",
        epigrafe: "Mar turquesa",
        orden: 2
      },
      {
        destinoId: portoGalinhas.id,
        imagen: "/assets/destinos/porto4.webp",
        epigrafe: "Playas paradisíacas",
        orden: 3
      },
      {
        destinoId: torres.id,
        imagen: "/assets/destinos/torres2.jpg",
        epigrafe: "Acantilados al atardecer",
        orden: 1
      },
      {
        destinoId: torres.id,
        imagen: "/assets/destinos/torres3.jpg",
        epigrafe: "Vista desde los morros",
        orden: 2
      },
      {
        destinoId: torres.id,
        imagen: "/assets/destinos/torres4.jpg",
        epigrafe: "Playas de Torres",
        orden: 3
      },
      {
        destinoId: ushuaia.id,
        imagen: "/assets/destinos/usuahia2.jpg",
        epigrafe: "Canal Beagle",
        orden: 1
      },
      {
        destinoId: ushuaia.id,
        imagen: "/assets/destinos/usuahia3.webp",
        epigrafe: "Montañas nevadas",
        orden: 2
      },
      {
        destinoId: ushuaia.id,
        imagen: "/assets/destinos/usuahia4.jpg",
        epigrafe: "Paisajes australes",
        orden: 3
      },
      {
        destinoId: puertoMadryn.id,
        imagen: "/assets/destinos/puerto2.jpeg",
        epigrafe: "Costa de Puerto Madryn",
        orden: 1
      },
      {
        destinoId: puertoMadryn.id,
        imagen: "/assets/destinos/puerto3.jpg",
        epigrafe: "Avistaje de fauna",
        orden: 2
      },
      {
        destinoId: puertoMadryn.id,
        imagen: "/assets/destinos/puerto4.jpg",
        epigrafe: "Playas patagónicas",
        orden: 3
      },
      {
        destinoId: lima.id,
        imagen: "/assets/destinos/lima2.jpg",
        epigrafe: "Costa limeña",
        orden: 1
      },
      {
        destinoId: lima.id,
        imagen: "/assets/destinos/lima3.png",
        epigrafe: "Acantilados urbanos",
        orden: 2
      },
      {
        destinoId: lima.id,
        imagen: "/assets/destinos/lima4.jpg",
        epigrafe: "Vista de la ciudad",
        orden: 3
      },
      {
        destinoId: camboya.id,
        imagen: "/assets/destinos/tai2.avif",
        epigrafe: "Templos y cultura",
        orden: 1
      },
      {
        destinoId: camboya.id,
        imagen: "/assets/destinos/tai3.webp",
        epigrafe: "Arquitectura histórica",
        orden: 2
      },
      {
        destinoId: camboya.id,
        imagen: "/assets/destinos/tai4.webp",
        epigrafe: "Paisajes exóticos",
        orden: 3
      }
    ]
  });

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

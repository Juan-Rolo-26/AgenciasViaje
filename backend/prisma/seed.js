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
        descripcionCorta: "Playas doradas, vida nocturna y cultura vibrante.",
        descripcion:
          "Río combina paisajes icónicos, gastronomía y experiencias urbanas en cada rincón.",
        imagenPortada:
          "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1400&q=80",
        destacado: true,
        orden: 1
      },
      {
        nombre: "Florianópolis",
        slug: "florianopolis",
        paisRegion: "Brasil",
        descripcionCorta: "Islas, playas tranquilas y naturaleza exuberante.",
        descripcion:
          "Ideal para descanso y deportes acuáticos con clima templado gran parte del año.",
        imagenPortada:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
        destacado: true,
        orden: 2
      },
      {
        nombre: "Madrid",
        slug: "madrid",
        paisRegion: "España",
        descripcionCorta: "Arte, gastronomía y vida cultural incomparable.",
        descripcion:
          "Museos, plazas históricas y experiencias gastronómicas en una ciudad vibrante.",
        imagenPortada:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
        destacado: true,
        orden: 3
      },
      {
        nombre: "Patagonia Viva",
        slug: "patagonia-viva",
        paisRegion: "Argentina",
        descripcionCorta: "Glaciares, trekking y paisajes inolvidables.",
        descripcion:
          "Un destino para aventureros, con naturaleza imponente y experiencias únicas.",
        imagenPortada:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
        destacado: false,
        orden: 4
      },
      {
        nombre: "Miami",
        slug: "miami",
        paisRegion: "Estados Unidos",
        descripcionCorta: "Playas icónicas, compras y energía cosmopolita.",
        descripcion:
          "Sol, gastronomía y experiencias premium frente al mar en South Beach.",
        imagenPortada:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
        destacado: true,
        orden: 5
      },
      {
        nombre: "Punta Cana",
        slug: "punta-cana",
        paisRegion: "República Dominicana",
        descripcionCorta: "Caribe azul, resorts all inclusive y relax total.",
        descripcion:
          "Playas extensas, hoteles de lujo y excursiones a islas soñadas.",
        imagenPortada:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
        destacado: true,
        orden: 6
      },
      {
        nombre: "Aruba",
        slug: "aruba",
        paisRegion: "Caribe",
        descripcionCorta: "Arena blanca, mar turquesa y atardeceres únicos.",
        descripcion:
          "Un destino ideal para desconectar con playas cristalinas y servicios premium.",
        imagenPortada:
          "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80",
        destacado: false,
        orden: 7
      },
      {
        nombre: "San Carlos de Bariloche",
        slug: "bariloche",
        paisRegion: "Argentina",
        descripcionCorta: "Lagos, nieve y postales de montaña.",
        descripcion:
          "Paisajes patagónicos, gastronomía y actividades invernales para toda la familia.",
        imagenPortada:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        destacado: true,
        orden: 8
      },
      {
        nombre: "Roma",
        slug: "roma",
        paisRegion: "Italia",
        descripcionCorta: "Historia, cultura y gastronomía inigualable.",
        descripcion:
          "Descubrí el Coliseo, la Fontana y la cocina italiana con estilo premium.",
        imagenPortada:
          "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1400&q=80",
        destacado: false,
        orden: 9
      },
      {
        nombre: "Cataratas del Iguazú",
        slug: "iguazu",
        paisRegion: "Argentina",
        descripcionCorta: "Una maravilla natural con energía única.",
        descripcion:
          "Senderos, selva y vistas impresionantes en las cataratas más famosas.",
        imagenPortada:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
        destacado: false,
        orden: 10
      }
    ]
  });

  const destinosList = await prisma.destino.findMany({ orderBy: { orden: "asc" } });
  const rio = destinosList.find((item) => item.slug === "rio-de-janeiro");
  const floripa = destinosList.find((item) => item.slug === "florianopolis");
  const madrid = destinosList.find((item) => item.slug === "madrid");
  const patagonia = destinosList.find((item) => item.slug === "patagonia-viva");
  const miami = destinosList.find((item) => item.slug === "miami");
  const puntaCana = destinosList.find((item) => item.slug === "punta-cana");
  const aruba = destinosList.find((item) => item.slug === "aruba");
  const bariloche = destinosList.find((item) => item.slug === "bariloche");
  const roma = destinosList.find((item) => item.slug === "roma");
  const iguazu = destinosList.find((item) => item.slug === "iguazu");

  await prisma.imagenDestino.createMany({
    data: [
      {
        destinoId: rio.id,
        imagen:
          "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
        epigrafe: "Copacabana al atardecer",
        orden: 1
      },
      {
        destinoId: madrid.id,
        imagen:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        epigrafe: "Gran Vía de noche",
        orden: 1
      },
      {
        destinoId: miami.id,
        imagen:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        epigrafe: "Atardecer en Miami",
        orden: 1
      },
      {
        destinoId: bariloche.id,
        imagen:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
        epigrafe: "Lago y montaña",
        orden: 1
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
        imagenPortada:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
        destacada: true,
        orden: 1
      },
      {
        nombre: "City Tour Histórico Madrid",
        slug: "city-tour-historico-madrid",
        destinoId: madrid.id,
        tipoActividad: "tour",
        fecha: new Date("2025-09-05"),
        hora: "15:30",
        precio: "55000",
        cupos: 25,
        puntoEncuentro: "Puerta del Sol",
        descripcion: "Recorrido por plazas y museos con guía experto.",
        imagenPortada:
          "https://images.unsplash.com/photo-1476067897447-d0c5df27b5df?auto=format&fit=crop&w=1200&q=80",
        destacada: true,
        orden: 2
      },
      {
        nombre: "Aventura en Lago Argentino",
        slug: "aventura-lago-argentino",
        destinoId: patagonia.id,
        tipoActividad: "actividad",
        fecha: new Date("2025-08-18"),
        hora: "09:00",
        precio: "62000",
        cupos: 18,
        puntoEncuentro: "Centro de visitantes El Calafate",
        descripcion: "Navegación y caminatas con vistas panorámicas.",
        imagenPortada:
          "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80",
        destacada: false,
        orden: 3
      },
      {
        nombre: "Ruta Art Deco en Miami",
        slug: "ruta-art-deco-miami",
        destinoId: miami.id,
        tipoActividad: "tour",
        fecha: new Date("2025-06-20"),
        hora: "17:00",
        precio: "38000",
        cupos: 30,
        puntoEncuentro: "Ocean Drive",
        descripcion: "Recorrido guiado por las zonas más icónicas de South Beach.",
        imagenPortada:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        destacada: true,
        orden: 4
      },
      {
        nombre: "Isla Saona Full Day",
        slug: "isla-saona-full-day",
        destinoId: puntaCana.id,
        tipoActividad: "excursion",
        fecha: new Date("2025-07-18"),
        hora: "08:00",
        precio: "52000",
        cupos: 24,
        puntoEncuentro: "Lobby hotelero Punta Cana",
        descripcion: "Navegación, snorkel y almuerzo caribeño.",
        imagenPortada:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
        destacada: true,
        orden: 5
      },
      {
        nombre: "Circuito Chico Bariloche",
        slug: "circuito-chico-bariloche",
        destinoId: bariloche.id,
        tipoActividad: "excursion",
        fecha: new Date("2025-07-12"),
        hora: "10:30",
        precio: "30000",
        cupos: 26,
        puntoEncuentro: "Centro Cívico",
        descripcion: "Recorrido panorámico por los principales miradores.",
        imagenPortada:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
        destacada: false,
        orden: 6
      },
      {
        nombre: "Tour Coliseo y Foro",
        slug: "tour-coliseo-foro",
        destinoId: roma.id,
        tipoActividad: "tour",
        fecha: new Date("2025-10-12"),
        hora: "11:00",
        precio: "62000",
        cupos: 20,
        puntoEncuentro: "Piazza del Colosseo",
        descripcion: "Entradas y guía especializado incluidos.",
        imagenPortada:
          "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1200&q=80",
        destacada: true,
        orden: 7
      },
      {
        nombre: "Safari Náutico Iguazú",
        slug: "safari-nautico-iguazu",
        destinoId: iguazu.id,
        tipoActividad: "actividad",
        fecha: new Date("2025-08-22"),
        hora: "14:00",
        precio: "45000",
        cupos: 22,
        puntoEncuentro: "Centro de visitantes Cataratas",
        descripcion: "Experiencia en lancha bajo los saltos principales.",
        imagenPortada:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        destacada: false,
        orden: 8
      }
    ]
  });

  const actividadesList = await prisma.actividad.findMany();
  const cristo = actividadesList.find((item) => item.slug === "tour-cristo-redentor");
  const madridTour = actividadesList.find((item) => item.slug === "city-tour-historico-madrid");
  const artDeco = actividadesList.find((item) => item.slug === "ruta-art-deco-miami");
  const saona = actividadesList.find((item) => item.slug === "isla-saona-full-day");
  const circuitoChico = actividadesList.find((item) => item.slug === "circuito-chico-bariloche");
  const coliseo = actividadesList.find((item) => item.slug === "tour-coliseo-foro");
  const iguazuSafari = actividadesList.find((item) => item.slug === "safari-nautico-iguazu");

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
        create: [{ destinoId: floripa.id }]
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
      titulo: "Europa cultural en Madrid",
      slug: "europa-cultural-madrid",
      destinoId: madrid.id,
      noches: 8,
      cupos: 10,
      destacada: true,
      activa: true,
      orden: 3,
      condiciones: "Hotel céntrico y excursiones incluidas.",
      destinos: {
        create: [{ destinoId: madrid.id }]
      },
      actividades: {
        create: [{ actividadId: madridTour.id }]
      },
      precios: {
        create: [
          {
            precio: "1214714",
            moneda: "ARS",
            fechaInicio: new Date("2025-09-01"),
            fechaFin: new Date("2025-11-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aéreo internacional" },
          { tipo: "excursion", descripcion: "City tour guiado" },
          { tipo: "equipaje", descripcion: "Equipaje en cabina y bodega" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Sol en Miami Beach",
      slug: "sol-en-miami-beach",
      destinoId: miami.id,
      noches: 7,
      cupos: 16,
      destacada: true,
      activa: true,
      orden: 4,
      condiciones: "Hotel frente al mar y traslados privados incluidos.",
      destinos: {
        create: [{ destinoId: miami.id }]
      },
      actividades: {
        create: [{ actividadId: artDeco.id }]
      },
      precios: {
        create: [
          {
            precio: "741741",
            moneda: "ARS",
            fechaInicio: new Date("2025-05-15"),
            fechaFin: new Date("2025-09-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aéreo ida y vuelta" },
          { tipo: "servicio", descripcion: "Traslados privados" },
          { tipo: "comida", descripcion: "Desayuno continental" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Caribe en Punta Cana",
      slug: "caribe-punta-cana",
      destinoId: puntaCana.id,
      noches: 7,
      cupos: 18,
      destacada: true,
      activa: true,
      orden: 5,
      condiciones: "Resort all inclusive y excursión a Isla Saona.",
      destinos: {
        create: [{ destinoId: puntaCana.id }]
      },
      actividades: {
        create: [{ actividadId: saona.id }]
      },
      precios: {
        create: [
          {
            precio: "899399",
            moneda: "ARS",
            fechaInicio: new Date("2025-06-10"),
            fechaFin: new Date("2025-10-20")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "servicio", descripcion: "All inclusive premium" },
          { tipo: "excursion", descripcion: "Isla Saona" },
          { tipo: "equipaje", descripcion: "Equipaje en bodega" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Aruba relax all inclusive",
      slug: "aruba-relax",
      destinoId: aruba.id,
      noches: 6,
      cupos: 14,
      destacada: false,
      activa: true,
      orden: 6,
      condiciones: "Resort frente al mar con experiencias gastronómicas.",
      destinos: {
        create: [{ destinoId: aruba.id }]
      },
      precios: {
        create: [
          {
            precio: "791291",
            moneda: "ARS",
            fechaInicio: new Date("2025-06-01"),
            fechaFin: new Date("2025-09-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "servicio", descripcion: "All inclusive" },
          { tipo: "transporte", descripcion: "Aéreo con equipaje" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Invierno en Bariloche",
      slug: "invierno-bariloche",
      destinoId: bariloche.id,
      noches: 5,
      cupos: 22,
      destacada: true,
      activa: true,
      orden: 7,
      condiciones: "Hotel boutique y excursión Circuito Chico.",
      destinos: {
        create: [{ destinoId: bariloche.id }]
      },
      actividades: {
        create: [{ actividadId: circuitoChico.id }]
      },
      precios: {
        create: [
          {
            precio: "96096",
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
      titulo: "Roma clásica",
      slug: "roma-clasica",
      destinoId: roma.id,
      noches: 6,
      cupos: 12,
      destacada: false,
      activa: true,
      orden: 8,
      condiciones: "Hotel céntrico y tour guiado por el Coliseo.",
      destinos: {
        create: [{ destinoId: roma.id }]
      },
      actividades: {
        create: [{ actividadId: coliseo.id }]
      },
      precios: {
        create: [
          {
            precio: "1399398",
            moneda: "ARS",
            fechaInicio: new Date("2025-09-10"),
            fechaFin: new Date("2025-11-30")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "transporte", descripcion: "Aéreo internacional" },
          { tipo: "excursion", descripcion: "Tour Coliseo y Foro" }
        ]
      }
    }
  });

  await prisma.oferta.create({
    data: {
      titulo: "Iguazú esencial",
      slug: "iguazu-esencial",
      destinoId: iguazu.id,
      noches: 4,
      cupos: 18,
      destacada: false,
      activa: true,
      orden: 9,
      condiciones: "Hotel con vista y safari náutico incluido.",
      destinos: {
        create: [{ destinoId: iguazu.id }]
      },
      actividades: {
        create: [{ actividadId: iguazuSafari.id }]
      },
      precios: {
        create: [
          {
            precio: "215000",
            moneda: "ARS",
            fechaInicio: new Date("2025-07-05"),
            fechaFin: new Date("2025-12-15")
          }
        ]
      },
      incluyeItems: {
        create: [
          { tipo: "servicio", descripcion: "Traslados aeropuerto-hotel" },
          { tipo: "excursion", descripcion: "Safari náutico" }
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

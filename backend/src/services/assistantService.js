const prisma = require("../lib/prisma");

const OPENAI_URL =
  process.env.OPENAI_URL || "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://localhost:11434/api/chat";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";
const LLM_PROVIDER = (process.env.LLM_PROVIDER || "").toLowerCase();
const MAX_HISTORY = 6;
const MAX_ITEMS = 40;
const MAX_TEXT = 180;
const MAX_HISTORY_CHARS = 800;
const OUT_OF_SCOPE_REPLY =
  "Soy una IA de agencia de viajes, no puedo responderte eso.";
const BASE_RELEVANT_KEYWORDS = [
  "viaje",
  "viajar",
  "viajes",
  "destino",
  "destinos",
  "oferta",
  "ofertas",
  "excursion",
  "excursiones",
  "hotel",
  "pasaje",
  "pasajes",
  "reserva",
  "reservar",
  "salida",
  "salidas",
  "tour",
  "paquete",
  "paquetes",
  "calendario",
  "mercosur",
  "pasaporte",
  "documentacion",
  "vuelo",
  "vuelos",
  "avion",
  "aereo",
  "colectivo",
  "bus",
  "traslado",
  "presupuesto",
  "cotizar",
  "cotizacion",
  "asistencia",
  "topotours",
  "topix",
  "agencia",
  "promocion",
  "promociones",
  "consulta",
  "hola",
  "buenas",
  "buen dia",
  "buenos dias",
  "buenas tardes",
  "buenas noches",
  "que tal"
];

function toSafeString(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function normalizeMatch(value) {
  return toSafeString(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function truncateText(value, limit = MAX_TEXT) {
  const text = toSafeString(value).trim();
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit - 3)}...`;
}

function formatDate(value) {
  if (!value) {
    return "";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

function formatDecimal(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "object" && typeof value.toString === "function") {
    return value.toString();
  }
  return String(value);
}

function limitArray(items, limit) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.slice(0, limit);
}

function buildDestinosSection(destinos) {
  if (!destinos.length) {
    return "Destinos: (sin datos)";
  }
  const items = limitArray(destinos, MAX_ITEMS).map((destino) => {
    const region = destino.paisRegion ? ` (${destino.paisRegion})` : "";
    const desc = destino.descripcionCorta
      ? ` - ${truncateText(destino.descripcionCorta, 120)}`
      : "";
    return `- ${destino.nombre}${region}${desc}`;
  });
  if (destinos.length > items.length) {
    items.push(`- ... ${destinos.length - items.length} destinos adicionales`);
  }
  return ["Destinos:", ...items].join("\n");
}

function getOfferDestinations(oferta) {
  const names = [];
  if (oferta.destino?.nombre) {
    names.push(oferta.destino.nombre);
  }
  if (Array.isArray(oferta.destinos)) {
    oferta.destinos.forEach((item) => {
      if (item?.destino?.nombre) {
        names.push(item.destino.nombre);
      }
    });
  }
  return Array.from(new Set(names));
}

function formatPriceItem(precio) {
  if (!precio) {
    return "";
  }
  const amount = formatDecimal(precio.precio);
  const currency = precio.moneda ? `${precio.moneda} ` : "";
  const start = formatDate(precio.fechaInicio);
  const end = formatDate(precio.fechaFin);
  const dateRange =
    start && end ? ` (${start} a ${end})` : start ? ` (desde ${start})` : "";
  if (!amount) {
    return "";
  }
  return `${currency}${amount}${dateRange}`.trim();
}

function buildOfertasSection(ofertas) {
  if (!ofertas.length) {
    return "Ofertas: (sin datos)";
  }
  const items = limitArray(ofertas, MAX_ITEMS).map((oferta) => {
    const destinos = getOfferDestinations(oferta);
    const destinoLabel = destinos.length ? destinos.join(" / ") : "sin destino";
    const precios = Array.isArray(oferta.precios)
      ? oferta.precios
          .map(formatPriceItem)
          .filter(Boolean)
          .slice(0, 4)
          .join("; ")
      : "";
    const incluyeItems = Array.isArray(oferta.incluyeItems)
      ? oferta.incluyeItems
          .map((item) => truncateText(item.descripcion, 80))
          .filter(Boolean)
          .slice(0, 4)
          .join(", ")
      : "";
    const actividades = Array.isArray(oferta.actividades)
      ? oferta.actividades
          .map((item) => item?.actividad?.nombre)
          .filter(Boolean)
          .slice(0, 4)
          .join(", ")
      : "";
    const detalles = [
      `destinos: ${destinoLabel}`,
      oferta.noches ? `noches: ${oferta.noches}` : null,
      oferta.cupos ? `cupos: ${oferta.cupos}` : null,
      precios ? `precios: ${precios}` : "precios: a consultar",
      actividades ? `actividades: ${actividades}` : null,
      incluyeItems ? `incluye: ${incluyeItems}` : null,
      oferta.noIncluye ? `no incluye: ${truncateText(oferta.noIncluye, 120)}` : null,
      oferta.condiciones
        ? `condiciones: ${truncateText(oferta.condiciones, 120)}`
        : null
    ].filter(Boolean);
    return `- ${oferta.titulo} | ${detalles.join(" | ")}`;
  });
  if (ofertas.length > items.length) {
    items.push(`- ... ${ofertas.length - items.length} ofertas adicionales`);
  }
  return ["Ofertas:", ...items].join("\n");
}

function buildActividadesSection(actividades) {
  if (!actividades.length) {
    return "Excursiones: (sin datos)";
  }
  const items = limitArray(actividades, MAX_ITEMS).map((actividad) => {
    const detalles = [
      actividad.destino?.nombre ? `destino: ${actividad.destino.nombre}` : null,
      actividad.tipoActividad ? `tipo: ${actividad.tipoActividad}` : null,
      actividad.fecha ? `fecha: ${formatDate(actividad.fecha)}` : null,
      actividad.hora ? `hora: ${actividad.hora}` : null,
      actividad.precio ? `precio: ${formatDecimal(actividad.precio)}` : null,
      actividad.cupos ? `cupos: ${actividad.cupos}` : null,
      actividad.puntoEncuentro
        ? `punto: ${truncateText(actividad.puntoEncuentro, 80)}`
        : null,
      actividad.descripcion
        ? `descripcion: ${truncateText(actividad.descripcion, 120)}`
        : null
    ].filter(Boolean);
    return `- ${actividad.nombre}${detalles.length ? ` | ${detalles.join(" | ")}` : ""}`;
  });
  if (actividades.length > items.length) {
    items.push(
      `- ... ${actividades.length - items.length} excursiones adicionales`
    );
  }
  return ["Excursiones:", ...items].join("\n");
}

function buildDataContext(data) {
  return [
    buildDestinosSection(data.destinos || []),
    buildOfertasSection(data.ofertas || []),
    buildActividadesSection(data.actividades || [])
  ].join("\n\n");
}

function collectRelevantKeywords(data) {
  const keywords = new Set(BASE_RELEVANT_KEYWORDS.map(normalizeMatch));
  const addKeyword = (value) => {
    const normalized = normalizeMatch(value);
    if (normalized && normalized.length > 2) {
      keywords.add(normalized);
    }
  };

  (data.destinos || []).forEach((destino) => {
    addKeyword(destino.nombre);
    addKeyword(destino.paisRegion);
  });

  (data.ofertas || []).forEach((oferta) => {
    addKeyword(oferta.titulo);
    addKeyword(oferta.destino?.nombre);
    (oferta.destinos || []).forEach((item) => {
      addKeyword(item?.destino?.nombre);
    });
  });

  (data.actividades || []).forEach((actividad) => {
    addKeyword(actividad.nombre);
    addKeyword(actividad.destino?.nombre);
  });

  return Array.from(keywords);
}

function isRelevantAssistantQuery(message, data) {
  const normalized = normalizeMatch(message);
  if (!normalized) {
    return false;
  }
  const keywords = collectRelevantKeywords(data);
  return keywords.some((keyword) => normalized.includes(keyword));
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }
  return history
    .filter(
      (item) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
    )
    .slice(-MAX_HISTORY)
    .map((item) => ({
      role: item.role,
      content: truncateText(item.content, MAX_HISTORY_CHARS)
    }));
}

async function fetchAssistantData() {
  const [destinos, ofertas, actividades] = await Promise.all([
    prisma.destino.findMany({
      where: { activo: true },
      orderBy: [{ destacado: "desc" }, { orden: "asc" }, { creadoEn: "desc" }],
      select: {
        nombre: true,
        paisRegion: true,
        descripcionCorta: true
      }
    }),
    prisma.oferta.findMany({
      where: { activa: true },
      orderBy: [{ destacada: "desc" }, { orden: "asc" }, { creadaEn: "desc" }],
      include: {
        destino: { select: { nombre: true } },
        destinos: { include: { destino: { select: { nombre: true } } } },
        actividades: { include: { actividad: { select: { nombre: true } } } },
        precios: true,
        incluyeItems: true
      }
    }),
    prisma.actividad.findMany({
      where: { activa: true },
      orderBy: [{ destacada: "desc" }, { orden: "asc" }, { creadaEn: "desc" }],
      include: { destino: { select: { nombre: true } } }
    })
  ]);

  return { destinos, ofertas, actividades };
}

function buildSystemPrompt() {
  return [
    "Sos Topix IA, el asistente de Topotours (agencia de viajes).",
    "Responde solo con informacion que aparezca en los datos disponibles.",
    "No inventes precios, fechas, cupos, condiciones ni destinos.",
    "Si algo no esta en los datos, deci que no esta disponible y ofrece alternativas.",
    `Si el usuario pregunta algo fuera de viajes, responde: "${OUT_OF_SCOPE_REPLY}"`,
    "Mantene un tono cordial y directo, estilo chat.",
    "Si faltan datos (destino, fechas, presupuesto, pasajeros), pedilos con una pregunta concreta.",
    "Si ves listados con '... adicionales', pedi mas detalles para acotar."
  ].join("\n");
}

async function callOpenAI(messages) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("Falta configurar OPENAI_API_KEY para OpenAI.");
    error.status = 501;
    throw error;
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 350
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `OpenAI error (${response.status}): ${errorText || "sin detalle"}`
    );
    error.status = 502;
    throw error;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    const error = new Error("La respuesta del asistente esta vacia.");
    error.status = 502;
    throw error;
  }
  return content.trim();
}

async function callOllama(messages) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `Ollama error (${response.status}): ${errorText || "sin detalle"}`
    );
    error.status = 502;
    throw error;
  }

  const data = await response.json();
  const content = data?.message?.content;
  if (!content) {
    const error = new Error("La respuesta de Ollama esta vacia.");
    error.status = 502;
    throw error;
  }
  return content.trim();
}

async function callLLM(messages) {
  if (LLM_PROVIDER === "ollama") {
    return callOllama(messages);
  }
  if (LLM_PROVIDER === "openai") {
    return callOpenAI(messages);
  }
  if (process.env.OPENAI_API_KEY) {
    return callOpenAI(messages);
  }
  return callOllama(messages);
}

async function createAssistantReply({ message, history }) {
  const text = toSafeString(message).trim();
  if (!text) {
    const error = new Error("message es obligatorio");
    error.status = 400;
    throw error;
  }

  const data = await fetchAssistantData();
  if (!isRelevantAssistantQuery(text, data)) {
    return OUT_OF_SCOPE_REPLY;
  }
  const dataContext = buildDataContext(data);
  const historyMessages = normalizeHistory(history);

  const messages = [
    { role: "system", content: buildSystemPrompt() },
    { role: "system", content: `Datos disponibles:\n${dataContext}` },
    ...historyMessages,
    { role: "user", content: truncateText(text, MAX_HISTORY_CHARS) }
  ];

  return callLLM(messages);
}

module.exports = {
  createAssistantReply
};

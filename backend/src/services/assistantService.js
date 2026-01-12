const prisma = require("../lib/prisma");

const GROQ_URL =
  process.env.GROQ_URL || "https://api.groq.com/openai/v1/chat/completions";
const GROQ_FALLBACK_MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.1-70b-versatile",
  "llama3-8b-8192",
  "llama3-70b-8192",
  "gemma-7b-it"
];
const MAX_HISTORY = 6;
const MAX_ITEMS = 25;
const MAX_TEXT = 140;
const MAX_HISTORY_CHARS = 500;
const ASSISTANT_CACHE_TTL_MS =
  Number(process.env.ASSISTANT_CACHE_TTL_MS) || 60 * 1000;
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
  "resumen",
  "pantallazo",
  "destacado",
  "destacados",
  "destacadas",
  "persona",
  "personas",
  "pasajero",
  "pasajeros",
  "adulto",
  "adultos",
  "nino",
  "ninos",
  "niño",
  "niños",
  "presupuesto",
  "fecha",
  "fechas",
  "mes",
  "meses",
  "semana",
  "semanas",
  "temporada",
  "hola",
  "buenas",
  "buen dia",
  "buenos dias",
  "buenas tardes",
  "buenas noches",
  "que tal"
];

const assistantCache = {
  data: null,
  dataContext: "",
  keywords: [],
  expiresAt: 0,
  promise: null
};

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

function formatDateRange(precio) {
  if (!precio) {
    return "";
  }
  const start = formatDate(precio.fechaInicio);
  const end = formatDate(precio.fechaFin);
  if (start && end) {
    return `${start} a ${end}`;
  }
  return start ? `desde ${start}` : "";
}

function buildOfertasSection(ofertas) {
  if (!ofertas.length) {
    return "Salidas: (sin datos)";
  }
  const items = limitArray(ofertas, MAX_ITEMS).map((oferta) => {
    const destinos = getOfferDestinations(oferta);
    const destinoLabel = destinos.length ? destinos.join(" / ") : "sin destino";
    const fechas = Array.isArray(oferta.precios)
      ? oferta.precios
          .map(formatDateRange)
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
      fechas ? `fechas: ${fechas}` : "fechas: a confirmar",
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
  return ["Salidas:", ...items].join("\n");
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

function isRelevantAssistantQuery(message, dataOrKeywords, history = []) {
  const normalized = normalizeMatch(message);
  if (!normalized) {
    return false;
  }
  const keywords = Array.isArray(dataOrKeywords)
    ? dataOrKeywords
    : collectRelevantKeywords(dataOrKeywords);
  const matchesKeywords = (value) =>
    keywords.some((keyword) => value.includes(keyword));
  if (matchesKeywords(normalized)) {
    return true;
  }
  if (!Array.isArray(history)) {
    return false;
  }
  return history.some((item) => {
    const content = normalizeMatch(item?.content);
    return content ? matchesKeywords(content) : false;
  });
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

async function fetchAssistantDataFromDb() {
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

async function getAssistantCachePayload() {
  const now = Date.now();
  if (assistantCache.data && assistantCache.expiresAt > now) {
    return assistantCache;
  }
  if (assistantCache.promise) {
    return assistantCache.promise;
  }

  assistantCache.promise = fetchAssistantDataFromDb()
    .then((data) => {
      assistantCache.data = data;
      assistantCache.dataContext = buildDataContext(data);
      assistantCache.keywords = collectRelevantKeywords(data);
      assistantCache.expiresAt = Date.now() + ASSISTANT_CACHE_TTL_MS;
      return assistantCache;
    })
    .finally(() => {
      assistantCache.promise = null;
    });

  return assistantCache.promise;
}

async function fetchAssistantData() {
  const payload = await getAssistantCachePayload();
  return payload.data || { destinos: [], ofertas: [], actividades: [] };
}

function buildSystemPrompt() {
  return [
    "Sos Topix IA, el asistente de Topotours (agencia de viajes).",
    "Responde solo con informacion que aparezca en los datos disponibles.",
    "No inventes fechas, cupos, condiciones ni destinos.",
    "No menciones precios ni valores monetarios.",
    "Si algo no esta en los datos, deci que no esta disponible y ofrece alternativas.",
    `Si el usuario pregunta algo fuera de viajes, responde: "${OUT_OF_SCOPE_REPLY}"`,
    "Mantene un tono cordial y directo, estilo chat.",
    "Si faltan datos (destino, fechas, presupuesto, pasajeros), pedilos con una pregunta concreta.",
    "Si el usuario menciona un destino o una salida, pregunta siempre: cuantas personas viajan, fechas estimadas, presupuesto y si prefieren avion o colectivo.",
    "Si el usuario quiere reservar, deriva a WhatsApp con un asesor sin pedir mas datos.",
    "Si el usuario saluda o pide un resumen, mostra primero un pantallazo con salidas destacadas y destinos destacados.",
    "Si ves listados con '... adicionales', pedi mas detalles para acotar."
  ].join("\n");
}

function buildOverviewReply(data) {
  const destinos = limitArray(data.destinos || [], 4);
  const ofertas = limitArray(data.ofertas || [], 4);
  const destinosLines = destinos.length
    ? destinos.map((destino) => `- ${destino.nombre}`).join("\n")
    : "- Sin destinos disponibles.";
  const ofertasLines = ofertas.length
    ? ofertas.map((oferta) => `- ${oferta.titulo}`).join("\n")
    : "- Sin salidas disponibles.";

  return [
    "Pantallazo rapido:",
    "",
    "Destinos destacados:",
    destinosLines,
    "",
    "Salidas destacadas:",
    ofertasLines,
    "",
    "Contame que te interesa y te ayudo a elegir."
  ].join("\n");
}

function getGroqModelCandidates() {
  const configured = process.env.GROQ_MODEL;
  const models = [
    configured,
    ...GROQ_FALLBACK_MODELS
  ].filter(Boolean);
  return Array.from(new Set(models));
}

async function requestGroq(messages, model) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 220
    })
  });

  const rawBody = await response.text();
  let payload = null;
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      payload = null;
    }
  }

  if (!response.ok) {
    const code = payload?.error?.code;
    const message =
      payload?.error?.message || rawBody || "sin detalle";
    const error = new Error(
      `Groq error (${response.status}): ${message}`
    );
    error.status = response.status === 429 ? 429 : 502;
    return { ok: false, error, decommissioned: code === "model_decommissioned" };
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    const error = new Error("La respuesta del asistente esta vacia.");
    error.status = 502;
    return { ok: false, error, decommissioned: false };
  }
  return { ok: true, content: content.trim() };
}

async function callGroq(messages) {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("Falta configurar GROQ_API_KEY para Groq.");
    error.status = 501;
    throw error;
  }

  const candidates = getGroqModelCandidates();
  let lastError = null;
  for (const model of candidates) {
    const result = await requestGroq(messages, model);
    if (result.ok) {
      return result.content;
    }
    lastError = result.error;
    if (!result.decommissioned) {
      throw result.error;
    }
  }
  throw lastError || new Error("Error al conectar con Groq.");
}

async function createAssistantReply({ message, history }) {
  const text = toSafeString(message).trim();
  if (!text) {
    const error = new Error("message es obligatorio");
    error.status = 400;
    throw error;
  }

  const payload = await getAssistantCachePayload();
  const data = payload.data || { destinos: [], ofertas: [], actividades: [] };
  const historyMessages = normalizeHistory(history);
  if (!isRelevantAssistantQuery(text, payload.keywords, historyMessages)) {
    return OUT_OF_SCOPE_REPLY;
  }
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    { role: "system", content: `Datos disponibles:\n${payload.dataContext}` },
    ...historyMessages,
    { role: "user", content: truncateText(text, MAX_HISTORY_CHARS) }
  ];

  try {
    return await callGroq(messages);
  } catch (error) {
    const messageText = String(error?.message || "");
    if (error?.status === 429 || messageText.includes("Rate limit")) {
      return "Estamos con mucha demanda en este momento. Probá de nuevo en unos segundos.";
    }
    throw error;
  }
}

module.exports = {
  createAssistantReply,
  fetchAssistantData,
  buildOverviewReply
};

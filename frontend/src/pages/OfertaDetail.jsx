import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useOfertas } from "../hooks/useTravelData.js";
import { formatDate } from "../utils/formatters.js";
import { getWhatsappLink } from "../utils/contactLinks.js";
import { getOfferImages } from "../utils/offerImages.js";
import { getIncluyeIcon, getNoIncluyeIcon } from "../utils/incluyeIcons.jsx";
import {
  stripMarkdownSectionByKeyword,
  stripLinesWithPriceSignals,
  hasPriceSignals,
  hasMeaningfulInfoText
} from "../utils/markdownSanitizers.js";

const TIPO_LABELS = {
  "aereo": "Vuelos",
  "aéreo": "Vuelos",
  "transporte": "Transporte",
  "traslados": "Traslados",
  "alojamiento": "Alojamiento",
  "desayuno": "Desayuno incluido",
  "comidas": "Comidas",
  "régimen": "Régimen alimentario",
  "regimen": "Régimen alimentario",
  "equipaje": "Equipaje",
  "asistencia": "Asistencia al viajero",
  "seguro": "Seguro de viaje",
  "excursión": "Excursiones",
  "excursion": "Excursiones",
  "salidas": "Fechas de salida",
  "notas": "Notas importantes",
  "otros": "Servicios adicionales",
};

function formatIncluyeTipo(tipo) {
  if (!tipo) return "Incluye";
  const key = tipo.toLowerCase().trim();
  return TIPO_LABELS[key] || (tipo.charAt(0).toUpperCase() + tipo.slice(1));
}


const DETAIL_PREFIX = "detalle-";
const ITINERARY_PREFIX = "itinerario-";
const DETAIL_LABELS = {
  programa: "Programa",
  destino: "Destino",
  duracion: "Duración",
  transporte: "Transporte",
  equipaje: "Equipaje",
  hotel: "Hotel",
  regimen: "Régimen",
  "media-pension": "Media pensión opcional",
  servicios: "Servicios",
  excursiones: "Excursiones",
  asistencia: "Asistencia médica",
  salidas: "Salidas",
  rutas: "Rutas",
  tribunas: "Tribunas / categorías",
  entradas: "Tipo de entrada",
  notas: "Notas"
};

const normalizeTipo = (tipo) => String(tipo || "").toLowerCase().trim();

const isDetailItem = (tipo) => normalizeTipo(tipo).startsWith(DETAIL_PREFIX);
const isItineraryItem = (tipo) => normalizeTipo(tipo).startsWith(ITINERARY_PREFIX);

function formatDetailLabel(tipo) {
  const normalized = normalizeTipo(tipo).replace(DETAIL_PREFIX, "");
  if (!normalized) {
    return "Detalle";
  }
  return DETAIL_LABELS[normalized] || normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getItineraryIndex(tipo) {
  const match = normalizeTipo(tipo).match(/^itinerario-(\d+)/);
  return match ? Number(match[1]) : 0;
}

function renderItineraryText(text) {
  const raw = String(text || "").trim();
  if (!raw) {
    return raw;
  }
  const [title, ...rest] = raw.split(":");
  if (!rest.length) {
    return raw;
  }
  return (
    <>
      <strong>{title.trim()}:</strong> {rest.join(":").trim()}
    </>
  );
}

function formatDateRangeLabel(startValue, endValue) {
  if (!startValue) return "";
  const sDate = new Date(startValue);
  const eDate = endValue ? new Date(endValue) : null;
  if (eDate) {
    const isFirstDay = sDate.getUTCDate() === 1;
    const lastDayOfMonth = new Date(Date.UTC(sDate.getUTCFullYear(), sDate.getUTCMonth() + 1, 0)).getUTCDate();
    const isLastDay = eDate.getUTCDate() === lastDayOfMonth;
    const sameYearMonth = sDate.getUTCFullYear() === eDate.getUTCFullYear() && sDate.getUTCMonth() === eDate.getUTCMonth();
    if (isFirstDay && isLastDay && sameYearMonth) {
      const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const monthName = monthNames[sDate.getUTCMonth()];
      const year = sDate.getUTCFullYear();
      return `Todo el mes de ${monthName} ${year}`;
    }
  }

  const start = formatDate(startValue);
  const end = formatDate(endValue);
  if (!end || start === end) {
    return start;
  }
  return `${start} - ${end}`;
}

// Helper para limpiar el título
function cleanTitle(title) {
  if (!title) return "";
  // Borra "con KMB", "KMB -", "- KMB", o "KMB" solo, case insensitive
  return title
    .replace(/\s+con\s+kmb/gi, "")
    .replace(/[-–]?\s*kmb\s*[-–]?/gi, "")
    .trim();
}

// Helper para formatear contenido markdown raw
function formatRawContent(text, { stripItinerary = false } = {}) {
  if (!text) return null;

  const sourceText = stripItinerary
    ? stripMarkdownSectionByKeyword(text, "itinerario")
    : text;

  const cleaned = stripLinesWithPriceSignals(sourceText);

  // Normalizar los saltos de línea y asegurar espacio antes de headers
  let processed = cleaned
    .replace(/\r\n/g, "\n")
    .replace(/([^\n])\s*(#{2,})/g, "$1\n\n$2") // Header sticky
    .replace(/([^\n])\s*(#{3,})/g, "$1\n\n$3") // Header sticky
    .replace(/([^\n])\s*•/g, "$1\n•"); // Bullets sticky

  // Split por headers para crear secciones si es posible
  // Esto asume que el texto usa markdown headers ## o ###
  const lines = processed.split("\n");
  const elements = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("###")) {
      elements.push(
        <h3 key={index} className="info-subtitle">
          {trimmed.replace(/^#+\s*/, "")}
        </h3>
      );
    } else if (trimmed.startsWith("##")) {
      elements.push(
        <h2 key={index} className="info-title">
          {trimmed.replace(/^#+\s*/, "")}
        </h2>
      );
    } else if (trimmed.startsWith("•")) {
      // List items
      // Check if previous element is a ul, otherwise create new
      // En este simple parser, renderizamos como p con bullet styled por css o span
      elements.push(
        <div key={index} className="info-list-item">
          <span className="info-bullet">•</span>
          <p>{parseBold(trimmed.replace(/^•\s*/, ""))}</p>
        </div>
      );
    } else {
      // Paragraph
      elements.push(
        <p key={index} className="info-text">
          {parseBold(trimmed)}
        </p>
      );
    }
  });

  if (elements.length === 0) {
    return null;
  }

  return <div className="info-content-wrapper">{elements}</div>;
}

function parseBold(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="info-highlight">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function OfertaDetail() {
  const { slug } = useParams();
  const { ofertas, loading, error } = useOfertas();

  const oferta = useMemo(
    () =>
      ofertas.find((item) => item.slug === slug || String(item.id) === slug),
    [ofertas, slug]
  );

  const preciosOrdenados = useMemo(() => {
    return [...(oferta?.precios || [])].sort(
      (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
    );
  }, [oferta]);

  const detalleItems = useMemo(() => {
    return (oferta?.incluyeItems || []).filter(
      (item) =>
        isDetailItem(item.tipo) &&
        !hasPriceSignals(item.tipo) &&
        !hasPriceSignals(item.descripcion)
    );
  }, [oferta]);

  const itinerarioItems = useMemo(() => {
    return (oferta?.incluyeItems || [])
      .filter((item) => isItineraryItem(item.tipo))
      .sort((a, b) => getItineraryIndex(a.tipo) - getItineraryIndex(b.tipo));
  }, [oferta]);

  const incluyeItems = useMemo(() => {
    return (oferta?.incluyeItems || []).filter(
      (item) =>
        !isDetailItem(item.tipo) &&
        !isItineraryItem(item.tipo) &&
        !hasPriceSignals(item.tipo) &&
        !hasPriceSignals(item.descripcion)
    );
  }, [oferta]);

  const detalleFechas = useMemo(() => {
    return detalleItems.find(
      (item) =>
        normalizeTipo(item.tipo) === "detalle-salidas" ||
        normalizeTipo(item.tipo) === "detalle-fechas"
    );
  }, [detalleItems]);

  const hasItinerary = itinerarioItems.length > 0;

  // New logic for parsing custom NO incluidos
  const noIncluyeParsed = useMemo(() => {
    let result = [];
    if (oferta?.noIncluye && oferta.noIncluye.trim()) {
      try {
        result = JSON.parse(oferta.noIncluye);
      } catch {
        // Fallback for old plaintext values
        result = oferta.noIncluye.split('\n').filter(line => line.trim()).map(item => ({
          tipo: 'General',
          descripcion: item.replace(/^-/, '').replace(/^•/, '').trim()
        }));
      }
    }
    return result;
  }, [oferta?.noIncluye]);

  const cleanedCondiciones = useMemo(() => {
    const source = hasItinerary
      ? stripMarkdownSectionByKeyword(oferta?.condiciones || "", "itinerario")
      : oferta?.condiciones || "";
    return stripLinesWithPriceSignals(source);
  }, [oferta?.condiciones, hasItinerary]);
  const hasInfoContent = Boolean(
    detalleItems.length ||
    hasMeaningfulInfoText(cleanedCondiciones) ||
    noIncluyeParsed.length > 0
  );

  const actividadesIncluidas = useMemo(() => {
    return (oferta?.actividades || [])
      .map((item) => item.actividad)
      .filter(Boolean);
  }, [oferta]);

  const destinosExtras = useMemo(() => {
    return (oferta?.destinos || [])
      .map((item) => item.destino)
      .filter(Boolean);
  }, [oferta]);

  if (loading) {
    return (
      <main>
        <p className="section-state">Cargando oferta...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p className="section-state error">{error}</p>
      </main>
    );
  }

  if (!oferta) {
    return (
      <main>
        <p className="section-state">No encontramos esta oferta.</p>
        <Link className="primary" to="/ofertas">
          Volver a ofertas
        </Link>
      </main>
    );
  }

  const offerImages = getOfferImages(oferta);
  const heroImage = offerImages[0] || fallbackDeal;
  const destinoPrincipal = oferta.destino?.nombre || "Destino";
  // Usar título limpio
  const tituloOferta = cleanTitle(oferta.titulo);
  const whatsappMessage = `Hola! Quiero reservar la salida ${tituloOferta} para ${destinoPrincipal}.`;
  const whatsappLink = getWhatsappLink(whatsappMessage);

  return (
    <main className="detail-page">
      <section
        className="detail-hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="detail-hero-overlay">
          <div className="detail-hero-content">
            <Link className="detail-back" to="/ofertas">
              Volver a ofertas
            </Link>
            <p className="detail-kicker">Oferta</p>
            <h1>{tituloOferta}</h1>
            <p>{destinoPrincipal}</p>
            <div className="detail-hero-meta">
              {oferta.noches ? <span>Noches: {oferta.noches}</span> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="detail-cta">
        <a
          className="detail-whatsapp"
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          Consultar por WhatsApp
        </a>
      </section>

      <section className="detail-section">
        <div className="detail-grid detail-grid--clean">
          {/* Card: Resumen del viaje */}
          <article className="detail-card detail-card--info">
            <h3>Resumen del Paquete</h3>
            <div className="detail-table">
              <div className="detail-table-row">
                <span>Destino principal</span>
                <span>{destinoPrincipal}</span>
              </div>
              {oferta.destino?.paisRegion && (
                <div className="detail-table-row">
                  <span>País/Región</span>
                  <span>{oferta.destino.paisRegion}</span>
                </div>
              )}
              <div className="detail-table-row">
                <span>Noches</span>
                <span>{oferta.noches}</span>
              </div>
              {preciosOrdenados.length > 0 ? (
                <div className="detail-table-row">
                  <span>Fechas de salida</span>
                  <span>
                    {preciosOrdenados.map((precio, i) => (
                      <div key={precio.id}>
                        {formatDateRangeLabel(precio.fechaInicio, precio.fechaFin)}
                      </div>
                    ))}
                  </span>
                </div>
              ) : detalleFechas?.descripcion ? (
                <div className="detail-table-row">
                  <span>Fechas de salida</span>
                  <span>{detalleFechas.descripcion}</span>
                </div>
              ) : null}
            </div>
          </article>

          {/* Card: Servicios Incluidos */}
          <article className="detail-card detail-card--includes">
            <h3>Servicios Incluidos</h3>
            {incluyeItems.length ? (
              <ul className="detail-list detail-list--icons detail-list--fancy">
                {incluyeItems.map((item) => (
                  <li key={item.id}>
                    <span className="detail-icon">{getIncluyeIcon(item.tipo)}</span>
                    <span className="detail-list-text">
                      <strong>{formatIncluyeTipo(item.tipo)}:</strong>{" "}
                      {item.descripcion}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Consultanos para conocer el detalle de los servicios incluidos en este paquete.</p>
            )}
          </article>

          {/* Card: Servicios NO Incluidos */}
          {noIncluyeParsed.length > 0 && (
            <article className="detail-card detail-card--includes">
              <h3>Servicios no incluidos</h3>
              <ul className="detail-list detail-list--icons detail-list--fancy">
                {noIncluyeParsed.map((item, idx) => (
                  <li key={`noinc-${idx}`}>
                    <span className="detail-icon" style={{ opacity: 0.6 }}>{getNoIncluyeIcon(item.tipo)}</span>
                    <span className="detail-list-text">
                      {item.tipo && item.tipo !== 'General' ? (
                        <><strong>{formatIncluyeTipo(item.tipo)}:</strong> {item.descripcion}</>
                      ) : (
                        <>{item.descripcion}</>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      </section>

      {destinosExtras.length ? (
        <section className="detail-section">
          <article className="detail-card">
            <h3>Destinos incluidos</h3>
            <ul className="detail-list">
              {destinosExtras.map((destino) => {
                const destinoSlug = destino.slug || destino.id;
                return (
                  <li key={destino.id}>
                    <Link to={`/destinos/${destinoSlug}`}>
                      {destino.nombre}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </article>
        </section>
      ) : null}

      {actividadesIncluidas.length ? (
        <section className="grid-section">
          <div className="section-header">
            <h2>Excursiones incluidas</h2>
            <p>Experiencias recomendadas para este paquete.</p>
          </div>
          <div className="grid">
            {actividadesIncluidas.map((actividad) => {
              const actividadSlug = actividad.slug || actividad.id;
              return (
                <Link
                  className="tile excursion-card"
                  key={actividad.id}
                  to={`/excursiones/${actividadSlug}`}
                >
                  <div
                    className="tile-image"
                    style={{
                      backgroundImage: actividad.imagenPortada
                        ? `url("${actividad.imagenPortada}")`
                        : `url("${fallbackDeal}")`
                    }}
                  ></div>
                  <div className="tile-content">
                    <h4>{actividad.nombre}</h4>
                    <p>{actividad.descripcion}</p>
                    <span className="tile-meta">
                      {actividad.destino?.nombre || "Destino"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useOfertas } from "../hooks/useTravelData.js";
import { formatDate } from "../utils/formatters.js";
import { getWhatsappLink } from "../utils/contactLinks.js";
import { getOfferImages } from "../utils/offerImages.js";
import { getIncluyeIcon } from "../utils/incluyeIcons.jsx";

function formatIncluyeTipo(tipo) {
  if (!tipo) {
    return "Incluye";
  }
  return tipo.charAt(0).toUpperCase() + tipo.slice(1);
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
  const start = formatDate(startValue);
  const end = formatDate(endValue);
  if (!start) {
    return "";
  }
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
function formatRawContent(text) {
  if (!text) return null;

  // Clean prices
  const cleaned = text
    .split('\n')
    .filter(line => {
      const lower = line.toLowerCase();
      return !(lower.includes('tarifa') || lower.includes('usd') || lower.includes('precio') || lower.includes('impuestos') || lower.includes('imp.'));
    })
    .join('\n');

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
    return (oferta?.incluyeItems || []).filter((item) => isDetailItem(item.tipo));
  }, [oferta]);

  const itinerarioItems = useMemo(() => {
    return (oferta?.incluyeItems || [])
      .filter((item) => isItineraryItem(item.tipo))
      .sort((a, b) => getItineraryIndex(a.tipo) - getItineraryIndex(b.tipo));
  }, [oferta]);

  const incluyeItems = useMemo(() => {
    return (oferta?.incluyeItems || []).filter(
      (item) => !isDetailItem(item.tipo) && !isItineraryItem(item.tipo)
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
        <div className={`detail-grid detail-grid--offer${hasItinerary ? "" : " detail-grid--no-itinerary"}`}>
          <article className="detail-card detail-card--info">
            <h3>{detalleItems.length ? "Detalle del producto" : "Información del viaje"}</h3>
            {detalleItems.length ? (
              <div className="detail-table">
                {detalleItems.map((item) => (
                  <div className="detail-table-row" key={item.id}>
                    <span>{formatDetailLabel(item.tipo)}</span>
                    <span>{item.descripcion}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Renderizado especial para condiciones/información */}
            {oferta.condiciones ? (
              <div className="detail-info-block">
                {formatRawContent(oferta.condiciones)}
              </div>
            ) : !detalleItems.length ? (
              <p>Consultanos para mas info.</p>
            ) : null}

            {oferta.noIncluye ? <p>No incluye: {oferta.noIncluye}</p> : null}
          </article>
          <article className="detail-card detail-card--includes">
            <h3>Qué incluye</h3>
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
              <p>Consultanos para conocer el detalle del paquete.</p>
            )}
          </article>
          <article className="detail-card detail-card--dates">
            <h3>Fechas disponibles</h3>
            {preciosOrdenados.length ? (
              <div className="detail-table">
                {preciosOrdenados.map((precio) => (
                  <div className="detail-table-row" key={precio.id}>
                    <span>
                      {formatDateRangeLabel(
                        precio.fechaInicio,
                        precio.fechaFin
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : detalleFechas?.descripcion ? (
              <p>{detalleFechas.descripcion}</p>
            ) : (
              <p>Fechas a confirmar. Te asesoramos por WhatsApp.</p>
            )}
          </article>
          {hasItinerary ? (
            <article className="detail-card detail-card--itinerary">
              <h3>Itinerario</h3>
              <ul className="detail-list detail-list--timeline">
                {itinerarioItems.map((item, index) => (
                  <li key={item.id} data-step={index + 1}>
                    <span className="detail-list-text">
                      {renderItineraryText(item.descripcion)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
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

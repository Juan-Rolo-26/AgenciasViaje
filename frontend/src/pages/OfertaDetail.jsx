import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useOfertas } from "../hooks/useTravelData.js";
import { formatDate } from "../utils/formatters.js";
import { getWhatsappLink } from "../utils/contactLinks.js";
import { getOfferImages } from "../utils/offerImages.js";

const incluyeIconos = {
  transporte: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7V5H17V7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  alojamiento: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="11" width="18" height="6" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V8H11V11" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 17V20M21 17V20" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  comida: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  servicio: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="12" width="3" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="12" width="3" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 18v2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  equipaje: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="7" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 7V5H15V7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
};

function getIncluyeIcon(tipo) {
  const key = String(tipo || "").toLowerCase();
  return incluyeIconos[key] || incluyeIconos.default;
}

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
  const whatsappMessage = `Hola! Quiero reservar la salida ${oferta.titulo} para ${destinoPrincipal}.`;
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
            <h1>{oferta.titulo}</h1>
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
        <div className="detail-grid">
          <article className="detail-card">
            <h3>{detalleItems.length ? "Detalle del producto" : "Detalle de la oferta"}</h3>
            {detalleItems.length ? (
              <div className="detail-table">
                {detalleItems.map((item) => (
                  <div className="detail-table-row" key={item.id}>
                    <span>{formatDetailLabel(item.tipo)}</span>
                    <span>{item.descripcion}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>{oferta.condiciones || "Consultanos para mas info."}</p>
            )}
            {detalleItems.length && oferta.condiciones ? (
              <p>{oferta.condiciones}</p>
            ) : null}
            {oferta.noIncluye ? <p>No incluye: {oferta.noIncluye}</p> : null}
          </article>
          <article className="detail-card">
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
        </div>
      </section>

      <section className="detail-section">
        <article className="detail-card">
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
      </section>

      {itinerarioItems.length ? (
        <section className="detail-section">
          <article className="detail-card">
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
        </section>
      ) : null}

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

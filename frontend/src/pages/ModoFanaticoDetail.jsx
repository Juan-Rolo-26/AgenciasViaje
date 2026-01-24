import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { resolveAssetUrl } from "../utils/assetUrl.js";
import { FANATIC_ITEMS } from "../utils/modoFanaticoData.js";
import { useOfertas } from "../hooks/useTravelData.js";
import { formatDate } from "../utils/formatters.js";
import { getWhatsappLink } from "../utils/contactLinks.js";
import "./ModoFanaticoDetail.css";

const DETAIL_PREFIX = "detalle-";
const ITINERARY_PREFIX = "itinerario-";

const RELATED_OFFERS_MAP = {
  f1: ["formula-1-por-el-mundo"],
  mundial: ["experiencia-mundial"]
};

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

const formatDetailLabel = (tipo) => {
  const normalized = normalizeTipo(tipo).replace(DETAIL_PREFIX, "");
  if (!normalized) return "Detalle";
  return (
    DETAIL_LABELS[normalized] ||
    normalized.charAt(0).toUpperCase() + normalized.slice(1)
  );
};

const getItineraryIndex = (tipo) => {
  const match = normalizeTipo(tipo).match(/^itinerario-(\d+)/);
  return match ? Number(match[1]) : 0;
};

const renderItineraryText = (text) => {
  const raw = String(text || "").trim();
  if (!raw) return raw;

  const [title, ...rest] = raw.split(":");
  if (!rest.length) return raw;

  return (
    <>
      <strong className="mfd-strong">{title.trim()}:</strong>{" "}
      {rest.join(":").trim()}
    </>
  );
};

const formatDateRangeLabel = (startValue, endValue) => {
  const start = formatDate(startValue);
  const end = formatDate(endValue);
  if (!start) return "";
  if (!end || start === end) return start;
  return `${start} - ${end}`;
};

export default function ModoFanaticoDetail() {
  const { slug } = useParams();
  const { ofertas, loading } = useOfertas();

  const item = useMemo(
    () => FANATIC_ITEMS.find((entry) => entry.slug === slug),
    [slug]
  );

  const heroImage = useMemo(() => {
    if (!item) return fallbackDeal;
    return resolveAssetUrl(item.imagenPortada) || fallbackDeal;
  }, [item]);

  const galleryImages = useMemo(() => {
    if (!item) return [fallbackDeal, fallbackDeal, fallbackDeal];

    const images = [item.imagenPortada, ...(item.imagenes || [])]
      .map((image) => resolveAssetUrl(image))
      .filter(Boolean);

    while (images.length < 3) images.push(fallbackDeal);
    return images.slice(0, 3);
  }, [item]);

  const oferta = useMemo(() => {
    const slugs = RELATED_OFFERS_MAP[item?.slug] || [];
    if (!slugs.length) return null;
    return (ofertas || []).find((o) => slugs.includes(o.slug)) || null;
  }, [item?.slug, ofertas]);

  const preciosOrdenados = useMemo(() => {
    return [...(oferta?.precios || [])].sort(
      (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
    );
  }, [oferta]);

  const detalleItems = useMemo(() => {
    return (oferta?.incluyeItems || []).filter((x) => isDetailItem(x.tipo));
  }, [oferta]);

  const itinerarioItems = useMemo(() => {
    return (oferta?.incluyeItems || [])
      .filter((x) => isItineraryItem(x.tipo))
      .sort((a, b) => getItineraryIndex(a.tipo) - getItineraryIndex(b.tipo));
  }, [oferta]);

  const incluyeItems = useMemo(() => {
    return (oferta?.incluyeItems || []).filter(
      (x) => !isDetailItem(x.tipo) && !isItineraryItem(x.tipo)
    );
  }, [oferta]);

  const detalleFechas = useMemo(() => {
    return detalleItems.find((x) => {
      const t = normalizeTipo(x.tipo);
      return t === "detalle-salidas" || t === "detalle-fechas";
    });
  }, [detalleItems]);

  if (!item) {
    return (
      <main className="mfd-page">
        <section className="mfd-container">
          <div className="mfd-empty">
            <h1>No encontramos este contenido</h1>
            <p>Probá volver a la sección anterior y elegir otra experiencia.</p>
            <Link className="mfd-btn mfd-btn-primary" to="/modo-fanatico">
              Volver a modo fanático
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mfd-page">
      {/* HERO */}
      <section className="mfd-hero" style={{ backgroundImage: `url("${heroImage}")` }}>
        <div className="mfd-hero-overlay" />
        <div className="mfd-container mfd-hero-inner">
          <Link className="mfd-back" to="/modo-fanatico">
            ← Volver
          </Link>

          <div className="mfd-hero-card">
            <span className="mfd-badge">MODO FANÁTICO</span>
            <h1 className="mfd-title">{item.nombre}</h1>
            <p className="mfd-subtitle">{item.descripcionCorta || "Experiencia especial."}</p>

            <div className="mfd-hero-actions">
              <a
                className="mfd-btn mfd-btn-primary"
                href={getWhatsappLink(`Hola! Quiero consultar por ${item.nombre}.`)}
                target="_blank"
                rel="noreferrer"
              >
                Consultar por WhatsApp
              </a>
              <a className="mfd-btn mfd-btn-ghost" href="#detalle">
                Ver detalles
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RESUMEN + GALERIA */}
      <section className="mfd-section">
        <div className="mfd-container">
          <div className="mfd-summary">
            <h2 className="mfd-h2">Descripción</h2>
            <p className="mfd-text">{item.descripcion}</p>
          </div>

          <div className="mfd-gallery">
            {galleryImages.map((image, index) => (
              <figure className="mfd-photo" key={`${image}-${index}`}>
                <img src={image} alt={`${item.nombre} ${index + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* DETALLE */}
      <section className="mfd-section mfd-section-alt" id="detalle">
        <div className="mfd-container">
          <header className="mfd-header">
            <div>
              <h2 className="mfd-h2">Paquete: {item.nombre}</h2>
              <p className="mfd-text-muted">Todos los detalles del programa en un solo lugar.</p>
            </div>

            {oferta ? (
              <a
                className="mfd-btn mfd-btn-primary"
                href={getWhatsappLink(`Hola! Quiero reservar ${oferta.titulo} (${item.nombre}).`)}
                target="_blank"
                rel="noreferrer"
              >
                Reservar / Consultar
              </a>
            ) : (
              <a
                className="mfd-btn mfd-btn-primary"
                href={getWhatsappLink(`Hola! Quiero consultar por ${item.nombre}.`)}
                target="_blank"
                rel="noreferrer"
              >
                Consultar
              </a>
            )}
          </header>

          {loading ? (
            <div className="mfd-state">Cargando paquete...</div>
          ) : !oferta ? (
            <div className="mfd-state">
              Consultanos para conocer los próximos paquetes disponibles.
            </div>
          ) : (
            <>
              {/* GRID PRINCIPAL */}
              <div className="mfd-grid">
                {/* DETALLE */}
                <article className="mfd-card">
                  <h3 className="mfd-h3">Detalle del producto</h3>

                  {detalleItems.length ? (
                    <div className="mfd-table">
                      {detalleItems.map((detail) => (
                        <div className="mfd-row" key={detail.id}>
                          <span className="mfd-row-label">
                            {formatDetailLabel(detail.tipo)}
                          </span>
                          <span className="mfd-row-value">{detail.descripcion}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mfd-text">{oferta.condiciones || "Consultanos para más info."}</p>
                  )}

                  {detalleItems.length && oferta.condiciones ? (
                    <div className="mfd-divider">
                      <p className="mfd-text">{oferta.condiciones}</p>
                    </div>
                  ) : null}
                </article>

                {/* INCLUYE */}
                <article className="mfd-card">
                  <h3 className="mfd-h3">Qué incluye</h3>

                  {incluyeItems.length ? (
                    <ul className="mfd-list">
                      {incluyeItems.map((inc) => (
                        <li className="mfd-list-item" key={inc.id}>
                          <span className="mfd-check" aria-hidden="true">✓</span>
                          <span>
                            <strong className="mfd-strong">
                              {formatDetailLabel(`detalle-${inc.tipo}`)}:
                            </strong>{" "}
                            {inc.descripcion}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mfd-text">Consultanos para conocer el detalle del paquete.</p>
                  )}
                </article>
              </div>

              {/* FECHAS */}
              <section className="mfd-block">
                <article className="mfd-card">
                  <h3 className="mfd-h3">Fechas disponibles</h3>

                  {preciosOrdenados.length ? (
                    <div className="mfd-table">
                      {preciosOrdenados.map((precio) => (
                        <div className="mfd-row" key={precio.id}>
                          <span className="mfd-row-value">
                            {formatDateRangeLabel(precio.fechaInicio, precio.fechaFin)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : detalleFechas?.descripcion ? (
                    <p className="mfd-text">{detalleFechas.descripcion}</p>
                  ) : (
                    <p className="mfd-text">Fechas a confirmar. Te asesoramos por WhatsApp.</p>
                  )}
                </article>
              </section>

              {/* ITINERARIO */}
              {itinerarioItems.length ? (
                <section className="mfd-block">
                  <article className="mfd-card">
                    <h3 className="mfd-h3">Itinerario</h3>
                    <ol className="mfd-timeline">
                      {itinerarioItems.map((step, index) => (
                        <li className="mfd-timeline-item" key={step.id}>
                          <span className="mfd-step">{index + 1}</span>
                          <span className="mfd-timeline-text">
                            {renderItineraryText(step.descripcion)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </article>
                </section>
              ) : null}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

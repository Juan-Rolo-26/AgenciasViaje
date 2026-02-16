import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import fallbackDeal from "../assets/inicio.jpg";
import { resolveAssetUrl } from "../utils/assetUrl.js";
import { FANATIC_ITEMS } from "../utils/modoFanaticoData.js";
import { useOfertas } from "../hooks/useTravelData.js";
import { formatDate, formatCurrency } from "../utils/formatters.js";
import { getWhatsappLink } from "../utils/contactLinks.js";
import { getIncluyeIcon } from "../utils/incluyeIcons.jsx";
import { stripMarkdownSectionByKeyword } from "../utils/markdownSanitizers.js";

// === Constants and Helpers from OfertaDetail / DestinoDetail ===

function formatIncluyeTipo(tipo) {
  if (!tipo) {
    return "Incluye";
  }
  return tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

const DETAIL_PREFIX = "detalle-";
const ITINERARY_PREFIX = "itinerario-";

const RELATED_OFFERS_MAP = {
  f1: [
    "f1-miami-2026",
    "f1-las-vegas-2026",
    "f1-monaco-2026",
    "f1-madrid-2026",
    "f1-monza-2026",
    "f1-silverstone-2026",
    "f1-sao-paulo-2026"
  ],
  mundial: [
    "mundial-kansas-1-partido",
    "mundial-dallas-2-partidos",
    "mundial-fase-grupos-3-partidos",
    "mundial-completa-aereo",
    "mundial-dallas-16avos",
    "mundial-16avos",
    "mundial-futbol-playa-mexico"
  ],
  finalisima: ["finalisima-2026"],
  "f1-sao-paulo": ["f1-sao-paulo-2026"]
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

const normalizeText = (value) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const cleanContent = (text, { stripItinerary = false } = {}) => {
  if (!text) return "";
  const sourceText = stripItinerary
    ? stripMarkdownSectionByKeyword(text, "itinerario")
    : text;

  return sourceText
    .split('\n')
    .filter(line => {
      const lower = line.toLowerCase();
      return !(lower.includes('tarifa') || lower.includes('usd') || lower.includes('precio') || lower.includes('impuestos') || lower.includes('imp.'));
    })
    .map(line => line.replace(/^•\s*/, "- ").trimEnd())
    .join('\n');
};

const formatDateRange = (inicio, fin) => {
  if (!inicio) return "Consultar fechas";
  const start = formatDate(inicio);
  const end = fin ? formatDate(fin) : "";
  if (!end || start === end) return start;
  return `${start} - ${end}`;
};

const getPriceLabel = (precio) => {
  const amount = Number(precio?.precio);
  if (!Number.isFinite(amount) || amount <= 0) {
    return "A consultar";
  }
  return formatCurrency(amount, precio?.moneda);
};

const splitBulletLines = (text) =>
  (text || "")
    .split('\n')
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

const getTransportType = (oferta) => {
  const transporteItem = (oferta.incluyeItems || []).find(
    (item) => (item.tipo || "").toLowerCase() === "transporte"
  );
  const etiquetas = (oferta.etiquetas || []).join(" ");
  const texto = normalizeText(
    `${transporteItem?.descripcion || ""} ${transporteItem?.tipo || ""} ${oferta.condiciones || ""} ${oferta.titulo || ""} ${oferta.descripcion || ""} ${etiquetas}`
  ).trim();

  if (
    texto.includes("aereo") ||
    texto.includes("avion") ||
    texto.includes("vuelo") ||
    texto.includes("flybondi") ||
    texto.includes("latam") ||
    texto.includes("aerolineas")
  ) {
    return "avion";
  }
  if (
    texto.includes("bus") ||
    texto.includes("micro") ||
    texto.includes("semicama") ||
    texto.includes("cama") ||
    texto.includes("omnibus")
  ) {
    return "bus";
  }
  return "";
};

const renderTransportIcon = (type) => {
  if (type === "avion") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M10.5 21l1.5-7.5L3 9l1-3 9 2 5-5a2 2 0 0 1 3 3l-5 5 2 9-3 1-4.5-6.5L10.5 21z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="7" width="18" height="9" rx="2" />
      <path d="M7 7V5H17V7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
};

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
      <strong>{title.trim()}:</strong>{" "}
      {rest.join(":").trim()}
    </>
  );
};

export default function ModoFanaticoDetail() {
  const { slug } = useParams();
  const { ofertas, loading } = useOfertas();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const item = useMemo(
    () => FANATIC_ITEMS.find((entry) => entry.slug === slug),
    [slug]
  );

  const heroImage = useMemo(() => {
    if (!item) return fallbackDeal;
    return resolveAssetUrl(item.imagenPortada) || fallbackDeal;
  }, [item]);

  const galleryImages = useMemo(() => {
    if (!item) return [];

    const images = [item.imagenPortada, ...(item.imagenes || [])]
      .map((image) => resolveAssetUrl(image))
      .filter(Boolean);

    return images.slice(0, 6);
  }, [item]);

  const ofertasRelacionadas = useMemo(() => {
    const slugs = RELATED_OFFERS_MAP[item?.slug] || [];
    if (!slugs.length) return [];
    return (ofertas || []).filter((o) => slugs.includes(o.slug));
  }, [item?.slug, ofertas]);

  // Derived data for the selected package (same logic as in DestinoDetail)
  const selectedPackageData = useMemo(() => {
    if (!selectedPackage) return null;

    const oferta = selectedPackage;

    // Fallback images if needed (though we use hero for now or generic)
    // const offerImages = [oferta.imagenPortada, ...(oferta.imagenes || [])].filter(Boolean);

    const preciosOrdenados = [...(oferta.precios || [])].sort(
      (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
    );

    const detalleItems = (oferta.incluyeItems || []).filter((item) => isDetailItem(item.tipo));

    const itinerarioItems = (oferta.incluyeItems || [])
      .filter((item) => isItineraryItem(item.tipo))
      .sort((a, b) => getItineraryIndex(a.tipo) - getItineraryIndex(b.tipo));

    const incluyeItems = (oferta.incluyeItems || []).filter(
      (item) => !isDetailItem(item.tipo) && !isItineraryItem(item.tipo)
    );

    const detalleFechas = detalleItems.find(
      (item) =>
        normalizeTipo(item.tipo) === "detalle-salidas" ||
        normalizeTipo(item.tipo) === "detalle-fechas"
    );

    // Try to find a snippet or short description for header
    const shortDesc = detalleItems.find(i =>
      ['detalle-fecha-gp', 'detalle-hotel', 'detalle-entrada'].includes(i.tipo)
    )?.descripcion || oferta.condiciones || "";

    const transportType = getTransportType(oferta);
    const transportLabel = transportType === "avion" ? "Aéreo" : transportType === "bus" ? "Bus" : "A confirmar";

    const priceRows = preciosOrdenados.map((precio, index) => ({
      id: precio.id || `${precio.fechaInicio}-${precio.fechaFin}-${index}`,
      dateLabel: formatDateRange(precio.fechaInicio, precio.fechaFin),
      amountLabel: getPriceLabel(precio)
    }));

    const priceFrom =
      priceRows.find((row) => row.amountLabel !== "A consultar")?.amountLabel || "A consultar";

    const fechasResumen = priceRows[0]?.dateLabel || "Consultar fechas";

    const noIncluyeItems = splitBulletLines(oferta.noIncluye);

    const summaryItems = [
      { label: "Noches", value: oferta.noches ? `${oferta.noches} noches` : "A confirmar" },
      { label: "Transporte", value: transportLabel },
      { label: "Fechas", value: fechasResumen },
      { label: "Precio desde", value: priceFrom }
    ];

    if (oferta.cupos) {
      summaryItems.push({ label: "Cupos", value: `${oferta.cupos} lugares` });
    }

    return {
      oferta,
      preciosOrdenados,
      detalleItems,
      itinerarioItems,
      incluyeItems,
      detalleFechas,
      shortDesc,
      transportLabel,
      priceRows,
      priceFrom,
      fechasResumen,
      noIncluyeItems,
      summaryItems
    };
  }, [selectedPackage]);

  const cleanedSelectedConditions = useMemo(() => {
    const sourceContent =
      selectedPackage?.condiciones ||
      selectedPackageData?.shortDesc ||
      "Consultanos para más detalles.";

    return cleanContent(sourceContent, {
      stripItinerary: Boolean(selectedPackageData?.itinerarioItems?.length)
    });
  }, [
    selectedPackage?.condiciones,
    selectedPackageData?.shortDesc,
    selectedPackageData?.itinerarioItems?.length
  ]);

  if (!item) {
    return (
      <main className="destino-detail-not-found">
        <div className="not-found-container">
          <svg className="not-found-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <h2>Experiencia no encontrada</h2>
          <p className="section-state">No encontramos esta experiencia en nuestro catálogo.</p>
          <Link className="premium-back-button" to="/modo-fanatico">
            Volver a Modo Fanático
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="destination-detail-page premium-destination-detail modo-fanatico-detail">
      {/* Hero Section */}
      <section
        className="destination-hero-premium"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="destination-hero-overlay"></div>
        <div className="destination-hero-content">
          <div className="back-button-container">
            <Link className="premium-back-button" to="/modo-fanatico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Volver</span>
            </Link>
          </div>
          <div className="destination-hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>Modo Fanático</span>
          </div>
          <h1 className="destination-hero-title">{item.nombre}</h1>
          <p className="destination-hero-subtitle">{item.descripcionCorta || "Vivilo con nosotros"}</p>
        </div>
      </section>

      {/* Description Section */}
      <section className="destination-description-premium">
        <div className="description-container">
          <div className="description-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="description-text">{item.descripcion}</p>
        </div>
      </section>

      {/* Gallery Section - MOVED UP BEFORE PACKAGES AS REQUESTED */}
      {galleryImages.length > 0 && (
        <section className="destination-gallery-premium" style={{ marginBottom: '60px' }}>
          <div className="gallery-header">
            <h2>Galería de Imágenes</h2>
          </div>
          <div className="destination-gallery-grid">
            {galleryImages.map((image, index) => (
              <div className="destination-gallery-item" key={`${image}-${index}`}>
                <div className="gallery-image-wrapper">
                  <img src={image} alt={`${item.nombre} ${index + 1}`} loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Packages Section */}
      <section className="destination-packages-premium" id="paquetes">
        <div className="packages-header">
          <div className="packages-header-content">
            <div className="packages-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div>
              <h2>Paquetes Disponibles</h2>
              <p>Elegí tu experiencia ideal en {item.nombre}</p>
            </div>
          </div>
        </div>

        {/* PACKAGE SELECTION LOGIC */}
        {!selectedPackage ? (
          /* LIST VIEW */
          loading ? (
            <p className="section-state">Cargando paquetes...</p>
          ) : ofertasRelacionadas.length > 0 ? (
            <div className="packages-grid-premium">
              {ofertasRelacionadas.map((pkg) => {
                const precio = pkg.precios && pkg.precios[0]; // Simple access for now
                const dateRange = precio
                  ? `${new Date(precio.fechaInicio).toLocaleDateString()} - ${new Date(precio.fechaFin).toLocaleDateString()}`
                  : "Consultar fechas";
                const transportType = getTransportType(pkg);
                const transportLabel = transportType === "avion" ? "Avión" : transportType === "bus" ? "Bus" : "";

                // Use generic image if pkg doesn't have specific one, but usually use heroImage as fallback
                // In this context, we can use the heroImage of the destination if pkg doesn't have one
                const pkgImage = heroImage;

                return (
                  <button
                    className="package-card-premium"
                    key={pkg.id}
                    style={{ border: 'none', textAlign: 'left', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedPackage(pkg);
                      document.getElementById('paquetes')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {/* Imagen de fondo */}
                    <div className="package-card-image">
                      <img src={pkgImage} alt={pkg.titulo} loading="lazy" />
                    </div>

                    {/* Header sobre la imagen */}
                    <div className="package-card-header">
                      <div className="package-destination-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span>{item.nombre}</span>
                      </div>
                      <h3 className="package-title">{pkg.titulo}</h3>
                    </div>

                    {/* Body con información */}
                    <div className="package-card-body">
                      <div className="package-info-preview">
                        <div className="package-info-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="6" rx="2" />
                            <path d="M7 11V8H11V11" />
                            <path d="M3 17V20M21 17V20" />
                          </svg>
                          <span><strong>{pkg.noches}</strong> noches de alojamiento</span>
                        </div>
                        {transportLabel ? (
                          <div className="package-info-item">
                            {renderTransportIcon(transportType)}
                            <span>Transporte: <strong>{transportLabel}</strong></span>
                          </div>
                        ) : null}
                        {/* Removed cupos as per previous request to match style */}
                      </div>

                      <div className="package-meta">
                        <div className="package-dates">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>{dateRange}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer con botón */}
                    <div className="package-card-footer">
                      <span className="premium-button-gradient">
                        Ver paquete completo
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="no-packages-message">
              <p>Consultanos para conocer los próximos paquetes disponibles.</p>
              <a
                href={getWhatsappLink(`Hola! Quiero consultar por ${item.nombre}.`)}
                className="docs-contact-button"
                target="_blank"
                rel="noreferrer"
              >
                Consultar por WhatsApp
              </a>
            </div>
          )
        ) : (
          /* DETAIL VIEW (Embedded - Premium Style) */
          <div className="package-embedded-detail">
            <button
              className="premium-back-button secondary"
              style={{ marginBottom: '32px', alignSelf: 'flex-start' }}
              onClick={() => setSelectedPackage(null)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Ver otros paquetes</span>
            </button>

          <div className="excursion-details-premium" style={{ padding: 0, background: 'transparent' }}>
            <div className="details-container" style={{ margin: 0, width: '100%', maxWidth: '100%' }}>
              <div className="fanatico-detail-grid">
                <div className="fanatico-detail-main">
                  {/* Header Card */}
                  <article className="detail-card-premium description-card">
                    <div className="card-header">
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <h3>{selectedPackage.titulo}</h3>
                    </div>
                    <div className="card-content fanatico-markdown">
                      <ReactMarkdown>
                        {cleanedSelectedConditions}
                      </ReactMarkdown>
                    </div>
                  </article>

                  {/* Info List Card */}
                  <article className="detail-card-premium info-card">
                    <div className="card-header">
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4M12 8h.01" />
                        </svg>
                      </div>
                      <h3>Qué incluye el paquete</h3>
                    </div>
                    <div className="card-content">
                      {selectedPackageData.incluyeItems.length ? (
                        <ul className="info-list-premium">
                          {selectedPackageData.incluyeItems.map((item) => (
                            <li className="info-item" key={item.id}>
                              <div className="info-icon">
                                {getIncluyeIcon(item.tipo)}
                              </div>
                              <div className="info-content">
                                <span className="info-label">{formatIncluyeTipo(item.tipo)}</span>
                                <span className="info-value" style={{ textTransform: 'none' }}>{item.descripcion}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="description-text">Consultanos para conocer el detalle de servicios incluidos.</p>
                      )}
                    </div>
                  </article>

                  {/* Detail Items */}
                  {selectedPackageData.detalleItems.length > 0 && (
                    <article className="detail-card-premium description-card">
                      <div className="card-header">
                        <div className="card-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M7 6v12M17 6v12M5 18h14" />
                          </svg>
                        </div>
                        <h3>Detalles del programa</h3>
                      </div>
                      <div className="card-content">
                        <ul className="detail-list detail-list--icons">
                          {selectedPackageData.detalleItems.map((item) => (
                            <li key={item.id}>
                              <span className="detail-list-text">{item.descripcion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  )}

                  {/* Itinerary Card */}
                  {selectedPackageData.itinerarioItems.length > 0 && (
                    <article className="detail-card-premium description-card">
                      <div className="card-header">
                        <div className="card-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                        <h3>Itinerario</h3>
                      </div>
                      <div className="card-content">
                        <ul className="detail-list detail-list--timeline">
                          {selectedPackageData.itinerarioItems.map((item, index) => (
                            <li key={item.id} data-step={index + 1}>
                              <span className="detail-list-text">
                                {renderItineraryText(item.descripcion)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  )}

                  {/* No Incluye */}
                  {selectedPackageData.noIncluyeItems.length > 0 && (
                    <article className="detail-card-premium description-card">
                      <div className="card-header">
                        <div className="card-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                          </svg>
                        </div>
                        <h3>No incluye</h3>
                      </div>
                      <div className="card-content">
                        <ul className="fanatico-excludes-list">
                          {selectedPackageData.noIncluyeItems.map((item, index) => (
                            <li key={`${item}-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  )}
                </div>

                <aside className="fanatico-detail-sidebar">
                  <article className="detail-card-premium summary-card">
                    <div className="card-header">
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16v16H4z" />
                          <path d="M8 8h8M8 12h8M8 16h5" />
                        </svg>
                      </div>
                      <h3>Resumen rápido</h3>
                    </div>
                    <div className="card-content">
                      <div className="fanatico-summary-grid">
                        {selectedPackageData.summaryItems.map((item, index) => (
                          <div className="fanatico-summary-item" key={`${item.label}-${index}`}>
                            <span className="fanatico-summary-label">{item.label}</span>
                            <span className="fanatico-summary-value">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>

                  <article className="detail-card-premium prices-card">
                    <div className="card-header">
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 7h18M6 7V5h12v2M6 11h12M6 15h8" />
                        </svg>
                      </div>
                      <h3>Fechas y precios</h3>
                    </div>
                    <div className="card-content">
                      {selectedPackageData.priceRows.length ? (
                        <div className="fanatico-price-list">
                          {selectedPackageData.priceRows.map((row) => (
                            <div className="fanatico-price-row" key={row.id}>
                              <div className="fanatico-price-date">{row.dateLabel}</div>
                              <div className={`fanatico-price-amount${row.amountLabel === "A consultar" ? " is-muted" : ""}`}>
                                {row.amountLabel}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="description-text">Consultanos para fechas y tarifas.</p>
                      )}
                      {selectedPackageData.detalleFechas?.descripcion && (
                        <p className="fanatico-price-note">{selectedPackageData.detalleFechas.descripcion}</p>
                      )}
                    </div>
                  </article>
                </aside>
              </div>

              {/* CTA Area */}
              <div className="fanatico-cta">
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--violet-900)', marginBottom: '8px' }}>¿Te interesa este paquete?</h3>
                  <p style={{ color: '#64748b' }}>Reservá tu lugar ahora y asegurá tu experiencia en {item.nombre}</p>
                </div>
                <a
                  className="excursion-whatsapp-button"
                  href={getWhatsappLink(`Hola! Quiero reservar el paquete ${selectedPackage.titulo} para el evento ${item.nombre}.`)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ maxWidth: '400px', margin: '0', width: '100%' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span>Reservar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      </section>

    </main>
  );
}

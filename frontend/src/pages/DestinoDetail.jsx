import { useMemo, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams, useSearchParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import { formatDate, getPrecioVigente } from "../utils/formatters.js";
import { getWhatsappLink } from "../utils/contactLinks.js";
import { getIncluyeIcon } from "../utils/incluyeIcons.jsx";

// === Constants and Helpers from OfertaDetail ===

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

const SALIDAS_GRUPALES_SLUGS = new Set([
  "mexico-a-su-tiempo-2026",
  "cartagena-san-andres-2026",
  "colombia-aromas-cafe-2026",
  "peru-aereo-grupal-2026",
  "peru-y-bolivia-2026",
  "europa-a-su-tiempo-2026",
  "costa-rica-al-maximo-2026",
  "esencias-centroeuropeas-2026",
  "europa-al-maximo-2026",
  "joyas-balcanicas-2026",
  "turquia-islas-griegas-2026",
  "turquia-dubai-2026",
  "turquia-islas-griegas-dubai-2026"
]);

const normalizeTipo = (tipo) => String(tipo || "").toLowerCase().trim();

const isDetailItem = (tipo) => normalizeTipo(tipo).startsWith(DETAIL_PREFIX);
const isItineraryItem = (tipo) => normalizeTipo(tipo).startsWith(ITINERARY_PREFIX);

const normalizeText = (value) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

const getUtcParts = (value) => {
  const date = new Date(value);
  const monthIndex = date.getUTCMonth();
  return {
    day: date.getUTCDate(),
    monthIndex,
    month: MONTH_NAMES[monthIndex],
    year: date.getUTCFullYear()
  };
};

const buildSalidaRange = (startValue, endValue) => {
  if (!startValue) {
    return { label: "", isMonthOnly: false };
  }
  const start = getUtcParts(startValue);
  const end = getUtcParts(endValue || startValue);
  const sameYear = start.year === end.year;
  const sameMonth = sameYear && start.monthIndex === end.monthIndex;

  if (sameMonth) {
    const lastDayOfMonth = new Date(
      Date.UTC(start.year, start.monthIndex + 1, 0)
    ).getUTCDate();
    if (start.day === 1 && end.day === lastDayOfMonth) {
      return { label: start.month, isMonthOnly: true };
    }
    if (start.day === end.day) {
      return { label: `${start.day} de ${start.month}`, isMonthOnly: false };
    }
    return {
      label: `${start.day} al ${end.day} de ${start.month}`,
      isMonthOnly: false
    };
  }

  if (sameYear) {
    return {
      label: `${start.day} de ${start.month} al ${end.day} de ${end.month}`,
      isMonthOnly: false
    };
  }

  return {
    label: `${start.day} de ${start.month} ${start.year} al ${end.day} de ${end.month} ${end.year}`,
    isMonthOnly: false
  };
};

const formatSalidaRange = (startValue, endValue, includePrefix = true) => {
  const { label, isMonthOnly } = buildSalidaRange(startValue, endValue);
  if (!label) return "";
  if (!includePrefix) return label;
  return isMonthOnly ? `Salidas de ${label}` : `Salidas del ${label}`;
};

const getSalidaRanges = (precios, { includePrefix = true } = {}) => {
  if (!Array.isArray(precios)) return [];
  const sorted = precios
    .filter((precio) => precio?.fechaInicio)
    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
  return sorted
    .map((precio) =>
      formatSalidaRange(precio.fechaInicio, precio.fechaFin, includePrefix)
    )
    .filter(Boolean);
};

const isSameUtcDay = (startValue, endValue) => {
  if (!startValue || !endValue) return false;
  const start = new Date(startValue);
  const end = new Date(endValue);
  return (
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCDate() === end.getUTCDate()
  );
};

const formatDayList = (days) => {
  const unique = Array.from(new Set(days)).sort((a, b) => a - b);
  if (!unique.length) return "";
  if (unique.length === 1) return `${unique[0]}`;
  if (unique.length === 2) return `${unique[0]} y ${unique[1]}`;
  return `${unique.slice(0, -1).join(", ")} y ${unique[unique.length - 1]}`;
};

const getGroupedMonthlySalidaData = (precios) => {
  if (!Array.isArray(precios) || !precios.length) return [];
  const valid = precios.filter((precio) => precio?.fechaInicio && precio?.fechaFin);
  if (!valid.length) return [];
  if (!valid.every((precio) => isSameUtcDay(precio.fechaInicio, precio.fechaFin))) {
    return [];
  }

  const groups = new Map();
  valid.forEach((precio) => {
    const parts = getUtcParts(precio.fechaInicio);
    const key = `${parts.year}-${parts.monthIndex}`;
    if (!groups.has(key)) {
      groups.set(key, {
        month: parts.month,
        monthIndex: parts.monthIndex,
        year: parts.year,
        days: []
      });
    }
    groups.get(key).days.push(parts.day);
  });

  const sortedGroups = [...groups.values()].sort(
    (a, b) => a.year - b.year || a.monthIndex - b.monthIndex
  );
  const years = new Set(sortedGroups.map((group) => group.year));
  const includeYear = years.size > 1;

  return sortedGroups
    .map((group) => {
      const dayList = formatDayList(group.days);
      if (!dayList) return null;
      const monthLabel = includeYear ? `${group.month} ${group.year}` : group.month;
      return { monthLabel, daysLabel: dayList };
    })
    .filter(Boolean);
};

const getGroupedMonthlySalidas = (precios, { includePrefix = false } = {}) => {
  const grouped = getGroupedMonthlySalidaData(precios);
  if (!grouped.length) return [];
  return grouped.map((group) => {
    if (includePrefix) {
      return `Salidas de ${group.monthLabel}: ${group.daysLabel}`;
    }
    return `${group.monthLabel}: ${group.daysLabel}`;
  });
};

const getCardSalidaRanges = (precios) => {
  if (!Array.isArray(precios)) return [];
  const sorted = precios
    .filter((precio) => precio?.fechaInicio && precio?.fechaFin)
    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  if (sorted.length < 2) return [];

  const grouped = getGroupedMonthlySalidaData(sorted);
  if (grouped.length && grouped.length <= 6) {
    return grouped;
  }

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const shortRanges = sorted.filter((precio) => {
    const start = new Date(precio.fechaInicio);
    const end = new Date(precio.fechaFin);
    const startUtc = Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate()
    );
    const endUtc = Date.UTC(
      end.getUTCFullYear(),
      end.getUTCMonth(),
      end.getUTCDate()
    );
    const days = Math.floor((endUtc - startUtc) / MS_PER_DAY) + 1;
    return days <= 45;
  });

  const candidate = shortRanges.length >= 2 ? shortRanges : sorted;
  if (candidate.length < 2 || candidate.length > 4) return [];

  return candidate
    .map((precio) => ({
      monthLabel: "",
      daysLabel: formatSalidaRange(precio.fechaInicio, precio.fechaFin, false)
    }))
    .filter((item) => item.daysLabel);
};

const cleanContent = (text) => {
  if (!text) return "";
  return text
    .split('\n')
    .filter(line => {
      const lower = line.toLowerCase();
      return !(lower.includes('tarifa') || lower.includes('usd') || lower.includes('precio') || lower.includes('impuestos') || lower.includes('imp.'));
    })
    .join('\n');
};

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

export default function DestinoDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { destinos, ofertas, actividades, loading, error } = useTravelData();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const destino = useMemo(
    () =>
      destinos.find(
        (item) => item.slug === slug || String(item.id) === slug
      ),
    [destinos, slug]
  );

  const ofertasDestino = useMemo(() => {
    if (!destino) {
      return [];
    }
    return ofertas.filter((oferta) => {
      const principal = oferta.destino?.id === destino.id;
      const secundarios = (oferta.destinos || []).some(
        (item) =>
          item.destino?.id === destino.id || item.destinoId === destino.id
      );
      return principal || secundarios;
    });
  }, [ofertas, destino]);

  useEffect(() => {
    if (!searchParams) return;
    const ofertaSlug = searchParams.get('oferta');
    if (ofertaSlug && ofertasDestino.length) {
      const found = ofertasDestino.find(o => (o.slug || o.id) === ofertaSlug);
      if (found) {
        setSelectedPackage(found);
        // Clean URL using React Router method
        // Use a timeout to avoid strict mode double-invoke issues clearing it too fast
        setTimeout(() => {
          const section = document.getElementById('paquetes');
          if (section) section.scrollIntoView({ behavior: 'smooth' });

          // Optional: Only clear param if we want to hide it
          // setParams is not available directly from useSearchParams() result [0]
          // We can use history API as a fallback if setSearchParams isn't de-structured
          // But here we rely on the fact we didn't destructure the setter above. 
          // Let's stick to safe history replacement to avoid re-renders loop
          window.history.replaceState({}, '', window.location.pathname);
        }, 100);
      }
    }
  }, [searchParams, ofertasDestino]);

  const actividadesDestino = useMemo(() => {
    if (!destino) {
      return [];
    }
    return actividades.filter(
      (actividad) => actividad.destino?.id === destino.id
    );
  }, [actividades, destino]);

  const galleryImages = useMemo(() => {
    if (!destino) {
      return [];
    }
    const images = [];
    const seen = new Set();
    const portada = destino.imagenPortada;
    const addImage = (value) => {
      if (!value || value === portada || seen.has(value)) {
        return;
      }
      seen.add(value);
      images.push(value);
    };

    if (Array.isArray(destino.galeria)) {
      destino.galeria.forEach((item) => addImage(item.imagen));
    }

    if (images.length < 2) {
      actividadesDestino.forEach((actividad) => {
        addImage(actividad.imagenPortada);
      });
    }

    if (!images.length) {
      images.push(fallbackDeal);
    }

    return images.slice(0, 6);
  }, [destino, actividadesDestino]);

  // Derived data for the selected package (same logic as in OfertaDetail)
  const selectedPackageData = useMemo(() => {
    if (!selectedPackage) return null;

    const oferta = selectedPackage;

    const preciosOrdenados = [...(oferta.precios || [])].sort(
      (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
    );

    const detalleItems = (oferta.incluyeItems || []).filter((item) => item && isDetailItem(item.tipo));

    const itinerarioItems = (oferta.incluyeItems || [])
      .filter((item) => item && isItineraryItem(item.tipo))
      .sort((a, b) => getItineraryIndex(a.tipo) - getItineraryIndex(b.tipo));

    const incluyeItems = (oferta.incluyeItems || []).filter(
      (item) => item && !isDetailItem(item.tipo) && !isItineraryItem(item.tipo)
    );

    const detalleFechas = detalleItems.find(
      (item) =>
        normalizeTipo(item.tipo) === "detalle-salidas" ||
        normalizeTipo(item.tipo) === "detalle-fechas"
    );

    return {
      oferta,
      preciosOrdenados,
      detalleItems,
      itinerarioItems,
      incluyeItems,
      detalleFechas
    };
  }, [selectedPackage]);

  const salidaDetalleLabels = useMemo(() => {
    if (!selectedPackageData) return [];
    const grouped = getGroupedMonthlySalidas(selectedPackageData.preciosOrdenados, {
      includePrefix: false
    });
    if (grouped.length) {
      return grouped;
    }
    return getSalidaRanges(selectedPackageData.preciosOrdenados, {
      includePrefix: false
    });
  }, [selectedPackageData]);

  const hasDetailDates = Boolean(
    selectedPackageData &&
      (selectedPackageData.preciosOrdenados.length ||
        selectedPackageData.detalleFechas)
  );
  const hasItinerary = Boolean(
    selectedPackageData && selectedPackageData.itinerarioItems.length > 0
  );

  if (loading) {
    return (
      <main className="destino-detail-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="section-state">Cargando destino...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="destino-detail-error">
        <div className="error-container">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="section-state error">{error}</p>
        </div>
      </main>
    );
  }

  if (!destino) {
    return (
      <main className="destino-detail-not-found">
        <div className="not-found-container">
          <svg className="not-found-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <h2>Destino no encontrado</h2>
          <p className="section-state">No encontramos este destino en nuestro catálogo.</p>
          <Link className="back-button primary" to="/destinos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver a destinos
          </Link>
        </div>
      </main>
    );
  }

  const heroImage = destino.imagenPortada || fallbackDeal;
  const backLink =
    destino.paisRegion === "Argentina" ? "/argentina" : "/destinos";

  return (
    <main className="destination-detail-page premium-destination-detail">
      {/* Hero Section */}
      <section
        className="destination-hero-premium"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="destination-hero-overlay"></div>
        <div className="destination-hero-content">
          <div className="back-button-container">
            <Link className="premium-back-button" to={backLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Volver</span>
            </Link>
          </div>
          <div className="destination-hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" strokeLinejoin="round" />
              <path d="M9 4v14M15 6v14" strokeLinejoin="round" />
            </svg>
            <span>{destino.paisRegion || "Destino"}</span>
          </div>
          <h1 className="destination-hero-title">{destino.nombre}</h1>
          <p className="destination-hero-subtitle">{destino.descripcionCorta || "Conocé sus mejores experiencias"}</p>
        </div>
      </section>

      {/* Description Section */}
      <section className="destination-description-premium">
        <div className="description-container">
          <div className="description-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <p className="description-text">{destino.descripcion}</p>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="destination-gallery-premium">
          <div className="gallery-header">
            <h2>Galería de Imágenes</h2>
            <p>Descubrí la belleza de {destino.nombre}</p>
          </div>
          <div className="destination-gallery-grid">
            {galleryImages.map((image, index) => (
              <div className="destination-gallery-item" key={`${image}-${index}`}>
                <div className="gallery-image-wrapper">
                  <img src={image} alt={`${destino.nombre} ${index + 1}`} loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Packages Section Selector Logic */}
      {ofertasDestino.length > 0 && (
        <section className="destination-packages-premium" id="paquetes">
          {!selectedPackage ? (
            <div className="packages-container">
              {(() => {
                const ofertasGrupales = ofertasDestino.filter((o) =>
                  SALIDAS_GRUPALES_SLUGS.has(o.slug)
                );
                const ofertasPaquetes = ofertasDestino.filter(o => !ofertasGrupales.includes(o));

                return (
                  <>
                    {/* SECTION: SALIDAS GRUPALES */}
                    {ofertasGrupales.length > 0 && (
                      <div className="packages-section-group">
                        <div className="packages-header">
                          <div className="packages-header-content">
                            <div className="packages-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                            </div>
                            <div>
                              <h2>Salidas Grupales</h2>
                              <p>Viajá acompañado con nuestras salidas exclusivas.</p>
                            </div>
                          </div>
                        </div>
                        <div className="packages-grid-premium">
                          {ofertasGrupales.map((oferta) => {
                            const precio = getPrecioVigente(oferta.precios);
                            const packageImage = oferta.destino?.imagenPortada || destino.imagenPortada || fallbackDeal;
                            const transportType = getTransportType(oferta);
                            const transportLabel = transportType === "avion" ? "Avión" : transportType === "bus" ? "Bus" : "";
                            const formatMonthRange = (startDate, endDate) => {
                              if (!startDate) return "Todo el año";
                              const start = new Date(startDate);
                              const end = endDate ? new Date(endDate) : start;
                              const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                              const startMonth = monthNames[start.getUTCMonth()];
                              const endMonth = monthNames[end.getUTCMonth()];
                              const startYear = start.getUTCFullYear();
                              const endYear = end.getUTCFullYear();
                              if (startYear === endYear && startMonth === "Enero" && endMonth === "Diciembre") {
                                return `Enero ${startYear} hasta Diciembre ${endYear}`;
                              }
                              if (startMonth === endMonth && startYear === endYear) return `${startMonth} ${startYear}`;
                              if (startYear === endYear) return `${startMonth} - ${endMonth} ${startYear}`;
                              return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
                            };
                            const salidaGroups = getCardSalidaRanges(oferta.precios);
                            const dateRange = salidaGroups.length
                              ? ""
                              : precio
                                ? formatMonthRange(precio.fechaInicio, precio.fechaFin)
                                : "Consultar fechas";

                            return (
                              <button
                                className="package-card-premium"
                                style={{ border: 'none', textAlign: 'left', cursor: 'pointer' }}
                                key={oferta.id}
                                onClick={() => {
                                  setSelectedPackage(oferta);
                                  document.getElementById('paquetes')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                              >
                                <div className="package-card-image">
                                  <img src={packageImage} alt={oferta.titulo} loading="lazy" />
                                </div>
                                <div className="package-card-header">
                                  <div className="package-destination-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                      <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{oferta.destino?.nombre || destino.nombre}</span>
                                  </div>
                                  <h3 className="package-title">{oferta.titulo}</h3>
                                </div>
                                <div className="package-card-body">
                                  <div className="package-info-preview">
                                    <div className="package-info-item">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="6" rx="2" />
                                        <path d="M7 11V8H11V11" />
                                        <path d="M3 17V20M21 17V20" />
                                      </svg>
                                      <span><strong>{oferta.noches}</strong> noches de alojamiento</span>
                                    </div>
                                    {transportLabel ? (
                                      <div className="package-info-item">
                                        {renderTransportIcon(transportType)}
                                        <span>Transporte: <strong>{transportLabel}</strong></span>
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="package-meta">
                                    <div className={`package-dates${salidaGroups.length ? " package-dates--dense" : ""}`}>
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                      </svg>
                                      {salidaGroups.length ? (
                                        <div className="package-dates-content">
                                          <span className="package-dates-title">Salidas</span>
                                          <div className="package-dates-list">
                                            {salidaGroups.map((group) => (
                                              <div
                                                className={`package-dates-row${group.monthLabel ? "" : " is-solo"}`}
                                                key={`${group.monthLabel}-${group.daysLabel}`}
                                              >
                                                {group.monthLabel ? (
                                                  <span className="package-dates-month">{group.monthLabel}</span>
                                                ) : null}
                                                <span className="package-dates-days">{group.daysLabel}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        <span>{dateRange}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
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
                      </div>
                    )}

                    {/* SECTION: PAQUETES (INDIVIDUALES) */}
                    {ofertasPaquetes.length > 0 && (
                      <div className="packages-section-individual" style={{ marginTop: ofertasGrupales.length > 0 ? '4rem' : '0' }}>
                        <div className="packages-header">
                          <div className="packages-header-content">
                            <div className="packages-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                              </svg>
                            </div>
                            <div>
                              <h2>Paquetes Disponibles</h2>
                              <p>Encontrá la propuesta perfecta para tu viaje a {destino.nombre}</p>
                            </div>
                          </div>
                        </div>
                        <div className="packages-grid-premium">
                          {ofertasPaquetes.map((oferta) => {
                            const precio = getPrecioVigente(oferta.precios);
                            const packageImage = oferta.destino?.imagenPortada || destino.imagenPortada || fallbackDeal;
                            const transportType = getTransportType(oferta);
                            const transportLabel = transportType === "avion" ? "Avión" : transportType === "bus" ? "Bus" : "";
                            const formatMonthRange = (startDate, endDate) => {
                              if (!startDate) return "Todo el año";
                              const start = new Date(startDate);
                              const end = endDate ? new Date(endDate) : start;
                              const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                              const startMonth = monthNames[start.getUTCMonth()];
                              const endMonth = monthNames[end.getUTCMonth()];
                              let startYear = start.getUTCFullYear();
                              let endYear = end.getUTCFullYear();

                              // Force 2026 if 2025 appears (User Request: "no existan destinos 2025 son todos 2026")
                              if (startYear === 2025) startYear = 2026;
                              if (endYear === 2025) endYear = 2026;

                              // Special case for full year 2026 packages
                              if (startYear === endYear && startMonth === "Enero" && endMonth === "Diciembre") {
                                return `Enero ${startYear} hasta Diciembre ${endYear} (Salidas diarias)`;
                              }

                              if (startMonth === endMonth && startYear === endYear) return `${startMonth} ${startYear}`;
                              if (startYear === endYear) return `${startMonth} - ${endMonth} ${startYear}`;
                              return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
                            };
                            const salidaGroups = getCardSalidaRanges(oferta.precios);
                            const dateRange = salidaGroups.length
                              ? ""
                              : precio
                                ? formatMonthRange(precio.fechaInicio, precio.fechaFin)
                                : "Consultar fechas";

                            return (
                              <button
                                className="package-card-premium"
                                style={{ border: 'none', textAlign: 'left', cursor: 'pointer' }}
                                key={oferta.id}
                                onClick={() => {
                                  setSelectedPackage(oferta);
                                  document.getElementById('paquetes')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                              >
                                <div className="package-card-image">
                                  <img src={packageImage} alt={oferta.titulo} loading="lazy" />
                                </div>
                                <div className="package-card-header">
                                  <div className="package-destination-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                      <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{oferta.destino?.nombre || destino.nombre}</span>
                                  </div>
                                  <h3 className="package-title">{oferta.titulo}</h3>
                                </div>
                                <div className="package-card-body">
                                  <div className="package-info-preview">
                                    <div className="package-info-item">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="6" rx="2" />
                                        <path d="M7 11V8H11V11" />
                                        <path d="M3 17V20M21 17V20" />
                                      </svg>
                                      <span><strong>{oferta.noches}</strong> noches de alojamiento</span>
                                    </div>
                                    {transportLabel ? (
                                      <div className="package-info-item">
                                        {renderTransportIcon(transportType)}
                                        <span>Transporte: <strong>{transportLabel}</strong></span>
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="package-meta">
                                    <div className={`package-dates${salidaGroups.length ? " package-dates--dense" : ""}`}>
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                      </svg>
                                      {salidaGroups.length ? (
                                        <div className="package-dates-content">
                                          <span className="package-dates-title">Salidas</span>
                                          <div className="package-dates-list">
                                            {salidaGroups.map((group) => (
                                              <div
                                                className={`package-dates-row${group.monthLabel ? "" : " is-solo"}`}
                                                key={`${group.monthLabel}-${group.daysLabel}`}
                                              >
                                                {group.monthLabel ? (
                                                  <span className="package-dates-month">{group.monthLabel}</span>
                                                ) : null}
                                                <span className="package-dates-days">{group.daysLabel}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        <span>{dateRange}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
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
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            /* DETAIL VIEW (Embedded) */
            <div className="package-embedded-detail">
              <button
                className="premium-back-button secondary"
                style={{ marginBottom: '24px', alignSelf: 'flex-start' }}
                onClick={() => setSelectedPackage(null)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Ver otros paquetes</span>
              </button>

              <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--violet-900)' }}>{selectedPackage.titulo}</h2>

              <div
                className={`detail-grid detail-grid--package${hasDetailDates ? "" : " detail-grid--no-dates"}${hasItinerary ? "" : " detail-grid--no-itinerary"}`}
              >
                {/* Card 1: Main Details */}
                <article className="detail-card detail-card--info">
                  <h3>{selectedPackageData.detalleItems.length ? "Detalle del paquete" : "Información"}</h3>
                  <div className="info-content">
                    {selectedPackageData.detalleItems.length > 0 ? (
                      <div className="detail-table">
                        {selectedPackageData.detalleItems.map((item) => (
                          <div className="detail-table-row" key={item.id}>
                            <span>{formatDetailLabel(item.tipo)}</span>
                            <span>{item.descripcion}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ReactMarkdown>{cleanContent(selectedPackage.condiciones) || "Consultanos para más información."}</ReactMarkdown>
                    )}
                    {selectedPackageData.detalleItems.length > 0 && selectedPackage.condiciones && (
                      <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                        <ReactMarkdown>{cleanContent(selectedPackage.condiciones)}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </article>

                {/* Card 2: Includes (Checklist) */}
                <article className="detail-card detail-card--includes">
                  <h3>Qué incluye</h3>
                  {selectedPackageData.incluyeItems.length ? (
                    <ul className="detail-list detail-list--icons detail-list--fancy">
                      {selectedPackageData.incluyeItems.map((item) => (
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

                {hasDetailDates && (
                  <article className="detail-card detail-card--dates">
                    <h3>Fechas de salida</h3>
                    {salidaDetalleLabels.length ? (
                      <div className="detail-table">
                        <div className="detail-table-row">
                          <span>Salidas</span>
                          <span style={{ whiteSpace: "pre-line", textAlign: "left" }}>
                            {salidaDetalleLabels.join("\n")}
                          </span>
                        </div>
                      </div>
                    ) : selectedPackageData.detalleFechas?.descripcion ? (
                      <p>{selectedPackageData.detalleFechas.descripcion}</p>
                    ) : (
                      <p>Fechas a confirmar. Te asesoramos por WhatsApp.</p>
                    )}
                  </article>
                )}
                {/* Itinerary if exists */}
                {hasItinerary && (
                  <article className="detail-card detail-card--itinerary">
                    <h3>Itinerario</h3>
                    <ul className="detail-list detail-list--timeline">
                      {selectedPackageData.itinerarioItems.map((item, index) => (
                        <li key={item.id} data-step={index + 1}>
                          <span className="detail-list-text">
                            {renderItineraryText(item.descripcion)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )}
              </div>

              <div className="detail-cta" style={{ marginTop: '32px', textAlign: 'center' }}>
                <a
                  className="detail-whatsapp"
                  href={getWhatsappLink(`Hola! Quiero reservar el paquete ${selectedPackage.titulo} en ${destino.nombre}.`)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Excursions Section (only for Córdoba) */}
      {destino.slug === "cordoba" && actividadesDestino.length > 0 && (
        <section className="destination-excursions-premium">
          <div className="excursions-header">
            <div className="excursions-header-content">
              <div className="excursions-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h2>Excursiones en {destino.nombre}</h2>
                <p>Sumá experiencias únicas a tu viaje</p>
              </div>
            </div>
          </div>
          <div className="excursions-grid-premium">
            {actividadesDestino.map((actividad) => {
              const actividadSlug = actividad.slug || actividad.id;
              return (
                <Link
                  className="excursion-card-premium"
                  key={actividad.id}
                  to={`/excursiones/${actividadSlug}`}
                >
                  <div
                    className="excursion-card-image"
                    style={{
                      backgroundImage: actividad.imagenPortada
                        ? `url("${actividad.imagenPortada}")`
                        : `url("${fallbackDeal}")`
                    }}
                  >
                    <div className="excursion-card-overlay"></div>
                  </div>
                  <div className="excursion-card-content">
                    <h4>{actividad.nombre}</h4>
                    <div className="excursion-card-meta">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>{actividad.tipoActividad || "Experiencia"}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

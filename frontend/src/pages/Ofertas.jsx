import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useOfertas } from "../hooks/useTravelData.js";
import { getOfferImages } from "../utils/offerImages.js";
import { resolveAssetUrl } from "../utils/assetUrl.js";

const OFFER_SECTIONS = [
  {
    id: "salidas-grupales",
    label: "Salidas grupales",
    image: "/assets/destinos/salidas-grupales.jpg"
  }
];

const OFFER_SECTION_SET = new Set(OFFER_SECTIONS.map((section) => section.id));

export default function Ofertas() {
  const { ofertas, loading, error } = useOfertas();
  const ofertasVisibles = useMemo(() => ofertas, [ofertas]);
  const [searchParams] = useSearchParams();
  const selectedSection = (() => {
    const value = (searchParams.get("seccion") || "").toLowerCase();
    return OFFER_SECTION_SET.has(value) ? value : "salidas-grupales";
  })();
  const sectionCards = useMemo(
    () =>
      OFFER_SECTIONS.map((section) => ({
        ...section,
        imageUrl: resolveAssetUrl(section.image)
      })),
    []
  );
  const activeSection = OFFER_SECTIONS.find(
    (section) => section.id === selectedSection
  );
  const initialFilters = {
    destino: "",
    pais: "",
    oferta: "",
    transporte: "",
    desde: "",
    hasta: ""
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
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);

  const normalizeText = (value) =>
    (value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const ofertasDestacadas = useMemo(() => {
    const destacadas = ofertasVisibles.filter((oferta) => oferta.destacada);
    return destacadas.length ? destacadas : ofertasVisibles;
  }, [ofertasVisibles]);

  const matchesSection = (oferta, sectionFilter) => {
    if (!sectionFilter) {
      return true;
    }
    const destinosAsociados = [
      oferta.destino,
      ...(oferta.destinos || []).map((item) => item.destino)
    ].filter(Boolean);
    const isNational = destinosAsociados.some(
      (destino) => destino.paisRegion === "Argentina"
    );
    const textBlock = normalizeText(
      `${oferta.titulo || ""} ${oferta.condiciones || ""} ${oferta.noIncluye || ""
      } ${oferta.descripcion || ""}`
    );
    if (sectionFilter === "paquetes-nacionales") {
      return isNational;
    }
    if (sectionFilter === "salidas-grupales") {
      return SALIDAS_GRUPALES_SLUGS.has(oferta.slug);
    }
    if (sectionFilter === "eventos-deportivos") {
      return (
        textBlock.includes("evento deportivo") ||
        textBlock.includes("deportivo") ||
        textBlock.includes("copa") ||
        textBlock.includes("maraton") ||
        textBlock.includes("torneo")
      );
    }
    if (sectionFilter === "eventos") {
      return (
        textBlock.includes("evento") ||
        textBlock.includes("festival") ||
        textBlock.includes("concierto")
      );
    }
    return true;
  };

  const ofertasBase = useMemo(() => {
    return ofertasDestacadas.filter((oferta) =>
      matchesSection(oferta, selectedSection)
    );
  }, [ofertasDestacadas, selectedSection]);

  const ofertasPorPais = useMemo(() => {
    const paisQuery = draftFilters.pais.toLowerCase();
    if (!paisQuery) {
      return ofertasBase;
    }
    return ofertasBase.filter((oferta) => {
      const destinosAsociados = [
        oferta.destino,
        ...(oferta.destinos || []).map((item) => item.destino)
      ].filter(Boolean);
      return destinosAsociados.some(
        (destino) => (destino.paisRegion || "").toLowerCase() === paisQuery
      );
    });
  }, [ofertasBase, draftFilters.pais]);

  const ofertasPorDestino = useMemo(() => {
    const destinoQuery = draftFilters.destino.toLowerCase();
    if (!destinoQuery) {
      return ofertasBase;
    }
    return ofertasBase.filter((oferta) => {
      const destinosAsociados = [
        oferta.destino,
        ...(oferta.destinos || []).map((item) => item.destino)
      ].filter(Boolean);
      return destinosAsociados.some(
        (destino) => destino.nombre.toLowerCase() === destinoQuery
      );
    });
  }, [ofertasBase, draftFilters.destino]);

  const destinos = useMemo(() => {
    const names = new Set();
    ofertasPorPais.forEach((oferta) => {
      if (oferta.destino?.nombre) {
        names.add(oferta.destino.nombre);
      }
      (oferta.destinos || []).forEach((item) => {
        if (item.destino?.nombre) {
          names.add(item.destino.nombre);
        }
      });
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [ofertasPorPais]);

  const paises = useMemo(() => {
    const regions = new Set();
    ofertasPorDestino.forEach((oferta) => {
      if (oferta.destino?.paisRegion) {
        regions.add(oferta.destino.paisRegion);
      }
      (oferta.destinos || []).forEach((item) => {
        if (item.destino?.paisRegion) {
          regions.add(item.destino.paisRegion);
        }
      });
    });
    return Array.from(regions).sort((a, b) => a.localeCompare(b));
  }, [ofertasPorDestino]);

  const ofertasDisponibles = useMemo(() => {
    const titles = new Set();
    const destinoQuery = draftFilters.destino.toLowerCase();
    const paisQuery = draftFilters.pais.toLowerCase();
    ofertasBase.forEach((oferta) => {
      const destinosAsociados = [
        oferta.destino,
        ...(oferta.destinos || []).map((item) => item.destino)
      ].filter(Boolean);
      const matchesDestino =
        !destinoQuery ||
        destinosAsociados.some(
          (destino) => destino.nombre.toLowerCase() === destinoQuery
        );
      const matchesPais =
        !paisQuery ||
        destinosAsociados.some(
          (destino) => (destino.paisRegion || "").toLowerCase() === paisQuery
        );
      if (matchesDestino && matchesPais && oferta.titulo) {
        titles.add(oferta.titulo);
      }
    });
    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, [ofertasBase, draftFilters.destino, draftFilters.pais]);

  const getTransportType = (oferta) => {
    const transporteItem = (oferta.incluyeItems || []).find(
      (item) => (item.tipo || "").toLowerCase() === "transporte"
    );
    const texto = normalizeText(
      `${transporteItem?.descripcion || ""} ${transporteItem?.tipo || ""} ${oferta.condiciones || ""
      } ${oferta.titulo || ""}`
    ).trim();
    if (
      texto.includes("aereo") ||
      texto.includes("avion") ||
      texto.includes("vuelo") ||
      texto.includes("flybondi")
    ) {
      return "avion";
    }
    if (
      texto.includes("bus") ||
      texto.includes("micro") ||
      texto.includes("semicama")
    ) {
      return "bus";
    }
    return "";
  };

  const ofertasFiltradas = useMemo(() => {
    const destinoQuery = filters.destino.toLowerCase();
    const paisQuery = filters.pais.toLowerCase();
    const selectedOffers = filters.oferta ? [filters.oferta] : [];
    const transporteQuery = filters.transporte;
    const desde = filters.desde ? new Date(filters.desde) : null;
    const hasta = filters.hasta ? new Date(filters.hasta) : null;
    const sectionFilter = selectedSection;

    return ofertasDestacadas.filter((oferta) => {
      const matchesOferta =
        !selectedOffers.length || selectedOffers.includes(oferta.titulo);
      const destinosAsociados = [
        oferta.destino,
        ...(oferta.destinos || []).map((item) => item.destino)
      ].filter(Boolean);
      const matchesDestino =
        !destinoQuery ||
        destinosAsociados.some(
          (destino) => destino.nombre.toLowerCase() === destinoQuery
        );
      const matchesPais =
        !paisQuery ||
        destinosAsociados.some(
          (destino) =>
            (destino.paisRegion || "").toLowerCase() === paisQuery
        );

      if (!matchesSection(oferta, sectionFilter)) {
        return false;
      }

      if (transporteQuery) {
        const transporte = getTransportType(oferta);
        if (transporte !== transporteQuery) {
          return false;
        }
      }

      if (desde || hasta) {
        const precios = oferta.precios || [];
        const matchesDate = precios.some((precio) => {
          const inicio = new Date(precio.fechaInicio);
          const fin = new Date(precio.fechaFin);
          if (desde && fin < desde) {
            return false;
          }
          if (hasta && inicio > hasta) {
            return false;
          }
          return true;
        });
        if (!matchesDate) {
          return false;
        }
      }

      return matchesOferta && matchesDestino && matchesPais;
    });
  }, [ofertasDestacadas, filters, selectedSection]);

  useEffect(() => {
    if (draftFilters.destino && !destinos.includes(draftFilters.destino)) {
      setDraftFilters((prev) => ({ ...prev, destino: "" }));
    }
  }, [draftFilters.destino, destinos]);

  useEffect(() => {
    if (draftFilters.pais && !paises.includes(draftFilters.pais)) {
      setDraftFilters((prev) => ({ ...prev, pais: "" }));
    }
  }, [draftFilters.pais, paises]);

  const handleApply = (event) => {
    event.preventDefault();
    setFilters(draftFilters);
  };

  const handleClear = () => {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
  };

  return (
    <main className="offers-page">
      {!selectedSection ? (
        <section className="section-landing">
          <div className="section-grid">
            {sectionCards.map((section) => (
              <Link
                key={section.id}
                className="section-tile"
                to={`/ofertas?seccion=${section.id}`}
                style={{ backgroundImage: `url("${section.imageUrl}")` }}
              >
                <div className="section-tile-overlay"></div>
                <div className="section-tile-content">
                  <span className="section-tile-title">{section.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="offers-hero page-hero">
            <div className="offers-hero-inner page-hero-inner">
              <span className="offers-kicker page-hero-kicker">
                Salidas grupales <span className="topotours-word">Topotours</span>
              </span>
              <h1>
                {activeSection
                  ? activeSection.label
                  : "Encontra tu proximo viaje"}
              </h1>
              <p>
                Experiencias seleccionadas, salidas grupales confirmadas y cupos limitados.
              </p>
            </div>
          </section>

          <section className="offers-section">
            <form className="offers-filters" onSubmit={handleApply}>
              <div className="offers-field">
                <label htmlFor="ofertas-destino">Destino</label>
                <select
                  id="ofertas-destino"
                  value={draftFilters.destino}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      destino: event.target.value
                    }))
                  }
                >
                  <option value="">Todos</option>
                  {destinos.map((destino) => (
                    <option key={destino} value={destino}>
                      {destino}
                    </option>
                  ))}
                </select>
              </div>

              <div className="offers-field">
                <label htmlFor="ofertas-pais">País</label>
                <select
                  id="ofertas-pais"
                  value={draftFilters.pais}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      pais: event.target.value
                    }))
                  }
                >
                  <option value="">Todos</option>
                  {paises.map((pais) => (
                    <option key={pais} value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>

              <div className="offers-field">
                <label htmlFor="ofertas-salida">Salida grupal</label>
                <select
                  id="ofertas-salida"
                  value={draftFilters.oferta}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      oferta: event.target.value
                    }))
                  }
                >
                  <option value="">Todas</option>
                  {ofertasDisponibles.map((oferta) => (
                    <option key={oferta} value={oferta}>
                      {oferta}
                    </option>
                  ))}
                </select>
              </div>

              <div className="offers-field">
                <label htmlFor="ofertas-transporte">Transporte</label>
                <select
                  id="ofertas-transporte"
                  value={draftFilters.transporte}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      transporte: event.target.value
                    }))
                  }
                >
                  <option value="">Todos</option>
                  <option value="avion">Avión</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              <div className="offers-field">
                <label htmlFor="ofertas-desde">Desde</label>
                <input
                  id="ofertas-desde"
                  type="date"
                  value={draftFilters.desde}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      desde: event.target.value
                    }))
                  }
                />
              </div>

              <div className="offers-field">
                <label htmlFor="ofertas-hasta">Hasta</label>
                <input
                  id="ofertas-hasta"
                  type="date"
                  value={draftFilters.hasta}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      hasta: event.target.value
                    }))
                  }
                />
              </div>

              <div className="offers-actions">
                <button className="primary" type="submit">
                  Buscar viajes
                </button>
                <button
                  className="secondary"
                  type="button"
                  onClick={handleClear}
                >
                  Limpiar
                </button>
              </div>
            </form>

            {loading ? (
              <p className="section-state">Cargando salidas grupales...</p>
            ) : error ? (
              <p className="section-state error">{error}</p>
            ) : ofertasFiltradas.length === 0 ? (
              <p className="section-state">No hay salidas grupales disponibles.</p>
            ) : (
              <div className="grid grid-3x3">
                {ofertasFiltradas.map((oferta) => {
                  const ofertaSlug = oferta.slug || oferta.id;
                  const offerImages = getOfferImages(oferta);
                  const offerImage = offerImages[0] || fallbackDeal;
                  const targetDestino = oferta.destino;

                  return (
                    <Link
                      className={`tile destination-card salidas-card ${selectedSection === 'salidas-grupales' ? 'premium-card' : ''}`}
                      key={oferta.id}
                      to={targetDestino ? `/destinos/${targetDestino.slug}?oferta=${ofertaSlug}` : `/ofertas/${ofertaSlug}`}
                    >
                      <div
                        className="tile-image"
                        style={{
                          backgroundImage: `url("${offerImage}")`
                        }}
                      ></div>
                      <div className="tile-content">
                        <span className="destination-meta">
                          {targetDestino?.paisRegion || targetDestino?.nombre || "Salida grupal"}
                        </span>
                        <h4>{oferta.titulo}</h4>
                        <p className="offer-card-description">
                          {oferta.descripcion || "Salida grupal confirmada. Consultanos para conocer el itinerario completo."}
                        </p>
                        <span className="card-cta">Explorar destino</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

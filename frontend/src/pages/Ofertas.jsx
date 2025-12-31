import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import {
  formatCurrency,
  formatDate,
  getPrecioVigente,
  parseAmount
} from "../utils/formatters.js";
import { getOfferImages } from "../utils/offerImages.js";
import { resolveAssetUrl } from "../utils/assetUrl.js";

const OFFER_SECTIONS = [
  {
    id: "salidas-grupales",
    label: "Salidas grupales",
    image: "/assets/destinos/salidas-grupales.jpg"
  },
  {
    id: "eventos",
    label: "Eventos",
    image: "/assets/destinos/paris2.jpg"
  },
  {
    id: "eventos-deportivos",
    label: "Eventos deportivos",
    image: "/assets/destinos/eventos%20deportivos.jpg"
  },
  {
    id: "paquetes-nacionales",
    label: "Paquetes nacionales",
    image: "/assets/destinos/bari1.png"
  }
];

const OFFER_SECTION_SET = new Set(OFFER_SECTIONS.map((section) => section.id));

export default function Ofertas() {
  const { ofertas, loading, error } = useTravelData();
  const [searchParams] = useSearchParams();
  const selectedSection = (() => {
    const value = (searchParams.get("seccion") || "").toLowerCase();
    return OFFER_SECTION_SET.has(value) ? value : "";
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
    moneda: "",
    precioMin: "",
    precioMax: "",
    desde: "",
    hasta: ""
  };
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);

  const ofertasDestacadas = useMemo(() => {
    const destacadas = ofertas.filter((oferta) => oferta.destacada);
    return destacadas.length ? destacadas : ofertas;
  }, [ofertas]);

  const destinos = useMemo(() => {
    const names = new Set();
    ofertas.forEach((oferta) => {
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
  }, [ofertas]);

  const ofertasDisponibles = useMemo(() => {
    const titles = new Set();
    ofertas.forEach((oferta) => {
      if (oferta.titulo) {
        titles.add(oferta.titulo);
      }
    });
    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, [ofertas]);

  const paises = useMemo(() => {
    const regions = new Set();
    ofertas.forEach((oferta) => {
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
  }, [ofertas]);

  const getMinPrice = (precios, currency) => {
    const currencyCode = (currency || "").toUpperCase();
    const amounts = (precios || [])
      .filter(
        (precio) =>
          !currencyCode ||
          (precio.moneda || "").toUpperCase() === currencyCode
      )
      .map((precio) => parseAmount(precio.precio))
      .filter((value) => value !== null);
    if (!amounts.length) {
      return null;
    }
    return Math.min(...amounts);
  };

  const getPrecioVigenteByCurrency = (precios, currency) => {
    const currencyCode = (currency || "").toUpperCase();
    return getPrecioVigente(
      (precios || []).filter(
        (precio) => (precio.moneda || "").toUpperCase() === currencyCode
      )
    );
  };

  const normalizeText = (value) =>
    (value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const getTransportType = (oferta) => {
    const transporteItem = (oferta.incluyeItems || []).find(
      (item) => (item.tipo || "").toLowerCase() === "transporte"
    );
    const texto = normalizeText(
      `${transporteItem?.descripcion || ""} ${transporteItem?.tipo || ""} ${
        oferta.condiciones || ""
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
      texto.includes("colectivo") ||
      texto.includes("micro") ||
      texto.includes("semicama")
    ) {
      return "colectivo";
    }
    return "";
  };

  const ofertasFiltradas = useMemo(() => {
    const destinoQuery = filters.destino.toLowerCase();
    const paisQuery = filters.pais.toLowerCase();
    const selectedOffers = filters.oferta ? [filters.oferta] : [];
    const transporteQuery = filters.transporte;
    const currencyFilter = (filters.moneda || "").toUpperCase();
    const minFilter = parseAmount(filters.precioMin);
    const maxFilter = parseAmount(filters.precioMax);
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

      if (sectionFilter) {
        const isNational = destinosAsociados.some(
          (destino) => destino.paisRegion === "Argentina"
        );
        const textBlock = normalizeText(
          `${oferta.titulo || ""} ${oferta.condiciones || ""} ${
            oferta.noIncluye || ""
          } ${oferta.descripcion || ""}`
        );
        if (sectionFilter === "paquetes-nacionales" && !isNational) {
          return false;
        }
        if (sectionFilter === "salidas-grupales") {
          if (
            !textBlock.includes("salida grupal") &&
            !textBlock.includes("salidas grupales") &&
            !textBlock.includes("grupal")
          ) {
            return false;
          }
        }
        if (sectionFilter === "eventos-deportivos") {
          if (
            !textBlock.includes("evento deportivo") &&
            !textBlock.includes("deportivo") &&
            !textBlock.includes("copa") &&
            !textBlock.includes("maraton") &&
            !textBlock.includes("torneo")
          ) {
            return false;
          }
        }
        if (sectionFilter === "eventos") {
          if (
            !textBlock.includes("evento") &&
            !textBlock.includes("festival") &&
            !textBlock.includes("concierto")
          ) {
            return false;
          }
        }
      }

      if (transporteQuery) {
        const transporte = getTransportType(oferta);
        if (transporte !== transporteQuery) {
          return false;
        }
      }

      const hasCurrencyPrice = !currencyFilter
        ? true
        : (oferta.precios || []).some(
            (precio) =>
              (precio.moneda || "").toUpperCase() === currencyFilter
          );
      if (!hasCurrencyPrice) {
        return false;
      }

      const minPrice = getMinPrice(oferta.precios, currencyFilter);
      if (minFilter !== null && (minPrice === null || minPrice < minFilter)) {
        return false;
      }
      if (maxFilter !== null && (minPrice === null || minPrice > maxFilter)) {
        return false;
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
                Ofertas <span className="topotours-word">Topotours</span>
              </span>
              <h1>
                {activeSection
                  ? activeSection.label
                  : "Encontra tu proximo viaje"}
              </h1>
              <p>
                Experiencias seleccionadas, salidas confirmadas y cupos limitados.
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
            <label htmlFor="ofertas-pais">Pais</label>
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
            <label htmlFor="ofertas-selector">Oferta</label>
            <select
              id="ofertas-selector"
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
              <option value="avion">Avion</option>
              <option value="colectivo">Colectivo</option>
            </select>
          </div>
          <div className="offers-field">
            <label htmlFor="ofertas-moneda">Moneda</label>
            <select
              id="ofertas-moneda"
              value={draftFilters.moneda}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  moneda: event.target.value
                }))
              }
            >
              <option value="">Todas</option>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>
          <div className="offers-field">
            <label htmlFor="ofertas-min">Precio min</label>
            <input
              id="ofertas-min"
              type="number"
              min="0"
              placeholder="50000"
              value={draftFilters.precioMin}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  precioMin: event.target.value
                }))
              }
            />
          </div>
          <div className="offers-field">
            <label htmlFor="ofertas-max">Precio max</label>
            <input
              id="ofertas-max"
              type="number"
              min="0"
              placeholder="300000"
              value={draftFilters.precioMax}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  precioMax: event.target.value
                }))
              }
            />
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
              Aplicar filtros
            </button>
            <button className="secondary" type="button" onClick={handleClear}>
              Limpiar
            </button>
          </div>
        </form>

          {loading ? (
            <p className="section-state">Cargando ofertas...</p>
          ) : error ? (
            <p className="section-state error">{error}</p>
          ) : ofertasFiltradas.length === 0 ? (
            <p className="section-state">No hay ofertas disponibles.</p>
          ) : (
            <div className="offer-grid grid-3x3">
              {ofertasFiltradas.map((oferta) => {
                const preciosOrdenados = [...(oferta.precios || [])].sort(
                  (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
                );
                const precio =
                  getPrecioVigente(oferta.precios) || preciosOrdenados[0];
                const precioUsd = getPrecioVigenteByCurrency(
                  oferta.precios,
                  "USD"
                );
                const precioArs = getPrecioVigenteByCurrency(
                  oferta.precios,
                  "ARS"
                );
                const ofertaSlug = oferta.slug || oferta.id;
                const offerImages = getOfferImages(oferta);
                const offerImage = offerImages[0] || fallbackDeal;
                const extraImages = offerImages.slice(1, 3);
                const fechaInicio = precio?.fechaInicio;
                const fechaFin = precio?.fechaFin;
                return (
                  <Link
                    className="offer-card offer-card-feature offer-link"
                    key={oferta.id}
                    to={`/ofertas/${ofertaSlug}`}
                  >
                    <div className="offer-image">
                      <img
                        className="offer-image-main"
                        src={offerImage}
                        alt={oferta.titulo}
                      />
                      {extraImages.length ? (
                        <div className="offer-image-stack">
                          {extraImages.map((image, imageIndex) => (
                            <img
                              key={`${oferta.id}-extra-${imageIndex}`}
                              src={image}
                              alt={`${oferta.titulo} destino ${imageIndex + 2}`}
                            />
                          ))}
                        </div>
                      ) : null}
                      <div className="offer-badge">
                        <span>Desde</span>
                        {precioUsd || precioArs ? (
                          <>
                            {precioUsd ? (
                              <strong className="offer-price-row">
                                {formatCurrency(
                                  precioUsd.precio,
                                  precioUsd.moneda
                                )}
                              </strong>
                            ) : null}
                            {precioArs ? (
                              <span className="offer-price-secondary">
                                {formatCurrency(
                                  precioArs.precio,
                                  precioArs.moneda
                                )}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <strong>A consultar</strong>
                        )}
                      </div>
                    </div>
                    <div className="offer-body">
                      <span className="offer-tag">
                        {(
                          oferta.destino?.nombre || "Destino destacado"
                        ).toUpperCase()}
                      </span>
                      <h3>{oferta.titulo}</h3>
                      <p className="offer-description">
                        {oferta.condiciones || oferta.noIncluye || "Consultanos"}
                      </p>
                      {fechaInicio && fechaFin ? (
                        <span className="offer-valid">
                          Valido del {formatDate(fechaInicio)} al{" "}
                          {formatDate(fechaFin)}
                        </span>
                      ) : null}
                      <span className="offer-cta">Ver oferta</span>
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

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import About from "../components/About.jsx";
import { useTravelData } from "../hooks/useTravelData.js";
import {
  formatCurrency,
  formatDate,
  getPrecioVigente,
  parseAmount
} from "../utils/formatters.js";
import { getOfferImages } from "../utils/offerImages.js";

export default function Home() {
  const { destinos, ofertas, actividades, loading, error } = useTravelData();
  const [searchType, setSearchType] = useState("destino");
  const [searchDestino, setSearchDestino] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchText, setSearchText] = useState("");

  const destinosDestacados = useMemo(() => {
    const destacados = destinos.filter((destino) => destino.destacado);
    return (destacados.length ? destacados : destinos).slice(0, 6);
  }, [destinos]);

  const ofertasDestacadas = useMemo(() => {
    const destacadas = ofertas.filter((oferta) => oferta.destacada);
    return (destacadas.length ? destacadas : ofertas).slice(0, 6);
  }, [ofertas]);

  const excursionesDestacadas = useMemo(() => {
    const destacadas = actividades.filter((actividad) => actividad.destacada);
    return (destacadas.length ? destacadas : actividades).slice(0, 6);
  }, [actividades]);

  const ofertaPorDestino = useMemo(() => {
    const map = new Map();
    ofertas.forEach((oferta) => {
      const precioVigente = getPrecioVigente(oferta.precios);
      const amount = parseAmount(precioVigente?.precio);
      if (!precioVigente || amount === null) {
        return;
      }

      const destinosIds = new Set();
      if (oferta.destino?.id) {
        destinosIds.add(oferta.destino.id);
      }
      (oferta.destinos || []).forEach((item) => {
        if (item.destino?.id) {
          destinosIds.add(item.destino.id);
        } else if (item.destinoId) {
          destinosIds.add(item.destinoId);
        }
      });

      destinosIds.forEach((destinoId) => {
        const current = map.get(destinoId);
        if (!current || amount < current.amount) {
          map.set(destinoId, {
            precio: precioVigente,
            amount,
            titulo: oferta.titulo
          });
        }
      });
    });
    return map;
  }, [ofertas]);

  const searchResults = useMemo(() => {
    const destinoQuery = searchDestino.trim().toLowerCase();
    const textQuery = searchText.trim().toLowerCase();
    const selectedDate = searchDate ? new Date(searchDate) : null;

    const matchesDestino = (nombre) =>
      !destinoQuery || nombre.toLowerCase().includes(destinoQuery);

    if (searchType === "destino") {
      return destinos.filter((destino) => {
        const matchesName = matchesDestino(destino.nombre);
        const matchesText =
          !textQuery ||
          destino.nombre.toLowerCase().includes(textQuery) ||
          (destino.descripcionCorta || "")
            .toLowerCase()
            .includes(textQuery) ||
          destino.descripcion.toLowerCase().includes(textQuery);
        return matchesName && matchesText;
      });
    }

    if (searchType === "oferta") {
      return ofertas.filter((oferta) => {
        const destinosAsociados = [
          oferta.destino,
          ...(oferta.destinos || []).map((item) => item.destino)
        ].filter(Boolean);
        const matchesName =
          !destinoQuery ||
          destinosAsociados.some((destino) =>
            matchesDestino(destino.nombre)
          );
        const matchesText =
          !textQuery ||
          oferta.titulo.toLowerCase().includes(textQuery) ||
          destinosAsociados.some((destino) =>
            destino.nombre.toLowerCase().includes(textQuery)
          );
        const matchesDate = selectedDate
          ? (oferta.precios || []).some((precio) => {
              const inicio = new Date(precio.fechaInicio);
              const fin = new Date(precio.fechaFin);
              return selectedDate >= inicio && selectedDate <= fin;
            })
          : true;
        return matchesName && matchesText && matchesDate;
      });
    }

    return actividades.filter((actividad) => {
      const destinoNombre = actividad.destino?.nombre || "";
      const matchesName = matchesDestino(destinoNombre);
      const matchesText =
        !textQuery ||
        actividad.nombre.toLowerCase().includes(textQuery) ||
        destinoNombre.toLowerCase().includes(textQuery);
      const matchesDate = selectedDate
        ? new Date(actividad.fecha).toDateString() ===
          selectedDate.toDateString()
        : true;
      return matchesName && matchesText && matchesDate;
    });
  }, [
    actividades,
    destinos,
    ofertas,
    searchDate,
    searchDestino,
    searchText,
    searchType
  ]);

  const loopDestinos = useMemo(() => {
    if (!destinosDestacados.length) {
      return [];
    }
    const base = [];
    while (base.length < 6) {
      base.push(...destinosDestacados);
    }
    const trimmed = base.slice(0, 6);
    return [...trimmed, ...trimmed];
  }, [destinosDestacados]);

  const loopOfertas = useMemo(() => {
    if (!ofertasDestacadas.length) {
      return [];
    }
    const base = [];
    while (base.length < 6) {
      base.push(...ofertasDestacadas);
    }
    const trimmed = base.slice(0, 6);
    return [...trimmed, ...trimmed];
  }, [ofertasDestacadas]);

  const loopExcursiones = useMemo(() => {
    if (!excursionesDestacadas.length) {
      return [];
    }
    const base = [];
    while (base.length < 6) {
      base.push(...excursionesDestacadas);
    }
    const trimmed = base.slice(0, 6);
    return [...trimmed, ...trimmed];
  }, [excursionesDestacadas]);

  const hasSearchFilters =
    searchDestino.trim() || searchDate || searchText.trim();
  const searchLabel =
    searchType === "destino"
      ? "Destinos"
      : searchType === "oferta"
      ? "Ofertas"
      : "Excursiones";
  const searchLink =
    searchType === "destino"
      ? "/destinos"
      : searchType === "oferta"
      ? "/ofertas"
      : "/excursiones";
  const searchSubtitle = searchDestino.trim()
    ? `Mostrando ${searchDestino.trim()}.`
    : "Resultados según tu búsqueda.";

  return (
    <main>
      <section className="hero hero-search" id="inicio">
        <div className="hero-content">
          <p className="eyebrow">Viajes premium, compará y disfrutá</p>
          <h1>
            Tu próxima escapada empieza en{" "}
            <span className="brand-word topotours-word">Topotours</span>.
          </h1>
          <p className="hero-subtitle">
            Buscá destinos, fechas y servicios con atención personalizada y
            ofertas pensadas para vos.
          </p>
          <form
            className="search-bar premium-filter"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="filter-group">
              <label className="filter-label">¿Qué querés buscar?</label>
              <select
                className="filter-select"
                value={searchType}
                onChange={(event) => setSearchType(event.target.value)}
              >
                <option value="destino">🌍 Destinos</option>
                <option value="oferta">🔥 Ofertas</option>
                <option value="excursion">🧭 Excursiones</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Destino</label>
              <input
                className="filter-input"
                list="destinos-list"
                placeholder="Ej: Brasil, Bariloche, Europa"
                value={searchDestino}
                onChange={(event) => setSearchDestino(event.target.value)}
              />
              <datalist id="destinos-list">
                {destinos.map((destino) => (
                  <option key={destino.id} value={destino.nombre} />
                ))}
              </datalist>
            </div>

            <div className="filter-group">
              <label className="filter-label">Fecha</label>
              <input
                className="filter-input"
                type="date"
                value={searchDate}
                onChange={(event) => setSearchDate(event.target.value)}
              />
            </div>

            <div className="filter-group grow">
              <label className="filter-label">Búsqueda libre</label>
              <input
                className="filter-input"
                placeholder="Playa, nieve, gastronomía, aventura…"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>

            <button className="filter-button" type="submit">
              Buscar viajes
            </button>
          </form>
          {hasSearchFilters ? (
            <div className="search-results">
              {loading ? (
                <p className="section-state">Cargando resultados...</p>
              ) : error ? (
                <p className="section-state error">{error}</p>
              ) : searchResults.length === 0 ? (
                <p className="section-state">No encontramos resultados.</p>
              ) : (
                <div className="search-results-panel">
                  <div className="search-results-header">
                    <div>
                      <span className="search-results-kicker">Resultados</span>
                      <h3>{searchLabel}</h3>
                      <p>{searchSubtitle}</p>
                    </div>
                    <Link className="secondary" to={searchLink}>
                      Ver todos
                    </Link>
                  </div>
                  <div className="search-results-grid search-results-grid-cards">
                    {searchResults.slice(0, 6).map((item) => {
                      if (searchType === "destino") {
                        const destinoSlug = item.slug || item.id;
                        const oferta = ofertaPorDestino.get(item.id);
                        return (
                          <Link
                            className="tile destination-card"
                            key={`${searchType}-${item.id}`}
                            to={`/destinos/${destinoSlug}`}
                          >
                            <div
                              className="tile-image"
                              style={{
                                backgroundImage: item.imagenPortada
                                  ? `url(${item.imagenPortada})`
                                  : `url(${fallbackDeal})`
                              }}
                            ></div>
                            <div className="tile-content">
                              <h4>{item.nombre}</h4>
                              <p className="destination-price">
                                {oferta
                                  ? formatCurrency(
                                      oferta.precio.precio,
                                      oferta.precio.moneda
                                    )
                                  : "Precio a consultar"}
                              </p>
                              <span className="destination-meta">
                                {oferta?.titulo ||
                                  item.paisRegion ||
                                  "Consultanos"}
                              </span>
                            </div>
                          </Link>
                        );
                      }

                      if (searchType === "oferta") {
                        const ofertaSlug = item.slug || item.id;
                        const precio = getPrecioVigente(item.precios);
                        const offerImages = getOfferImages(item);
                        const offerImage = offerImages[0] || fallbackDeal;
                        const extraImages = offerImages.slice(1, 3);
                        return (
                          <Link
                            className="offer-card offer-link search-offer-card"
                            key={`${searchType}-${item.id}`}
                            to={`/ofertas/${ofertaSlug}`}
                          >
                            <div className="offer-image">
                              <img
                                className="offer-image-main"
                                src={offerImage}
                                alt={item.titulo}
                              />
                              {extraImages.length ? (
                                <div className="offer-image-stack">
                                  {extraImages.map((image, imageIndex) => (
                                    <img
                                      key={`${item.id}-search-${imageIndex}`}
                                      src={image}
                                      alt={`${item.titulo} destino ${
                                        imageIndex + 2
                                      }`}
                                    />
                                  ))}
                                </div>
                              ) : null}
                            </div>
                            <div className="offer-body">
                              <div className="offer-header">
                                <span className="offer-tag">
                                  {item.destino?.nombre ||
                                    "Destino destacado"}
                                </span>
                                <h3>{item.titulo}</h3>
                              </div>
                              <p className="offer-description">
                                {item.condiciones ||
                                  item.noIncluye ||
                                  "Consultanos"}
                              </p>
                              <div className="offer-meta">
                                {precio ? (
                                  <span className="offer-price">
                                    {formatCurrency(
                                      precio.precio,
                                      precio.moneda
                                    )}
                                  </span>
                                ) : (
                                  <span className="offer-price">
                                    Precio a consultar
                                  </span>
                                )}
                                {precio ? (
                                  <span className="offer-dates">
                                    {formatDate(precio.fechaInicio)} -{" "}
                                    {formatDate(precio.fechaFin)}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </Link>
                        );
                      }

                      const actividadSlug = item.slug || item.id;
                      return (
                        <Link
                          className="tile excursion-card"
                          key={`${searchType}-${item.id}`}
                          to={`/excursiones/${actividadSlug}`}
                        >
                          <div
                            className="tile-image"
                            style={{
                              backgroundImage: item.imagenPortada
                                ? `url(${item.imagenPortada})`
                                : `url(${fallbackDeal})`
                            }}
                          ></div>
                          <div className="tile-content">
                            <h4>{item.nombre}</h4>
                            <p>{item.descripcion}</p>
                            <span className="tile-meta">
                              {item.destino?.nombre || "Destino"}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid-section">
        <div className="section-header section-header-row">
          <div>
            <h2>Destinos destacados</h2>
            <p>Elegí tu próxima aventura con propuestas a tu medida.</p>
          </div>
          <Link className="secondary" to="/destinos">
            Ver mas
          </Link>
        </div>
        {loading ? (
          <p className="section-state">Cargando destinos...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : destinos.length === 0 ? (
          <p className="section-state">No hay destinos disponibles.</p>
        ) : (
          <div className="destination-carousel">
            <div className="destination-track">
              {loopDestinos.map((destino, index) => {
                const oferta = ofertaPorDestino.get(destino.id);
                return (
                  <article
                    className="tile destination-card"
                    key={`${destino.id}-${index}`}
                  >
                    <div
                      className="tile-image"
                      style={{
                        backgroundImage: destino.imagenPortada
                          ? `url(${destino.imagenPortada})`
                          : `url(${fallbackDeal})`
                      }}
                    ></div>
                    <div className="tile-content">
                      <h4>{destino.nombre}</h4>
                      <p className="destination-price">
                        {oferta
                          ? formatCurrency(
                              oferta.precio.precio,
                              oferta.precio.moneda
                            )
                          : "Precio a consultar"}
                      </p>
                      <span className="destination-meta">
                        {oferta?.titulo || destino.paisRegion || "Consultanos"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="grid-section">
        <div className="section-header section-header-row">
          <div>
            <h2>Ofertas destacadas</h2>
            <p>Promos con fechas flexibles y beneficios exclusivos.</p>
          </div>
          <Link className="secondary" to="/ofertas">
            Ver mas
          </Link>
        </div>
        {loading ? (
          <p className="section-state">Cargando ofertas...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : loopOfertas.length === 0 ? (
          <p className="section-state">No hay ofertas disponibles.</p>
        ) : (
          <div className="offer-carousel">
            <div className="offer-track">
              {loopOfertas.map((oferta, index) => {
                const precio = getPrecioVigente(oferta.precios);
                const ofertaSlug = oferta.slug || oferta.id;
                const offerImages = getOfferImages(oferta);
                const offerImage = offerImages[0] || fallbackDeal;
                const extraImages = offerImages.slice(1, 3);
                return (
                  <Link
                    className="offer-card offer-card-feature offer-link"
                    key={`${oferta.id}-${index}`}
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
                              key={`${oferta.id}-home-${imageIndex}`}
                              src={image}
                              alt={`${oferta.titulo} destino ${imageIndex + 2}`}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="offer-body">
                      <div className="offer-header">
                        <span className="offer-tag">
                          {oferta.destino?.nombre || "Destino destacado"}
                        </span>
                        <h3>{oferta.titulo}</h3>
                      </div>
                      <p className="offer-description">
                        {oferta.condiciones || oferta.noIncluye || "Consultanos"}
                      </p>
                      <div className="offer-meta">
                        {precio ? (
                          <span className="offer-price">
                            {formatCurrency(precio.precio, precio.moneda)}
                          </span>
                        ) : (
                          <span className="offer-price">Precio a consultar</span>
                        )}
                        {precio ? (
                          <span className="offer-dates">
                            {formatDate(precio.fechaInicio)} -{" "}
                            {formatDate(precio.fechaFin)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="grid-section">
        <div className="section-header section-header-row">
          <div>
            <h2>Excursiones destacadas</h2>
            <p>Sumale experiencias y recorridos locales a tu viaje.</p>
          </div>
          <Link className="secondary" to="/excursiones">
            Ver mas
          </Link>
        </div>
        {loading ? (
          <p className="section-state">Cargando excursiones...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : loopExcursiones.length === 0 ? (
          <p className="section-state">No hay excursiones disponibles.</p>
        ) : (
          <div className="excursion-carousel">
            <div className="excursion-track">
              {loopExcursiones.map((actividad, index) => {
                const actividadSlug = actividad.slug || actividad.id;
                return (
                  <Link
                    className="tile excursion-card"
                    key={`${actividad.id}-${index}`}
                    to={`/excursiones/${actividadSlug}`}
                  >
                    <div
                      className="tile-image"
                      style={{
                        backgroundImage: actividad.imagenPortada
                          ? `url(${actividad.imagenPortada})`
                          : `url(${fallbackDeal})`
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
          </div>
        )}
      </section>

      <About />
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import About from "../components/About.jsx";
import { useTravelData } from "../hooks/useTravelData.js";
import {
  formatCurrency,
  formatDate,
  getPrecioVigente
} from "../utils/formatters.js";
import { getOfferImages } from "../utils/offerImages.js";

export default function Home() {
  const { destinos, ofertas, actividades, loading, error } = useTravelData();
  const [searchType, setSearchType] = useState("destino");
  const [searchDestino, setSearchDestino] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);

  const ofertasDestacadas = useMemo(() => {
    const destacadas = ofertas.filter((oferta) => oferta.destacada);
    return (destacadas.length ? destacadas : ofertas).slice(0, 6);
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

  const loopDestinos = useMemo(() => {
    if (!destinos.length) {
      return [];
    }
    return [...destinos, ...destinos];
  }, [destinos]);

  const excursionesDestacadas = useMemo(() => {
    const destacadas = actividades.filter((actividad) => actividad.destacada);
    return (destacadas.length ? destacadas : actividades).slice(0, 6);
  }, [actividades]);

  const excursionesDisponibles = useMemo(() => {
    const names = new Set();
    actividades.forEach((actividad) => {
      if (actividad.nombre) {
        names.add(actividad.nombre);
      }
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [actividades]);

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
  const searchSubtitle = "Resultados según tu búsqueda.";
  const totalResults = searchResults.length;
  const currentResult = totalResults
    ? searchResults[searchIndex % totalResults]
    : null;

  useEffect(() => {
    if (searchType === "destino") {
      setSearchText("");
      setSearchDate("");
    } else {
      setSearchDestino("");
    }
  }, [searchType]);

  useEffect(() => {
    setSearchIndex(0);
  }, [searchType, searchDestino, searchDate, searchText, totalResults]);

  const goPrevResult = () => {
    if (!totalResults) {
      return;
    }
    setSearchIndex((prev) => (prev - 1 + totalResults) % totalResults);
  };

  const goNextResult = () => {
    if (!totalResults) {
      return;
    }
    setSearchIndex((prev) => (prev + 1) % totalResults);
  };

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
            className={`search-bar premium-filter premium-filter-${searchType}`}
            onSubmit={(event) => event.preventDefault()}
          >
            {searchType === "destino" ? (
              <>
                <div className="filter-card filter-card-select">
                  <span className="filter-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  <div className="filter-card-body">
                    <label className="filter-card-label" htmlFor="search-destino">
                      Destino
                    </label>
                    <select
                      id="search-destino"
                      className="filter-card-input"
                      value={searchDestino}
                      onChange={(event) => setSearchDestino(event.target.value)}
                    >
                      <option value="">Todos</option>
                      {destinos.map((destino) => (
                        <option key={destino.id} value={destino.nombre}>
                          {destino.nombre}
                        </option>
                      ))}
                    </select>
                    <span className="filter-card-arrow" aria-hidden="true"></span>
                  </div>
                </div>
                <div className="filter-card filter-card-select">
                  <span className="filter-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle
                        cx="11"
                        cy="11"
                        r="7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="m20 20-3.5-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div className="filter-card-body">
                    <label className="filter-card-label" htmlFor="search-type">
                      Filtro de búsqueda
                    </label>
                    <select
                      id="search-type"
                      className="filter-card-input"
                      value={searchType}
                      onChange={(event) => setSearchType(event.target.value)}
                    >
                      <option value="destino">Destino (lugares)</option>
                      <option value="oferta">Oferta (promos y salidas)</option>
                      <option value="excursion">Excursión (actividades)</option>
                    </select>
                    <span className="filter-card-arrow" aria-hidden="true"></span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="filter-card filter-card-select">
                  <span className="filter-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle
                        cx="11"
                        cy="11"
                        r="7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="m20 20-3.5-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div className="filter-card-body">
                    <label className="filter-card-label" htmlFor="search-text">
                      {searchType === "oferta"
                        ? "Qué querés buscar"
                        : "Excursión"}
                    </label>
                    <select
                      id="search-text"
                      className="filter-card-input"
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                    >
                      <option value="">
                        {searchType === "oferta"
                          ? "Todas las ofertas"
                          : "Todas las excursiones"}
                      </option>
                      {(searchType === "oferta"
                        ? ofertasDisponibles
                        : excursionesDisponibles
                      ).map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <span className="filter-card-arrow" aria-hidden="true"></span>
                  </div>
                </div>
                <div className="filter-card">
                  <span className="filter-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M16 3v4M8 3v4M3 11h18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div className="filter-card-body">
                    <label className="filter-card-label" htmlFor="search-date">
                      Fecha (opcional)
                    </label>
                    <input
                      id="search-date"
                      className="filter-card-input"
                      type="date"
                      value={searchDate}
                      onChange={(event) => setSearchDate(event.target.value)}
                    />
                  </div>
                </div>
                <div className="filter-card filter-card-select">
                  <span className="filter-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle
                        cx="11"
                        cy="11"
                        r="7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="m20 20-3.5-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div className="filter-card-body">
                    <label className="filter-card-label" htmlFor="search-type">
                      Filtro de búsqueda
                    </label>
                    <select
                      id="search-type"
                      className="filter-card-input"
                      value={searchType}
                      onChange={(event) => setSearchType(event.target.value)}
                    >
                      <option value="destino">Destino (lugares)</option>
                      <option value="oferta">Oferta (promos y salidas)</option>
                      <option value="excursion">Excursión (actividades)</option>
                    </select>
                    <span className="filter-card-arrow" aria-hidden="true"></span>
                  </div>
                </div>
              </>
            )}

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
                  <div className="search-results-carousel">
                    <button
                      className={`search-results-nav${
                        totalResults > 1 ? "" : " is-hidden"
                      }`}
                      type="button"
                      onClick={goPrevResult}
                      aria-label="Resultado anterior"
                    >
                      <svg
                        className="search-results-nav-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M15 6l-6 6 6 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {currentResult ? (() => {
                      if (searchType === "destino") {
                        const destinoSlug = currentResult.slug || currentResult.id;
                        return (
                          <Link
                            className="tile destination-card search-result-card"
                            key={`${searchType}-${currentResult.id}`}
                            to={`/destinos/${destinoSlug}`}
                          >
                            <div
                              className="tile-image"
                              style={{
                                backgroundImage: currentResult.imagenPortada
                                  ? `url("${currentResult.imagenPortada}")`
                                  : `url("${fallbackDeal}")`
                              }}
                            ></div>
                            <div className="tile-content">
                              <h4>{currentResult.nombre}</h4>
                              <span className="destination-meta">
                                {currentResult.paisRegion || "Destino"}
                              </span>
                            </div>
                          </Link>
                        );
                      }

                      if (searchType === "oferta") {
                        const ofertaSlug = currentResult.slug || currentResult.id;
                        const precio = getPrecioVigente(currentResult.precios);
                        const offerImages = getOfferImages(currentResult);
                        const offerImage = offerImages[0] || fallbackDeal;
                        return (
                          <Link
                            className="tile destination-card search-result-card"
                            key={`${searchType}-${currentResult.id}`}
                            to={`/ofertas/${ofertaSlug}`}
                          >
                            <div
                              className="tile-image"
                              style={{
                                backgroundImage: offerImage
                                  ? `url("${offerImage}")`
                                  : `url("${fallbackDeal}")`
                              }}
                            ></div>
                            <div className="tile-content">
                              <h4>{currentResult.titulo}</h4>
                              <p className="destination-price">
                                {precio
                                  ? formatCurrency(
                                      precio.precio,
                                      precio.moneda
                                    )
                                  : "Precio a consultar"}
                              </p>
                              <span className="destination-meta">
                                {currentResult.destino?.nombre ||
                                  "Oferta destacada"}
                              </span>
                            </div>
                          </Link>
                        );
                      }

                      const actividadSlug = currentResult.slug || currentResult.id;
                      return (
                        <Link
                          className="tile destination-card search-result-card"
                          key={`${searchType}-${currentResult.id}`}
                          to={`/excursiones/${actividadSlug}`}
                        >
                          <div
                            className="tile-image"
                            style={{
                              backgroundImage: currentResult.imagenPortada
                                ? `url("${currentResult.imagenPortada}")`
                                : `url("${fallbackDeal}")`
                            }}
                          ></div>
                          <div className="tile-content">
                            <h4>{currentResult.nombre}</h4>
                            <span className="destination-meta">
                              {currentResult.destino?.nombre || "Excursión"}
                            </span>
                          </div>
                        </Link>
                      );
                    })() : null}
                    <button
                      className={`search-results-nav${
                        totalResults > 1 ? "" : " is-hidden"
                      }`}
                      type="button"
                      onClick={goNextResult}
                      aria-label="Siguiente resultado"
                    >
                      <svg
                        className="search-results-nav-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M9 6l6 6-6 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {totalResults > 1 ? (
                    <div className="search-results-count">
                      {searchIndex + 1} / {totalResults}
                    </div>
                  ) : null}
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
          <div className="offer-carousel">
            <div className="offer-track">
              {loopDestinos.map((destino, index) => {
                const destinoSlug = destino.slug || destino.id;
                const descripcion =
                  destino.descripcionCorta || "Descubrí este destino.";
                const galeriaImages = Array.isArray(destino.galeria)
                  ? destino.galeria
                      .map((item) =>
                        typeof item === "string" ? item : item?.imagen
                      )
                      .filter(Boolean)
                      .slice(0, 2)
                  : [];
                return (
                  <Link
                    className="offer-card offer-card-feature offer-link"
                    key={`${destino.id}-${index}`}
                    to={`/destinos/${destinoSlug}`}
                    aria-label={`Ver destino ${destino.nombre}`}
                  >
                    <div className="offer-image">
                      <img
                        className="offer-image-main"
                        src={destino.imagenPortada || fallbackDeal}
                        alt={destino.nombre}
                      />
                      {galeriaImages.length ? (
                        <div className="offer-image-stack">
                          {galeriaImages.map((image, imageIndex) => (
                            <img
                              key={`${destino.id}-home-${imageIndex}`}
                              src={image}
                              alt={`${destino.nombre} ${imageIndex + 2}`}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="offer-body">
                      <div className="offer-header">
                        <span className="offer-tag">
                          {destino.paisRegion || "Destino"}
                        </span>
                        <h3>{destino.nombre}</h3>
                      </div>
                      <p className="offer-description">{descripcion}</p>
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
          </div>
        )}
      </section>

      <About />
    </main>
  );
}

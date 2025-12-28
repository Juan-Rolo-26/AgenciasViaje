import { useMemo, useState } from "react";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import {
  formatCurrency,
  getPrecioVigente,
  parseAmount
} from "../utils/formatters.js";

export default function Home() {
  const { destinos, ofertas, actividades, aboutSections, loading, error } =
    useTravelData();
  const [searchType, setSearchType] = useState("destino");
  const [searchDestino, setSearchDestino] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchText, setSearchText] = useState("");

  const destinosDestacados = useMemo(() => {
    const destacados = destinos.filter((destino) => destino.destacado);
    return (destacados.length ? destacados : destinos).slice(0, 3);
  }, [destinos]);

  const ofertaPorDestino = useMemo(() => {
    const map = new Map();
    ofertas.forEach((oferta) => {
      const destinoId = oferta.destino?.id;
      if (!destinoId) {
        return;
      }
      const precioVigente = getPrecioVigente(oferta.precios);
      const amount = parseAmount(precioVigente?.precio);
      if (!precioVigente || amount === null) {
        return;
      }
      const current = map.get(destinoId);
      if (!current || amount < current.amount) {
        map.set(destinoId, {
          precio: precioVigente,
          amount,
          titulo: oferta.titulo
        });
      }
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
        const destinoNombre = oferta.destino?.nombre || "";
        const matchesName = matchesDestino(destinoNombre);
        const matchesText =
          !textQuery ||
          oferta.titulo.toLowerCase().includes(textQuery) ||
          destinoNombre.toLowerCase().includes(textQuery);
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

  return (
    <main>
      <section className="hero hero-search" id="inicio">
        <div className="hero-content">
          <p className="eyebrow">Viajes premium, compará y disfrutá</p>
          <h1>
            Tu próxima escapada empieza en{" "}
            <span className="brand-word">Topotours</span>.
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
          <div className="search-results">
            {loading ? (
              <p className="section-state">Cargando resultados...</p>
            ) : error ? (
              <p className="section-state error">{error}</p>
            ) : searchResults.length === 0 ? (
              <p className="section-state">No encontramos resultados.</p>
            ) : (
              <div className="search-results-grid">
                {searchResults.slice(0, 6).map((item) => (
                  <article
                    className="search-result"
                    key={`${searchType}-${item.id}`}
                  >
                    <h4>
                      {searchType === "destino"
                        ? item.nombre
                        : searchType === "oferta"
                        ? item.titulo
                        : item.nombre}
                    </h4>
                    <p>
                      {searchType === "oferta"
                        ? item.destino?.nombre
                        : searchType === "excursion"
                        ? item.destino?.nombre
                        : item.paisRegion}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="hero-deals">
          {loading ? (
            <p className="section-state">Cargando destinos destacados...</p>
          ) : error ? (
            <p className="section-state error">{error}</p>
          ) : destinosDestacados.length === 0 ? (
            <p className="section-state">No hay destinos para mostrar.</p>
          ) : (
            destinosDestacados.map((destino) => {
              const oferta = ofertaPorDestino.get(destino.id);
              return (
                <article className="deal-card" key={destino.id}>
                  <img
                    className="deal-img"
                    src={destino.imagenPortada || fallbackDeal}
                    alt={destino.nombre}
                  />
                  <div className="deal-info">
                    <span className="deal-tag">
                      {destino.destacado ? "Destino destacado" : "Destino"}
                    </span>
                    <h3>{destino.nombre}</h3>
                    <p className="deal-price">
                      {oferta
                        ? formatCurrency(
                            oferta.precio.precio,
                            oferta.precio.moneda
                          )
                        : "Precio a consultar"}
                    </p>
                    <p className="deal-meta">
                      {oferta?.titulo || destino.paisRegion || "Consultanos"}
                    </p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section id="nosotros" className="about-section">
        <div className="section-header">
          <h2>Sobre nosotros</h2>
          <p>
            Somos una agencia especializada en experiencias memorables, con
            atención personalizada y propuestas diseñadas a medida.
          </p>
        </div>
        {loading ? (
          <p className="section-state">Cargando sección...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : aboutSections.length === 0 ? (
          <div className="about-grid">
            <div className="about-text">
              <h3>Topotours, viajes con propósito</h3>
              <p>
                Acompañamos cada etapa del viaje: inspiración, planificación y
                experiencia en destino. Nuestro equipo selecciona servicios
                premium y soporte continuo para que solo disfrutes.
              </p>
            </div>
            <div
              className="about-image"
              style={{ backgroundImage: `url(${fallbackDeal})` }}
            ></div>
          </div>
        ) : (
          aboutSections.map((section) => (
            <div className="about-grid" key={section.id}>
              <div className="about-text">
                <h3>{section.titulo}</h3>
                <p>{section.contenido}</p>
                {section.valores?.length ? (
                  <div className="about-values">
                    {section.valores.map((valor) => (
                      <div className="about-value" key={valor.id}>
                        <span className="about-icon">
                          {valor.icono || "★"}
                        </span>
                        <div>
                          <h4>{valor.titulo}</h4>
                          <p>{valor.descripcion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div
                className="about-image"
                style={{
                  backgroundImage: section.imagen
                    ? `url(${section.imagen})`
                    : `url(${fallbackDeal})`
                }}
              ></div>
            </div>
          ))
        )}
      </section>

      <section className="grid-section">
        <div className="section-header">
          <h2>Destinos destacados</h2>
          <p>Elegí tu próxima aventura con propuestas a tu medida.</p>
        </div>
        {loading ? (
          <p className="section-state">Cargando destinos...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : destinos.length === 0 ? (
          <p className="section-state">No hay destinos disponibles.</p>
        ) : (
          <div className="grid destination-grid">
            {destinos.slice(0, 8).map((destino, index) => {
              const oferta = ofertaPorDestino.get(destino.id);
              return (
                <article
                  className="tile destination-card"
                  key={destino.id}
                  style={{ "--delay": `${index * 70}ms` }}
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
        )}
      </section>
    </main>
  );
}

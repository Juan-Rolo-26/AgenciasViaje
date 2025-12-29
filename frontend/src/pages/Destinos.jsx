import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import worldMap from "../assets/world-map.svg";
import { useTravelData } from "../hooks/useTravelData.js";
import {
  formatCurrency,
  getPrecioVigente,
  parseAmount
} from "../utils/formatters.js";

export default function Destinos() {
  const { destinos, ofertas, loading, error } = useTravelData();
  const initialFilters = {
    pais: "",
    query: "",
    destacados: "todos"
  };
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);

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

  const paises = useMemo(() => {
    return Array.from(
      new Set(destinos.map((destino) => destino.paisRegion).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [destinos]);

  const destinosFiltrados = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return destinos.filter((destino) => {
      const matchesPais =
        !filters.pais || destino.paisRegion === filters.pais;
      const matchesDestacado =
        filters.destacados !== "destacados" || destino.destacado;
      const matchesQuery =
        !query ||
        destino.nombre.toLowerCase().includes(query) ||
        (destino.paisRegion || "").toLowerCase().includes(query) ||
        (destino.descripcionCorta || "")
          .toLowerCase()
          .includes(query) ||
        destino.descripcion.toLowerCase().includes(query);
      return matchesPais && matchesDestacado && matchesQuery;
    });
  }, [destinos, filters]);

  const mapPins = useMemo(() => {
    const config = [
      { slug: "rio-de-janeiro", left: "24%", top: "60%" },
      { slug: "lima", left: "25%", top: "48%" },
      { slug: "ushuaia", left: "30%", top: "78%" },
      { slug: "camboya", left: "76%", top: "48%" }
    ];

    return config
      .map((item) => {
        const destino = destinos.find((entry) => entry.slug === item.slug);
        if (!destino) {
          return null;
        }
        const oferta = ofertaPorDestino.get(destino.id);
        return {
          ...item,
          nombre: destino.nombre,
          precio: oferta
            ? formatCurrency(oferta.precio.precio, oferta.precio.moneda)
            : "Precio a consultar"
        };
      })
      .filter(Boolean);
  }, [destinos, ofertaPorDestino]);

  const handleApply = (event) => {
    event.preventDefault();
    setFilters(draftFilters);
  };

  const handleClear = () => {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
  };

  return (
    <main>
      <section className="destinations-hero">
        <div className="destinations-hero-inner">
          <span className="destinations-kicker">Destinos</span>
          <h1>Inspirate con nuestros destinos</h1>
          <p>
            Explora playas, montanas y ciudades vibrantes con propuestas a tu
            medida.
          </p>
        </div>
      </section>

      <section className="destinations-map">
        <div className="destinations-map-card">
          <span className="destinations-map-kicker">
            Inspirate con destinos
          </span>
          <h2>Un mundo de destinos para vos</h2>
          <p>
            Compará valores y encontrá oportunidades únicas para tu próxima
            aventura.
          </p>
          <Link className="primary" to="#destinos">
            Explorar destinos
          </Link>
        </div>
        <div
          className="destinations-map-visual"
          style={{ backgroundImage: `url(${worldMap})` }}
        >
          {mapPins.map((pin) => (
            <div
              className="destinations-map-pin"
              key={pin.slug}
              style={{ left: pin.left, top: pin.top }}
            >
              <span className="destinations-map-pin-icon">✈️</span>
              <div className="destinations-map-pin-label">
                <strong>{pin.nombre}</strong>
                <span>{pin.precio}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="destinations-section" id="destinos">
        <form className="destinations-filters" onSubmit={handleApply}>
          <div className="destinations-field">
            <label htmlFor="destinos-pais">Pais</label>
            <select
              id="destinos-pais"
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

          <div className="destinations-field grow">
            <label htmlFor="destinos-buscar">Buscar</label>
            <input
              id="destinos-buscar"
              placeholder="Patagonia, Caribe, Europa..."
              value={draftFilters.query}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  query: event.target.value
                }))
              }
            />
          </div>

          <div className="destinations-field">
            <label htmlFor="destinos-destacados">Destacados</label>
            <select
              id="destinos-destacados"
              value={draftFilters.destacados}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  destacados: event.target.value
                }))
              }
            >
              <option value="todos">Todos</option>
              <option value="destacados">Destacados</option>
            </select>
          </div>

          <div className="destinations-actions">
            <button className="primary" type="submit">
              Aplicar
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

        <div className="section-header">
          <h2>Destinos inolvidables</h2>
          <p>Inspiracion para tu proxima aventura con guias y tips locales.</p>
        </div>
        {loading ? (
          <p className="section-state">Cargando destinos...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : destinosFiltrados.length === 0 ? (
          <p className="section-state">No hay destinos disponibles.</p>
        ) : (
          <div className="grid destination-grid grid-3x3">
            {destinosFiltrados.map((destino, index) => {
              const oferta = ofertaPorDestino.get(destino.id);
              const destinoSlug = destino.slug || destino.id;
              return (
                <Link
                  className="tile destination-card"
                  key={destino.id}
                  style={{ "--delay": `${index * 70}ms` }}
                  to={`/destinos/${destinoSlug}`}
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
                      {oferta?.titulo ||
                        destino.paisRegion ||
                        "Consultanos"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

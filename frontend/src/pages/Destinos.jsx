import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";

export default function Destinos() {
  const { destinos, loading, error } = useTravelData();
  const initialFilters = {
    pais: "",
    query: "",
    destacados: "todos"
  };
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);

  const paises = useMemo(() => {
    return Array.from(
      new Set(destinos.map((destino) => destino.paisRegion).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [destinos]);

  const destinosDisponibles = useMemo(() => {
    return Array.from(
      new Set(destinos.map((destino) => destino.nombre).filter(Boolean))
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
            <label htmlFor="destinos-buscar">Destino</label>
            <select
              id="destinos-buscar"
              value={draftFilters.query}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  query: event.target.value
                }))
              }
            >
              <option value="">Todos</option>
              {destinosDisponibles.map((destino) => (
                <option key={destino} value={destino}>
                  {destino}
                </option>
              ))}
            </select>
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

        <div className="section-header section-header-centered">
          <h2>Destinos inolvidables</h2>
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
                        ? `url("${destino.imagenPortada}")`
                        : `url("${fallbackDeal}")`
                    }}
                  ></div>
                  <div className="tile-content">
                    <h4>{destino.nombre}</h4>
                    <span className="destination-meta">
                      {destino.paisRegion || "Destino"}
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

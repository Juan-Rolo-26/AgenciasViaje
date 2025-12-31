import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import { resolveAssetUrl } from "../utils/assetUrl.js";

const CONTINENTS = [
  {
    id: "america",
    label: "America",
    image: "/assets/destinos/estados1.jpg"
  },
  {
    id: "europa",
    label: "Europa",
    image: "/assets/destinos/europa1.jpg"
  },
  {
    id: "asia",
    label: "Asia",
    image: "/assets/destinos/tai1.webp"
  },
  {
    id: "africa",
    label: "Africa",
    image: "/assets/destinos/africa1.jpg"
  }
];

const CONTINENT_BY_COUNTRY = {
  Argentina: "america",
  Brasil: "america",
  Perú: "america",
  "Estados Unidos": "america",
  "Emiratos Árabes": "asia",
  Japón: "asia",
  Indonesia: "asia",
  China: "asia",
  Vietnam: "asia",
  Maldivas: "asia",
  India: "asia",
  "Sudáfrica": "africa",
  Kenia: "africa",
  Egipto: "africa",
  Marruecos: "africa",
  Tanzania: "africa",
  Francia: "europa",
  Inglaterra: "europa",
  Italia: "europa",
  Portugal: "europa",
  Grecia: "europa",
  Alemania: "europa",
  "Países Bajos": "europa",
  "República Checa": "europa",
  España: "europa"
};

const CONTINENT_SET = new Set(CONTINENTS.map((item) => item.id));

export default function Destinos() {
  const { destinos, loading, error } = useTravelData();
  const continentCards = useMemo(
    () =>
      CONTINENTS.map((item) => ({
        ...item,
        imageUrl: resolveAssetUrl(item.image)
      })),
    []
  );
  const [searchParams] = useSearchParams();
  const selectedContinent = (() => {
    const value = (searchParams.get("continente") || "").toLowerCase();
    return CONTINENT_SET.has(value) ? value : "";
  })();
  const activeContinent = CONTINENTS.find(
    (item) => item.id === selectedContinent
  );
  const baseFilters = {
    pais: "",
    query: "",
    destacados: "todos",
    continente: ""
  };
  const initialFilters = {
    ...baseFilters,
    continente: selectedContinent
  };
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const nextFilters = {
      pais: "",
      query: "",
      destacados: "todos",
      continente: selectedContinent
    };
    setDraftFilters(nextFilters);
    setFilters(nextFilters);
  }, [selectedContinent]);

  const destinosPorContinente = useMemo(() => {
    if (!selectedContinent) {
      return destinos;
    }
    return destinos.filter(
      (destino) =>
        (CONTINENT_BY_COUNTRY[destino.paisRegion] || "") === selectedContinent
    );
  }, [destinos, selectedContinent]);

  const paises = useMemo(() => {
    return Array.from(
      new Set(
        destinosPorContinente.map((destino) => destino.paisRegion).filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [destinosPorContinente]);

  const destinosDisponibles = useMemo(() => {
    return Array.from(
      new Set(
        destinosPorContinente.map((destino) => destino.nombre).filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [destinosPorContinente]);

  const destinosFiltrados = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return destinos.filter((destino) => {
      const matchesPais =
        !filters.pais || destino.paisRegion === filters.pais;
      const continent = CONTINENT_BY_COUNTRY[destino.paisRegion] || "";
      const matchesContinent =
        !filters.continente || continent === filters.continente;
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
      return (
        matchesPais &&
        matchesContinent &&
        matchesDestacado &&
        matchesQuery
      );
    });
  }, [destinos, filters]);

  const handleApply = (event) => {
    event.preventDefault();
    setFilters(draftFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      ...baseFilters,
      continente: selectedContinent
    };
    setDraftFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  return (
    <main>
      {!selectedContinent ? (
        <section className="continent-landing">
          <div className="continent-grid">
            {continentCards.map((continent) => (
              <Link
                key={continent.id}
                className="continent-tile"
                to={`/destinos?continente=${continent.id}`}
                style={{ backgroundImage: `url("${continent.imageUrl}")` }}
              >
                <div className="continent-tile-overlay"></div>
                <div className="continent-tile-content">
                  <span className="continent-tile-title">
                    {continent.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="page-hero destinations-hero">
            <div className="page-hero-inner">
              <span className="page-hero-kicker">
                Destinos <span className="topotours-word">Topotours</span>
              </span>
              <h2>
                {activeContinent
                  ? `Destinos en ${activeContinent.label}`
                  : "Destinos inolvidables"}
              </h2>
              <p>Elegí tu próxima aventura con propuestas a tu medida.</p>
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
        </>
      )}
    </main>
  );
}

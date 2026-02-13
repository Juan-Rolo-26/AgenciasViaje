import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useDestinos } from "../hooks/useTravelData.js";
import { resolveAssetUrl } from "../utils/assetUrl.js";

const CONTINENTS = [
  {
    id: "america",
    label: "America",
    image: "/assets/destinos/bayahibe.jpg"
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
  Chile: "america",
  Colombia: "america",
  "Costa Rica": "america",
  Cuba: "america",
  México: "america",
  "República Dominicana": "america",
  Uruguay: "america",
  Perú: "america",
  "Estados Unidos": "america",
  "Emiratos Árabes": "asia",
  Japón: "asia",
  Indonesia: "asia",
  China: "asia",
  Vietnam: "asia",
  Maldivas: "asia",
  India: "asia",
  Singapur: "asia",
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
  España: "europa",
  Bolivia: "america",
  Aruba: "america",
  Curazao: "america",
  Panamá: "america",
  Australia: "asia"
};

const CONTINENT_SET = new Set(CONTINENTS.map((item) => item.id));

export default function Destinos({ lockedPais = "", heroOverrides = {} } = {}) {
  const { destinos, loading, error } = useDestinos();
  const lockedPaisValue = (lockedPais || "").trim();
  const destinosBase = useMemo(() => {
    if (lockedPaisValue) {
      return destinos;
    }
    return destinos.filter((destino) => destino.paisRegion !== "Argentina");
  }, [destinos, lockedPaisValue]);
  const continentCards = useMemo(
    () =>
      CONTINENTS.map((item) => ({
        ...item,
        imageUrl: resolveAssetUrl(item.image)
      })),
    []
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedContinent = (() => {
    const value = (searchParams.get("continente") || "").toLowerCase();
    return CONTINENT_SET.has(value) ? value : "";
  })();
  const selectedPais =
    lockedPaisValue || (searchParams.get("pais") || "").trim();
  useEffect(() => {
    if (!lockedPaisValue && selectedPais.toLowerCase() === "argentina") {
      navigate("/argentina", { replace: true });
    }
  }, [lockedPaisValue, navigate, selectedPais]);
  const activeContinent = CONTINENTS.find(
    (item) => item.id === selectedContinent
  );
  const heroKicker =
    heroOverrides.kicker ?? (
      <>
        Destinos <span className="topotours-word">Topotours</span>
      </>
    );
  const heroTitle =
    heroOverrides.title ||
    (activeContinent
      ? `Destinos en ${activeContinent.label}`
      : selectedPais
        ? `Destinos en ${selectedPais}`
        : "Destinos inolvidables");
  const heroSubtitle =
    heroOverrides.subtitle ||
    "Elegí tu próxima aventura con propuestas a tu medida.";
  const baseFilters = {
    pais: lockedPaisValue,
    query: "",
    continente: ""
  };
  const initialFilters = {
    ...baseFilters,
    continente: selectedContinent,
    pais: selectedPais
  };
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const nextFilters = {
      pais: selectedPais,
      query: "",
      continente: selectedContinent
    };
    setDraftFilters(nextFilters);
    setFilters(nextFilters);
  }, [selectedContinent, selectedPais]);

  const destinosParaOpciones = useMemo(() => {
    return destinosBase.filter((destino) => {
      const continent = CONTINENT_BY_COUNTRY[destino.paisRegion] || "";
      if (draftFilters.continente && continent !== draftFilters.continente) {
        return false;
      }
      if (draftFilters.pais && destino.paisRegion !== draftFilters.pais) {
        return false;
      }
      return true;
    });
  }, [destinosBase, draftFilters.continente, draftFilters.pais]);

  const paises = useMemo(() => {
    return Array.from(
      new Set(destinosParaOpciones.map((destino) => destino.paisRegion).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [destinosParaOpciones]);

  const destinosDisponibles = useMemo(() => {
    return Array.from(
      new Set(destinosParaOpciones.map((destino) => destino.nombre).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [destinosParaOpciones]);

  useEffect(() => {
    if (
      draftFilters.pais &&
      !paises.includes(draftFilters.pais) &&
      !lockedPaisValue
    ) {
      setDraftFilters((prev) => ({ ...prev, pais: "" }));
    }
  }, [draftFilters.pais, lockedPaisValue, paises]);

  const destinosFiltrados = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return destinosBase.filter((destino) => {
      const matchesPais =
        !filters.pais || destino.paisRegion === filters.pais;
      const continent = CONTINENT_BY_COUNTRY[destino.paisRegion] || "";
      const matchesContinent =
        !filters.continente || continent === filters.continente;
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
        matchesQuery
      );
    });
  }, [destinosBase, filters]);

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
      {!selectedContinent && !selectedPais ? (
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
              <span className="page-hero-kicker">{heroKicker}</span>
              <h2>{heroTitle}</h2>
              <p>{heroSubtitle}</p>
            </div>
          </section>
          <section className="destinations-section" id="destinos">
            <form className="destinations-filters" onSubmit={handleApply}>
              <div className="destinations-field">
                <label htmlFor="destinos-pais">Pais</label>
                <select
                  id="destinos-pais"
                  value={draftFilters.pais}
                  disabled={Boolean(lockedPaisValue)}
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

              <div className="destinations-actions">
                <button className="primary" type="submit">
                  Buscar destinos
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

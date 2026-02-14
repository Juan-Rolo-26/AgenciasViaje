import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTravelData } from "../hooks/useTravelData.js";
import { getOfferImages } from "../utils/offerImages.js";
import fallbackDeal from "../assets/inicio.jpg";
import "../assets/search-results-new.css";

const CONTINENTS = [
    { id: "america", label: "América" },
    { id: "europa", label: "Europa" },
    { id: "asia", label: "Asia" },
    { id: "africa", label: "África" }
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

export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    const initialType = searchParams.get("type") || "destino";
    const initialDestino = searchParams.get("destino") || "";
    const initialRegion = searchParams.get("region") || "";
    const initialPais = searchParams.get("pais") || "";
    const initialText = searchParams.get("text") || "";
    const initialDate = searchParams.get("date") || "";
    const initialTransporte = searchParams.get("transporte") || "";

    const [searchType, setSearchType] = useState(initialType);
    const [searchDestino, setSearchDestino] = useState(initialDestino);
    const [searchRegion, setSearchRegion] = useState(initialRegion);
    const [searchPais, setSearchPais] = useState(initialPais);
    const [searchText, setSearchText] = useState(initialText);
    const [searchDate, setSearchDate] = useState(initialDate);
    const [searchTransporte, setSearchTransporte] = useState(initialTransporte);

    const { destinos, ofertas, actividades, loading, error } = useTravelData();

    const destinosNoArgentina = useMemo(
        () => destinos.filter((destino) => destino.paisRegion !== "Argentina"),
        [destinos]
    );

    const normalizeText = (value) =>
        (value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const salidasDisponibles = useMemo(() => {
        return ofertas.filter((oferta) => oferta.tipo === "grupal");
    }, [ofertas]);

    const paquetesDisponibles = useMemo(() => {
        return ofertas;
    }, [ofertas]);

    const excursionesDestacadas = useMemo(() => {
        return actividades.filter((act) => {
            const destinoNombre = act.destino?.nombre || "";
            const destinoNorm = normalizeText(destinoNombre);
            const actividadNorm = normalizeText(act.nombre);
            return (
                destinoNorm.includes("cordoba") || actividadNorm.includes("cordoba")
            );
        });
    }, [actividades]);

    // Filtros disponibles
    const regionesDisponibles = useMemo(() => CONTINENTS, []);

    const paisesDisponibles = useMemo(() => {
        if (!searchRegion) {
            return Object.keys(CONTINENT_BY_COUNTRY).sort();
        }
        return Object.keys(CONTINENT_BY_COUNTRY)
            .filter((pais) => CONTINENT_BY_COUNTRY[pais] === searchRegion)
            .sort();
    }, [searchRegion]);

    const destinosDisponibles = useMemo(() => {
        let filtered = destinosNoArgentina;
        if (searchRegion) {
            filtered = filtered.filter(
                (destino) =>
                    CONTINENT_BY_COUNTRY[destino.paisRegion] === searchRegion
            );
        }
        if (searchPais) {
            filtered = filtered.filter(
                (destino) =>
                    destino.paisRegion.toLowerCase() === searchPais.toLowerCase()
            );
        }
        return filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [destinosNoArgentina, searchRegion, searchPais]);

    const ofertasDisponibles = useMemo(() => {
        return salidasDisponibles
            .map((oferta) => oferta.titulo)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort();
    }, [salidasDisponibles]);

    const paquetesDisponiblesTitles = useMemo(() => {
        return paquetesDisponibles
            .map((oferta) => oferta.titulo)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort();
    }, [paquetesDisponibles]);

    const excursionesDisponibles = useMemo(() => {
        return excursionesDestacadas
            .map((excursion) => excursion.nombre)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort();
    }, [excursionesDestacadas]);

    const getTransportType = (oferta) => {
        const texto = `${oferta.titulo} ${oferta.descripcion || ""}`.toLowerCase();

        // Check text content first
        if (
            texto.includes("aéreo") ||
            texto.includes("aereo") ||
            texto.includes("avión") ||
            texto.includes("avion") ||
            texto.includes("vuelo")
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

        // Check incluyeItems if available
        if (oferta.incluyeItems && Array.isArray(oferta.incluyeItems)) {
            for (const item of oferta.incluyeItems) {
                const tipo = (item.tipo || "").toLowerCase();
                const desc = (item.descripcion || "").toLowerCase();

                if (tipo.includes("transporte") || tipo.includes("aéreo") || tipo.includes("aereo")) {
                    if (desc.includes("aéreo") || desc.includes("aereo") || desc.includes("vuelo") || desc.includes("avión")) {
                        return "avion";
                    }
                    if (desc.includes("bus") || desc.includes("micro") || desc.includes("cama") || desc.includes("semi")) {
                        return "bus";
                    }
                }
            }
        }

        return "";
    };

    // Resultados filtrados
    const searchResults = useMemo(() => {
        const destinoQuery = searchDestino.trim().toLowerCase();
        const regionQuery = searchRegion.trim().toLowerCase();
        const paisQuery = searchPais.trim().toLowerCase();
        const textQuery = searchText.trim().toLowerCase();
        const selectedDate = searchDate ? new Date(searchDate) : null;
        const transporteQuery = searchTransporte;

        const matchesDestino = (nombre) =>
            !destinoQuery || nombre.toLowerCase().includes(destinoQuery);
        const matchesRegion = (region) =>
            !regionQuery || CONTINENT_BY_COUNTRY[region] === regionQuery;
        const matchesPais = (region) =>
            !paisQuery || (region || "").toLowerCase() === paisQuery;

        if (searchType === "destino") {
            return destinosNoArgentina.filter((destino) => {
                const matchesName = matchesDestino(destino.nombre);
                const matchesRegionValue = matchesRegion(destino.paisRegion);
                const matchesPaisValue = matchesPais(destino.paisRegion);
                const matchesText =
                    !textQuery ||
                    destino.nombre.toLowerCase().includes(textQuery) ||
                    (destino.descripcionCorta || "")
                        .toLowerCase()
                        .includes(textQuery) ||
                    destino.descripcion.toLowerCase().includes(textQuery);
                return (
                    matchesName &&
                    matchesRegionValue &&
                    matchesPaisValue &&
                    matchesText
                );
            });
        }

        if (searchType === "oferta") {
            return salidasDisponibles.filter((oferta) => {
                const destinosAsociados = [
                    oferta.destino,
                    ...(oferta.destinos || []).map((item) => item.destino)
                ].filter(Boolean);

                // Si hay filtro de destino, requiere match en destino
                const hasDestinoFilter = !!destinoQuery;
                const matchesName =
                    !hasDestinoFilter ||
                    destinosAsociados.some((destino) =>
                        matchesDestino(destino.nombre)
                    );

                // Filtro de texto
                const matchesText =
                    !textQuery ||
                    oferta.titulo.toLowerCase().includes(textQuery) ||
                    (oferta.descripcion || "").toLowerCase().includes(textQuery) ||
                    destinosAsociados.some((destino) =>
                        destino.nombre.toLowerCase().includes(textQuery)
                    );

                // Filtro de fecha (solo si hay fecha seleccionada)
                const matchesDate = selectedDate
                    ? (oferta.precios || []).some((precio) => {
                        const inicio = new Date(precio.fechaInicio);
                        const fin = new Date(precio.fechaFin);
                        return selectedDate >= inicio && selectedDate <= fin;
                    })
                    : true;

                // Filtro de transporte (solo si hay transporte seleccionado)
                const matchesTransporte = transporteQuery
                    ? getTransportType(oferta) === transporteQuery
                    : true;

                return matchesName && matchesText && matchesDate && matchesTransporte;
            });
        }

        if (searchType === "paquete") {
            return paquetesDisponibles.filter((oferta) => {
                const destinosAsociados = [
                    oferta.destino,
                    ...(oferta.destinos || []).map((item) => item.destino)
                ].filter(Boolean);
                const hasDestinoFilter = !!destinoQuery;
                const matchesName =
                    !hasDestinoFilter ||
                    destinosAsociados.some((destino) =>
                        matchesDestino(destino.nombre)
                    );
                const matchesText =
                    !textQuery ||
                    oferta.titulo.toLowerCase().includes(textQuery) ||
                    (oferta.descripcion || "").toLowerCase().includes(textQuery) ||
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
                const matchesTransporte = transporteQuery
                    ? getTransportType(oferta) === transporteQuery
                    : true;
                return matchesName && matchesText && matchesDate && matchesTransporte;
            });
        }

        return excursionesDestacadas.filter((actividad) => {
            const destinoNombre = actividad.destino?.nombre || "";
            const matchesCordoba = (() => {
                const destinoNorm = normalizeText(destinoNombre);
                const actividadNorm = normalizeText(actividad.nombre);
                return (
                    destinoNorm.includes("cordoba") ||
                    actividadNorm.includes("cordoba")
                );
            })();
            const matchesName = matchesDestino(destinoNombre);
            const matchesText =
                !textQuery ||
                actividad.nombre.toLowerCase().includes(textQuery) ||
                destinoNombre.toLowerCase().includes(textQuery);
            const matchesDate = true;
            return matchesCordoba && matchesName && matchesText && matchesDate;
        });
    }, [
        destinosNoArgentina,
        salidasDisponibles,
        paquetesDisponibles,
        excursionesDestacadas,
        searchType,
        searchDestino,
        searchRegion,
        searchPais,
        searchText,
        searchDate,
        searchTransporte
    ]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append("type", searchType);
        if (searchDestino) params.append("destino", searchDestino);
        if (searchRegion) params.append("region", searchRegion);
        if (searchPais) params.append("pais", searchPais);
        if (searchText) params.append("text", searchText);
        if (searchDate) params.append("date", searchDate);
        if (searchTransporte) params.append("transporte", searchTransporte);
        navigate(`/busqueda?${params.toString()}`);
    };

    const handleClear = () => {
        setSearchDestino("");
        setSearchRegion("");
        setSearchPais("");
        setSearchText("");
        setSearchDate("");
        setSearchTransporte("");
        navigate(`/busqueda?type=${searchType}`);
    };

    const searchLabel =
        searchType === "destino"
            ? "Destinos"
            : searchType === "oferta"
                ? "Salidas grupales"
                : searchType === "paquete"
                    ? "Paquetes"
                    : "Excursiones";

    return (
        <main className="search-results-page-new">
            {/* Header con botón de volver */}
            <div className="search-results-header-top">
                <button
                    className="back-to-home-btn"
                    onClick={() => navigate("/")}
                    aria-label="Volver al inicio"
                >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M15 19l-7-7 7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Volver al inicio
                </button>
                <h1>Resultados de búsqueda</h1>
            </div>

            {/* Filtro horizontal */}
            <div className="search-filter-horizontal">
                <form onSubmit={handleSearch} className="search-form-horizontal">
                    {/* Tipo de búsqueda */}
                    <div className="filter-field">
                        <label htmlFor="search-type-h">Buscando</label>
                        <select
                            id="search-type-h"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="destino">Destinos</option>
                            <option value="paquete">Paquetes</option>
                            <option value="oferta">Salidas grupales</option>
                            <option value="excursion">Excursiones (Córdoba)</option>
                        </select>
                    </div>

                    {searchType === "destino" && (
                        <>
                            <div className="filter-field">
                                <label htmlFor="region-h">Continente</label>
                                <select
                                    id="region-h"
                                    value={searchRegion}
                                    onChange={(e) => setSearchRegion(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {regionesDisponibles.map((region) => (
                                        <option key={region.id} value={region.id}>
                                            {region.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-field">
                                <label htmlFor="pais-h">País</label>
                                <select
                                    id="pais-h"
                                    value={searchPais}
                                    onChange={(e) => setSearchPais(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {paisesDisponibles.map((pais) => (
                                        <option key={pais} value={pais}>
                                            {pais}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-field">
                                <label htmlFor="destino-h">Destino</label>
                                <select
                                    id="destino-h"
                                    value={searchDestino}
                                    onChange={(e) => setSearchDestino(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {destinosDisponibles.map((destino) => (
                                        <option key={destino.id} value={destino.nombre}>
                                            {destino.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {searchType === "oferta" && (
                        <>
                            <div className="filter-field">
                                <label htmlFor="oferta-h">Salida grupal</label>
                                <select
                                    id="oferta-h"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    {ofertasDisponibles.map((oferta) => (
                                        <option key={oferta} value={oferta}>
                                            {oferta}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-field">
                                <label htmlFor="date-h">Fecha</label>
                                <input
                                    id="date-h"
                                    type="date"
                                    value={searchDate}
                                    onChange={(e) => setSearchDate(e.target.value)}
                                />
                            </div>
                            <div className="filter-field">
                                <label htmlFor="transporte-h">Transporte</label>
                                <select
                                    id="transporte-h"
                                    value={searchTransporte}
                                    onChange={(e) => setSearchTransporte(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    <option value="avion">Avión</option>
                                    <option value="bus">Bus</option>
                                </select>
                            </div>
                        </>
                    )}

                    {searchType === "paquete" && (
                        <>
                            <div className="filter-field">
                                <label htmlFor="paquete-h">Paquete</label>
                                <select
                                    id="paquete-h"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {paquetesDisponiblesTitles.map((oferta) => (
                                        <option key={oferta} value={oferta}>
                                            {oferta}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-field">
                                <label htmlFor="date-p">Fecha</label>
                                <input
                                    id="date-p"
                                    type="date"
                                    value={searchDate}
                                    onChange={(e) => setSearchDate(e.target.value)}
                                />
                            </div>
                            <div className="filter-field">
                                <label htmlFor="transporte-p">Transporte</label>
                                <select
                                    id="transporte-p"
                                    value={searchTransporte}
                                    onChange={(e) => setSearchTransporte(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    <option value="avion">Avión</option>
                                    <option value="bus">Bus</option>
                                </select>
                            </div>
                        </>
                    )}

                    {searchType === "excursion" && (
                        <div className="filter-field">
                            <label htmlFor="excursion-h">Excursión</label>
                            <select
                                id="excursion-h"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            >
                                <option value="">Todas</option>
                                {excursionesDisponibles.map((excursion) => (
                                    <option key={excursion} value={excursion}>
                                        {excursion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="filter-actions">
                        <button type="submit" className="btn-search">
                            Buscar
                        </button>
                        <button
                            type="button"
                            className="btn-clear"
                            onClick={handleClear}
                        >
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>

            {/* Contador de resultados */}
            <div className="results-count">
                <h2>
                    {searchLabel} encontrados
                    <span className="count-badge">{searchResults.length}</span>
                </h2>
            </div>

            {/* Grid de resultados */}
            <div className="search-results-container">
                {loading ? (
                    <p className="section-state">Cargando resultados...</p>
                ) : error ? (
                    <p className="section-state error">{error}</p>
                ) : searchResults.length === 0 ? (
                    <div className="no-results">
                        <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <h3>No encontramos resultados</h3>
                        <p>Intenta ajustar los filtros de búsqueda</p>
                    </div>
                ) : (
                    <div className="results-grid">
                        {searchResults.map((item) => {
                            if (searchType === "destino") {
                                const destinoSlug = item.slug || item.id;
                                return (
                                    <Link
                                        className="tile destination-card"
                                        key={item.id}
                                        to={`/destinos/${destinoSlug}`}
                                    >
                                        <div
                                            className="tile-image"
                                            style={{
                                                backgroundImage: item.imagenPortada
                                                    ? `url("${item.imagenPortada}")`
                                                    : `url("${fallbackDeal}")`
                                            }}
                                        ></div>
                                        <div className="tile-content">
                                            <span className="destination-meta">
                                                {item.paisRegion || "Destino"}
                                            </span>
                                            <h4>{item.nombre}</h4>
                                            <p className="destination-description">
                                                {item.descripcionCorta || item.descripcion}
                                            </p>
                                            <span className="card-cta">Explorar destino</span>
                                        </div>
                                    </Link>
                                );
                            }

                            if (searchType === "oferta" || searchType === "paquete") {
                                const ofertaSlug = item.slug || item.id;
                                const offerImages = getOfferImages(item);
                                const offerImage = offerImages[0] || fallbackDeal;
                                const targetDestino = item.destino;

                                return (
                                    <Link
                                        className="tile destination-card salidas-card"
                                        key={item.id}
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
                                            <h4>{item.titulo}</h4>
                                            <p className="offer-card-description">
                                                {item.descripcion || "Salida grupal confirmada. Consultanos para conocer el itinerario completo."}
                                            </p>
                                            <span className="card-cta">Explorar destino</span>
                                        </div>
                                    </Link>
                                );
                            }

                            // Excursiones
                            const actividadSlug = item.slug || item.id;
                            return (
                                <Link
                                    className="tile destination-card"
                                    key={item.id}
                                    to={`/excursiones/${actividadSlug}`}
                                >
                                    <div
                                        className="tile-image"
                                        style={{
                                            backgroundImage: item.imagenPortada
                                                ? `url("${item.imagenPortada}")`
                                                : `url("${fallbackDeal}")`
                                        }}
                                    ></div>
                                    <div className="tile-content">
                                        <span className="destination-meta">
                                            {item.destino?.nombre || "Excursión"}
                                        </span>
                                        <h4>{item.nombre}</h4>
                                        <p className="destination-description">
                                            {item.descripcion}
                                        </p>
                                        <span className="card-cta">Ver detalles</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

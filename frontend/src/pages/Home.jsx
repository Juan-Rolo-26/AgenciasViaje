import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import logo from "../assets/logo.png";
import ComplaintSection from "../components/ComplaintSection.jsx";
import CustomSelect from "../components/CustomSelect.jsx";
import SearchLoadingAnimation from "../components/SearchLoadingAnimation.jsx";
import { useTravelData } from "../hooks/useTravelData.js";
import { getExcursionGallery } from "../utils/excursionGallery.js";
import { getOfferImages } from "../utils/offerImages.js";
import { resolveAssetUrl } from "../utils/assetUrl.js";
import "../assets/search-button-premium.css";
import "../assets/filter-extra-large.css";
import "../assets/salidas-compact.css";
import "../assets/continents-section.css";

const CONTINENTS = [
  { id: "america", label: "America" },
  { id: "europa", label: "Europa" },
  { id: "asia", label: "Asia" },
  { id: "africa", label: "Africa" }
];

const CONTINENT_DATA = [
  {
    id: "america",
    name: "América",
    description: "Playas paradisíacas, ciudades vibrantes y naturaleza salvaje",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    alt: "Playa tropical en el Caribe"
  },
  {
    id: "europa",
    name: "Europa",
    description: "Historia milenaria, arte y arquitectura incomparable",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    alt: "Coliseo Romano al atardecer"
  },
  {
    id: "asia",
    name: "Asia",
    description: "Cultura milenaria, templos místicos y paisajes exóticos",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
    alt: "Templos y paisajes asiáticos"
  },
  {
    id: "africa",
    name: "África",
    description: "Safaris únicos, wildlife y aventuras inolvidables",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    alt: "Safari africano con jirafas"
  }
];

const HERO_IMAGES = [
  "/assets/destinos/berlin1.jpg",
  "/assets/destinos/roma.jpg",
  "/assets/destinos/madrid3.jpg",
  "/assets/destinos/sudafrica2.jpg",
  "/assets/destinos/Buzios.webp",
  "/assets/destinos/maldivas1.webp",
  "/assets/destinos/singapur1.webp",
  "/assets/destinos/africa1.jpg",
  "/assets/destinos/tai3.webp",
  "/assets/destinos/santiago4.webp",
  "/assets/destinos/Paris1.webp",
  "/assets/destinos/dubai3.webp",
  "/assets/destinos/costarica1.jpg"
];

const HERO_ROTATION_MS = 5000;
const HERO_FADE_MS = 3000;
const CAROUSEL_PX_PER_SECOND = 24;

const CONTINENT_BY_COUNTRY = {
  Argentina: "america",
  Brasil: "america",
  Chile: "america",
  Colombia: "america",
  "Costa Rica": "america",
  Cuba: "america",
  México: "america",
  "República Dominicana": "america",
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

export default function Home() {
  const navigate = useNavigate();
  const { destinos, ofertas, actividades, loading, error } = useTravelData();
  const destinosNoArgentina = useMemo(
    () => destinos.filter((destino) => destino.paisRegion !== "Argentina"),
    [destinos]
  );
  const [isSearching, setIsSearching] = useState(false);

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();

    // Mostrar animación de carga
    setIsSearching(true);

    // Después de 4 segundos, navegar a resultados
    setTimeout(() => {
      const params = new URLSearchParams();
      params.append("type", searchType);
      if (searchDestino) params.append("destino", searchDestino);
      if (searchRegion) params.append("region", searchRegion);
      if (searchPais) params.append("pais", searchPais);
      if (searchText) params.append("text", searchText);
      if (searchDate) params.append("date", searchDate);
      if (searchTransporte) params.append("transporte", searchTransporte);

      navigate(`/busqueda?${params.toString()}`);
      setIsSearching(false);
    }, 4000);
  };

  // Filtrar salidas grupales
  const salidasDisponibles = useMemo(() => {
    return ofertas.filter((oferta) => oferta.tipo === "grupal");
  }, [ofertas]);

  const paquetesDisponibles = useMemo(() => {
    return ofertas;
  }, [ofertas]);
  const heroImages = useMemo(
    () => HERO_IMAGES.map((image) => resolveAssetUrl(image)),
    []
  );
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPrevIndex, setHeroPrevIndex] = useState(0);
  const [heroIsFading, setHeroIsFading] = useState(false);
  const heroFadeTimeout = useRef(null);
  const heroImage = heroImages[heroIndex] || fallbackDeal;
  const heroPrevImage = heroImages[heroPrevIndex] || heroImage;
  const destinosCarouselRef = useRef(null);
  const destinosTrackRef = useRef(null);
  const salidasCarouselRef = useRef(null);
  const salidasTrackRef = useRef(null);
  const excursionesCarouselRef = useRef(null);
  const excursionesTrackRef = useRef(null);
  const [searchType, setSearchType] = useState("destino");
  const [searchDestino, setSearchDestino] = useState("");
  const [searchRegion, setSearchRegion] = useState("");
  const [searchPais, setSearchPais] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchTransporte, setSearchTransporte] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);

  useEffect(() => {
    if (!heroImages.length) {
      return;
    }
    heroImages.forEach((image) => {
      const preload = new Image();
      preload.src = image;
    });
  }, [heroImages]);

  useEffect(() => {
    if (heroImages.length < 2) {
      return;
    }
    const intervalId = setInterval(() => {
      setHeroIndex((current) => {
        const next = (current + 1) % heroImages.length;
        setHeroPrevIndex(current);
        setHeroIsFading(true);
        if (heroFadeTimeout.current) {
          clearTimeout(heroFadeTimeout.current);
        }
        heroFadeTimeout.current = setTimeout(() => {
          setHeroPrevIndex(next);
          setHeroIsFading(false);
        }, HERO_FADE_MS);
        return next;
      });
    }, HERO_ROTATION_MS);
    return () => {
      clearInterval(intervalId);
      if (heroFadeTimeout.current) {
        clearTimeout(heroFadeTimeout.current);
      }
    };
  }, [heroImages.length]);

  const ofertasDisponibles = useMemo(() => {
    const titles = new Set();
    salidasDisponibles.forEach((oferta) => {
      if (oferta.titulo) {
        titles.add(oferta.titulo);
      }
    });
    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, [salidasDisponibles]);

  const paquetesTitles = useMemo(() => {
    const titles = new Set();
    paquetesDisponibles.forEach((oferta) => {
      if (oferta.titulo) {
        titles.add(oferta.titulo);
      }
    });
    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, [paquetesDisponibles]);

  const regionesDisponibles = useMemo(() => {
    const continents = new Set();
    destinosNoArgentina.forEach((destino) => {
      const continent = CONTINENT_BY_COUNTRY[destino.paisRegion];
      if (continent) {
        continents.add(continent);
      }
    });
    return CONTINENTS.filter((item) => continents.has(item.id));
  }, [destinosNoArgentina]);

  const paisesDisponibles = useMemo(() => {
    const countries = new Set();
    destinosNoArgentina.forEach((destino) => {
      if (!destino.paisRegion) {
        return;
      }
      const continent = CONTINENT_BY_COUNTRY[destino.paisRegion];
      if (searchRegion && continent !== searchRegion) {
        return;
      }
      countries.add(destino.paisRegion);
    });
    return Array.from(countries).sort((a, b) => a.localeCompare(b));
  }, [destinosNoArgentina, searchRegion]);

  const destinosDisponibles = useMemo(() => {
    return destinosNoArgentina.filter((destino) => {
      const continent = CONTINENT_BY_COUNTRY[destino.paisRegion];
      if (searchRegion && continent !== searchRegion) {
        return false;
      }
      if (searchPais && destino.paisRegion !== searchPais) {
        return false;
      }
      return true;
    });
  }, [destinosNoArgentina, searchRegion, searchPais]);

  useEffect(() => {
    if (searchPais && !paisesDisponibles.includes(searchPais)) {
      setSearchPais("");
    }
  }, [searchPais, paisesDisponibles]);

  useEffect(() => {
    if (
      searchDestino &&
      !destinosDisponibles.some(
        (destino) => destino.nombre === searchDestino
      )
    ) {
      setSearchDestino("");
    }
  }, [searchDestino, destinosDisponibles]);

  const loopDestinos = useMemo(() => {
    if (!destinosNoArgentina.length) {
      return [];
    }
    return [...destinosNoArgentina, ...destinosNoArgentina];
  }, [destinosNoArgentina]);

  const normalizeText = (value) =>
    (value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const excursionesDestacadas = useMemo(() => {
    const destacadas = actividades.filter((actividad) => actividad.destacada);
    return (destacadas.length ? destacadas : actividades).slice(0, 6);
  }, [actividades]);

  const excursionesDisponibles = useMemo(() => {
    const names = new Set();
    actividades.forEach((actividad) => {
      if (actividad.nombre) {
        const destinoNombre = normalizeText(actividad.destino?.nombre);
        const actividadNombre = normalizeText(actividad.nombre);
        if (
          destinoNombre.includes("cordoba") ||
          actividadNombre.includes("cordoba")
        ) {
          names.add(actividad.nombre);
        }
      }
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [actividades]);

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
        const matchesTransporte = transporteQuery
          ? getTransportType(oferta) === transporteQuery
          : true;
        return matchesName && matchesText && matchesDate && matchesTransporte;
      });
    }

    return actividades.filter((actividad) => {
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
    actividades,
    destinosNoArgentina,
    salidasDisponibles,
    paquetesDisponibles,
    searchDate,
    searchDestino,
    searchRegion,
    searchPais,
    searchText,
    searchTransporte,
    searchType
  ]);

  const loopOfertas = useMemo(() => {
    if (!salidasDisponibles.length) {
      return [];
    }
    const base = [];
    while (base.length < 6) {
      base.push(...salidasDisponibles);
    }
    const trimmed = base.slice(0, 6);
    return [...trimmed, ...trimmed];
  }, [salidasDisponibles]);

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

  useEffect(() => {
    const pairs = [
      { container: destinosCarouselRef.current, track: destinosTrackRef.current },
      { container: salidasCarouselRef.current, track: salidasTrackRef.current },
      {
        container: excursionesCarouselRef.current,
        track: excursionesTrackRef.current
      }
    ];

    const updateSpeed = (container, track) => {
      if (!container || !track) {
        return;
      }
      const baseWidth = track.scrollWidth / 2;
      const seconds = Math.max(baseWidth / CAROUSEL_PX_PER_SECOND, 1);
      container.style.setProperty("--carousel-speed", `${seconds}s`);
    };

    const updateAll = () => {
      pairs.forEach(({ container, track }) => updateSpeed(container, track));
    };

    updateAll();

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateAll);
      pairs.forEach(({ track }) => {
        if (track) {
          resizeObserver.observe(track);
        }
      });
    }

    window.addEventListener("resize", updateAll);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", updateAll);
    };
  }, [loopDestinos.length, loopOfertas.length, loopExcursiones.length]);

  const hasSearchFilters =
    searchDestino.trim() ||
    searchRegion ||
    searchPais ||
    searchDate ||
    searchText.trim() ||
    searchTransporte;
  const searchLabel =
    searchType === "destino"
      ? "Destinos"
      : searchType === "oferta"
        ? "Salidas grupales"
        : searchType === "paquete"
          ? "Paquetes"
          : "Excursiones Córdoba";
  const searchButtonLabel =
    searchType === "destino"
      ? "Buscar destinos"
      : searchType === "oferta"
        ? "Buscar salidas grupales"
        : searchType === "paquete"
          ? "Buscar paquetes"
          : "Buscar excursiones";
  const searchLink =
    searchType === "destino"
      ? "/destinos"
      : searchType === "oferta"
        ? "/ofertas?seccion=salidas-grupales"
        : searchType === "paquete"
          ? "/ofertas"
          : "/cordoba";
  const searchSubtitle = "Resultados según tu búsqueda.";
  const totalResults = searchResults.length;
  const currentResult = totalResults
    ? searchResults[searchIndex % totalResults]
    : null;

  useEffect(() => {
    if (searchType === "destino") {
      setSearchText("");
      setSearchDate("");
      setSearchTransporte("");
    } else {
      setSearchDestino("");
      setSearchRegion("");
      setSearchPais("");
      if (searchType !== "oferta") {
        setSearchTransporte("");
      }
    }
  }, [searchType]);

  useEffect(() => {
    if (searchPais && !paisesDisponibles.includes(searchPais)) {
      setSearchPais("");
    }
  }, [paisesDisponibles, searchPais]);

  useEffect(() => {
    setSearchIndex(0);
  }, [
    searchType,
    searchDestino,
    searchRegion,
    searchPais,
    searchDate,
    searchText,
    searchTransporte,
    totalResults
  ]);

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
      <section
        className={`hero hero-search${heroIsFading ? " hero-search-fade" : ""}`}
        id="inicio"
      >
        <div
          className="hero-background hero-background-prev"
          style={{ backgroundImage: `url("${heroPrevImage}")` }}
          aria-hidden="true"
        ></div>
        <div
          className="hero-background hero-background-current"
          style={{ backgroundImage: `url("${heroImage}")` }}
          aria-hidden="true"
        ></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Tu próxima escapada empieza en{" "}
              <span className="brand-word topotours-word">Topotours</span>
            </h1>
          </div>
          <form
            className={`search-bar premium-filter premium-filter-${searchType}`}
            onSubmit={handleSearch}
          >
            {searchType === "destino" ? (
              <>
                <CustomSelect
                  id="search-region"
                  label="Continente"
                  value={searchRegion}
                  onChange={(event) => setSearchRegion(event.target.value)}
                  options={regionesDisponibles.map((region) => ({
                    value: region.id,
                    label: region.label,
                  }))}
                  icon={
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 4v14M15 6v14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  placeholder="Todos"
                />
                <CustomSelect
                  id="search-pais"
                  label="País"
                  value={searchPais}
                  onChange={(event) => setSearchPais(event.target.value)}
                  options={paisesDisponibles.map((pais) => ({
                    value: pais,
                    label: pais,
                  }))}
                  icon={
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4 6h16M4 12h16M4 18h16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="8"
                        cy="6"
                        r="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="14"
                        cy="12"
                        r="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="10"
                        cy="18"
                        r="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  }
                  placeholder="Todos"
                />
                <CustomSelect
                  id="search-destino"
                  label="Destino"
                  value={searchDestino}
                  onChange={(event) => setSearchDestino(event.target.value)}
                  options={destinosDisponibles.map((destino) => ({
                    value: destino.nombre,
                    label: destino.nombre,
                  }))}
                  icon={
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
                  }
                  placeholder="Todos"
                />
                <CustomSelect
                  id="search-type"
                  label="Filtro de búsqueda"
                  value={searchType}
                  onChange={(event) => setSearchType(event.target.value)}
                  options={[
                    { value: "destino", label: "Destinos" },
                    { value: "paquete", label: "Paquetes" },
                    { value: "oferta", label: "Salidas grupales" },
                    { value: "excursion", label: "Excursiones (Córdoba)" },
                  ]}
                  icon={
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
                  }
                  showPlaceholderOption={false}
                />
              </>
            ) : (
              <>
                <CustomSelect
                  id="search-text"
                  label={
                    searchType === "oferta"
                      ? "Salidas grupales"
                      : searchType === "paquete"
                        ? "Paquetes"
                        : "Excursión Córdoba"
                  }
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  options={(searchType === "oferta"
                    ? ofertasDisponibles
                    : searchType === "paquete"
                      ? paquetesTitles
                      : excursionesDisponibles
                  ).map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  icon={
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
                  }
                  placeholder={
                    searchType === "oferta"
                      ? "Todas las salidas grupales"
                      : searchType === "paquete"
                        ? "Todos los paquetes"
                        : "Todas las excursiones"
                  }
                />
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
                {searchType === "oferta" || searchType === "paquete" ? (
                  <CustomSelect
                    id="search-transporte"
                    label="Transporte"
                    value={searchTransporte}
                    onChange={(event) =>
                      setSearchTransporte(event.target.value)
                    }
                    options={[
                      { value: "avion", label: "Avion" },
                      { value: "bus", label: "Bus" },
                    ]}
                    icon={
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect
                          x="3"
                          y="7"
                          width="18"
                          height="10"
                          rx="2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M7 7V5H17V7"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="7"
                          cy="18"
                          r="2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="17"
                          cy="18"
                          r="2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    }
                    placeholder="Todos"
                  />
                ) : null}
                <CustomSelect
                  id="search-type"
                  label="Filtro de búsqueda"
                  value={searchType}
                  onChange={(event) => setSearchType(event.target.value)}
                  options={[
                    { value: "destino", label: "Destinos" },
                    { value: "paquete", label: "Paquetes" },
                    { value: "oferta", label: "Salidas grupales" },
                    { value: "excursion", label: "Excursiones (Córdoba)" },
                  ]}
                  icon={
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
                  }
                  showPlaceholderOption={false}
                />
              </>
            )}

            <button className="filter-button" type="submit">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m20 20-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {searchButtonLabel}
            </button>
          </form>
        </div>
      </section>

      {isSearching && <SearchLoadingAnimation searchType={searchType} />}

      <section className="grid-section">
        <div className="section-header section-header-row">
          <div>
            <h2>Destinos</h2>
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
        ) : destinosNoArgentina.length === 0 ? (
          <p className="section-state">No hay destinos disponibles.</p>
        ) : (
          <div
            className="offer-carousel destination-carousel"
            ref={destinosCarouselRef}
          >
            <div className="offer-track" ref={destinosTrackRef}>
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
            <h2>Salidas grupales</h2>
            <p>Experiencias con cupos confirmados y fechas flexibles.</p>
          </div>
          <Link className="secondary" to="/ofertas?seccion=salidas-grupales">
            Ver mas
          </Link>
        </div>
        {loading ? (
          <p className="section-state">Cargando salidas...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : loopOfertas.length === 0 ? (
          <p className="section-state">No hay salidas disponibles.</p>
        ) : (
          <div
            className="offer-carousel destination-carousel"
            ref={salidasCarouselRef}
          >
            <div className="offer-track" ref={salidasTrackRef}>
              {loopOfertas.map((oferta, index) => {
                const ofertaSlug = oferta.slug || oferta.id;
                const offerImages = getOfferImages(oferta);
                const offerImage = offerImages[0] || fallbackDeal;
                const targetDestino = oferta.destino;
                const targetLink = targetDestino
                  ? `/destinos/${targetDestino.slug}?oferta=${ofertaSlug}`
                  : `/ofertas/${ofertaSlug}`;
                return (
                  <Link
                    className="salidas-card-compact"
                    key={`${oferta.id}-${index}`}
                    to={targetLink}
                  >
                    <div className="salidas-card-image">
                      <img
                        src={offerImage}
                        alt={oferta.titulo}
                      />
                    </div>
                    <div className="salidas-card-body">
                      <span className="salidas-card-destino">
                        {oferta.destino?.nombre || "Destino"}
                      </span>
                      <h4 className="salidas-card-titulo">{oferta.titulo}</h4>
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
            <h2>Excursiones</h2>
            <p>Sumale experiencias y recorridos locales a tu viaje.</p>
          </div>
          <Link className="secondary" to="/cordoba">
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
          <div
            className="offer-carousel destination-carousel"
            ref={excursionesCarouselRef}
          >
            <div className="offer-track" ref={excursionesTrackRef}>
              {loopExcursiones.map((actividad, index) => {
                const actividadSlug = actividad.slug || actividad.id;
                const galleryImages = getExcursionGallery(actividad.slug);
                const coverImage =
                  actividad.imagenPortada ||
                  galleryImages[0] ||
                  fallbackDeal;
                const extraImages = galleryImages
                  .filter((image) => image !== coverImage)
                  .slice(0, 2);
                return (
                  <Link
                    className="offer-card offer-card-feature offer-link"
                    key={`${actividad.id}-${index}`}
                    to={`/excursiones/${actividadSlug}`}
                  >
                    <div className="offer-image">
                      <img
                        className="offer-image-main"
                        src={coverImage}
                        alt={actividad.nombre}
                      />
                      {extraImages.length ? (
                        <div className="offer-image-stack">
                          {extraImages.map((image, imageIndex) => (
                            <img
                              key={`${actividad.id}-home-${imageIndex}`}
                              src={image}
                              alt={`${actividad.nombre} ${imageIndex + 2}`}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="offer-body">
                      <div className="offer-header">
                        <span className="offer-tag">
                          {actividad.destino?.nombre || "Córdoba"}
                        </span>
                        <h3>{actividad.nombre}</h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN EXPLORAR POR CONTINENTE */}
      <section className="explore-continents-section">
        <div className="explore-header">
          <span className="explore-header-badge">Descubrí el mundo</span>
          <h2>Buscá los mejores paquetes por destino</h2>
          <p>
            Elegí tu próximo destino y viví experiencias únicas en cada rincón del planeta.
          </p>
        </div>

        <div className="continents-scroll-container">
          <div className="continents-track">
            {CONTINENT_DATA.map((continent) => {
              // Contar destinos disponibles para este continente
              const count = destinos.filter(
                (d) => CONTINENT_BY_COUNTRY[d.paisRegion] === continent.id
              ).length;

              return (
                <div
                  key={continent.id}
                  className="continent-card"
                  onClick={() => {
                    navigate(`/busqueda?region=${continent.id}`);
                  }}
                >
                  <img
                    className="continent-image"
                    src={continent.image}
                    alt={continent.alt}
                  />
                  <span className="continent-badge">
                    {count > 0 ? `${count} Destinos` : "Explorar"}
                  </span>
                  <div className="continent-overlay">
                    <h3 className="continent-name">{continent.name}</h3>
                    <p className="continent-description">
                      {continent.description}
                    </p>
                    <div className="continent-cta">
                      Explorar destino
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid-section travel-docs-preview">
        <div className="travel-docs-preview-frame">
          <div className="section-header travel-docs-preview-header">
            <span className="section-state">
              Ministerio del Interior - Dirección Nacional de Migraciones
            </span>
            <h2>¿Lo que necesito para salir del país?</h2>
            <p>
              Accedé a la guía completa con requisitos para viajes internacionales.
            </p>
          </div>
          <div className="travel-docs-preview-action">
            <Link className="primary" to="/documentacion">
              Ver documentación
            </Link>
          </div>
        </div>
      </section>



      <ComplaintSection />
    </main >
  );
}

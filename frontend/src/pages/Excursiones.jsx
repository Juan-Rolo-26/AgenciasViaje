import { useMemo } from "react";
import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useActividades } from "../hooks/useTravelData.js";

export default function Excursiones({
  forcedSection = "",
  heroOverrides = {}
} = {}) {
  const { actividades, loading, error } = useActividades();
  const forcedSectionValue = (forcedSection || "").toLowerCase();
  const selectedSection = forcedSectionValue || "cordoba";
  const heroKicker =
    heroOverrides.kicker ?? (
      <>
        Excursiones <span className="topotours-word">Topotours</span>
      </>
    );
  const heroTitle =
    heroOverrides.title || "Excursiones en Córdoba";
  const heroSubtitle =
    heroOverrides.subtitle ||
    "Sumá tours, aventura y sabores locales al viaje que elijas.";

  const excursionesDestacadas = actividades;

  const normalizeText = (value) =>
    (value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const excursionesFiltradas = useMemo(() => {
    if (!selectedSection) {
      return excursionesDestacadas;
    }
    if (selectedSection === "cordoba") {
      return excursionesDestacadas.filter((actividad) => {
        const destinoNombre = normalizeText(actividad.destino?.nombre);
        const actividadNombre = normalizeText(actividad.nombre);
        return (
          destinoNombre.includes("cordoba") ||
          actividadNombre.includes("cordoba")
        );
      });
    }
    const wantNational = selectedSection === "nacionales";
    return excursionesDestacadas.filter((actividad) => {
      const pais = actividad.destino?.paisRegion || "";
      if (!pais) {
        return false;
      }
      const isArgentina = pais === "Argentina";
      return wantNational ? isArgentina : !isArgentina;
    });
  }, [excursionesDestacadas, selectedSection]);

  return (
    <main>
      <section className="page-hero excursions-hero">
        <div className="page-hero-inner">
          <span className="page-hero-kicker">{heroKicker}</span>
          <h2>{heroTitle}</h2>
          <p>{heroSubtitle}</p>
        </div>
      </section>
      <section className="grid-section excursions-section">
        {loading ? (
          <p className="section-state">Cargando excursiones...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : excursionesFiltradas.length === 0 ? (
          <p className="section-state">No hay excursiones disponibles.</p>
        ) : (
          <div className="grid grid-3x3">
            {excursionesFiltradas.map((actividad, index) => {
              const actividadSlug = actividad.slug || actividad.id;
              return (
                <Link
                  className="tile destination-card"
                  key={actividad.id}
                  style={{ "--delay": `${index * 70}ms` }}
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
                    <span className="destination-meta">
                      {actividad.destino?.nombre || "Destino"}
                    </span>
                    <span className="card-cta">Ver excursión →</span>
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

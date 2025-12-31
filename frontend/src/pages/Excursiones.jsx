import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import { resolveAssetUrl } from "../utils/assetUrl.js";

const EXCURSION_SECTIONS = [
  {
    id: "nacionales",
    label: "Excursiones nacionales",
    image: "/assets/destinos/usuahia.jpg"
  },
  {
    id: "internacionales",
    label: "Excursiones internacionales",
    image: "/assets/destinos/roma.jpg"
  }
];

const EXCURSION_SECTION_SET = new Set(
  EXCURSION_SECTIONS.map((section) => section.id)
);

export default function Excursiones() {
  const { actividades, loading, error } = useTravelData();
  const [searchParams] = useSearchParams();
  const selectedSection = (() => {
    const value = (searchParams.get("seccion") || "").toLowerCase();
    return EXCURSION_SECTION_SET.has(value) ? value : "";
  })();
  const sectionCards = useMemo(
    () =>
      EXCURSION_SECTIONS.map((section) => ({
        ...section,
        imageUrl: resolveAssetUrl(section.image)
      })),
    []
  );
  const activeSection = EXCURSION_SECTIONS.find(
    (section) => section.id === selectedSection
  );

  const excursionesDestacadas = useMemo(() => {
    const destacadas = actividades.filter((actividad) => actividad.destacada);
    return destacadas.length ? destacadas : actividades;
  }, [actividades]);

  const excursionesFiltradas = useMemo(() => {
    if (!selectedSection) {
      return excursionesDestacadas;
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
      {!selectedSection ? (
        <section className="section-landing">
          <div className="section-grid">
            {sectionCards.map((section) => (
              <Link
                key={section.id}
                className="section-tile"
                to={`/excursiones?seccion=${section.id}`}
                style={{ backgroundImage: `url("${section.imageUrl}")` }}
              >
                <div className="section-tile-overlay"></div>
                <div className="section-tile-content">
                  <span className="section-tile-title">{section.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="page-hero excursions-hero">
            <div className="page-hero-inner">
              <span className="page-hero-kicker">
                Excursiones <span className="topotours-word">Topotours</span>
              </span>
              <h2>
                {activeSection
                  ? activeSection.label
                  : "Excursiones que suman experiencia"}
              </h2>
              <p>Sumá tours, aventura y sabores locales al viaje que elijas.</p>
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
                {excursionesFiltradas.map((actividad) => {
                  const actividadSlug = actividad.slug || actividad.id;
                  return (
                    <Link
                      className="tile excursion-card"
                      key={actividad.id}
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
            )}
          </section>
        </>
      )}
    </main>
  );
}

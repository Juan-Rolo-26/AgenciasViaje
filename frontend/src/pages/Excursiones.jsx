import { useMemo } from "react";
import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";

export default function Excursiones() {
  const { actividades, loading, error } = useTravelData();

  const excursionesDestacadas = useMemo(() => {
    const destacadas = actividades.filter((actividad) => actividad.destacada);
    return destacadas.length ? destacadas : actividades;
  }, [actividades]);

  return (
    <main>
      <section className="grid-section">
        <div className="section-header">
          <h2>Excursiones que suman experiencia</h2>
          <p>Sumá tours, aventura y sabores locales al viaje que elijas.</p>
        </div>
        {loading ? (
          <p className="section-state">Cargando excursiones...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : excursionesDestacadas.length === 0 ? (
          <p className="section-state">No hay excursiones disponibles.</p>
        ) : (
          <div className="grid grid-3x3">
            {excursionesDestacadas.map((actividad) => {
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
                        ? `url(${actividad.imagenPortada})`
                        : `url(${fallbackDeal})`
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
    </main>
  );
}

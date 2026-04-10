import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import "../assets/cruceros-redesign.css";
import { useCruceros } from "../hooks/useTravelData.js";

export default function Cruceros() {
  const { cruceros, loading, error } = useCruceros();

  return (
    <main>
      <section className="page-hero excursions-hero">
        <div className="page-hero-inner">
          <span className="page-hero-kicker">
            Cruceros <span className="topotours-word">Topotours</span>
          </span>
          <h2>Cruceros para viajar con todo resuelto</h2>
          <p>
            Explorá nuestras salidas en crucero con itinerarios completos, navieras de primer nivel y los mejores destinos del mundo.
          </p>
        </div>
      </section>

      <section className="grid-section excursions-section">
        {loading ? (
          <p className="section-state">Cargando cruceros...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : cruceros.length === 0 ? (
          <p className="section-state">No hay cruceros disponibles.</p>
        ) : (
          <div className="grid grid-3x3">
            {cruceros.map((crucero, index) => {
              const cruceroSlug = crucero.slug || crucero.id;
              const metaParts = [
                crucero.destino?.nombre,
                crucero.duracionNoches ? `${crucero.duracionNoches} noches` : null,
                crucero.naviera || crucero.barco || null
              ].filter(Boolean);

              return (
                <Link
                  className="tile destination-card crucero-card-new"
                  key={crucero.id}
                  style={{ "--delay": `${index * 70}ms` }}
                  to={`/cruceros/${cruceroSlug}`}
                >
                  <div
                    className="tile-image"
                    style={{
                      backgroundImage: crucero.imagenPortada
                        ? `url("${crucero.imagenPortada}")`
                        : `url("${fallbackDeal}")`
                    }}
                  ></div>
                  <div className="tile-content">
                    <h4>{crucero.nombre}</h4>
                    <span className="destination-meta">
                      {metaParts.join(" • ") || "Crucero disponible"}
                    </span>
                    <span className="card-cta">Ver crucero</span>
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

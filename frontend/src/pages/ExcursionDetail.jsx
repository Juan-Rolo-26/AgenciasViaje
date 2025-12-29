import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";

export default function ExcursionDetail() {
  const { slug } = useParams();
  const { actividades, loading, error } = useTravelData();

  const actividad = useMemo(
    () =>
      actividades.find(
        (item) => item.slug === slug || String(item.id) === slug
      ),
    [actividades, slug]
  );

  if (loading) {
    return (
      <main>
        <p className="section-state">Cargando excursion...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p className="section-state error">{error}</p>
      </main>
    );
  }

  if (!actividad) {
    return (
      <main>
        <p className="section-state">No encontramos esta excursion.</p>
        <Link className="primary" to="/excursiones">
          Volver a excursiones
        </Link>
      </main>
    );
  }

  const heroImage = actividad.imagenPortada || fallbackDeal;
  const destinoSlug = actividad.destino?.slug || actividad.destino?.id;
  const precio = formatCurrency(actividad.precio, "ARS");

  return (
    <main className="detail-page">
      <section
        className="detail-hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="detail-hero-overlay">
          <div className="detail-hero-content">
            <Link className="detail-back" to="/excursiones">
              Volver a excursiones
            </Link>
            <p className="detail-kicker">Excursion</p>
            <h1>{actividad.nombre}</h1>
            <p>{actividad.destino?.nombre || "Destino destacado"}</p>
            <div className="detail-hero-meta">
              <span>{actividad.tipoActividad}</span>
              <span>{precio || "Precio a consultar"}</span>
              <span>
                {actividad.fecha ? formatDate(actividad.fecha) : "Fecha a definir"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-grid">
          <article className="detail-card">
            <h3>Detalle de la excursion</h3>
            <p>{actividad.descripcion}</p>
          </article>
          <article className="detail-card">
            <h3>Informacion clave</h3>
            <ul className="detail-list">
              <li>Tipo: {actividad.tipoActividad}</li>
              <li>Hora: {actividad.hora || "A confirmar"}</li>
              <li>Punto de encuentro: {actividad.puntoEncuentro}</li>
              <li>Cupos disponibles: {actividad.cupos}</li>
            </ul>
          </article>
        </div>
      </section>

      {destinoSlug ? (
        <section className="detail-section">
          <article className="detail-card">
            <h3>Destino relacionado</h3>
            <Link className="detail-link" to={`/destinos/${destinoSlug}`}>
              Ver detalle de {actividad.destino?.nombre}
            </Link>
          </article>
        </section>
      ) : null}
    </main>
  );
}

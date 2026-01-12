import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useActividades } from "../hooks/useTravelData.js";
import { getExcursionGallery } from "../utils/excursionGallery.js";

export default function ExcursionDetail() {
  const { slug } = useParams();
  const { actividades, loading, error } = useActividades();

  const actividad = useMemo(
    () =>
      actividades.find(
        (item) => item.slug === slug || String(item.id) === slug
      ),
    [actividades, slug]
  );
  const heroImage = actividad?.imagenPortada || fallbackDeal;
  const destinoSlug = actividad?.destino?.slug || actividad?.destino?.id;
  const cuposLabel =
    actividad?.cupos && actividad.cupos > 0 ? actividad.cupos : "A coordinar";
  const galleryImages = useMemo(() => {
    const images = [];
    const seen = new Set();
    const addImage = (value) => {
      if (!value || seen.has(value)) {
        return;
      }
      seen.add(value);
      images.push(value);
    };

    if (actividad?.slug) {
      getExcursionGallery(actividad.slug).forEach(addImage);
    }
    addImage(heroImage);

    if (!images.length) {
      images.push(fallbackDeal);
    }

    while (images.length < 3) {
      images.push(fallbackDeal);
    }

    return images.slice(0, 3);
  }, [actividad?.slug, heroImage]);

  const descripcion =
    typeof actividad?.descripcion === "string" &&
    actividad.descripcion.trim().length
      ? actividad.descripcion
      : "Consultanos para conocer el detalle de la excursión.";
  const puntoEncuentro = actividad?.puntoEncuentro || "A coordinar";
  const tipoActividad = actividad?.tipoActividad || "Excursión";

  if (loading) {
    return (
      <main>
        <p className="section-state">Cargando excursión...</p>
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
        <p className="section-state">No encontramos esta excursión.</p>
        <Link className="primary" to="/cordoba">
          Volver a excursiones
        </Link>
      </main>
    );
  }

  return (
    <main className="detail-page excursion-detail-page">
      <section
        className="destination-hero excursion-hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="destination-hero-overlay"></div>
        <div className="destination-hero-card">
          <Link className="destination-hero-back" to="/cordoba">
            Anterior
          </Link>
          <span className="destination-hero-country">
            {(actividad.destino?.nombre || "Excursión").toUpperCase()}
          </span>
          <h1>{actividad.nombre}</h1>
          <p>Excursión con fecha a coordinar.</p>
        </div>
      </section>

      <section className="destination-photos">
        {galleryImages.map((image, index) => (
          <div className="destination-photo-card" key={`${image}-${index}`}>
            <img src={image} alt={`${actividad.nombre} ${index + 1}`} />
          </div>
        ))}
      </section>

      <section className="detail-section">
        <div className="detail-grid">
          <article className="detail-card">
            <h3>Detalle de la excursión</h3>
            <p>{descripcion}</p>
          </article>
          <article className="detail-card">
            <h3>Información clave</h3>
            <ul className="detail-list">
              <li>Tipo: {tipoActividad}</li>
              <li>Fecha: A coordinar</li>
              <li>Hora: {actividad.hora || "A confirmar"}</li>
              <li>Punto de encuentro: {puntoEncuentro}</li>
              <li>Cupos disponibles: {cuposLabel}</li>
              <li>Traslado: Incluido</li>
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

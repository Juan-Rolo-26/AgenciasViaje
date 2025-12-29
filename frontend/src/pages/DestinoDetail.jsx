import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import {
  formatCurrency,
  formatDate,
  getPrecioVigente
} from "../utils/formatters.js";

export default function DestinoDetail() {
  const { slug } = useParams();
  const { destinos, ofertas, actividades, loading, error } = useTravelData();

  const destino = useMemo(
    () =>
      destinos.find(
        (item) => item.slug === slug || String(item.id) === slug
      ),
    [destinos, slug]
  );

  const ofertasDestino = useMemo(() => {
    if (!destino) {
      return [];
    }
    return ofertas.filter((oferta) => {
      const principal = oferta.destino?.id === destino.id;
      const secundarios = (oferta.destinos || []).some(
        (item) =>
          item.destino?.id === destino.id || item.destinoId === destino.id
      );
      return principal || secundarios;
    });
  }, [ofertas, destino]);

  const actividadesDestino = useMemo(() => {
    if (!destino) {
      return [];
    }
    return actividades.filter(
      (actividad) => actividad.destino?.id === destino.id
    );
  }, [actividades, destino]);

  const galleryImages = useMemo(() => {
    if (!destino) {
      return [];
    }
    const images = [];
    const seen = new Set();
    const addImage = (value) => {
      if (!value || seen.has(value)) {
        return;
      }
      seen.add(value);
      images.push(value);
    };

    addImage(destino.imagenPortada);

    if (Array.isArray(destino.galeria)) {
      destino.galeria.forEach((item) => addImage(item.imagen));
    }

    actividadesDestino.forEach((actividad) => {
      addImage(actividad.imagenPortada);
    });

    if (!images.length) {
      images.push(fallbackDeal);
    }

    return images.slice(0, 6);
  }, [destino, actividadesDestino]);

  if (loading) {
    return (
      <main>
        <p className="section-state">Cargando destino...</p>
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

  if (!destino) {
    return (
      <main>
        <p className="section-state">No encontramos este destino.</p>
        <Link className="primary" to="/destinos">
          Volver a destinos
        </Link>
      </main>
    );
  }

  const heroImage = destino.imagenPortada || fallbackDeal;

  return (
    <main className="destination-detail-page">
      <section
        className="destination-hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="destination-hero-overlay"></div>
        <div className="destination-hero-card">
          <Link className="destination-hero-back" to="/destinos">
            Anterior
          </Link>
          <span className="destination-hero-country">
            {(destino.paisRegion || "Destino destacado").toUpperCase()}
          </span>
          <h1>{destino.nombre}</h1>
          <p>{destino.descripcionCorta || "Conoce sus mejores experiencias."}</p>
        </div>
      </section>

      <section className="destination-summary">
        <p>{destino.descripcion}</p>
      </section>

      <section className="destination-photos">
        {galleryImages.slice(0, 2).map((image, index) => (
          <div className="destination-photo-card" key={`${image}-${index}`}>
            <img src={image} alt={`${destino.nombre} ${index + 1}`} />
          </div>
        ))}
      </section>

      <section className="grid-section">
        <div className="section-header">
          <h2>Ofertas para {destino.nombre}</h2>
          <p>Promos y paquetes pensados para este destino.</p>
        </div>
        {ofertasDestino.length === 0 ? (
          <p className="section-state">
            No hay ofertas disponibles para este destino.
          </p>
        ) : (
          <div className="offer-grid">
            {ofertasDestino.map((oferta) => {
              const precio = getPrecioVigente(oferta.precios);
              const ofertaSlug = oferta.slug || oferta.id;
              return (
                <Link
                  className="offer-card offer-link"
                  key={oferta.id}
                  to={`/ofertas/${ofertaSlug}`}
                >
                  <div className="offer-header">
                    <span className="offer-tag">
                      {oferta.destino?.nombre || destino.nombre}
                    </span>
                    <h3>{oferta.titulo}</h3>
                  </div>
                  <p className="offer-description">
                    {oferta.condiciones ||
                      oferta.noIncluye ||
                      "Consultanos"}
                  </p>
                  <div className="offer-meta">
                    {precio ? (
                      <span className="offer-price">
                        {formatCurrency(precio.precio, precio.moneda)}
                      </span>
                    ) : (
                      <span className="offer-price">Precio a consultar</span>
                    )}
                    {precio ? (
                      <span className="offer-dates">
                        {formatDate(precio.fechaInicio)} -{" "}
                        {formatDate(precio.fechaFin)}
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid-section">
        <div className="section-header">
          <h2>Excursiones en {destino.nombre}</h2>
          <p>Sumale experiencias y recorridos locales al viaje.</p>
        </div>
        {actividadesDestino.length === 0 ? (
          <p className="section-state">No hay excursiones disponibles.</p>
        ) : (
          <div className="grid">
            {actividadesDestino.map((actividad) => {
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
                      {actividad.tipoActividad || "Experiencia"}
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

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useActividades } from "../hooks/useTravelData.js";
import { getWhatsappLink } from "../utils/contactLinks.js";
import { getExcursionGallery } from "../utils/excursionGallery.js";
import { resolveAssetUrl } from "../utils/assetUrl.js";

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
  const whatsappMessage = `Hola! Quiero reservar la excursión ${actividad?.nombre || "Córdoba"}.`;
  const whatsappLink = getWhatsappLink(whatsappMessage);

  if (loading) {
    return (
      <main className="excursion-detail-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="section-state">Cargando excursión...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="excursion-detail-error">
        <div className="error-container">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="section-state error">{error}</p>
        </div>
      </main>
    );
  }

  if (!actividad) {
    return (
      <main className="excursion-detail-not-found">
        <div className="not-found-container">
          <svg className="not-found-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <h2>Excursión no encontrada</h2>
          <p className="section-state">No encontramos esta excursión en nuestro catálogo.</p>
          <Link className="back-button primary" to="/cordoba">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver a excursiones
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="detail-page excursion-detail-page premium-excursion-detail">
      {/* Hero Section with Parallax Effect */}
      <section
        className="excursion-hero-premium"
        style={{ backgroundImage: `url("${resolveAssetUrl(heroImage)}")` }}
      >
        <div className="excursion-hero-overlay"></div>
        <div className="excursion-hero-content">
          <div className="back-button-container">
            <Link className="premium-back-button" to="/cordoba">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Volver</span>
            </Link>
          </div>
          <div className="excursion-hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{actividad.destino?.nombre || "Excursión"}</span>
          </div>
          <h1 className="excursion-hero-title">{actividad.nombre}</h1>
          <p className="excursion-hero-subtitle">Experiencia única con fecha a coordinar</p>
          <div className="excursion-hero-meta">
            <div className="hero-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{actividad.hora || "A confirmar"}</span>
            </div>
            <div className="hero-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>{cuposLabel} cupos</span>
            </div>
            <div className="hero-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{tipoActividad}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="excursion-gallery-premium">
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div className="gallery-item" key={`${image}-${index}`}>
              <div className="gallery-image-wrapper">
                <img src={resolveAssetUrl(image)} alt={`${actividad.nombre} ${index + 1}`} loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="excursion-cta-premium">
        <div className="cta-container">
          <div className="cta-content">
            <h3>¿Listo para vivir esta experiencia?</h3>
            <p>Reservá tu lugar ahora y asegurá tu aventura</p>
          </div>
          <a
            className="excursion-whatsapp-button"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span>Reservar por WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Details Section */}
      <section className="excursion-details-premium">
        <div className="details-container">
          <div className="details-main">
            <article className="detail-card-premium description-card">
              <div className="card-header">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3>Descripción de la Experiencia</h3>
              </div>
              <div className="card-content">
                <p className="description-text">{descripcion}</p>
              </div>
            </article>

            <article className="detail-card-premium info-card">
              <div className="card-header">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <h3>Información Detallada</h3>
              </div>
              <div className="card-content">
                <ul className="info-list-premium">
                  <li className="info-item">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="info-content">
                      <div className="card-prices" style={{ marginTop: 0, gap: '4px' }}>
                        <span className="price-label">Tarifa por persona</span>
                        <div className="prices-wrapper">
                          <span className="price-ars">
                            {actividad.precioPesos ? `ARS $${Number(actividad.precioPesos).toLocaleString('es-AR')}` : (actividad.precio ? `ARS $${Number(actividad.precio).toLocaleString('es-AR')}` : 'Consultar')}
                          </span>
                          <span className="price-usd">
                            {actividad.precioDolares ? ` USD $${Number(actividad.precioDolares).toLocaleString('es-AR')}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="info-item">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="info-content">
                      <span className="info-label">Tipo de actividad</span>
                      <span className="info-value">{tipoActividad}</span>
                    </div>
                  </li>
                  <li className="info-item">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="info-content">
                      <span className="info-label">Fecha</span>
                      <span className="info-value">A coordinar</span>
                    </div>
                  </li>
                  <li className="info-item">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="info-content">
                      <span className="info-label">Horario</span>
                      <span className="info-value">{actividad.hora || "A confirmar"}</span>
                    </div>
                  </li>
                  <li className="info-item">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="info-content">
                      <span className="info-label">Punto de encuentro</span>
                      <span className="info-value">{puntoEncuentro}</span>
                    </div>
                  </li>
                  <li className="info-item">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="info-content">
                      <span className="info-label">Cupos disponibles</span>
                      <span className="info-value">{cuposLabel}</span>
                    </div>
                  </li>
                  <li className="info-item">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </div>
                    <div className="info-content">
                      <span className="info-label">Traslado</span>
                      <span className="info-value">Incluido</span>
                    </div>
                  </li>
                </ul>
              </div>
            </article>
          </div>

          {destinoSlug && (
            <aside className="details-sidebar">
              <article className="detail-card-premium related-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3>Destino Relacionado</h3>
                </div>
                <div className="card-content">
                  <p className="related-description">
                    Descubrí más sobre {actividad.destino?.nombre} y todas las experiencias que tenemos para ofrecerte en este increíble destino.
                  </p>
                  <Link className="related-link" to={`/destinos/${destinoSlug}`}>
                    <span>Ver destino {actividad.destino?.nombre}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}

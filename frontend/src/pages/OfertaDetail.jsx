import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useOfertas } from "../hooks/useTravelData.js";
import { formatDate } from "../utils/formatters.js";
import { getWhatsappLink } from "../utils/contactLinks.js";
import { getOfferImages } from "../utils/offerImages.js";

const incluyeIconos = {
  transporte: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7V5H17V7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  alojamiento: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="11" width="18" height="6" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V8H11V11" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 17V20M21 17V20" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  comida: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  servicio: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="12" width="3" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="12" width="3" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 18v2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  equipaje: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="7" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 7V5H15V7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
};

function getIncluyeIcon(tipo) {
  const key = String(tipo || "").toLowerCase();
  return incluyeIconos[key] || incluyeIconos.default;
}

function formatIncluyeTipo(tipo) {
  if (!tipo) {
    return "Incluye";
  }
  return tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

export default function OfertaDetail() {
  const { slug } = useParams();
  const { ofertas, loading, error } = useOfertas();

  const oferta = useMemo(
    () =>
      ofertas.find((item) => item.slug === slug || String(item.id) === slug),
    [ofertas, slug]
  );

  const preciosOrdenados = useMemo(() => {
    return [...(oferta?.precios || [])].sort(
      (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
    );
  }, [oferta]);

  const actividadesIncluidas = useMemo(() => {
    return (oferta?.actividades || [])
      .map((item) => item.actividad)
      .filter(Boolean);
  }, [oferta]);

  const destinosExtras = useMemo(() => {
    return (oferta?.destinos || [])
      .map((item) => item.destino)
      .filter(Boolean);
  }, [oferta]);

  if (loading) {
    return (
      <main>
        <p className="section-state">Cargando oferta...</p>
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

  if (!oferta) {
    return (
      <main>
        <p className="section-state">No encontramos esta oferta.</p>
        <Link className="primary" to="/ofertas">
          Volver a ofertas
        </Link>
      </main>
    );
  }

  const offerImages = getOfferImages(oferta);
  const heroImage = offerImages[0] || fallbackDeal;
  const destinoPrincipal = oferta.destino?.nombre || "Destino";
  const whatsappMessage = `Hola! Quiero reservar la salida ${oferta.titulo} para ${destinoPrincipal}.`;
  const whatsappLink = getWhatsappLink(whatsappMessage);

  return (
    <main className="detail-page">
      <section
        className="detail-hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="detail-hero-overlay">
          <div className="detail-hero-content">
            <Link className="detail-back" to="/ofertas">
              Volver a ofertas
            </Link>
            <p className="detail-kicker">Oferta</p>
            <h1>{oferta.titulo}</h1>
            <p>{destinoPrincipal}</p>
            <div className="detail-hero-meta">
              <span>Noches: {oferta.noches}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-cta">
        <a
          className="detail-whatsapp"
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          Consultar por WhatsApp
        </a>
      </section>

      <section className="detail-section">
        <div className="detail-grid">
          <article className="detail-card">
            <h3>Detalle de la oferta</h3>
            <p>{oferta.condiciones || "Consultanos para mas info."}</p>
            {oferta.noIncluye ? (
              <p>No incluye: {oferta.noIncluye}</p>
            ) : null}
          </article>
          <article className="detail-card">
            <h3>Que incluye</h3>
            {oferta.incluyeItems?.length ? (
              <ul className="detail-list detail-list--icons">
                {oferta.incluyeItems.map((item) => (
                  <li key={item.id}>
                    <span className="detail-icon">{getIncluyeIcon(item.tipo)}</span>
                    <span className="detail-list-text">
                      <strong>{formatIncluyeTipo(item.tipo)}:</strong>{" "}
                      {item.descripcion}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Consultanos para conocer el detalle del paquete.</p>
            )}
          </article>
        </div>
      </section>

      <section className="detail-section">
        <article className="detail-card">
          <h3>Fechas disponibles</h3>
          {preciosOrdenados.length ? (
            <div className="detail-table">
              {preciosOrdenados.map((precio) => (
                <div className="detail-table-row" key={precio.id}>
                  <span>
                    {formatDate(precio.fechaInicio)} -{" "}
                    {formatDate(precio.fechaFin)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>Fechas a confirmar. Te asesoramos por WhatsApp.</p>
          )}
        </article>
      </section>

      {destinosExtras.length ? (
        <section className="detail-section">
          <article className="detail-card">
            <h3>Destinos incluidos</h3>
            <ul className="detail-list">
              {destinosExtras.map((destino) => {
                const destinoSlug = destino.slug || destino.id;
                return (
                  <li key={destino.id}>
                    <Link to={`/destinos/${destinoSlug}`}>
                      {destino.nombre}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </article>
        </section>
      ) : null}

      {actividadesIncluidas.length ? (
        <section className="grid-section">
          <div className="section-header">
            <h2>Excursiones incluidas</h2>
            <p>Experiencias recomendadas para este paquete.</p>
          </div>
          <div className="grid">
            {actividadesIncluidas.map((actividad) => {
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
        </section>
      ) : null}
    </main>
  );
}

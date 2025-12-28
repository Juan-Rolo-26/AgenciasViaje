import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import { formatCurrency, formatDate, getPrecioVigente } from "../utils/formatters.js";

export default function OfertaDetail() {
  const { slug } = useParams();
  const { ofertas, loading, error } = useTravelData();

  const oferta = useMemo(
    () =>
      ofertas.find((item) => item.slug === slug || String(item.id) === slug),
    [ofertas, slug]
  );

  const precioVigente = getPrecioVigente(oferta?.precios || []);
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

  const heroImage = oferta.destino?.imagenPortada || fallbackDeal;
  const destinoPrincipal = oferta.destino?.nombre || "Destino destacado";

  return (
    <main className="detail-page">
      <section
        className="detail-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
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
              {precioVigente ? (
                <span>
                  {formatCurrency(precioVigente.precio, precioVigente.moneda)}
                </span>
              ) : (
                <span>Precio a consultar</span>
              )}
              <span>Noches: {oferta.noches}</span>
              <span>Cupos: {oferta.cupos}</span>
            </div>
          </div>
        </div>
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
              <ul className="detail-list">
                {oferta.incluyeItems.map((item) => (
                  <li key={item.id}>
                    {item.tipo}: {item.descripcion}
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
          <h3>Fechas y precios</h3>
          {preciosOrdenados.length ? (
            <div className="detail-table">
              {preciosOrdenados.map((precio) => (
                <div className="detail-table-row" key={precio.id}>
                  <span>
                    {formatDate(precio.fechaInicio)} -{" "}
                    {formatDate(precio.fechaFin)}
                  </span>
                  <strong>
                    {formatCurrency(precio.precio, precio.moneda)}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <p>Precio a consultar. Te asesoramos por WhatsApp.</p>
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
        </section>
      ) : null}
    </main>
  );
}

import { useTravelData } from "../hooks/useTravelData.js";
import {
  formatCurrency,
  formatDate,
  getPrecioVigente
} from "../utils/formatters.js";

export default function Ofertas() {
  const { ofertas, loading, error } = useTravelData();

  return (
    <main>
      <section className="grid-section offers-section">
        <div className="section-header">
          <h2>Ofertas diseñadas para vos</h2>
          <p>
            Promociones con fechas flexibles y beneficios exclusivos. Explorá
            propuestas en tendencia y aprovechá nuestros combos favoritos.
          </p>
        </div>
        {loading ? (
          <p className="section-state">Cargando ofertas...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : ofertas.length === 0 ? (
          <p className="section-state">No hay ofertas disponibles.</p>
        ) : (
          <div className="offer-grid">
            {ofertas.map((oferta) => {
              const precio = getPrecioVigente(oferta.precios);
              return (
                <article className="offer-card" key={oferta.id}>
                  <div className="offer-header">
                    <span className="offer-tag">
                      {oferta.destino?.nombre || "Destino destacado"}
                    </span>
                    <h3>{oferta.titulo}</h3>
                  </div>
                  <p className="offer-description">
                    {oferta.condiciones || oferta.noIncluye || "Consultanos"}
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
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

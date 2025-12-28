import { useMemo } from "react";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import {
  formatCurrency,
  getPrecioVigente,
  parseAmount
} from "../utils/formatters.js";

export default function Destinos() {
  const { destinos, ofertas, loading, error } = useTravelData();

  const ofertaPorDestino = useMemo(() => {
    const map = new Map();
    ofertas.forEach((oferta) => {
      const destinoId = oferta.destino?.id;
      if (!destinoId) {
        return;
      }
      const precioVigente = getPrecioVigente(oferta.precios);
      const amount = parseAmount(precioVigente?.precio);
      if (!precioVigente || amount === null) {
        return;
      }
      const current = map.get(destinoId);
      if (!current || amount < current.amount) {
        map.set(destinoId, {
          precio: precioVigente,
          amount,
          titulo: oferta.titulo
        });
      }
    });
    return map;
  }, [ofertas]);

  return (
    <main>
      <section className="grid-section">
        <div className="section-header">
          <h2>Destinos inolvidables</h2>
          <p>Inspiración para tu próxima aventura con guías y tips locales.</p>
        </div>
        {loading ? (
          <p className="section-state">Cargando destinos...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : destinos.length === 0 ? (
          <p className="section-state">No hay destinos disponibles.</p>
        ) : (
          <div className="grid destination-grid">
            {destinos.map((destino, index) => {
              const oferta = ofertaPorDestino.get(destino.id);
              return (
                <article
                  className="tile destination-card"
                  key={destino.id}
                  style={{ "--delay": `${index * 70}ms` }}
                >
                  <div
                    className="tile-image"
                    style={{
                      backgroundImage: destino.imagenPortada
                        ? `url(${destino.imagenPortada})`
                        : `url(${fallbackDeal})`
                    }}
                  ></div>
                  <div className="tile-content">
                    <h4>{destino.nombre}</h4>
                    <p className="destination-price">
                      {oferta
                        ? formatCurrency(
                            oferta.precio.precio,
                            oferta.precio.moneda
                          )
                        : "Precio a consultar"}
                    </p>
                    <span className="destination-meta">
                      {oferta?.titulo ||
                        destino.paisRegion ||
                        "Consultanos"}
                    </span>
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

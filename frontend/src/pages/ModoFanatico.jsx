import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { resolveAssetUrl } from "../utils/assetUrl.js";
import { FANATIC_ITEMS } from "../utils/modoFanaticoData.js";
import { apiRequest } from "../api/api.js";

export default function ModoFanatico() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/api/modo-fanatico")
      .then((data) => {
        // If DB has items, use them; otherwise fallback to static data
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(FANATIC_ITEMS);
        }
      })
      .catch(() => setItems(FANATIC_ITEMS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-kicker">
            Modo <span className="topotours-word">fanático</span>
          </span>
          <h2>Eventos deportivos y experiencias únicas</h2>
          <p>
            Viví el deporte como un verdadero hincha con salidas temáticas,
            entradas y propuestas exclusivas.
          </p>
        </div>
      </section>

      <section className="grid-section">
        <div className="section-header">
          <h2>Modo fanático</h2>
          <p>Explorá experiencias pensadas para hinchas.</p>
        </div>
        <div className="grid destination-grid grid-3x3">
          {loading ? (
            <p className="section-state">Cargando...</p>
          ) : (
            items.map((item) => {
              const heroImage = resolveAssetUrl(item.imagenPortada) || fallbackDeal;
              return (
                <Link
                  className="tile destination-card premium-card salidas-card"
                  key={item.slug}
                  to={`/modo-fanatico/${item.slug}`}
                >
                  <div
                    className="tile-image"
                    style={{ backgroundImage: `url("${heroImage}")` }}
                  ></div>
                  <div className="tile-content">
                    <h4>{item.nombre}</h4>
                    <span className="destination-meta">Modo fanático</span>

                    <div className="card-prices">
                      <span className="price-label">Desde</span>
                      <div className="prices-wrapper">
                        <span className="price-ars">
                          {item.precioPesos
                            ? `ARS $${Number(item.precioPesos).toLocaleString("es-AR")}`
                            : (item.precio
                              ? `ARS $${Number(item.precio).toLocaleString("es-AR")}`
                              : "Consultar")}
                        </span>
                        {item.precioDolares ? (
                          <span className="price-usd">
                            {`USD $${Number(item.precioDolares).toLocaleString("es-AR")}`}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <span className="card-cta">Ver experiencia</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

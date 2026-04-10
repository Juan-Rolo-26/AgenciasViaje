import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { resolveAssetUrl } from "../utils/assetUrl.js";
import { FANATIC_ITEMS } from "../utils/modoFanaticoData.js";

export default function ModoFanatico() {
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
          {FANATIC_ITEMS.map((item) => {
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
                  <span className="card-cta">Ver experiencia</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

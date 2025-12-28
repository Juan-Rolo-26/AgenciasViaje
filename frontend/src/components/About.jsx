import "./About.css";
import logo from "../assets/logo.png";

export default function About() {
  return (
    <section className="about-section" id="nosotros">
      <div className="about-header">
        <h2>Sobre nosotros</h2>
        <p>
          Disenamos viajes a medida con asesoramiento real, proveedores
          seleccionados y acompanamiento en cada etapa del recorrido.
        </p>
      </div>

      <div className="about-card">
        <div className="about-content">
          <h3>
            <span className="topotours-word">Topotours</span>, viajes con
            respaldo real
          </h3>
          <p className="about-description">
            Acompanamos cada etapa del viaje: desde la inspiracion inicial hasta
            la experiencia en destino. Nuestro equipo analiza opciones, ajusta
            itinerarios y coordina cada detalle para que viajes con total
            tranquilidad.
          </p>

          <ul className="about-list">
            <li>
              <span className="badge">01</span>
              <div>
                <strong>Asesoramiento experto</strong>
                <p>
                  Recomendaciones reales basadas en experiencia y conocimiento
                  local.
                </p>
              </div>
            </li>

            <li>
              <span className="badge">02</span>
              <div>
                <strong>Itinerarios a medida</strong>
                <p>Viajes disenados segun tus gustos, tiempos y presupuesto.</p>
              </div>
            </li>

            <li>
              <span className="badge">03</span>
              <div>
                <strong>Soporte en cada etapa</strong>
                <p>
                  Antes, durante y despues del viaje. Siempre estamos presentes.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="about-image">
          <img src={logo} alt="Topotours" />
        </div>
      </div>

      <div className="about-card about-card-secondary">
        <div className="about-content">
          <h3>
            Sobre <span className="topotours-word">Topotours</span>
          </h3>
          <p className="about-description">
            Somos un equipo de especialistas en viajes premium con foco en la
            atencion personalizada y en crear experiencias memorables.
          </p>

          <ul className="about-checklist">
            <li>
              <span className="check-icon">*</span>
              <div>
                <strong>Asesoria dedicada</strong>
                <p>Te acompanamos de forma personalizada en todo el proceso.</p>
              </div>
            </li>

            <li>
              <span className="check-icon">OK</span>
              <div>
                <strong>Calidad garantizada</strong>
                <p>
                  Trabajamos solo con proveedores que cumplen estandares
                  premium.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="about-image">
          <img src={logo} alt="Topotours" />
        </div>
      </div>
    </section>
  );
}

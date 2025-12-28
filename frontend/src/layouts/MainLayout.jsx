import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
import { getWhatsappLink } from "../utils/contactLinks.js";

const navLinkClass = ({ isActive }) =>
  `nav-item${isActive ? " active" : ""}`;

export default function MainLayout() {
  const asesorWhatsappLink = getWhatsappLink(
    "Hola! Quiero hablar con un asesor. Me pueden ayudar?"
  );

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          <Link className="nav-logo" to="/" aria-label="Ir al inicio">
            <img src={logo} alt="Topotours" />
            <div className="brand-text">
              <span className="brand-name topotours-word">Topotours</span>
              <span className="brand-sub">Agencia de Viajes</span>
            </div>
          </Link>

          <nav className="nav-main" aria-label="Navegación principal">
            <NavLink className={navLinkClass} to="/destinos">
              <span className="nav-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 2C8 2 5 5.1 5 9.2c0 4.9 6 12.6 6.3 13 .4.5 1 .5 1.4 0 .3-.4 6.3-8.1 6.3-13C19 5.1 16 2 12 2Zm0 9.7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Destinos
            </NavLink>

            <NavLink className={navLinkClass} to="/ofertas">
              <span className="nav-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 2c1.9 2.1 2.8 4.1 2.8 6.1 0 1.1-.3 2.1-.9 3 .9-.3 2-.9 2.8-2.1 1.8 2.1 2.3 4 2.3 5.6 0 3.6-2.9 6.4-7 6.4s-7-2.8-7-6.4c0-2.6 1.4-4.7 3.6-6.6.3 1.7 1.1 2.8 2.2 3.6-.1-.4-.2-.9-.2-1.4 0-2 1.1-4.5 4.4-8.2Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Ofertas
            </NavLink>

            <NavLink className={navLinkClass} to="/excursiones">
              <span className="nav-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 4a6 6 0 0 0-6 6c0 4.2 4.7 8.7 5.4 9.3a1 1 0 0 0 1.2 0c.7-.6 5.4-5.1 5.4-9.3a6 6 0 0 0-6-6Zm0 7.8A1.8 1.8 0 1 1 12 8a1.8 1.8 0 0 1 0 3.6ZM19.5 18.5a1 1 0 0 1-1.4 1.4l-1.7-1.7a1 1 0 1 1 1.4-1.4l1.7 1.7Zm-13.9 0 1.7-1.7a1 1 0 1 1 1.4 1.4l-1.7 1.7a1 1 0 0 1-1.4-1.4Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Excursiones
            </NavLink>

            <NavLink className={navLinkClass} to="/calendario">
              <span className="nav-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm14 8H3v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-9Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Calendario
            </NavLink>

            <NavLink className={navLinkClass} to="/asistencia">
              <span className="nav-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h1v-4H8a1 1 0 0 1-1-1V10a5 5 0 1 1 10 0v2a1 1 0 0 1-1 1h-1v4h1a3 3 0 0 0 3-3v-4a7 7 0 0 0-7-7Zm-1 14h2a2 2 0 0 1 0 4h-2a2 2 0 1 1 0-4Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Asistencia
            </NavLink>
          </nav>

          <div className="nav-cta">
            <a
              className="cta-button"
              href={asesorWhatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              Hablar con un asesor
            </a>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-col footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="Topotours" />
              <div>
                <strong className="topotours-word">Topotours</strong>
                <span>Agencia de Viajes</span>
              </div>
            </div>
            <p className="footer-description">
              Diseñamos viajes memorables con atención personalizada. Nos
              ocupamos de cada detalle para que solo tengas que disfrutar.
            </p>
          </div>

          <div className="footer-col">
            <h4>Navegación</h4>
            <ul className="footer-links">
              <li>
                <Link to="/destinos">Destinos</Link>
              </li>
              <li>
                <Link to="/ofertas">Ofertas</Link>
              </li>
              <li>
                <Link to="/excursiones">Excursiones</Link>
              </li>
              <li>
                <Link to="/calendario">Calendario</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-contact">
            <h4>Contacto</h4>
            <ul className="footer-info">
              <li>
                <a
                  className="footer-contact-button"
                  href="mailto:topotoursviajes@gmail.com"
                  aria-label="Enviar mail a Topotours"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm2 .5 6 4.2 6-4.2H6Zm12 1.8-6 4.2-6-4.2V18h12V8.3Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  className="footer-contact-button"
                  href="tel:3518785667"
                  aria-label="Llamar a Topotours"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M6.2 2.8c.5-.5 1.2-.7 1.9-.4l2.2.9c.7.3 1.1 1 .9 1.7l-.6 2.4a1.3 1.3 0 0 1-1.3 1c-.4 0-.8-.1-1.1-.3l-.6-.3a14.5 14.5 0 0 0 6.6 6.6l.3-.6c.3-.7 1-1 1.7-.9l2.4.6c.7.2 1.2.9 1 1.6l-.6 2.3c-.2.7-.9 1.2-1.6 1.2C9.8 20.6 3.4 14.2 3.4 6.6c0-.7.5-1.4 1.2-1.6l1.6-.6Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  className="footer-contact-button"
                  href="https://instagram.com/topotoursviajes"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram de Topotours"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 7.4A4.6 4.6 0 1 0 12 16.6 4.6 4.6 0 0 0 12 7.4Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z"
                      fill="currentColor"
                    />
                    <path
                      d="M16.8 3H7.2A4.2 4.2 0 0 0 3 7.2v9.6A4.2 4.2 0 0 0 7.2 21h9.6a4.2 4.2 0 0 0 4.2-4.2V7.2A4.2 4.2 0 0 0 16.8 3Zm2.6 13.8a2.6 2.6 0 0 1-2.6 2.6H7.2a2.6 2.6 0 0 1-2.6-2.6V7.2a2.6 2.6 0 0 1 2.6-2.6h9.6a2.6 2.6 0 0 1 2.6 2.6v9.6Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Oficina</h4>
            <p className="footer-address">
              9 de Julio 151 – Galería Libertad, Local 5
              <br />
              Córdoba, Argentina
            </p>
            <div className="footer-badge">
              <span>Agencia habilitada</span>
              <strong>Legajo N° 19929</strong>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()}{" "}
            <strong className="topotours-word">Topotours</strong>. Todos los
            derechos reservados.
          </span>
        </div>
      </footer>
    </>
  );
}

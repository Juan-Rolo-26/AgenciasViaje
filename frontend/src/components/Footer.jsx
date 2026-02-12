import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Topotours</h3>
            <ul>
              <li><Link to="/nosotros">Quiénes somos</Link></li>
              <li><Link to="/terminos">Términos y condiciones</Link></li>
              <li><Link to="/privacidad">Privacidad</Link></li>
              <li><Link to="/blog">Blog de viajes</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Soporte</h3>
            <ul>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/faq">Preguntas frecuentes</Link></li>
              <li><Link to="/documentacion">Documentación</Link></li>
              <li><a href="https://wa.me/5493512345678" target="_blank" rel="noreferrer">WhatsApp</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Productos</h3>
            <ul>
              <li><Link to="/destinos">Destinos</Link></li>
              <li><Link to="/ofertas">Salidas Grupales</Link></li>
              <li><Link to="/cordoba">Excursiones</Link></li>
              <li><Link to="/modo-fanatico">Modo Fanático</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Seguinos</h3>
            <div className="social-links">
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Topotours EVT. Todos los derechos reservados.</p>
          <div className="payment-icons">
            {/* Simple visual representation of payment - could be SVGs */}
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

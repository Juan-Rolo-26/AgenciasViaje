import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { apiRequest } from "../api/api.js";
import { getWhatsappLink } from "../utils/contactLinks.js";

const navLinkClass = ({ isActive }) =>
  `nav-item${isActive ? " active" : ""}`;

const continentLinks = [
  { id: "america", label: "America" },
  { id: "europa", label: "Europa" },
  { id: "asia", label: "Asia" },
  { id: "africa", label: "Africa" }
];

const offerLinks = [
  { id: "salidas-grupales", label: "Salidas grupales" },
  { id: "eventos", label: "Eventos" },
  { id: "eventos-deportivos", label: "Eventos deportivos" },
  { id: "paquetes-nacionales", label: "Paquetes nacionales" }
];

const excursionLinks = [
  { id: "nacionales", label: "Excursiones nacionales" },
  { id: "internacionales", label: "Excursiones internacionales" }
];

export default function MainLayout() {
  const location = useLocation();
  const asesorWhatsappLink = getWhatsappLink(
    "Hola! Quiero hablar con un asesor. Me pueden ayudar?"
  );
  const [navOpen, setNavOpen] = useState(false);
  const [navSectionsOpen, setNavSectionsOpen] = useState({
    destinos: false,
    ofertas: false,
    excursiones: false
  });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const initialMessages = useMemo(
    () => [
      {
        id: "intro",
        role: "assistant",
        text:
          "Hola, soy Topix IA 👋 Trabajo con la info real de Topotours para ayudarte a elegir destino, fechas y presupuesto."
      }
    ],
    []
  );
  const [assistantMessages, setAssistantMessages] =
    useState(initialMessages);
  const [assistantDraft, setAssistantDraft] = useState("");
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [assistantError, setAssistantError] = useState("");

  const buildHistoryPayload = (messages) =>
    messages
      .filter(
        (message) => message.role === "user" || message.role === "assistant"
      )
      .slice(-6)
      .map((message) => ({ role: message.role, content: message.text }));

  const toggleAssistant = () => {
    setAssistantOpen((prev) => !prev);
  };

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  const toggleNav = () => {
    setNavOpen((prev) => !prev);
  };

  const closeNav = () => {
    setNavOpen(false);
  };

  const toggleNavSection = (sectionKey) => {
    setNavSectionsOpen((prev) => {
      const shouldOpen = !prev[sectionKey];
      return {
        destinos: false,
        ofertas: false,
        excursiones: false,
        [sectionKey]: shouldOpen
      };
    });
  };

  const closeAssistant = () => {
    setAssistantOpen(false);
  };

  useEffect(() => {
    if (!navOpen) {
      setNavSectionsOpen({
        destinos: false,
        ofertas: false,
        excursiones: false
      });
    }
  }, [navOpen]);

  const resetAssistant = () => {
    setAssistantMessages(initialMessages);
    setAssistantDraft("");
    setAssistantError("");
    setAssistantBusy(false);
  };

  const handleAssistantSubmit = async (event) => {
    event.preventDefault();
    if (assistantBusy) {
      return;
    }
    const message = assistantDraft.trim();
    if (!message) {
      return;
    }
    const stamp = Date.now();
    const pendingId = `${stamp}-assistant`;
    const history = buildHistoryPayload(assistantMessages);
    setAssistantMessages((prev) => [
      ...prev,
      { id: `${stamp}-user`, role: "user", text: message },
      {
        id: pendingId,
        role: "assistant",
        text: "Estoy pensando en respuestas... puede demorar unos minutos."
      }
    ]);
    setAssistantDraft("");
    setAssistantBusy(true);
    setAssistantError("");

    try {
      const response = await apiRequest("/api/assistant", {
        method: "POST",
        body: {
          message,
          history
        }
      });
      const replyText =
        response?.reply ||
        "No pude generar una respuesta en este momento. Queres intentar otra vez?";
      setAssistantMessages((prev) =>
        prev.map((item) =>
          item.id === pendingId ? { ...item, text: replyText } : item
        )
      );
    } catch (error) {
      const rawMessage =
        typeof error?.message === "string" ? error.message.trim() : "";
      let parsedMessage = "";
      if (rawMessage.startsWith("{") && rawMessage.endsWith("}")) {
        try {
          const parsed = JSON.parse(rawMessage);
          parsedMessage =
            typeof parsed?.error === "string" ? parsed.error : "";
        } catch (parseError) {
          parsedMessage = "";
        }
      }
      const errorMessage = parsedMessage || rawMessage || "Error de conexion.";
      const fallback =
        "Ahora mismo no puedo conectarme con Topix IA. Podes intentar mas tarde o hablar con un asesor.";
      setAssistantMessages((prev) =>
        prev.map((item) =>
          item.id === pendingId ? { ...item, text: fallback } : item
        )
      );
      setAssistantError(errorMessage);
    } finally {
      setAssistantBusy(false);
    }
  };

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

          <button
            className={`nav-toggle${navOpen ? " is-open" : ""}`}
            type="button"
            onClick={toggleNav}
            aria-label={navOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={navOpen}
            aria-controls="primary-navigation"
          >
            <span className="nav-toggle-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <nav
            className={`nav-main${navOpen ? " is-open" : ""}`}
            id="primary-navigation"
            aria-label="Navegación principal"
          >
            <div
              className={`nav-item-group${
                navSectionsOpen.destinos ? " is-expanded" : ""
              }`}
            >
              <div className="nav-item-row">
                <NavLink
                  className={navLinkClass}
                  to="/destinos"
                  onClick={closeNav}
                >
                  <span className="nav-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 2C8 2 5 5.1 5 9.2c0 4.9 6 12.6 6.3 13 .4.5 1 .5 1.4 0 .3-.4 6.3-8.1 6.3-13C19 5.1 16 2 12 2Zm0 9.7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  Destinos
                  <span className="nav-caret" aria-hidden="true">
                    <svg viewBox="0 0 12 12">
                      <path
                        d="M2 4.5l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </NavLink>
                <button
                  className="nav-group-toggle"
                  type="button"
                  aria-label="Mostrar secciones de destinos"
                  aria-expanded={navSectionsOpen.destinos}
                  aria-controls="nav-dropdown-destinos"
                  onClick={() => toggleNavSection("destinos")}
                >
                  <span className="nav-caret-icon" aria-hidden="true">
                    <svg viewBox="0 0 12 12">
                      <path
                        d="M2 4.5l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              <div
                className="nav-dropdown"
                role="menu"
                aria-label="Continentes"
                id="nav-dropdown-destinos"
              >
                {continentLinks.map((continent) => (
                  <Link
                    key={continent.id}
                    className="nav-dropdown-item"
                    to={`/destinos?continente=${continent.id}`}
                    onClick={closeNav}
                  >
                    {continent.label}
                  </Link>
                ))}
              </div>
            </div>

            <div
              className={`nav-item-group${
                navSectionsOpen.ofertas ? " is-expanded" : ""
              }`}
            >
              <div className="nav-item-row">
                <NavLink
                  className={navLinkClass}
                  to="/ofertas"
                  onClick={closeNav}
                >
                  <span className="nav-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 2c1.9 2.1 2.8 4.1 2.8 6.1 0 1.1-.3 2.1-.9 3 .9-.3 2-.9 2.8-2.1 1.8 2.1 2.3 4 2.3 5.6 0 3.6-2.9 6.4-7 6.4s-7-2.8-7-6.4c0-2.6 1.4-4.7 3.6-6.6.3 1.7 1.1 2.8 2.2 3.6-.1-.4-.2-.9-.2-1.4 0-2 1.1-4.5 4.4-8.2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  Ofertas
                  <span className="nav-caret" aria-hidden="true">
                    <svg viewBox="0 0 12 12">
                      <path
                        d="M2 4.5l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </NavLink>
                <button
                  className="nav-group-toggle"
                  type="button"
                  aria-label="Mostrar secciones de ofertas"
                  aria-expanded={navSectionsOpen.ofertas}
                  aria-controls="nav-dropdown-ofertas"
                  onClick={() => toggleNavSection("ofertas")}
                >
                  <span className="nav-caret-icon" aria-hidden="true">
                    <svg viewBox="0 0 12 12">
                      <path
                        d="M2 4.5l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              <div
                className="nav-dropdown"
                role="menu"
                aria-label="Secciones de ofertas"
                id="nav-dropdown-ofertas"
              >
                {offerLinks.map((section) => (
                  <Link
                    key={section.id}
                    className="nav-dropdown-item"
                    to={`/ofertas?seccion=${section.id}`}
                    onClick={closeNav}
                  >
                    {section.label}
                  </Link>
                ))}
              </div>
            </div>

            <div
              className={`nav-item-group${
                navSectionsOpen.excursiones ? " is-expanded" : ""
              }`}
            >
              <div className="nav-item-row">
                <NavLink
                  className={navLinkClass}
                  to="/excursiones"
                  onClick={closeNav}
                >
                  <span className="nav-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 4a6 6 0 0 0-6 6c0 4.2 4.7 8.7 5.4 9.3a1 1 0 0 0 1.2 0c.7-.6 5.4-5.1 5.4-9.3a6 6 0 0 0-6-6Zm0 7.8A1.8 1.8 0 1 1 12 8a1.8 1.8 0 0 1 0 3.6ZM19.5 18.5a1 1 0 0 1-1.4 1.4l-1.7-1.7a1 1 0 1 1 1.4-1.4l1.7 1.7Zm-13.9 0 1.7-1.7a1 1 0 1 1 1.4 1.4l-1.7 1.7a1 1 0 0 1-1.4-1.4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  Excursiones
                  <span className="nav-caret" aria-hidden="true">
                    <svg viewBox="0 0 12 12">
                      <path
                        d="M2 4.5l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </NavLink>
                <button
                  className="nav-group-toggle"
                  type="button"
                  aria-label="Mostrar secciones de excursiones"
                  aria-expanded={navSectionsOpen.excursiones}
                  aria-controls="nav-dropdown-excursiones"
                  onClick={() => toggleNavSection("excursiones")}
                >
                  <span className="nav-caret-icon" aria-hidden="true">
                    <svg viewBox="0 0 12 12">
                      <path
                        d="M2 4.5l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              <div
                className="nav-dropdown"
                role="menu"
                aria-label="Secciones de excursiones"
                id="nav-dropdown-excursiones"
              >
                {excursionLinks.map((section) => (
                  <Link
                    key={section.id}
                    className="nav-dropdown-item"
                    to={`/excursiones?seccion=${section.id}`}
                    onClick={closeNav}
                  >
                    {section.label}
                  </Link>
                ))}
              </div>
            </div>

            <NavLink
              className={navLinkClass}
              to="/calendario"
              onClick={closeNav}
            >
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

            <NavLink
              className={navLinkClass}
              to="/asistencia"
              onClick={closeNav}
            >
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

          <div className={`nav-cta${navOpen ? " is-open" : ""}`}>
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

      <div className="assistant-fab">
        <button
          className="assistant-fab-button"
          type="button"
          onClick={toggleAssistant}
          aria-label="Abrir asistente Topix"
          aria-expanded={assistantOpen}
          aria-controls="assistant-panel"
        >
          <img src={logo} alt="Topotours" />
          <span className="assistant-fab-badge">AI</span>
        </button>
        {assistantOpen ? (
          <div
            className="assistant-panel"
            id="assistant-panel"
            role="dialog"
            aria-label="Asistente Topix"
          >
            <div className="assistant-panel-header">
              <span className="assistant-panel-title">Topix IA</span>
              <div className="assistant-panel-actions">
                <button
                  className="assistant-panel-reset"
                  type="button"
                  onClick={resetAssistant}
                >
                  Reiniciar chat
                </button>
                <button
                  className="assistant-panel-close"
                  type="button"
                  onClick={closeAssistant}
                  aria-label="Cerrar asistente"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="assistant-panel-body">
              {assistantMessages.map((message) => (
                <div
                  key={message.id}
                  className={`assistant-message${
                    message.role === "user" ? " user" : ""
                  }`}
                >
                  {message.role === "assistant" ? (
                    <span className="assistant-avatar" aria-hidden="true">
                      <img src={logo} alt="" />
                    </span>
                  ) : null}
                  <div className="assistant-bubble">{message.text}</div>
                </div>
              ))}
            </div>
            <form
              className="assistant-panel-input"
              onSubmit={handleAssistantSubmit}
            >
              <input
                type="text"
                value={assistantDraft}
                onChange={(event) => setAssistantDraft(event.target.value)}
                placeholder="Escribi aca..."
                aria-label="Escribir mensaje"
                disabled={assistantBusy}
              />
              <button
                className="assistant-panel-send"
                type="submit"
                disabled={assistantBusy || !assistantDraft.trim()}
              >
                →
              </button>
            </form>
            <p className="assistant-panel-note">
              La IA responde solo con datos de la base de Topotours. Puede
              cometer errores, considera verificar la informacion.
            </p>
            {assistantError && import.meta.env.DEV ? (
              <p className="assistant-panel-error">{assistantError}</p>
            ) : null}
          </div>
        ) : null}
      </div>

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
              <li>
                <Link to="/politicas">Privacidad y cookies</Link>
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

import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "../assets/cruceros-redesign.css";
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

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];

const normalizeText = (value) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const extractLeadData = (text, prevLead) => {
  const normalized = normalizeText(text);
  const nextLead = { ...prevLead };

  if (!nextLead.people) {
    const totalMatch =
      normalized.match(/somos\s+(\d+)/) ||
      normalized.match(/(\d+)\s*(personas|pasajeros|adultos)/);
    if (totalMatch) {
      let label = `${totalMatch[1]} personas`;
      const kidsMatch = normalized.match(/(\d+)\s*(ninos|ninas)/);
      if (kidsMatch) {
        label = `${label} (${kidsMatch[1]} niños)`;
      }
      nextLead.people = label;
    }
  }

  if (!nextLead.transport) {
    const hasPlane =
      normalized.includes("avion") ||
      normalized.includes("aereo") ||
      normalized.includes("vuelo");
    const hasBus =
      normalized.includes("bus") || normalized.includes("micro");
    if (hasPlane && hasBus) {
      nextLead.transport = "Avion o bus";
    } else if (hasPlane) {
      nextLead.transport = "Avion";
    } else if (hasBus) {
      nextLead.transport = "Bus";
    }
  }

  if (!nextLead.budget) {
    const budgetMatch = normalized.match(
      /(presupuesto|hasta|maximo|maxima|tope|gastar|inversion)\s*(de|:)?\s*(\$?\s*\d[\d.,]*)\s*(usd|dolares|pesos|ars)?/
    );
    if (budgetMatch) {
      const amount = budgetMatch[3]?.replace(/\s+/g, "") || "";
      const currency = budgetMatch[4] ? budgetMatch[4].toUpperCase() : "";
      if (amount) {
        nextLead.budget = `${amount} ${currency}`.trim();
      }
    } else {
      const currencyMatch = normalized.match(
        /(\$|usd|dolares|pesos|ars)\s*(\d[\d.,]*)/
      );
      if (currencyMatch) {
        nextLead.budget = `${currencyMatch[2]} ${currencyMatch[1]}`.trim();
      }
    }
  }

  if (!nextLead.dates) {
    const dateMatch = normalized.match(
      /(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)/
    );
    if (dateMatch) {
      nextLead.dates = dateMatch[1];
    } else {
      const monthMatch = MONTHS.find((month) => normalized.includes(month));
      if (monthMatch) {
        const yearMatch = normalized.match(/\b(20\d{2})\b/);
        nextLead.dates = `${monthMatch}${yearMatch ? ` ${yearMatch[1]}` : ""}`;
      }
    }
  }

  if (!nextLead.destination) {
    const destinationMatch = text.match(
      /(destino|a|para|hacia)\s+([a-zA-ZÁÉÍÓÚÑáéíóúñ\s]{3,})/i
    );
    if (destinationMatch) {
      const raw = destinationMatch[2]
        .split(/[.,;!?]/)[0]
        .trim();
      const words = raw.split(/\s+/).filter(Boolean);
      const stopWords = new Set([
        "en",
        "para",
        "con",
        "por",
        "y",
        "desde",
        "hasta"
      ]);
      const selected = [];
      for (const word of words) {
        if (stopWords.has(normalizeText(word))) {
          break;
        }
        selected.push(word);
        if (selected.length >= 4) {
          break;
        }
      }
      if (selected.length) {
        nextLead.destination = selected.join(" ");
      }
    }
  }

  return nextLead;
};

const buildLeadWhatsappMessage = (lead, note, summary) => {
  const lines = [
    "Hola! Estuve hablando con Topix IA y quiero avanzar con un asesor."
  ];
  lines.push(`Destino: ${lead.destination || "Pendiente"}`);
  lines.push(`Personas: ${lead.people || "Pendiente"}`);
  lines.push(`Fechas: ${lead.dates || "Pendiente"}`);
  lines.push(`Presupuesto: ${lead.budget || "Pendiente"}`);
  lines.push(`Transporte: ${lead.transport || "Pendiente"}`);
  if (note) {
    lines.push(`Nota: ${note}`);
  }
  if (summary) {
    lines.push("", "Resumen del chat:", summary);
  }
  return lines.join("\n");
};

export default function MainLayout() {
  const location = useLocation();
  const isDestinosRoute = location.pathname.startsWith("/destinos");
  const asesorPhoneLink = getWhatsappLink(
    "Hola! Quiero hablar con un asesor. Me pueden ayudar?"
  );
  const [navOpen, setNavOpen] = useState(false);
  const [navSectionsOpen, setNavSectionsOpen] = useState({
    destinos: false
  });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantOverviewLoaded, setAssistantOverviewLoaded] =
    useState(false);
  const [assistantLead, setAssistantLead] = useState({
    people: "",
    destination: "",
    budget: "",
    dates: "",
    transport: ""
  });
  const [assistantReservationIntent, setAssistantReservationIntent] =
    useState(false);
  const [assistantReservationNote, setAssistantReservationNote] =
    useState("");
  const [assistantLeadReadyNotified, setAssistantLeadReadyNotified] =
    useState(false);
  const initialMessages = useMemo(
    () => [
      {
        id: "intro",
        role: "assistant",
        text:
          "Hola, soy Topix IA 👋 Trabajo con la info real de Topotours para ayudarte con destinos, fechas y opciones de viaje."
      }
    ],
    []
  );
  const [assistantMessages, setAssistantMessages] =
    useState(initialMessages);
  const [assistantDraft, setAssistantDraft] = useState("");
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [assistantError, setAssistantError] = useState("");
  const assistantLeadComplete = Object.values(assistantLead).every(Boolean);
  const assistantShowWhatsapp =
    assistantLeadComplete || assistantReservationIntent;
  const assistantSummary = useMemo(() => {
    const userMessages = assistantMessages
      .filter((message) => message.role === "user")
      .map((message) => message.text)
      .filter(Boolean)
      .slice(-6);
    return userMessages.join(" | ");
  }, [assistantMessages]);
  const assistantLeadWhatsappLink = assistantShowWhatsapp
    ? getWhatsappLink(
      buildLeadWhatsappMessage(
        assistantLead,
        assistantReservationNote,
        assistantSummary
      )
    )
    : "";

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

  useEffect(() => {
    if (!assistantOpen || assistantOverviewLoaded) {
      return;
    }
    let active = true;

    const loadOverview = async () => {
      setAssistantOverviewLoaded(true);
      try {
        const response = await apiRequest("/api/assistant/overview");
        const replyText = response?.reply;
        if (!active || !replyText) {
          return;
        }
        setAssistantMessages((prev) => [
          ...prev,
          {
            id: `overview-${Date.now()}`,
            role: "assistant",
            text: replyText
          }
        ]);
      } catch (error) {
        if (!active) {
          return;
        }
        setAssistantMessages((prev) => [
          ...prev,
          {
            id: `overview-${Date.now()}`,
            role: "assistant",
            text:
              "Ahora mismo no puedo traer el pantallazo de salidas y destinos. Si queres, contame que estas buscando."
          }
        ]);
      }
    };

    loadOverview();

    return () => {
      active = false;
    };
  }, [assistantOpen, assistantOverviewLoaded]);

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
        destinos: false
      });
    }
  }, [navOpen]);

  const resetAssistant = () => {
    setAssistantMessages(initialMessages);
    setAssistantDraft("");
    setAssistantError("");
    setAssistantBusy(false);
    setAssistantOverviewLoaded(false);
    setAssistantLead({
      people: "",
      destination: "",
      budget: "",
      dates: "",
      transport: ""
    });
    setAssistantReservationIntent(false);
    setAssistantReservationNote("");
    setAssistantLeadReadyNotified(false);
  };

  useEffect(() => {
    if (!assistantLeadComplete || assistantLeadReadyNotified) {
      return;
    }
    setAssistantMessages((prev) => [
      ...prev,
      {
        id: `lead-ready-${Date.now()}`,
        role: "assistant",
        text:
          "Ya tengo presupuesto, fechas, destino, personas y transporte. Para cerrar la venta, escribinos por WhatsApp y seguimos por ahi."
      }
    ]);
    setAssistantLeadReadyNotified(true);
  }, [assistantLeadComplete, assistantLeadReadyNotified]);

  const handleAssistantSubmit = async (event) => {
    event.preventDefault();
    if (assistantBusy) {
      return;
    }
    const message = assistantDraft.trim();
    if (!message) {
      return;
    }
    const normalizedMessage = normalizeText(message);
    if (
      normalizedMessage.includes("reservar") ||
      normalizedMessage.includes("reserva") ||
      normalizedMessage.includes("quiero reservar") ||
      normalizedMessage.includes("me gustaria reservar") ||
      normalizedMessage.includes("me gustaría reservar")
    ) {
      const stamp = Date.now();
      setAssistantReservationIntent(true);
      setAssistantReservationNote(message);
      setAssistantLead((prev) => extractLeadData(message, prev));
      setAssistantMessages((prev) => [
        ...prev,
        { id: `${stamp}-user`, role: "user", text: message },
        {
          id: `reservation-${stamp}`,
          role: "assistant",
          text:
            "Perfecto. Para reservar pasamos directo con un asesor por WhatsApp. Te dejo el boton para continuar."
        }
      ]);
      setAssistantDraft("");
      return;
    }
    setAssistantLead((prev) => extractLeadData(message, prev));
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
              className={`nav-item-group${navSectionsOpen.destinos ? " is-expanded" : ""
                }`}
            >
              <div className="nav-item-row">
                <button
                  className={`nav-item nav-item-button${isDestinosRoute ? " active" : ""
                    }`}
                  type="button"
                  aria-expanded={navSectionsOpen.destinos}
                  aria-controls="nav-dropdown-destinos"
                  onClick={() => toggleNavSection("destinos")}
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

            <NavLink
              className={navLinkClass}
              to="/ofertas?seccion=salidas-grupales"
              onClick={closeNav}
            >
              <span className="nav-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm10 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM7 13c-3 0-5 1.6-5 4v2h10v-2c0-2.4-2-4-5-4Zm10 0c-.7 0-1.3.1-1.9.3 1.2.9 1.9 2.1 1.9 3.7v2h6v-2c0-2.4-2-4-6-4Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Salidas grupales
            </NavLink>

            <NavLink
              className={navLinkClass}
              to="/cruceros"
              onClick={closeNav}
            >
              <span className="nav-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2" />
                  <line x1="12" y1="7" x2="12" y2="19" />
                  <line x1="6" y1="11" x2="18" y2="11" />
                  <path d="M5 19 Q12 23 19 19" />
                </svg>
              </span>
              Cruceros
            </NavLink>

            <NavLink
              className={navLinkClass}
              to="/modo-fanatico"
              onClick={closeNav}
            >
              <span className="nav-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 2 9.6 7.2 4 8l4 3.9-1 5.9L12 15l5 2.8-1-5.9 4-3.9-5.6-.8L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Modo fanático
            </NavLink>

            <NavLink
              className={navLinkClass}
              to="/argentina"
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
              Argentina
            </NavLink>

            <NavLink
              className={navLinkClass}
              to="/cordoba"
              onClick={closeNav}
            >
              <span className="nav-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 4a6 6 0 0 0-6 6c0 4.2 4.7 8.7 5.4 9.3a1 1 0 0 0 1.2 0c.7-.6 5.4-5.1 5.4-9.3a6 6 0 0 0-6-6Zm0 7.8A1.8 1.8 0 1 1 12 8a1.8 1.8 0 0 1 0 3.6Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Córdoba
            </NavLink>
          </nav>

          <div className={`nav-cta${navOpen ? " is-open" : ""}`}>
            <a
              className="cta-button"
              href={asesorPhoneLink}
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
                  className={`assistant-message${message.role === "user" ? " user" : ""
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
            <div className="assistant-panel-cta">
              <p>
                Cerrar venta con un agente de ventas por WhatsApp con toda la
                info del chat.
              </p>
              <a
                className="assistant-panel-whatsapp"
                href={
                  assistantLeadWhatsappLink ||
                  getWhatsappLink(
                    buildLeadWhatsappMessage(assistantLead, "", assistantSummary)
                  )
                }
                target="_blank"
                rel="noreferrer"
              >
                Cerrar venta con un agente
              </a>
            </div>
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
                <Link to="/ofertas?seccion=salidas-grupales">
                  Salidas grupales
                </Link>
              </li>
              <li>
                <Link to="/cruceros">Cruceros</Link>
              </li>
              <li>
                <Link to="/argentina">Argentina</Link>
              </li>
              <li>
                <Link to="/cordoba">Córdoba</Link>
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
                  href={asesorPhoneLink}
                  aria-label="WhatsApp de Topotours"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
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
              <a
                href="https://agenciasdeviajes.ar/qr/7249?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-qr-link"
                title="Ver legajo oficial en agenciasdeviajes.ar"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent("https://agenciasdeviajes.ar/qr/7249")}`}
                  alt="QR Legajo N° 19929"
                  className="footer-qr-img"
                />
              </a>
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

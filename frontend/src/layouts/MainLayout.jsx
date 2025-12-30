import { useMemo, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
import { useTravelData } from "../hooks/useTravelData.js";
import { formatCurrency, getPrecioVigente, parseAmount } from "../utils/formatters.js";
import { getWhatsappLink } from "../utils/contactLinks.js";

const navLinkClass = ({ isActive }) =>
  `nav-item${isActive ? " active" : ""}`;

export default function MainLayout() {
  const { destinos, ofertas, actividades, loading: travelLoading } =
    useTravelData();
  const asesorWhatsappLink = getWhatsappLink(
    "Hola! Quiero hablar con un asesor. Me pueden ayudar?"
  );
  const [assistantOpen, setAssistantOpen] = useState(false);
  const initialMessages = useMemo(
    () => [
      {
        id: "intro",
        role: "assistant",
        text:
          "Hola, soy Topix IA 👋 Trabajo con las ofertas reales de Topotours para ayudarte a elegir destino, fechas y presupuesto."
      }
    ],
    []
  );
  const [assistantMessages, setAssistantMessages] =
    useState(initialMessages);
  const [assistantDraft, setAssistantDraft] = useState("");
  const promptMessage =
    "Decime destino, fechas y cantidad de pasajeros para empezar.";

  const destinosNombres = useMemo(
    () => destinos.map((destino) => destino.nombre).filter(Boolean),
    [destinos]
  );
  const destinosRegiones = useMemo(
    () =>
      Array.from(
        new Set(destinos.map((destino) => destino.paisRegion).filter(Boolean))
      ),
    [destinos]
  );
  const actividadesNombres = useMemo(
    () => actividades.map((actividad) => actividad.nombre).filter(Boolean),
    [actividades]
  );

  const normalizeText = (value) => value.toLowerCase();

  const monthMap = [
    ["enero", 0],
    ["febrero", 1],
    ["marzo", 2],
    ["abril", 3],
    ["mayo", 4],
    ["junio", 5],
    ["julio", 6],
    ["agosto", 7],
    ["septiembre", 8],
    ["setiembre", 8],
    ["octubre", 9],
    ["noviembre", 10],
    ["diciembre", 11]
  ];

  const parseMonth = (value) => {
    const found = monthMap.find(([name]) => value.includes(name));
    if (!found) {
      return null;
    }
    return { name: found[0], index: found[1] };
  };

  const parseDuration = (value) => {
    const match = value.match(/(\d+)\s*(noches|noche|dias|días|dia|día)/);
    if (match) {
      return Number(match[1]);
    }
    if (value.includes("fin de semana")) {
      return 2;
    }
    return null;
  };

  const parseTripStyle = (value) => {
    if (value.includes("pareja") || value.includes("romant")) {
      return "pareja";
    }
    if (value.includes("familia")) {
      return "familia";
    }
    if (value.includes("amigos")) {
      return "amigos";
    }
    if (value.includes("solo") || value.includes("sola")) {
      return "solo";
    }
    return null;
  };

  const getOfferPriceAmount = (oferta) => {
    const precio = getPrecioVigente(oferta.precios);
    return parseAmount(precio?.precio);
  };

  const isMonthInRange = (startDate, endDate, monthIndex) => {
    if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
      return false;
    }
    if (!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) {
      return false;
    }
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    if (startMonth === endMonth) {
      return startMonth === monthIndex;
    }
    if (startMonth < endMonth) {
      return monthIndex >= startMonth && monthIndex <= endMonth;
    }
    return monthIndex >= startMonth || monthIndex <= endMonth;
  };

  const parseBudget = (value) => {
    const match = value.match(/(\d[\d.,]*)/);
    if (!match) {
      return null;
    }
    const cleaned = match[1].replace(/[^\d]/g, "");
    if (!cleaned) {
      return null;
    }
    return Number(cleaned);
  };

  const parsePeopleCount = (value) => {
    const match = value.match(/(\d+)\s*(personas|pasajeros|personas?)/);
    return match ? Number(match[1]) : null;
  };

  const getOfferDestinations = (oferta) =>
    [oferta.destino, ...(oferta.destinos || []).map((item) => item.destino)].filter(
      Boolean
    );

  const buildAssistantReply = (message) => {
    if (travelLoading) {
      return "Estoy cargando los datos del viaje. Proba de nuevo en unos segundos.";
    }

    const text = normalizeText(message);
    const wantsDestinations =
      text.includes("destinos") || text.includes("lugares");
    const wantsAll = text.includes("todos") || text.includes("todas");
    const wantsExcursions =
      text.includes("excursion") || text.includes("actividad");
    const wantsOffers =
      text.includes("oferta") ||
      text.includes("escapada") ||
      text.includes("paquete") ||
      text.includes("viaje");
    const wantsRecommendation =
      text.includes("recomenda") ||
      text.includes("suger") ||
      text.includes("aconseja");

    const budget = parseBudget(text);
    const budgetTier =
      text.includes("barato") || text.includes("economico")
        ? "low"
        : text.includes("premium") || text.includes("lujo")
          ? "high"
          : null;
    const people = parsePeopleCount(text);
    const isUSD = text.includes("usd") || text.includes("dolar");
    const duration = parseDuration(text);
    const month = parseMonth(text);
    const tripStyle = parseTripStyle(text);

    if (wantsDestinations && wantsAll) {
      if (!destinosNombres.length) {
        return "Todavia no tengo destinos cargados.";
      }
      const sample = destinosNombres.slice(0, 12).join(", ");
      const extra =
        destinosNombres.length > 12
          ? ` y ${destinosNombres.length - 12} mas`
          : "";
      return `Destinos disponibles: ${sample}${extra}. Podes verlos todos en /destinos.`;
    }

    if (wantsExcursions) {
      if (!actividadesNombres.length) {
        return "Todavia no tengo excursiones cargadas.";
      }
      const sample = actividadesNombres.slice(0, 10).join(", ");
      const extra =
        actividadesNombres.length > 10
          ? ` y ${actividadesNombres.length - 10} mas`
          : "";
      return `Excursiones disponibles: ${sample}${extra}.`;
    }

    if (wantsOffers || text.includes("precio") || wantsRecommendation) {
      const matchedDestinos = destinosNombres.filter((destino) =>
        text.includes(normalizeText(destino))
      );
      const matchedRegiones = destinosRegiones.filter((region) =>
        text.includes(normalizeText(region))
      );
      const wantsEuropa = text.includes("europa");

      let filtered = ofertas.filter((oferta) => oferta.activa !== false);
      if (matchedDestinos.length || matchedRegiones.length) {
        filtered = filtered.filter((oferta) => {
          const destinosOferta = getOfferDestinations(oferta);
          return destinosOferta.some((destino) => {
            const nombre = normalizeText(destino.nombre || "");
            const region = normalizeText(destino.paisRegion || "");
            return (
              matchedDestinos.some((match) => normalizeText(match) === nombre) ||
              matchedRegiones.some((match) => normalizeText(match) === region)
            );
          });
        });
      }

      if (wantsEuropa && !matchedDestinos.length && !matchedRegiones.length) {
        return "Por ahora no tengo ofertas para Europa. Queres que busque otra region?";
      }

      if (duration) {
        filtered = filtered.filter((oferta) => {
          if (!oferta.noches) {
            return true;
          }
          return Math.abs(oferta.noches - duration) <= 1;
        });
      }

      if (month) {
        filtered = filtered.filter((oferta) => {
          if (!oferta.precios?.length) {
            return false;
          }
          return oferta.precios.some((precio) => {
            const startDate = new Date(precio.fechaInicio);
            const endDate = new Date(precio.fechaFin);
            return isMonthInRange(startDate, endDate, month.index);
          });
        });
      }

      if (budget && !isUSD) {
        filtered = filtered.filter((oferta) => {
          const amount = getOfferPriceAmount(oferta);
          return amount !== null ? amount <= budget : true;
        });
      }

      const sorted = [...filtered].sort((a, b) => {
        const amountA = getOfferPriceAmount(a);
        const amountB = getOfferPriceAmount(b);
        if (amountA === null && amountB === null) {
          return 0;
        }
        if (amountA === null) {
          return 1;
        }
        if (amountB === null) {
          return -1;
        }
        return amountA - amountB;
      });

      if (budgetTier === "low" && sorted.length > 2) {
        const cutoff = Math.ceil(sorted.length / 3);
        filtered = sorted.slice(0, cutoff);
      } else if (budgetTier === "high" && sorted.length > 2) {
        const cutoff = Math.floor(sorted.length / 3);
        filtered = sorted.slice(cutoff);
      } else {
        filtered = sorted;
      }

      if (!filtered.length) {
        const fallback = ofertas
          .filter((oferta) => oferta.activa !== false)
          .sort((a, b) => {
            const amountA = getOfferPriceAmount(a);
            const amountB = getOfferPriceAmount(b);
            if (amountA === null && amountB === null) {
              return 0;
            }
            if (amountA === null) {
              return 1;
            }
            if (amountB === null) {
              return -1;
            }
            return amountA - amountB;
          })
          .slice(0, 3);

        if (month) {
          const monthLabel = month.name.charAt(0).toUpperCase() + month.name.slice(1);
          return [
            `No encontre disponibilidad exacta para ${monthLabel}.`,
            fallback.length
              ? `Te propongo alternativas similares: ${fallback
                  .map((oferta) => oferta.titulo)
                  .join(" · ")}.`
              : "Si queres, puedo buscar en otras fechas o destinos.",
            "Decime si queres ajustar presupuesto o fechas."
          ].join("\n");
        }

        return "No encontre ofertas con esos criterios. Queres que busque por otro destino o presupuesto?";
      }

      const sample = filtered.slice(0, 3).map((oferta) => {
        const precio = getPrecioVigente(oferta.precios);
        const precioLabel = precio
          ? formatCurrency(precio.precio, precio.moneda)
          : "Precio a consultar";
        const destinoLabels = getOfferDestinations(oferta)
          .map((destino) => destino.nombre)
          .filter(Boolean)
          .join(" / ");
        const nightsLabel = oferta.noches ? `${oferta.noches} noches` : "";
        const detailParts = [destinoLabels, nightsLabel].filter(Boolean).join(" · ");
        return `✈️ ${oferta.titulo}${detailParts ? ` (${detailParts})` : ""} — ${precioLabel}`;
      });

      const peopleNote = people ? ` para ${people} personas` : "";
      const durationNote = duration ? ` de ${duration} dias` : "";
      const monthNote = month ? ` en ${month.name}` : "";
      const styleNote = tripStyle ? ` ideal para ${tripStyle}` : "";

      if (budget && isUSD) {
        return [
          `Encontre estas opciones${peopleNote}${durationNote}${monthNote}${styleNote}:`,
          sample.join("\n"),
          "Los precios estan en ARS. Si queres, decime tu presupuesto en ARS para filtrar."
        ].join("\n");
      }

      return [
        `Encontre estas opciones${peopleNote}${durationNote}${monthNote}${styleNote}:`,
        sample.join("\n"),
        "Te paso mas detalles o coordinamos por WhatsApp?"
      ].join("\n");
    }

    return "Contame destino, fechas, presupuesto y con quien viajas. Asi puedo recomendarte opciones reales de la agencia.";
  };

  const toggleAssistant = () => {
    setAssistantOpen((prev) => {
      if (!prev) {
        setAssistantMessages((messages) =>
          messages.filter((message) => message.text !== promptMessage)
        );
      }
      return !prev;
    });
  };

  const closeAssistant = () => {
    setAssistantOpen(false);
  };

  const resetAssistant = () => {
    setAssistantMessages(initialMessages);
    setAssistantDraft("");
  };

  const handleAssistantSubmit = (event) => {
    event.preventDefault();
    const message = assistantDraft.trim();
    if (!message) {
      return;
    }
    const stamp = Date.now();
    const reply = buildAssistantReply(message);
    setAssistantMessages((prev) => [
      ...prev,
      { id: `${stamp}-user`, role: "user", text: message },
      { id: `${stamp}-assistant`, role: "assistant", text: reply }
    ]);
    setAssistantDraft("");
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
              />
              <button className="assistant-panel-send" type="submit">
                →
              </button>
            </form>
            <p className="assistant-panel-note">
              La IA puede cometer errores, considera verificar la informacion.
            </p>
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

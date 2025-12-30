import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import { getOfferImages } from "../utils/offerImages.js";

export default function Calendario() {
  const { ofertas, destinos, loading } = useTravelData();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [searchText, setSearchText] = useState("");
  const [monthOfferIndex, setMonthOfferIndex] = useState(0);

  const normalizeDate = (value) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const formatMonthLabel = (date) =>
    date.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const eventos = useMemo(() => {
    return ofertas.flatMap((oferta) =>
      (oferta.precios || []).map((precio) => {
        const images = getOfferImages(oferta);
        return {
          id: `${oferta.id}-${precio.id}`,
          titulo: oferta.titulo,
          fechaInicio: normalizeDate(precio.fechaInicio),
          fechaFin: normalizeDate(precio.fechaFin),
          destino: oferta.destino?.nombre || "",
          slug: oferta.slug || oferta.id,
          imagen: images[0] || oferta.destino?.imagenPortada || "",
          precio: precio.precio,
          moneda: precio.moneda
        };
      })
    );
  }, [ofertas]);

  const destinosDisponibles = useMemo(() => {
    return Array.from(
      new Set(destinos.map((destino) => destino.nombre).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [destinos]);

  const searchQuery = searchText.trim().toLowerCase();
  const eventosFiltrados = useMemo(() => {
    if (!searchQuery) {
      return eventos;
    }
    return eventos.filter((evento) => {
      const texto = `${evento.titulo} ${evento.destino}`.toLowerCase();
      return texto.includes(searchQuery);
    });
  }, [eventos, searchQuery]);

  const { gridDays, gridStart, gridEnd, monthStart, monthEnd } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const startOffset = (start.getDay() + 6) % 7;
    const startGrid = new Date(year, month, 1 - startOffset);
    const days = Array.from({ length: 42 }, (_, index) => {
      const day = new Date(startGrid);
      day.setDate(startGrid.getDate() + index);
      return day;
    });
    const endGrid = new Date(startGrid);
    endGrid.setDate(startGrid.getDate() + 41);
    return {
      gridDays: days,
      gridStart: normalizeDate(startGrid),
      gridEnd: normalizeDate(endGrid),
      monthStart: normalizeDate(start),
      monthEnd: normalizeDate(end)
    };
  }, [currentMonth]);

  const dayKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const eventosPorDia = useMemo(() => {
    const map = new Map();
    gridDays.forEach((day) => {
      map.set(dayKey(day), []);
    });

    eventosFiltrados.forEach((evento) => {
      if (evento.fechaFin < gridStart || evento.fechaInicio > gridEnd) {
        return;
      }
      const start = new Date(
        Math.max(evento.fechaInicio.getTime(), gridStart.getTime())
      );
      const end = new Date(
        Math.min(evento.fechaFin.getTime(), gridEnd.getTime())
      );
      for (
        let current = new Date(start);
        current <= end;
        current.setDate(current.getDate() + 1)
      ) {
        const key = dayKey(current);
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key).push(evento);
      }
    });

    return map;
  }, [eventosFiltrados, gridDays, gridStart, gridEnd]);

  const eventosDelMes = useMemo(() => {
    return eventosFiltrados
      .filter(
        (evento) =>
          evento.fechaFin >= monthStart && evento.fechaInicio <= monthEnd
      )
      .sort((a, b) => a.fechaInicio - b.fechaInicio);
  }, [eventosFiltrados, monthStart, monthEnd]);

  const totalEventosMes = eventosDelMes.length;
  const eventoMesActual = totalEventosMes
    ? eventosDelMes[monthOfferIndex % totalEventosMes]
    : null;

  useEffect(() => {
    setMonthOfferIndex(0);
  }, [currentMonth, totalEventosMes, searchText]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handlePrevMonthOffer = () => {
    if (!totalEventosMes) {
      return;
    }
    setMonthOfferIndex((prev) => (prev - 1 + totalEventosMes) % totalEventosMes);
  };

  const handleNextMonthOffer = () => {
    if (!totalEventosMes) {
      return;
    }
    setMonthOfferIndex((prev) => (prev + 1) % totalEventosMes);
  };

  return (
    <main>
      <section className="calendar">
        <div className="calendar-hero">
          <span className="calendar-kicker">
            Calendario <span className="topotours-word">Topotours</span>
          </span>
          <h2>Organiza tu viaje por fechas</h2>
          <p>Mira las ofertas vigentes por mes y encontra la fecha ideal.</p>
        </div>

        <div className="calendar-filter-bar">
          <div className="calendar-filter">
            <label htmlFor="calendar-destino">Destino</label>
            <select
              id="calendar-destino"
              className="calendar-input"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            >
              <option value="">Todos</option>
              {destinosDisponibles.map((destino) => (
                <option key={destino} value={destino}>
                  {destino}
                </option>
              ))}
            </select>
          </div>
          <div className="calendar-filter">
            <label>Mes</label>
            <div className="calendar-month-input">
              {formatMonthLabel(currentMonth)}
            </div>
          </div>
          <button className="primary" type="button">
            Ver calendario
          </button>
        </div>

        {loading ? (
          <p className="section-state">Cargando fechas...</p>
        ) : eventosFiltrados.length === 0 ? (
          <p className="section-state">No hay fechas disponibles.</p>
        ) : (
          <div className="calendar-panel">
            <div className="calendar-panel-header">
              <div>
                <h3 className="calendar-panel-title">
                  {formatMonthLabel(currentMonth)}
                </h3>
                <span className="calendar-panel-subtitle">
                  {eventosDelMes.length} ofertas activas
                </span>
              </div>
              <div className="calendar-panel-actions">
                <button
                  className="calendar-icon-button"
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Mes anterior"
                >
                  &lsaquo;
                </button>
                <button
                  className="calendar-icon-button"
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Mes siguiente"
                >
                  &rsaquo;
                </button>
              </div>
            </div>
            <div className="calendar-panel-body">
              <div className="calendar-month">
                <div className="calendar-weekdays">
                  <span>Lun</span>
                  <span>Mar</span>
                  <span>Mie</span>
                  <span>Jue</span>
                  <span>Vie</span>
                  <span>Sab</span>
                  <span>Dom</span>
                </div>
                <div className="calendar-days-grid">
                  {gridDays.map((day) => {
                    const key = dayKey(day);
                    const eventosDia = eventosPorDia.get(key) || [];
                    const isCurrentMonth =
                      day.getMonth() === currentMonth.getMonth();
                    const isToday = dayKey(day) === dayKey(new Date());
                    return (
                      <div
                        className={`calendar-day${
                          isCurrentMonth ? "" : " is-outside"
                        }${isToday ? " is-today" : ""}${
                          eventosDia.length ? " has-events" : ""
                        }`}
                        key={key}
                      >
                        <span className="calendar-date">{day.getDate()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="calendar-month-offers">
                <div className="calendar-offer-header">
                  <h4>Ofertas del mes</h4>
                </div>
                {eventoMesActual ? (
                  <>
                    <div className="calendar-offer-carousel">
                      <button
                        className={`search-results-nav${
                          totalEventosMes > 1 ? "" : " is-hidden"
                        }`}
                        type="button"
                        onClick={handlePrevMonthOffer}
                        aria-label="Oferta anterior"
                      >
                        <svg
                          className="search-results-nav-icon"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M15 6l-6 6 6 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <Link
                        key={eventoMesActual.id}
                        className="calendar-offer-item calendar-offer-item--media"
                        to={`/ofertas/${eventoMesActual.slug}`}
                        style={{
                          backgroundImage: `url("${
                            eventoMesActual.imagen || fallbackDeal
                          }")`
                        }}
                      >
                        <div className="calendar-offer-overlay"></div>
                        <div className="calendar-offer-content">
                          <span className="calendar-offer-title">
                            {eventoMesActual.titulo}
                          </span>
                          <span className="calendar-offer-price">
                            {eventoMesActual.precio
                              ? formatCurrency(
                                  eventoMesActual.precio,
                                  eventoMesActual.moneda
                                )
                              : "Precio a consultar"}
                          </span>
                          <span className="calendar-offer-destination">
                            {eventoMesActual.destino || "Destino confirmado"}
                          </span>
                        </div>
                      </Link>
                      <button
                        className={`search-results-nav${
                          totalEventosMes > 1 ? "" : " is-hidden"
                        }`}
                        type="button"
                        onClick={handleNextMonthOffer}
                        aria-label="Oferta siguiente"
                      >
                        <svg
                          className="search-results-nav-icon"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M9 6l6 6-6 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {totalEventosMes > 1 ? (
                      <div className="calendar-offer-count">
                        {monthOfferIndex + 1} / {totalEventosMes}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p>No hay ofertas activas este mes.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

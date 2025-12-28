import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTravelData } from "../hooks/useTravelData.js";
import { formatDate } from "../utils/formatters.js";

export default function Calendario() {
  const { ofertas, loading } = useTravelData();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [searchText, setSearchText] = useState("");

  const normalizeDate = (value) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const formatMonthLabel = (date) =>
    date.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const eventos = useMemo(() => {
    return ofertas.flatMap((oferta) =>
      (oferta.precios || []).map((precio) => ({
        id: `${oferta.id}-${precio.id}`,
        titulo: oferta.titulo,
        fechaInicio: normalizeDate(precio.fechaInicio),
        fechaFin: normalizeDate(precio.fechaFin),
        destino: oferta.destino?.nombre || "",
        slug: oferta.slug || oferta.id
      }))
    );
  }, [ofertas]);

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
    return eventosFiltrados.filter(
      (evento) => evento.fechaFin >= monthStart && evento.fechaInicio <= monthEnd
    );
  }, [eventosFiltrados, monthStart, monthEnd]);

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

  return (
    <main>
      <section className="calendar">
        <div className="calendar-hero">
          <div className="section-header">
            <span className="calendar-kicker">
              Calendario <span className="topotours-word">Topotours</span>
            </span>
            <h2>Organiza tu viaje por fechas</h2>
            <p>
              Mira las ofertas vigentes por mes y encontra la fecha ideal.
            </p>
          </div>
        </div>

        <div className="calendar-filter-bar">
          <div className="calendar-filter">
            <label htmlFor="calendar-destino">Destino</label>
            <input
              id="calendar-destino"
              className="calendar-input"
              placeholder="Buscar destino u oferta"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
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
                >
                  {"<"}
                </button>
                <button
                  className="calendar-icon-button"
                  type="button"
                  onClick={handleNextMonth}
                >
                  {">"}
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
                        }${isToday ? " is-today" : ""}`}
                        key={key}
                      >
                        <span className="calendar-date">{day.getDate()}</span>
                        {eventosDia.length ? (
                          <span className="calendar-count">
                            {eventosDia.length}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="calendar-month-offers">
                <h4>Ofertas del mes</h4>
                {eventosDelMes.length ? (
                  <div className="calendar-offer-list">
                    {eventosDelMes.map((evento) => (
                      <Link
                        key={evento.id}
                        className="calendar-offer-item"
                        to={`/ofertas/${evento.slug}`}
                      >
                        <span className="calendar-offer-title">
                          {evento.titulo}
                        </span>
                        <span className="calendar-offer-dates">
                          {formatDate(evento.fechaInicio)} -{" "}
                          {formatDate(evento.fechaFin)}
                        </span>
                        <span className="calendar-offer-destination">
                          {evento.destino || "Destino confirmado"}
                        </span>
                      </Link>
                    ))}
                  </div>
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

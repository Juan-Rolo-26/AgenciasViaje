import { useMemo } from "react";
import { useTravelData } from "../hooks/useTravelData.js";
import { formatDate } from "../utils/formatters.js";

export default function Calendario() {
  const { ofertas, loading } = useTravelData();

  const fechasCalendario = useMemo(() => {
    const fechas = ofertas.flatMap((oferta) =>
      (oferta.precios || []).map((precio) => ({
        id: `${oferta.id}-${precio.id}`,
        titulo: oferta.titulo,
        fechaInicio: precio.fechaInicio,
        fechaFin: precio.fechaFin,
        destino: oferta.destino?.nombre
      }))
    );

    return fechas
      .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
      .slice(0, 6);
  }, [ofertas]);

  return (
    <main>
      <section className="calendar">
        <div className="section-header">
          <h2>Calendario de salidas</h2>
          <p>
            Seleccioná la época ideal para viajar con nuestras fechas
            sugeridas.
          </p>
        </div>
        {loading ? (
          <p className="section-state">Cargando fechas...</p>
        ) : fechasCalendario.length === 0 ? (
          <p className="section-state">No hay fechas disponibles.</p>
        ) : (
          <div className="calendar-grid">
            {fechasCalendario.map((fecha) => (
              <div className="month" key={fecha.id}>
                <h4>
                  {formatDate(fecha.fechaInicio)} - {formatDate(fecha.fechaFin)}
                </h4>
                <p>{fecha.destino || "Destino confirmado"}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

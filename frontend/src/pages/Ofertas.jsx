import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import fallbackDeal from "../assets/inicio.jpg";
import { useTravelData } from "../hooks/useTravelData.js";
import {
  formatCurrency,
  formatDate,
  getPrecioVigente,
  parseAmount
} from "../utils/formatters.js";

export default function Ofertas() {
  const { ofertas, loading, error } = useTravelData();
  const initialFilters = {
    destino: "",
    pais: "",
    precioMin: "",
    precioMax: "",
    desde: "",
    hasta: ""
  };
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);

  const ofertasDestacadas = useMemo(() => {
    const destacadas = ofertas.filter((oferta) => oferta.destacada);
    return destacadas.length ? destacadas : ofertas;
  }, [ofertas]);

  const destinos = useMemo(() => {
    const names = new Set();
    ofertas.forEach((oferta) => {
      if (oferta.destino?.nombre) {
        names.add(oferta.destino.nombre);
      }
      (oferta.destinos || []).forEach((item) => {
        if (item.destino?.nombre) {
          names.add(item.destino.nombre);
        }
      });
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [ofertas]);

  const paises = useMemo(() => {
    const regions = new Set();
    ofertas.forEach((oferta) => {
      if (oferta.destino?.paisRegion) {
        regions.add(oferta.destino.paisRegion);
      }
      (oferta.destinos || []).forEach((item) => {
        if (item.destino?.paisRegion) {
          regions.add(item.destino.paisRegion);
        }
      });
    });
    return Array.from(regions).sort((a, b) => a.localeCompare(b));
  }, [ofertas]);

  const getMinPrice = (precios) => {
    const amounts = (precios || [])
      .map((precio) => parseAmount(precio.precio))
      .filter((value) => value !== null);
    if (!amounts.length) {
      return null;
    }
    return Math.min(...amounts);
  };

  const ofertasFiltradas = useMemo(() => {
    const destinoQuery = filters.destino.toLowerCase();
    const paisQuery = filters.pais.toLowerCase();
    const minFilter = parseAmount(filters.precioMin);
    const maxFilter = parseAmount(filters.precioMax);
    const desde = filters.desde ? new Date(filters.desde) : null;
    const hasta = filters.hasta ? new Date(filters.hasta) : null;

    return ofertasDestacadas.filter((oferta) => {
      const destinosAsociados = [
        oferta.destino,
        ...(oferta.destinos || []).map((item) => item.destino)
      ].filter(Boolean);
      const matchesDestino =
        !destinoQuery ||
        destinosAsociados.some(
          (destino) => destino.nombre.toLowerCase() === destinoQuery
        );
      const matchesPais =
        !paisQuery ||
        destinosAsociados.some(
          (destino) =>
            (destino.paisRegion || "").toLowerCase() === paisQuery
        );

      const minPrice = getMinPrice(oferta.precios);
      if (minFilter !== null && (minPrice === null || minPrice < minFilter)) {
        return false;
      }
      if (maxFilter !== null && (minPrice === null || minPrice > maxFilter)) {
        return false;
      }

      if (desde || hasta) {
        const precios = oferta.precios || [];
        const matchesDate = precios.some((precio) => {
          const inicio = new Date(precio.fechaInicio);
          const fin = new Date(precio.fechaFin);
          if (desde && fin < desde) {
            return false;
          }
          if (hasta && inicio > hasta) {
            return false;
          }
          return true;
        });
        if (!matchesDate) {
          return false;
        }
      }

      return matchesDestino && matchesPais;
    });
  }, [ofertasDestacadas, filters]);

  const handleApply = (event) => {
    event.preventDefault();
    setFilters(draftFilters);
  };

  const handleClear = () => {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
  };

  return (
    <main className="offers-page">
      <section className="offers-hero">
        <div className="offers-hero-inner">
          <span className="offers-kicker">
            Ofertas <span className="topotours-word">Topotours</span>
          </span>
          <h1>Encontra tu proximo viaje</h1>
          <p>
            Experiencias seleccionadas, salidas confirmadas y cupos limitados.
          </p>
        </div>
      </section>

      <section className="offers-section">
        <form className="offers-filters" onSubmit={handleApply}>
          <div className="offers-field">
            <label htmlFor="ofertas-destino">Destino</label>
            <select
              id="ofertas-destino"
              value={draftFilters.destino}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  destino: event.target.value
                }))
              }
            >
              <option value="">Todos</option>
              {destinos.map((destino) => (
                <option key={destino} value={destino}>
                  {destino}
                </option>
              ))}
            </select>
          </div>
          <div className="offers-field">
            <label htmlFor="ofertas-pais">Pais</label>
            <select
              id="ofertas-pais"
              value={draftFilters.pais}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  pais: event.target.value
                }))
              }
            >
              <option value="">Todos</option>
              {paises.map((pais) => (
                <option key={pais} value={pais}>
                  {pais}
                </option>
              ))}
            </select>
          </div>
          <div className="offers-field">
            <label htmlFor="ofertas-min">Precio min</label>
            <input
              id="ofertas-min"
              type="number"
              min="0"
              placeholder="50000"
              value={draftFilters.precioMin}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  precioMin: event.target.value
                }))
              }
            />
          </div>
          <div className="offers-field">
            <label htmlFor="ofertas-max">Precio max</label>
            <input
              id="ofertas-max"
              type="number"
              min="0"
              placeholder="300000"
              value={draftFilters.precioMax}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  precioMax: event.target.value
                }))
              }
            />
          </div>
          <div className="offers-field">
            <label htmlFor="ofertas-desde">Desde</label>
            <input
              id="ofertas-desde"
              type="date"
              value={draftFilters.desde}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  desde: event.target.value
                }))
              }
            />
          </div>
          <div className="offers-field">
            <label htmlFor="ofertas-hasta">Hasta</label>
            <input
              id="ofertas-hasta"
              type="date"
              value={draftFilters.hasta}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  hasta: event.target.value
                }))
              }
            />
          </div>
          <div className="offers-actions">
            <button className="primary" type="submit">
              Aplicar filtros
            </button>
            <button className="secondary" type="button" onClick={handleClear}>
              Limpiar
            </button>
          </div>
        </form>

        <div className="section-header">
          <h2>Ofertas disponibles</h2>
          <p>Promos con fechas flexibles y beneficios exclusivos.</p>
        </div>
        {loading ? (
          <p className="section-state">Cargando ofertas...</p>
        ) : error ? (
          <p className="section-state error">{error}</p>
        ) : ofertasFiltradas.length === 0 ? (
          <p className="section-state">No hay ofertas disponibles.</p>
        ) : (
          <div className="offer-grid grid-3x3">
            {ofertasFiltradas.map((oferta) => {
              const preciosOrdenados = [...(oferta.precios || [])].sort(
                (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
              );
              const precio = getPrecioVigente(oferta.precios) || preciosOrdenados[0];
              const ofertaSlug = oferta.slug || oferta.id;
              const offerImage =
                oferta.destino?.imagenPortada || fallbackDeal;
              const fechaInicio = precio?.fechaInicio;
              const fechaFin = precio?.fechaFin;
              return (
                <Link
                  className="offer-card offer-card-feature offer-link"
                  key={oferta.id}
                  to={`/ofertas/${ofertaSlug}`}
                >
                  <div className="offer-image">
                    <img src={offerImage} alt={oferta.titulo} />
                    <div className="offer-badge">
                      <span>Desde</span>
                      <strong>
                        {precio
                          ? formatCurrency(precio.precio, precio.moneda)
                          : "A consultar"}
                      </strong>
                    </div>
                  </div>
                  <div className="offer-body">
                    <span className="offer-tag">
                      {(oferta.destino?.nombre || "Destino destacado").toUpperCase()}
                    </span>
                    <h3>{oferta.titulo}</h3>
                    <p className="offer-description">
                      {oferta.condiciones || oferta.noIncluye || "Consultanos"}
                    </p>
                    {fechaInicio && fechaFin ? (
                      <span className="offer-valid">
                        Valido del {formatDate(fechaInicio)} al{" "}
                        {formatDate(fechaFin)}
                      </span>
                    ) : null}
                    <span className="offer-cta">Ver oferta</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

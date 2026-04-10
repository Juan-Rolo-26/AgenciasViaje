import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Modal from "./Modal.jsx";

const TIPOS_SERVICIO = [
    "Aéreo", "Transporte", "Alojamiento", "Traslados", "Desayuno", "Comidas",
    "Régimen", "Equipaje", "Asistencia", "Excursión", "Seguro", "Salidas", "Notas", "Otros"
];

const EMPTY_OFERTA = {
    titulo: "", slug: "", destinoId: "",
    noches: 7, cupos: 0, destacada: false, activa: true, orden: 0, noIncluye: "",
};

function toSlug(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function fmtDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function MesRapido({ onAdd }) {
    const hoy = new Date();
    const [anio, setAnio] = useState(hoy.getFullYear());

    function agregarMes(mesIdx) {
        const m = String(mesIdx + 1).padStart(2, "0");
        const y = String(anio);
        const start = `${y}-${m}-01`;
        const lastDay = new Date(anio, mesIdx + 1, 0).getDate();
        const end = `${y}-${m}-${String(lastDay).padStart(2, "0")}`;
        onAdd(start, end);
    }

    return (
        <div style={{
            display: "flex", flexDirection: "column", gap: "10px",
            background: "linear-gradient(135deg, #f0f4ff, #e8edff)",
            border: "1px solid #c7d2f8",
            padding: "14px 16px", borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(99,102,241,0.08)"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#4338ca", letterSpacing: "0.01em" }}>
                    + Agregar mes entero
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto", background: "white", borderRadius: "8px", padding: "4px 8px", border: "1px solid #c7d2f8" }}>
                    <button type="button" onClick={() => setAnio(a => a - 1)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#4338ca", padding: "0 4px", lineHeight: 1 }}>‹</button>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#1e1b4b", minWidth: "44px", textAlign: "center" }}>{anio}</span>
                    <button type="button" onClick={() => setAnio(a => a + 1)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#4338ca", padding: "0 4px", lineHeight: 1 }}>›</button>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                {MESES.map((mes, i) => (
                    <button
                        key={mes}
                        type="button"
                        onClick={() => agregarMes(i)}
                        style={{
                            padding: "8px 4px",
                            fontSize: "13px",
                            fontWeight: 600,
                            border: "1px solid #c7d2f8",
                            borderRadius: "8px",
                            background: "white",
                            color: "#3730a3",
                            cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#4338ca"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#4338ca"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#3730a3"; e.currentTarget.style.borderColor = "#c7d2f8"; }}
                    >
                        {mes}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function OfertasView({ tipo, titulo }) {
    const { apiFetch, showToast } = useAdmin();
    const [list, setList] = useState([]);
    const [destinos, setDestinos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    // form state
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ ...EMPTY_OFERTA, tipo });
    const [servicios, setServicios] = useState([]);
    const [noServicios, setNoServicios] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [saving, setSaving] = useState(false);

    const customNoIncluidosTipos = useMemo(() => {
        const tipos = new Set(["Propinas", "Seguro de cancelación", "Bebidas", "Gastos personales"]);
        list.forEach(o => {
            if (o.noIncluye) {
                try {
                    const parsed = JSON.parse(o.noIncluye);
                    if (Array.isArray(parsed)) parsed.forEach(p => p.tipo && tipos.add(p.tipo));
                } catch { }
            }
        });
        return Array.from(tipos).sort();
    }, [list]);
    // expand row
    const [expanded, setExpanded] = useState(null);
    // delete
    const [delTarget, setDelTarget] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [o, d] = await Promise.all([
                apiFetch(`/api/admin/ofertas?tipo=${tipo}`),
                apiFetch("/api/admin/destinos"),
            ]);
            setList(o); setDestinos(d);
        } catch { showToast("error", "Error al cargar datos"); }
        finally { setLoading(false); }
    }, [apiFetch, showToast, tipo]);

    useEffect(() => { load(); }, [load]);

    function openNew() {
        setEditItem(null);
        setForm({ ...EMPTY_OFERTA, tipo });
        setServicios([{ tipo: "Aéreo", descripcion: "" }]);
        setNoServicios([]);
        setFechas([{ fechaInicio: "", fechaFin: "" }]);
        setShowForm(true);
    }

    function openEdit(o) {
        setEditItem(o);
        setForm({
            titulo: o.titulo || "", slug: o.slug || "", destinoId: String(o.destinoId || ""),
            noches: o.noches || 7, cupos: o.cupos || 0,
            destacada: !!o.destacada, activa: o.activa !== false, orden: o.orden || 0, tipo,
            noIncluye: o.noIncluye || "",
        });
        setServicios((o.incluyeItems || []).map(i => ({ id: i.id, tipo: i.tipo, descripcion: i.descripcion })));
        let parsedNoIncluye = [];
        if (o.noIncluye) {
            try {
                parsedNoIncluye = JSON.parse(o.noIncluye);
            } catch {
                parsedNoIncluye = o.noIncluye.split('\n').filter(Boolean).map(x => ({ tipo: "General", descripcion: x }));
            }
        }
        setNoServicios(parsedNoIncluye);
        setFechas((o.precios || [])
            .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
            .map(p => ({
                id: p.id,
                fechaInicio: p.fechaInicio ? p.fechaInicio.slice(0, 10) : "",
                fechaFin: p.fechaFin ? p.fechaFin.slice(0, 10) : "",
            }))
        );
        setShowForm(true);
    }

    async function save() {
        if (!form.titulo || !form.slug || !form.destinoId) {
            showToast("error", "Título, slug y destino son requeridos"); return;
        }
        setSaving(true);
        try {
            const body = {
                ...form,
                noIncluye: JSON.stringify(noServicios.filter(s => s.tipo)),
                destinoId: Number(form.destinoId),
                incluyeItems: servicios.filter(s => s.tipo && s.descripcion),
                precios: fechas.filter(f => f.fechaInicio).map(f => ({
                    fechaInicio: new Date(f.fechaInicio).toISOString(),
                    fechaFin: f.fechaFin ? new Date(f.fechaFin).toISOString() : new Date(f.fechaInicio).toISOString(),
                    precio: 0, moneda: "ARS",
                })),
            };
            if (editItem) {
                await apiFetch(`/api/admin/ofertas/${editItem.id}`, { method: "PUT", body });
                showToast("success", "Oferta actualizada ✓");
            } else {
                await apiFetch("/api/admin/ofertas", { method: "POST", body });
                showToast("success", "Oferta creada ✓");
            }
            setShowForm(false); load();
        } catch (e) { showToast("error", e.message); }
        finally { setSaving(false); }
    }

    async function toggleActiva(o) {
        try {
            await apiFetch(`/api/admin/ofertas/${o.id}`, { method: "PUT", body: { activa: !o.activa } });
            showToast("success", `Oferta ${!o.activa ? "activada" : "desactivada"}`);
            load();
        } catch (e) { showToast("error", e.message); }
    }

    async function doDelete(id) {
        try {
            await apiFetch(`/api/admin/ofertas/${id}`, { method: "DELETE" });
            showToast("success", "Eliminada correctamente");
            setDelTarget(null); load();
        } catch (e) { showToast("error", e.message); }
    }

    const filtered = list.filter(o =>
        o.titulo?.toLowerCase().includes(search.toLowerCase()) ||
        o.destino?.nombre?.toLowerCase().includes(search.toLowerCase())
    );

    const esGrupal = tipo === "grupal";

    return (
        <div>
            <div className="view-header">
                <div>
                    <h2>{titulo}</h2>
                    <p>{list.length} {esGrupal ? "salidas grupales" : "paquetes"} registrados</p>
                </div>
                <button className="btn-primary" onClick={openNew}>+ Nuevo</button>
            </div>

            <div className="search-row">
                <input type="search" placeholder="Buscar por título o destino..." value={search}
                    onChange={e => setSearch(e.target.value)} className="search-input" />
            </div>

            {loading ? <p className="loading">Cargando...</p> : (
                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Destino</th>
                                <th>Noches</th>
                                {esGrupal && <th>Próximas salidas</th>}
                                <th>Servicios</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(o => (
                                <Fragment key={o.id}>
                                    <tr className={expanded === o.id ? "row-open" : ""}>
                                        <td>
                                            <strong>{o.titulo}</strong>
                                            <div className="slug-hint"><code>{o.slug}</code></div>
                                        </td>
                                        <td>{o.destino?.nombre || "—"}</td>
                                        <td>{o.noches} noches</td>
                                        {esGrupal && (
                                            <td className="salidas-td">
                                                {(o.precios || [])
                                                    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
                                                    .slice(0, 3)
                                                    .map(p => (
                                                        <span key={p.id} className="date-chip">{fmtDate(p.fechaInicio)}</span>
                                                    ))
                                                }
                                                {(o.precios || []).length === 0 && <span className="hint">Sin fechas</span>}
                                            </td>
                                        )}
                                        <td>
                                            <span className="badge badge-blue">{(o.incluyeItems || []).length} servicios</span>
                                        </td>
                                        <td>
                                            <button
                                                className={`badge badge-toggle ${o.activa ? "badge-green" : "badge-gray"}`}
                                                onClick={() => toggleActiva(o)}
                                                title="Click para activar/desactivar"
                                            >
                                                {o.activa ? "✅ Activa" : "⏸ Inactiva"}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="row-actions">
                                                <button className="btn-icon" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                                                    {expanded === o.id ? "▲" : "▼"}
                                                </button>
                                                <button className="btn-edit" onClick={() => openEdit(o)}>✏️</button>
                                                <button className="btn-del" onClick={() => setDelTarget(o)}>🗑</button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expanded === o.id && (
                                        <tr className="expanded-row">
                                            <td colSpan={esGrupal ? 7 : 6}>
                                                <div className="expanded-inner">
                                                    {/* Servicios */}
                                                    <div>
                                                        <h5>Servicios incluidos</h5>
                                                        {(o.incluyeItems || []).length === 0
                                                            ? <p className="hint">Sin servicios registrados</p>
                                                            : (
                                                                <div className="chips-row">
                                                                    {(o.incluyeItems || []).map(s => (
                                                                        <span key={s.id} className="service-chip">
                                                                            <strong>{s.tipo}:</strong> {s.descripcion}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    {/* Fechas */}
                                                    {(o.precios || []).length > 0 && (
                                                        <div style={{ marginTop: 12 }}>
                                                            <h5>Fechas de salida</h5>
                                                            <div className="chips-row">
                                                                {o.precios.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)).map(p => (
                                                                    <span key={p.id} className="date-chip">{fmtDate(p.fechaInicio)}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={esGrupal ? 7 : 6} className="empty">Sin resultados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* FORM MODAL */}
            {showForm && (
                <Modal title={editItem ? `Editar: ${editItem.titulo}` : `Nuevo ${titulo}`} onClose={() => setShowForm(false)} wide>

                    {/* Sección 1: Datos básicos */}
                    <div className="form-section">
                        <h4>Información básica</h4>
                        <div className="form-grid">
                            <div className="field span2">
                                <label>Título *</label>
                                <input value={form.titulo} onChange={e => {
                                    const v = e.target.value;
                                    setForm(f => ({ ...f, titulo: v, slug: editItem ? f.slug : toSlug(v) }));
                                }} />
                            </div>
                            <div className="field">
                                <label>Slug *</label>
                                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                            </div>
                            <div className="field">
                                <label>Destino *</label>
                                <select value={form.destinoId} onChange={e => setForm(f => ({ ...f, destinoId: e.target.value }))}>
                                    <option value="">Seleccioná un destino...</option>
                                    {destinos.map(d => (
                                        <option key={d.id} value={d.id}>{d.nombre} — {d.paisRegion}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label>Noches</label>
                                <input type="number" min="1" value={form.noches} onChange={e => setForm(f => ({ ...f, noches: +e.target.value }))} />
                            </div>
                            <div className="field">
                                <label>Cupos disponibles</label>
                                <input type="number" min="0" value={form.cupos} onChange={e => setForm(f => ({ ...f, cupos: +e.target.value }))} />
                            </div>
                            <div className="field">
                                <label>Orden (número)</label>
                                <input type="number" value={form.orden} onChange={e => setForm(f => ({ ...f, orden: +e.target.value }))} />
                            </div>
                            <div className="field">
                                <label className="check-label">
                                    <input type="checkbox" checked={form.destacada} onChange={e => setForm(f => ({ ...f, destacada: e.target.checked }))} />
                                    ⭐ Destacada
                                </label>
                            </div>
                            <div className="field">
                                <label className="check-label">
                                    <input type="checkbox" checked={form.activa} onChange={e => setForm(f => ({ ...f, activa: e.target.checked }))} />
                                    ✅ Activa (visible en web)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-row">
                            <h4>Servicios NO incluidos</h4>
                            <button className="btn-secondary sm" onClick={() => setNoServicios(s => [...s, { tipo: "", descripcion: "" }])}>
                                + Agregar no incluido
                            </button>
                        </div>
                        <div className="items-list">
                            {noServicios.map((s, i) => (
                                <div className="item-row" key={'noinc' + i}>
                                    <input list="no-incluidos-tipos" placeholder="Tipo (ej: Propinas...)" value={s.tipo}
                                        onChange={e => setNoServicios(ss => ss.map((x, j) => j === i ? { ...x, tipo: e.target.value } : x))} style={{ width: '180px' }} />
                                    <input placeholder="Descripción (opcional)..." value={s.descripcion}
                                        onChange={e => setNoServicios(ss => ss.map((x, j) => j === i ? { ...x, descripcion: e.target.value } : x))} />
                                    <button className="btn-del sm" onClick={() => setNoServicios(ss => ss.filter((_, j) => j !== i))}>✕</button>
                                </div>
                            ))}
                            {noServicios.length === 0 && <p className="hint">Sin servicios no incluidos aclarados.</p>}
                            <datalist id="no-incluidos-tipos">
                                {customNoIncluidosTipos.map(t => <option key={t} value={t} />)}
                            </datalist>
                        </div>
                    </div>

                    {/* Sección 2: Servicios incluidos */}
                    <div className="form-section">
                        <div className="section-row">
                            <h4>Servicios incluidos</h4>
                            <button className="btn-secondary sm" onClick={() => setServicios(s => [...s, { tipo: "Transporte", descripcion: "" }])}>
                                + Agregar servicio
                            </button>
                        </div>
                        <div className="items-list">
                            {servicios.map((s, i) => (
                                <div className="item-row" key={i}>
                                    <select value={s.tipo} onChange={e => setServicios(ss => ss.map((x, j) => j === i ? { ...x, tipo: e.target.value } : x))}>
                                        {TIPOS_SERVICIO.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <input placeholder="Descripción del servicio..." value={s.descripcion}
                                        onChange={e => setServicios(ss => ss.map((x, j) => j === i ? { ...x, descripcion: e.target.value } : x))} />
                                    <button className="btn-del sm" onClick={() => setServicios(ss => ss.filter((_, j) => j !== i))}>✕</button>
                                </div>
                            ))}
                            {servicios.length === 0 && <p className="hint">Sin servicios. Hacé click en "+ Agregar servicio".</p>}
                        </div>
                    </div>

                    {/* Sección 3: Fechas de salida */}
                    <div className="form-section">
                        <div className="section-row">
                            <h4>Fechas de salida</h4>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                                <MesRapido onAdd={(start, end) => setFechas(ff => [...ff, { fechaInicio: start, fechaFin: end }])} />
                                <button className="btn-secondary sm" onClick={() => setFechas(ff => [...ff, { fechaInicio: "", fechaFin: "" }])}>
                                    + Fecha exacta
                                </button>
                            </div>
                        </div>
                        <div className="items-list">
                            {fechas.map((f, i) => (
                                <div className="item-row dates-row" key={i}>
                                    <div className="field">
                                        <label>Fecha inicio</label>
                                        <input type="date" value={f.fechaInicio}
                                            onChange={e => setFechas(ff => ff.map((x, j) => j === i ? { ...x, fechaInicio: e.target.value } : x))} />
                                    </div>
                                    <div className="field">
                                        <label>Fecha fin (opcional)</label>
                                        <input type="date" value={f.fechaFin}
                                            onChange={e => setFechas(ff => ff.map((x, j) => j === i ? { ...x, fechaFin: e.target.value } : x))} />
                                    </div>
                                    <button className="btn-del sm align-end" onClick={() => setFechas(ff => ff.filter((_, j) => j !== i))}>✕</button>
                                </div>
                            ))}
                            {fechas.length === 0 && <p className="hint">Sin fechas. Hacé click en "+ Agregar fecha".</p>}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                        <button className="btn-primary" onClick={save} disabled={saving}>
                            {saving ? "Guardando..." : editItem ? "Guardar cambios" : "Crear"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* DELETE CONFIRM */}
            {delTarget && (
                <Modal title="Confirmar eliminación" onClose={() => setDelTarget(null)}>
                    <p>¿Eliminar <strong>{delTarget.titulo}</strong>?</p>
                    <p className="hint">Esta acción es permanente.</p>
                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={() => setDelTarget(null)}>Cancelar</button>
                        <button className="btn-danger" onClick={() => doDelete(delTarget.id)}>Sí, eliminar</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

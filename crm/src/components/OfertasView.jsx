import { Fragment, useEffect, useState, useCallback } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Modal from "./Modal.jsx";

const TIPOS_SERVICIO = [
    "Aéreo", "Transporte", "Alojamiento", "Traslados", "Desayuno", "Comidas",
    "Régimen", "Equipaje", "Asistencia", "Excursión", "Seguro", "Salidas", "Notas", "Otros"
];

const EMPTY_OFERTA = {
    titulo: "", slug: "", destinoId: "",
    noches: 7, cupos: 0, destacada: false, activa: true, orden: 0,
};

function toSlug(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function fmtDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
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
    const [fechas, setFechas] = useState([]);
    const [saving, setSaving] = useState(false);
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
        setFechas([{ fechaInicio: "", fechaFin: "" }]);
        setShowForm(true);
    }

    function openEdit(o) {
        setEditItem(o);
        setForm({
            titulo: o.titulo || "", slug: o.slug || "", destinoId: String(o.destinoId || ""),
            noches: o.noches || 7, cupos: o.cupos || 0,
            destacada: !!o.destacada, activa: o.activa !== false, orden: o.orden || 0, tipo,
        });
        setServicios((o.incluyeItems || []).map(i => ({ id: i.id, tipo: i.tipo, descripcion: i.descripcion })));
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
                            <button className="btn-secondary sm" onClick={() => setFechas(ff => [...ff, { fechaInicio: "", fechaFin: "" }])}>
                                + Agregar fecha
                            </button>
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

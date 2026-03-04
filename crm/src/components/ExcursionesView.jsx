import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Modal from "./Modal.jsx";

const TIPOS_ACTIVIDAD = [
    "City Tour", "Excursión de día completo", "Trekking", "Safari",
    "Aventura", "Cultural", "Gastronómica", "Náutica", "Deportiva", "Otra"
];

const EMPTY = {
    nombre: "", slug: "", destinoId: "", descripcion: "",
    tipoActividad: "City Tour", imagenPortada: "",
    fecha: "", hora: "09:00", puntoEncuentro: "",
    precio: 0, cupos: 0, activa: true, destacada: false, orden: 0,
};

function toSlug(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function fmtDate(iso) {
    if (!iso) return "Sin fecha";
    return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}

export default function ExcursionesView() {
    const { apiFetch, showToast } = useAdmin();
    const [list, setList] = useState([]);
    const [destinos, setDestinos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [delTarget, setDelTarget] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [exc, dest] = await Promise.all([
                apiFetch("/api/admin/excursiones"),
                apiFetch("/api/admin/destinos"),
            ]);
            setList(exc); setDestinos(dest);
        } catch { showToast("error", "Error al cargar excursiones"); }
        finally { setLoading(false); }
    }, [apiFetch, showToast]);

    useEffect(() => { load(); }, [load]);

    function openNew() {
        setEditItem(null); setForm(EMPTY); setShowForm(true);
    }

    function openEdit(a) {
        setEditItem(a);
        setForm({
            nombre: a.nombre || "", slug: a.slug || "",
            destinoId: String(a.destinoId || ""),
            descripcion: a.descripcion || "",
            tipoActividad: a.tipoActividad || "City Tour",
            imagenPortada: a.imagenPortada || "",
            fecha: a.fecha ? a.fecha.slice(0, 10) : "",
            hora: a.hora || "09:00",
            puntoEncuentro: a.puntoEncuentro || "",
            precio: a.precio || 0,
            cupos: a.cupos || 0,
            activa: a.activa !== false,
            destacada: !!a.destacada,
            orden: a.orden || 0,
        });
        setShowForm(true);
    }

    async function save() {
        if (!form.nombre || !form.slug || !form.destinoId || !form.descripcion || !form.imagenPortada || !form.fecha) {
            showToast("error", "Nombre, slug, destino, descripción, imagen y fecha son requeridos");
            return;
        }
        setSaving(true);
        try {
            const body = {
                ...form,
                destinoId: Number(form.destinoId),
                precio: Number(form.precio),
                cupos: Number(form.cupos),
                fecha: new Date(form.fecha).toISOString(),
            };
            if (editItem) {
                await apiFetch(`/api/admin/excursiones/${editItem.id}`, { method: "PUT", body });
                showToast("success", "Excursión actualizada ✓");
            } else {
                await apiFetch("/api/admin/excursiones", { method: "POST", body });
                showToast("success", "Excursión creada ✓");
            }
            setShowForm(false); load();
        } catch (e) { showToast("error", e.message); }
        finally { setSaving(false); }
    }

    async function toggleActiva(a) {
        try {
            await apiFetch(`/api/admin/excursiones/${a.id}`, { method: "PUT", body: { activa: !a.activa } });
            showToast("success", `Excursión ${!a.activa ? "activada" : "desactivada"}`);
            load();
        } catch (e) { showToast("error", e.message); }
    }

    async function doDelete(id) {
        try {
            await apiFetch(`/api/admin/excursiones/${id}`, { method: "DELETE" });
            showToast("success", "Eliminada"); setDelTarget(null); load();
        } catch (e) { showToast("error", e.message); }
    }

    const filtered = list.filter(a =>
        a.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        a.destino?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        a.tipoActividad?.toLowerCase().includes(search.toLowerCase())
    );

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

    return (
        <div>
            <div className="view-header">
                <div>
                    <h2>Excursiones</h2>
                    <p>{list.length} excursiones registradas</p>
                </div>
                <button className="btn-primary" onClick={openNew}>+ Nueva Excursión</button>
            </div>

            <div className="search-row">
                <input type="search" placeholder="Buscar por nombre, destino o tipo..." value={search}
                    onChange={e => setSearch(e.target.value)} className="search-input" />
            </div>

            {loading ? <p className="loading">Cargando...</p> : (
                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Imagen</th><th>Nombre</th><th>Destino</th>
                                <th>Tipo</th><th>Fecha</th><th>Estado</th><th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        {a.imagenPortada
                                            ? <img src={a.imagenPortada} alt="" className="tbl-thumb" />
                                            : <div className="tbl-thumb-ph">🏄</div>}
                                    </td>
                                    <td>
                                        <strong>{a.nombre}</strong>
                                        <div className="slug-hint"><code>{a.slug}</code></div>
                                    </td>
                                    <td>{a.destino?.nombre || "—"}</td>
                                    <td>
                                        <span className="badge badge-purple">{a.tipoActividad || "—"}</span>
                                    </td>
                                    <td className="fecha-td">{fmtDate(a.fecha)}</td>
                                    <td>
                                        <button
                                            className={`badge badge-toggle ${a.activa ? "badge-green" : "badge-gray"}`}
                                            onClick={() => toggleActiva(a)}
                                        >
                                            {a.activa ? "✅ Activa" : "⏸ Inactiva"}
                                        </button>
                                        {a.destacada && <span className="badge badge-amber ml">⭐</span>}
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="btn-edit" onClick={() => openEdit(a)}>✏️</button>
                                            <button className="btn-del" onClick={() => setDelTarget(a)}>🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="7" className="empty">Sin resultados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* FORM MODAL */}
            {showForm && (
                <Modal
                    title={editItem ? `Editar: ${editItem.nombre}` : "Nueva Excursión"}
                    onClose={() => setShowForm(false)}
                    wide
                >
                    <div className="form-section">
                        <h4>Información básica</h4>
                        <div className="form-grid">
                            <div className="field span2">
                                <label>Nombre *</label>
                                <input value={form.nombre} onChange={e => {
                                    const v = e.target.value;
                                    setForm(f => ({ ...f, nombre: v, slug: editItem ? f.slug : toSlug(v) }));
                                }} />
                            </div>
                            <div className="field">
                                <label>Slug *</label>
                                <input value={form.slug} onChange={set("slug")} />
                            </div>
                            <div className="field">
                                <label>Destino *</label>
                                <select value={form.destinoId} onChange={set("destinoId")}>
                                    <option value="">Seleccioná un destino...</option>
                                    {destinos.map(d => (
                                        <option key={d.id} value={d.id}>{d.nombre} — {d.paisRegion}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label>Tipo de actividad</label>
                                <select value={form.tipoActividad} onChange={set("tipoActividad")}>
                                    {TIPOS_ACTIVIDAD.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="field">
                                <label>Fecha</label>
                                <input type="date" value={form.fecha} onChange={set("fecha")} required />
                            </div>
                            <div className="field">
                                <label>Hora de salida</label>
                                <input type="time" value={form.hora} onChange={set("hora")} />
                            </div>
                            <div className="field">
                                <label>Precio (ARS)</label>
                                <input type="number" min="0" value={form.precio} onChange={set("precio")} />
                            </div>
                            <div className="field">
                                <label>Cupos disponibles</label>
                                <input type="number" min="0" value={form.cupos} onChange={set("cupos")} />
                            </div>
                            <div className="field span2">
                                <label>Punto de encuentro</label>
                                <input value={form.puntoEncuentro} onChange={set("puntoEncuentro")} placeholder="Ej: Lobby del hotel, Plaza Central..." />
                            </div>
                            <div className="field span2">
                                <label>URL imagen de portada *</label>
                                <input value={form.imagenPortada} onChange={set("imagenPortada")} placeholder="https://..." />
                                {form.imagenPortada && <img src={form.imagenPortada} alt="preview" className="img-preview" />}
                            </div>
                            <div className="field span2">
                                <label>Descripción *</label>
                                <textarea rows={5} value={form.descripcion} onChange={set("descripcion")} />
                            </div>
                            <div className="field">
                                <label className="check-label">
                                    <input type="checkbox" checked={form.destacada} onChange={set("destacada")} />
                                    ⭐ Destacada en inicio
                                </label>
                            </div>
                            <div className="field">
                                <label className="check-label">
                                    <input type="checkbox" checked={form.activa} onChange={set("activa")} />
                                    ✅ Activa (visible en web)
                                </label>
                            </div>
                            <div className="field">
                                <label>Orden (número)</label>
                                <input type="number" value={form.orden} onChange={set("orden")} />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                        <button className="btn-primary" onClick={save} disabled={saving}>
                            {saving ? "Guardando..." : editItem ? "Guardar cambios" : "Crear excursión"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* DELETE CONFIRM */}
            {delTarget && (
                <Modal title="Confirmar eliminación" onClose={() => setDelTarget(null)}>
                    <p>¿Eliminar <strong>{delTarget.nombre}</strong>?</p>
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

import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Modal from "./Modal.jsx";

const EMPTY = {
    nombre: "", slug: "", paisRegion: "", descripcionCorta: "",
    descripcion: "", imagenPortada: "", destacado: false, activo: true, orden: 0,
};

function toSlug(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function DestinosView() {
    const { apiFetch, showToast } = useAdmin();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(EMPTY);
    const [galeria, setGaleria] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [delTarget, setDelTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try { setList(await apiFetch("/api/admin/destinos")); }
        catch { showToast("error", "Error al cargar destinos"); }
        finally { setLoading(false); }
    }, [apiFetch, showToast]);

    useEffect(() => { load(); }, [load]);

    function openNew() {
        setEditId(null); setForm(EMPTY); setGaleria([]); setShowForm(true);
    }

    function openEdit(d) {
        setEditId(d.id);
        setForm({
            nombre: d.nombre || "", slug: d.slug || "", paisRegion: d.paisRegion || "",
            descripcionCorta: d.descripcionCorta || "", descripcion: d.descripcion || "",
            imagenPortada: d.imagenPortada || "",
            destacado: !!d.destacado, activo: d.activo !== false, orden: d.orden || 0,
        });
        setGaleria((d.galeria || []).map(g => ({ imagen: g.imagen, epigrafe: g.epigrafe || "" })));
        setShowForm(true);
    }

    async function save() {
        if (!form.nombre || !form.slug || !form.descripcion || !form.imagenPortada) {
            showToast("error", "Nombre, slug, descripción e imagen son requeridos"); return;
        }
        setSaving(true);
        try {
            const body = { ...form, galeria: galeria.filter(g => g.imagen) };
            if (editId) {
                await apiFetch(`/api/admin/destinos/${editId}`, { method: "PUT", body });
                showToast("success", "Destino actualizado ✓");
            } else {
                await apiFetch("/api/admin/destinos", { method: "POST", body });
                showToast("success", "Destino creado ✓");
            }
            setShowForm(false); load();
        } catch (e) { showToast("error", e.message); }
        finally { setSaving(false); }
    }

    async function doDelete(id) {
        try {
            await apiFetch(`/api/admin/destinos/${id}`, { method: "DELETE" });
            showToast("success", "Destino eliminado");
            setDelTarget(null); load();
        } catch (e) { showToast("error", e.message); }
    }

    const filtered = list.filter(d =>
        d.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        d.paisRegion?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="view-header">
                <div>
                    <h2>Destinos</h2>
                    <p>{list.length} destinos registrados</p>
                </div>
                <button className="btn-primary" onClick={openNew}>+ Nuevo Destino</button>
            </div>

            <div className="search-row">
                <input type="search" placeholder="Buscar destino o país..." value={search}
                    onChange={e => setSearch(e.target.value)} className="search-input" />
            </div>

            {loading ? <p className="loading">Cargando...</p> : (
                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Imagen</th><th>Nombre</th><th>País/Región</th>
                                <th>Slug</th><th>Estado</th><th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(d => (
                                <tr key={d.id}>
                                    <td>
                                        {d.imagenPortada
                                            ? <img src={d.imagenPortada} alt="" className="tbl-thumb" />
                                            : <div className="tbl-thumb-ph">🏔</div>}
                                    </td>
                                    <td><strong>{d.nombre}</strong></td>
                                    <td>{d.paisRegion || "—"}</td>
                                    <td><code>{d.slug}</code></td>
                                    <td>
                                        <span className={`badge ${d.activo ? "badge-green" : "badge-gray"}`}>
                                            {d.activo ? "Activo" : "Inactivo"}
                                        </span>
                                        {d.destacado && <span className="badge badge-purple ml">⭐ Destacado</span>}
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="btn-edit" onClick={() => openEdit(d)}>✏️ Editar</button>
                                            <button className="btn-del" onClick={() => setDelTarget(d)}>🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="6" className="empty">Sin resultados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* FORM MODAL */}
            {showForm && (
                <Modal title={editId ? "Editar Destino" : "Nuevo Destino"} onClose={() => setShowForm(false)} wide>
                    <div className="form-grid">
                        <div className="field">
                            <label>Nombre *</label>
                            <input value={form.nombre} onChange={e => {
                                const v = e.target.value;
                                setForm(f => ({ ...f, nombre: v, slug: editId ? f.slug : toSlug(v) }));
                            }} />
                        </div>
                        <div className="field">
                            <label>Slug *</label>
                            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                        </div>
                        <div className="field">
                            <label>País / Región</label>
                            <input value={form.paisRegion} onChange={e => setForm(f => ({ ...f, paisRegion: e.target.value }))} />
                        </div>
                        <div className="field">
                            <label>Orden</label>
                            <input type="number" value={form.orden} onChange={e => setForm(f => ({ ...f, orden: +e.target.value }))} />
                        </div>
                        <div className="field span2">
                            <label>URL imagen de portada *</label>
                            <input value={form.imagenPortada} placeholder="https://..." onChange={e => setForm(f => ({ ...f, imagenPortada: e.target.value }))} />
                            {form.imagenPortada && <img src={form.imagenPortada} alt="preview" className="img-preview" />}
                        </div>
                        <div className="field span2">
                            <label>Descripción corta</label>
                            <input value={form.descripcionCorta} onChange={e => setForm(f => ({ ...f, descripcionCorta: e.target.value }))} />
                        </div>
                        <div className="field span2">
                            <label>Descripción completa *</label>
                            <textarea rows={5} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
                        </div>
                        <div className="field">
                            <label className="check-label">
                                <input type="checkbox" checked={form.destacado} onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))} />
                                ⭐ Destacado en inicio
                            </label>
                        </div>
                        <div className="field">
                            <label className="check-label">
                                <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} />
                                ✅ Activo (visible en web)
                            </label>
                        </div>
                    </div>

                    {/* GALERÍA */}
                    <div className="gallery-section">
                        <div className="section-row">
                            <h4>📸 Galería de imágenes</h4>
                            <button className="btn-secondary sm" onClick={() => setGaleria(g => [...g, { imagen: "", epigrafe: "" }])}>+ Agregar foto</button>
                        </div>
                        {galeria.map((g, i) => (
                            <div className="gallery-row" key={i}>
                                <input placeholder="URL de imagen" value={g.imagen}
                                    onChange={e => setGaleria(gl => gl.map((x, j) => j === i ? { ...x, imagen: e.target.value } : x))} />
                                <input placeholder="Epígrafe (opcional)" value={g.epigrafe}
                                    onChange={e => setGaleria(gl => gl.map((x, j) => j === i ? { ...x, epigrafe: e.target.value } : x))} />
                                <button className="btn-del sm" onClick={() => setGaleria(gl => gl.filter((_, j) => j !== i))}>✕</button>
                            </div>
                        ))}
                        {galeria.length === 0 && <p className="hint">Sin fotos de galería agregadas aún.</p>}
                    </div>

                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                        <button className="btn-primary" onClick={save} disabled={saving}>
                            {saving ? "Guardando..." : editId ? "Guardar cambios" : "Crear destino"}
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

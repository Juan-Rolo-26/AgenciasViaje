import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Modal from "./Modal.jsx";

const EMPTY = {
    nombre: "", slug: "", descripcionCorta: "", descripcion: "",
    imagenPortada: "", precioPesos: 0, precioDolares: 0,
    destacado: false, activo: true, orden: 0,
};

function toSlug(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function parseSlugs(raw) {
    try { return JSON.parse(raw || "[]"); } catch { return []; }
}

export default function ModoFanaticoView() {
    const { apiFetch, showToast } = useAdmin();
    const [list, setList] = useState([]);
    const [ofertas, setOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(EMPTY);
    const [imagenes, setImagenes] = useState([]);
    const [ofertasSlugs, setOfertasSlugs] = useState([]);
    const [slugInput, setSlugInput] = useState("");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [delTarget, setDelTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [items, ofs] = await Promise.all([
                apiFetch("/api/admin/modo-fanatico"),
                apiFetch("/api/admin/ofertas"),
            ]);
            setList(items);
            setOfertas(ofs);
        }
        catch { showToast("error", "Error al cargar Modo Fanático"); }
        finally { setLoading(false); }
    }, [apiFetch, showToast]);

    useEffect(() => { load(); }, [load]);

    function openNew() {
        setEditId(null); setForm(EMPTY); setImagenes([]); setOfertasSlugs([]); setSlugInput(""); setShowForm(true);
    }

    function openEdit(item) {
        setEditId(item.id);
        setForm({
            nombre: item.nombre || "", slug: item.slug || "",
            descripcionCorta: item.descripcionCorta || "",
            descripcion: item.descripcion || "",
            imagenPortada: item.imagenPortada || "",
            precioPesos: item.precioPesos || 0,
            precioDolares: item.precioDolares || 0,
            destacado: !!item.destacado,
            activo: item.activo !== false,
            orden: item.orden || 0,
        });
        setImagenes((item.imagenes || []).map(img => ({ imagen: img.imagen, epigrafe: img.epigrafe || "" })));
        setOfertasSlugs(parseSlugs(item.ofertasSlugs));
        setSlugInput("");
        setShowForm(true);
    }

    async function save() {
        if (!form.nombre || !form.slug || !form.descripcion || !form.imagenPortada) {
            showToast("error", "Nombre, slug, descripción e imagen de portada son requeridos"); return;
        }
        setSaving(true);
        try {
            const body = {
                ...form,
                precioPesos: Number(form.precioPesos || 0),
                precioDolares: Number(form.precioDolares || 0),
                ofertasSlugs: JSON.stringify(ofertasSlugs),
                imagenes: imagenes.filter(img => img.imagen),
            };
            if (editId) {
                await apiFetch(`/api/admin/modo-fanatico/${editId}`, { method: "PUT", body });
                showToast("success", "Experiencia actualizada ✓");
            } else {
                await apiFetch("/api/admin/modo-fanatico", { method: "POST", body });
                showToast("success", "Experiencia creada ✓");
            }
            setShowForm(false); load();
        } catch (e) { showToast("error", e.message); }
        finally { setSaving(false); }
    }

    async function doDelete(id) {
        try {
            await apiFetch(`/api/admin/modo-fanatico/${id}`, { method: "DELETE" });
            showToast("success", "Eliminado"); setDelTarget(null); load();
        } catch (e) { showToast("error", e.message); }
    }

    function addSlug(slug) {
        const s = (slug || slugInput).trim();
        if (!s || ofertasSlugs.includes(s)) return;
        setOfertasSlugs(prev => [...prev, s]);
        setSlugInput("");
    }

    function removeSlug(slug) {
        setOfertasSlugs(prev => prev.filter(s => s !== slug));
    }

    const filtered = list.filter(item =>
        item.nombre?.toLowerCase().includes(search.toLowerCase())
    );

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

    // Ofertas disponibles para el picker (excluye las ya agregadas)
    const ofertasDisponibles = ofertas.filter(o => !ofertasSlugs.includes(o.slug));

    return (
        <div>
            <div className="view-header">
                <div>
                    <h2>Modo Fanático</h2>
                    <p>{list.length} experiencias registradas</p>
                </div>
                <button className="btn-primary" onClick={openNew}>+ Nueva Experiencia</button>
            </div>

            <div className="search-row">
                <input type="search" placeholder="Buscar por nombre..." value={search}
                    onChange={e => setSearch(e.target.value)} className="search-input" />
            </div>

            {loading ? <p className="loading">Cargando...</p> : (
                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Imagen</th><th>Nombre</th><th>Precio ARS</th><th>Precio USD</th><th>Paquetes</th><th>Estado</th><th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        {item.imagenPortada
                                            ? <img src={item.imagenPortada} alt="" className="tbl-thumb" />
                                            : <div className="tbl-thumb-ph">⚽</div>}
                                    </td>
                                    <td>
                                        <strong>{item.nombre}</strong>
                                        <div className="slug-hint"><code>{item.slug}</code></div>
                                        {item.descripcionCorta && <div className="hint">{item.descripcionCorta}</div>}
                                    </td>
                                    <td>{item.precioPesos ? `ARS $${Number(item.precioPesos).toLocaleString("es-AR")}` : "—"}</td>
                                    <td>{item.precioDolares ? `USD $${Number(item.precioDolares).toLocaleString("es-AR")}` : "—"}</td>
                                    <td>
                                        <span className="hint">{parseSlugs(item.ofertasSlugs).length} paquete(s)</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${item.activo ? "badge-green" : "badge-gray"}`}>
                                            {item.activo ? "Activo" : "Inactivo"}
                                        </span>
                                        {item.destacado && <span className="badge badge-amber ml">⭐</span>}
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="btn-edit" onClick={() => openEdit(item)}>✏️</button>
                                            <button className="btn-del" onClick={() => setDelTarget(item)}>🗑</button>
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
                <Modal title={editId ? "Editar Experiencia" : "Nueva Experiencia Modo Fanático"} onClose={() => setShowForm(false)} wide>
                    <div className="form-section">
                        <h4>Información básica</h4>
                        <div className="form-grid">
                            <div className="field span2">
                                <label>Nombre *</label>
                                <input value={form.nombre} onChange={e => {
                                    const v = e.target.value;
                                    setForm(f => ({ ...f, nombre: v, slug: editId ? f.slug : toSlug(v) }));
                                }} />
                            </div>
                            <div className="field">
                                <label>Slug *</label>
                                <input value={form.slug} onChange={set("slug")} />
                            </div>
                            <div className="field">
                                <label>Orden</label>
                                <input type="number" value={form.orden} onChange={e => setForm(f => ({ ...f, orden: +e.target.value }))} />
                            </div>
                            <div className="field">
                                <label>Precio desde (ARS)</label>
                                <input type="number" min="0" value={form.precioPesos} onChange={set("precioPesos")} />
                            </div>
                            <div className="field">
                                <label>Precio desde (USD)</label>
                                <input type="number" min="0" value={form.precioDolares} onChange={set("precioDolares")} />
                            </div>
                            <div className="field span2">
                                <label>Descripción corta</label>
                                <input value={form.descripcionCorta} onChange={set("descripcionCorta")} placeholder="Frase corta visible en la card..." />
                            </div>
                            <div className="field span2">
                                <label>Descripción completa *</label>
                                <textarea rows={6} value={form.descripcion} onChange={set("descripcion")} />
                            </div>
                            <div className="field span2">
                                <label>URL imagen de portada *</label>
                                <input value={form.imagenPortada} onChange={set("imagenPortada")} placeholder="https://... o /assets/destinos/..." />
                                {form.imagenPortada && <img src={form.imagenPortada} alt="preview" className="img-preview" />}
                            </div>
                            <div className="field">
                                <label className="check-label">
                                    <input type="checkbox" checked={form.destacado} onChange={set("destacado")} />
                                    ⭐ Destacado en inicio
                                </label>
                            </div>
                            <div className="field">
                                <label className="check-label">
                                    <input type="checkbox" checked={form.activo} onChange={set("activo")} />
                                    ✅ Activo (visible en web)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* PAQUETES RELACIONADOS */}
                    <div className="form-section">
                        <h4>🧳 Paquetes relacionados</h4>
                        <p className="hint" style={{ marginBottom: 12 }}>
                            Asigná los paquetes/ofertas que se mostrarán en la página de esta experiencia.
                        </p>

                        {/* Picker por dropdown */}
                        {ofertasDisponibles.length > 0 && (
                            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                                <select
                                    className="field-input"
                                    value=""
                                    onChange={e => { if (e.target.value) addSlug(e.target.value); }}
                                    style={{ flex: 1 }}
                                >
                                    <option value="">— Seleccioná un paquete para agregar —</option>
                                    {ofertasDisponibles.map(o => (
                                        <option key={o.id} value={o.slug}>
                                            {o.titulo} ({o.slug})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Ingreso manual de slug */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                            <input
                                placeholder="O escribí el slug manualmente y presioná Agregar"
                                value={slugInput}
                                onChange={e => setSlugInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addSlug()}
                                style={{ flex: 1 }}
                            />
                            <button className="btn-secondary sm" onClick={() => addSlug()}>+ Agregar</button>
                        </div>

                        {/* Lista de slugs agregados */}
                        {ofertasSlugs.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {ofertasSlugs.map((slug, i) => {
                                    const oferta = ofertas.find(o => o.slug === slug);
                                    return (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8f9fa", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                                            <span style={{ flex: 1 }}>
                                                <strong>{oferta ? oferta.titulo : slug}</strong>
                                                {oferta && <span className="hint" style={{ marginLeft: 8 }}>{slug}</span>}
                                                {!oferta && <span className="hint" style={{ marginLeft: 8, color: "#f59e0b" }}>⚠ No encontrado en BD</span>}
                                            </span>
                                            <button className="btn-del sm" onClick={() => removeSlug(slug)}>✕</button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="hint">Sin paquetes asignados aún.</p>
                        )}
                    </div>

                    {/* GALERÍA */}
                    <div className="gallery-section">
                        <div className="section-row">
                            <h4>📸 Galería de imágenes</h4>
                            <button className="btn-secondary sm" onClick={() => setImagenes(imgs => [...imgs, { imagen: "", epigrafe: "" }])}>+ Agregar foto</button>
                        </div>
                        {imagenes.map((img, i) => (
                            <div className="gallery-row" key={i}>
                                <input placeholder="URL de imagen" value={img.imagen}
                                    onChange={e => setImagenes(imgs => imgs.map((x, j) => j === i ? { ...x, imagen: e.target.value } : x))} />
                                <input placeholder="Epígrafe (opcional)" value={img.epigrafe}
                                    onChange={e => setImagenes(imgs => imgs.map((x, j) => j === i ? { ...x, epigrafe: e.target.value } : x))} />
                                <button className="btn-del sm" onClick={() => setImagenes(imgs => imgs.filter((_, j) => j !== i))}>✕</button>
                            </div>
                        ))}
                        {imagenes.length === 0 && <p className="hint">Sin fotos de galería agregadas aún.</p>}
                    </div>

                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                        <button className="btn-primary" onClick={save} disabled={saving}>
                            {saving ? "Guardando..." : editId ? "Guardar cambios" : "Crear experiencia"}
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

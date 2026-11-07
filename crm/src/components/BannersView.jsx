import { useEffect, useRef, useState, useCallback } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Modal from "./Modal.jsx";

const EMPTY = {
    titulo: "", subtitulo: "", imagen: "", linkUrl: "", linkTexto: "",
    colorTexto: "#ffffff", alturaPx: 300, activo: true, orden: 0,
};

const ALTURAS = [
    { label: "Pequeño — 180px", value: 180 },
    { label: "Mediano — 260px", value: 260 },
    { label: "Estándar — 300px", value: 300 },
    { label: "Grande — 380px", value: 380 },
    { label: "Extra grande — 460px", value: 460 },
    { label: "Hero completo — 560px", value: 560 },
];

export default function BannersView() {
    const { apiFetch, token, showToast } = useAdmin();
    const [list, setList] = useState([]);
    const [destinos, setDestinos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [delTarget, setDelTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [destinoSearch, setDestinoSearch] = useState("");
    const fileInputRef = useRef(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [items, dests] = await Promise.all([
                apiFetch("/api/admin/banners"),
                apiFetch("/api/admin/destinos"),
            ]);
            setList(items);
            setDestinos(dests);
        } catch { showToast("error", "Error al cargar banners"); }
        finally { setLoading(false); }
    }, [apiFetch, showToast]);

    useEffect(() => { load(); }, [load]);

    async function uploadFile(file) {
        if (!file || !file.type.startsWith("image/")) {
            showToast("error", "Solo se permiten imágenes"); return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("imagen", file);
            const res = await fetch("/api/admin/banners/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al subir");
            setForm(f => ({ ...f, imagen: data.url }));
            showToast("success", "Imagen subida");
        } catch (e) {
            showToast("error", e.message || "Error al subir imagen");
        } finally { setUploading(false); }
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
        e.target.value = "";
    }

    function handleDrop(e) {
        e.preventDefault(); setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    }

    function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

    function openNew() { setEditId(null); setForm(EMPTY); setDestinoSearch(""); setShowForm(true); }

    function openEdit(item) {
        setEditId(item.id);
        setForm({
            titulo: item.titulo || "", subtitulo: item.subtitulo || "",
            imagen: item.imagen || "", linkUrl: item.linkUrl || "",
            linkTexto: item.linkTexto || "", colorTexto: item.colorTexto || "#ffffff",
            alturaPx: item.alturaPx ?? 300, activo: item.activo !== false, orden: item.orden ?? 0,
        });
        setDestinoSearch("");
        setShowForm(true);
    }

    async function save() {
        if (!form.imagen) { showToast("error", "La imagen es requerida"); return; }
        setSaving(true);
        try {
            const body = { ...form, orden: Number(form.orden), alturaPx: Number(form.alturaPx) };
            if (editId) {
                await apiFetch(`/api/admin/banners/${editId}`, { method: "PUT", body });
            } else {
                await apiFetch("/api/admin/banners", { method: "POST", body });
            }
            showToast("success", editId ? "Banner actualizado" : "Banner creado");
            setShowForm(false);
            load();
        } catch { showToast("error", "Error al guardar"); }
        finally { setSaving(false); }
    }

    async function confirmDelete() {
        try {
            await apiFetch(`/api/admin/banners/${delTarget.id}`, { method: "DELETE" });
            showToast("success", "Banner eliminado");
            setDelTarget(null);
            load();
        } catch { showToast("error", "Error al eliminar"); }
    }

    return (
        <div className="view-container">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Banners del Hero</h2>
                    <p className="view-subtitle">Aparecen debajo del buscador y rotan automáticamente cada 20 segundos.</p>
                </div>
                <button className="btn-primary" onClick={openNew}>+ Nuevo Banner</button>
            </div>

            {loading ? (
                <div className="loading-state">Cargando...</div>
            ) : list.length === 0 ? (
                <div className="bv-empty">
                    <div className="bv-empty-icon">🖼️</div>
                    <p className="bv-empty-title">Todavía no hay banners</p>
                    <p className="bv-empty-sub">Creá el primero y va a aparecer en la página principal.</p>
                    <button className="btn-primary" onClick={openNew}>Crear primer banner</button>
                </div>
            ) : (
                <div className="bv-list">
                    {list.map((b) => (
                        <div key={b.id} className={`bv-card${!b.activo ? " bv-card--off" : ""}`}>
                            <div className="bv-card-thumb">
                                <img src={b.imagen} alt={b.titulo || "Banner"} />
                                <span className="bv-card-orden">#{b.orden}</span>
                            </div>
                            <div className="bv-card-body">
                                <div className="bv-card-info">
                                    <p className="bv-card-name">{b.titulo || <em>Sin título</em>}</p>
                                    {b.subtitulo && <p className="bv-card-sub">{b.subtitulo}</p>}
                                    {b.linkUrl && (
                                        <p className="bv-card-link">
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                            {b.linkUrl}
                                        </p>
                                    )}
                                </div>
                                <div className="bv-card-right">
                                    <span className={`badge ${b.activo ? "badge-green" : "badge-gray"}`}>
                                        {b.activo ? "Activo" : "Inactivo"}
                                    </span>
                                    <div className="row-actions">
                                        <button className="btn-icon" onClick={() => openEdit(b)}>✏️ Editar</button>
                                        <button className="btn-del sm" onClick={() => setDelTarget(b)}>🗑</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── FORM MODAL ── */}
            {showForm && (
                <Modal title={editId ? "Editar Banner" : "Nuevo Banner"} wide onClose={() => setShowForm(false)}>
                    {/* IMAGE SECTION */}
                    <div className="bv-section">
                        <p className="bv-section-label">Imagen del banner <span className="bv-req">*</span></p>

                        <div
                            className={`bv-drop${dragOver ? " bv-drop--over" : ""}${form.imagen ? " bv-drop--filled" : ""}`}
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            {uploading ? (
                                <div className="bv-drop-loading">
                                    <div className="bv-spinner" />
                                    <span>Subiendo imagen…</span>
                                </div>
                            ) : form.imagen ? (
                                <>
                                    <img src={form.imagen} alt="preview" className="bv-drop-img" />
                                    <div className="bv-drop-hover">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                        <span>Cambiar imagen</span>
                                    </div>
                                </>
                            ) : (
                                <div className="bv-drop-placeholder">
                                    <div className="bv-drop-circle">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                    </div>
                                    <p className="bv-drop-text">Arrastrá una imagen aquí o <span className="bv-drop-link">hacé clic para seleccionar</span></p>
                                    <p className="bv-drop-hint">JPG, PNG, WebP — máx. 10 MB · Recomendado: 1920 × 300 px</p>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

                        <div className="bv-url-row">
                            <span className="bv-url-label">o pegá una URL de imagen</span>
                            <input
                                className="bv-url-input field input"
                                value={form.imagen}
                                onChange={e => set("imagen", e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* TEXT SECTION */}
                    <div className="bv-section">
                        <p className="bv-section-label">Texto sobre la imagen <span className="bv-opt">(opcional)</span></p>
                        <div className="form-grid">
                            <div className="field">
                                <label>Título</label>
                                <input value={form.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Ej: Viajes a Europa desde $1200" />
                            </div>
                            <div className="field">
                                <label>Subtítulo</label>
                                <input value={form.subtitulo} onChange={e => set("subtitulo", e.target.value)} placeholder="Ej: Salidas garantizadas en julio" />
                            </div>
                            <div className="field">
                                <label>Texto del botón CTA</label>
                                <input value={form.linkTexto} onChange={e => set("linkTexto", e.target.value)} placeholder="Ver ofertas" />
                            </div>
                        </div>
                    </div>

                    {/* DESTINO SECTION */}
                    <div className="bv-section">
                        <p className="bv-section-label">Destino al que redirige <span className="bv-opt">(opcional)</span></p>

                        {/* Destino seleccionado */}
                        {form.linkUrl && form.linkUrl.startsWith("/destinos/") ? (
                            <div className="bv-destino-selected">
                                <div className="bv-destino-selected-info">
                                    <span className="bv-destino-selected-icon">📍</span>
                                    <div>
                                        <p className="bv-destino-selected-name">
                                            {destinos.find(d => `/destinos/${d.slug}` === form.linkUrl)?.nombre || form.linkUrl}
                                        </p>
                                        <p className="bv-destino-selected-url">{form.linkUrl}</p>
                                    </div>
                                </div>
                                <button type="button" className="bv-destino-clear" onClick={() => set("linkUrl", "")}>✕ Quitar</button>
                            </div>
                        ) : (
                            <>
                                <input
                                    className="bv-destino-search"
                                    value={destinoSearch}
                                    onChange={e => setDestinoSearch(e.target.value)}
                                    placeholder="Buscar destino por nombre…"
                                />
                                <div className="bv-destino-list">
                                    {destinos
                                        .filter(d => !destinoSearch || d.nombre.toLowerCase().includes(destinoSearch.toLowerCase()))
                                        .slice(0, 40)
                                        .map(d => (
                                            <button
                                                key={d.id}
                                                type="button"
                                                className={`bv-destino-item${form.linkUrl === `/destinos/${d.slug}` ? " active" : ""}`}
                                                onClick={() => set("linkUrl", `/destinos/${d.slug}`)}
                                            >
                                                {d.imagenPortada && (
                                                    <img src={d.imagenPortada} alt="" className="bv-destino-thumb" />
                                                )}
                                                <span>{d.nombre}</span>
                                                {d.paisRegion && <span className="bv-destino-pais">{d.paisRegion}</span>}
                                            </button>
                                        ))
                                    }
                                    {destinos.filter(d => !destinoSearch || d.nombre.toLowerCase().includes(destinoSearch.toLowerCase())).length === 0 && (
                                        <p className="bv-destino-empty">Sin resultados para "{destinoSearch}"</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* CONFIG SECTION */}
                    <div className="bv-section bv-section--last">
                        <p className="bv-section-label">Configuración</p>
                        <div className="bv-config-row">
                            <div className="field" style={{ flex: 1 }}>
                                <label>Alto del banner</label>
                                <div className="bv-altura-row">
                                    {ALTURAS.map(a => (
                                        <button
                                            key={a.value}
                                            type="button"
                                            className={`bv-altura-btn${form.alturaPx === a.value ? " active" : ""}`}
                                            onClick={() => set("alturaPx", a.value)}
                                        >
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bv-config-row" style={{ marginTop: 14 }}>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Color del texto</label>
                                <div className="bv-color-wrap">
                                    <input type="color" value={form.colorTexto} onChange={e => set("colorTexto", e.target.value)} className="bv-color-swatch" />
                                    <input value={form.colorTexto} onChange={e => set("colorTexto", e.target.value)} placeholder="#ffffff" className="bv-color-hex" />
                                </div>
                            </div>
                            <div className="field bv-field-orden">
                                <label>Orden</label>
                                <input type="number" min="0" value={form.orden} onChange={e => set("orden", e.target.value)} />
                            </div>
                            <div className="field bv-field-toggle">
                                <label>Estado</label>
                                <label className="bv-toggle">
                                    <input type="checkbox" checked={form.activo} onChange={e => set("activo", e.target.checked)} />
                                    <span className="bv-toggle-track" />
                                    <span className="bv-toggle-label">{form.activo ? "Activo" : "Inactivo"}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button className="btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                        <button className="btn-primary" onClick={save} disabled={saving || uploading}>
                            {saving ? "Guardando…" : editId ? "Guardar cambios" : "Crear banner"}
                        </button>
                    </div>
                </Modal>
            )}

            {delTarget && (
                <Modal title="Eliminar banner" onClose={() => setDelTarget(null)}>
                    <p style={{ color: "var(--g700)", marginBottom: 4 }}>
                        ¿Eliminás el banner <strong>{delTarget.titulo || `#${delTarget.id}`}</strong>?
                    </p>
                    <p style={{ color: "var(--g500)", fontSize: 13 }}>Esta acción no se puede deshacer.</p>
                    <div className="modal-footer">
                        <button className="btn-outline" onClick={() => setDelTarget(null)}>Cancelar</button>
                        <button className="btn-danger" onClick={confirmDelete}>Eliminar</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

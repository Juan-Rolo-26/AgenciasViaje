import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Modal from "./Modal.jsx";

const EMPTY = {
  nombre: "",
  slug: "",
  destinoId: "",
  naviera: "",
  barco: "",
  tipoCrucero: "",
  fechaSalida: "",
  horaSalida: "18:00",
  duracionNoches: 0,
  precio: 0,
  cupos: 0,
  puertoSalida: "",
  descripcion: "",
  imagenPortada: "",
  activa: true,
  destacada: false,
  orden: 0,
};

function toSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function fmtDate(iso) {
  if (!iso) return "Sin fecha";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CrucerosView() {
  const { apiFetch, showToast } = useAdmin();
  const [list, setList] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [galeria, setGaleria] = useState([]);
  const [saving, setSaving] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cruceros, destinosData] = await Promise.all([
        apiFetch("/api/admin/cruceros"),
        apiFetch("/api/admin/destinos"),
      ]);
      setList(cruceros);
      setDestinos(destinosData);
    } catch {
      showToast("error", "Error al cargar cruceros");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setEditItem(null);
    setForm(EMPTY);
    setGaleria([]);
    setShowForm(true);
  }

  function openEdit(crucero) {
    setEditItem(crucero);
    setForm({
      nombre: crucero.nombre || "",
      slug: crucero.slug || "",
      destinoId: String(crucero.destinoId || ""),
      naviera: crucero.naviera || "",
      barco: crucero.barco || "",
      tipoCrucero: crucero.tipoCrucero || "",
      fechaSalida: crucero.fechaSalida ? crucero.fechaSalida.slice(0, 10) : "",
      horaSalida: crucero.horaSalida || "18:00",
      duracionNoches: crucero.duracionNoches || 0,
      precio: crucero.precio || 0,
      cupos: crucero.cupos || 0,
      puertoSalida: crucero.puertoSalida || "",
      descripcion: crucero.descripcion || "",
      imagenPortada: crucero.imagenPortada || "",
      activa: crucero.activa !== false,
      destacada: !!crucero.destacada,
      orden: crucero.orden || 0,
    });
    setGaleria(
      (crucero.galeria || []).map((item) => ({
        imagen: item.imagen,
        epigrafe: item.epigrafe || "",
      }))
    );
    setShowForm(true);
  }

  async function save() {
    if (
      !form.nombre ||
      !form.slug ||
      !form.destinoId ||
      !form.fechaSalida ||
      !form.puertoSalida ||
      !form.descripcion ||
      !form.imagenPortada
    ) {
      showToast(
        "error",
        "Nombre, slug, destino, fecha, puerto, descripción e imagen son requeridos"
      );
      return;
    }

    setSaving(true);
    try {
      const body = {
        ...form,
        destinoId: Number(form.destinoId),
        duracionNoches: Number(form.duracionNoches),
        precio: Number(form.precio),
        cupos: Number(form.cupos),
        orden: Number(form.orden),
        fechaSalida: new Date(form.fechaSalida).toISOString(),
        galeria: galeria.filter((item) => item.imagen),
      };

      if (editItem) {
        await apiFetch(`/api/admin/cruceros/${editItem.id}`, {
          method: "PUT",
          body,
        });
        showToast("success", "Crucero actualizado ✓");
      } else {
        await apiFetch("/api/admin/cruceros", { method: "POST", body });
        showToast("success", "Crucero creado ✓");
      }

      setShowForm(false);
      load();
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActiva(crucero) {
    try {
      await apiFetch(`/api/admin/cruceros/${crucero.id}`, {
        method: "PUT",
        body: { activa: !crucero.activa },
      });
      showToast(
        "success",
        `Crucero ${!crucero.activa ? "activado" : "desactivado"}`
      );
      load();
    } catch (error) {
      showToast("error", error.message);
    }
  }

  async function doDelete(id) {
    try {
      await apiFetch(`/api/admin/cruceros/${id}`, { method: "DELETE" });
      showToast("success", "Crucero eliminado");
      setDelTarget(null);
      load();
    } catch (error) {
      showToast("error", error.message);
    }
  }

  const filtered = list.filter((crucero) => {
    const query = search.toLowerCase();
    return (
      crucero.nombre?.toLowerCase().includes(query) ||
      crucero.destino?.nombre?.toLowerCase().includes(query) ||
      crucero.naviera?.toLowerCase().includes(query) ||
      crucero.barco?.toLowerCase().includes(query)
    );
  });

  const set = (key) => (event) =>
    setForm((prev) => ({
      ...prev,
      [key]:
        event.target.type === "checkbox" ? event.target.checked : event.target.value,
    }));

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Cruceros</h2>
          <p>{list.length} cruceros registrados</p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          + Nuevo Crucero
        </button>
      </div>

      <div className="search-row">
        <input
          type="search"
          placeholder="Buscar por nombre, destino, naviera o barco..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p className="loading">Cargando...</p>
      ) : (
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Crucero</th>
                <th>Destino</th>
                <th>Salida</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((crucero) => (
                <tr key={crucero.id}>
                  <td>
                    {crucero.imagenPortada ? (
                      <img src={crucero.imagenPortada} alt="" className="tbl-thumb" />
                    ) : (
                      <div className="tbl-thumb-ph">🚢</div>
                    )}
                  </td>
                  <td>
                    <strong>{crucero.nombre}</strong>
                    <div className="slug-hint">
                      <code>{crucero.slug}</code>
                    </div>
                    <div className="hint">
                      {[crucero.naviera, crucero.barco].filter(Boolean).join(" • ") ||
                        "Sin naviera ni barco"}
                    </div>
                  </td>
                  <td>{crucero.destino?.nombre || "—"}</td>
                  <td>
                    <div className="fecha-td">{fmtDate(crucero.fechaSalida)}</div>
                    <div className="hint">
                      {crucero.duracionNoches
                        ? `${crucero.duracionNoches} noches`
                        : "Duración a confirmar"}
                    </div>
                  </td>
                  <td>
                    <button
                      className={`badge badge-toggle ${
                        crucero.activa ? "badge-green" : "badge-gray"
                      }`}
                      onClick={() => toggleActiva(crucero)}
                    >
                      {crucero.activa ? "✅ Activo" : "⏸ Inactivo"}
                    </button>
                    {crucero.destacada ? (
                      <span className="badge badge-amber ml">⭐</span>
                    ) : null}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-edit" onClick={() => openEdit(crucero)}>
                        ✏️
                      </button>
                      <button className="btn-del" onClick={() => setDelTarget(crucero)}>
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">
                    Sin resultados
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      {showForm ? (
        <Modal
          title={editItem ? `Editar: ${editItem.nombre}` : "Nuevo Crucero"}
          onClose={() => setShowForm(false)}
          wide
        >
          <div className="form-section">
            <h4>Información básica</h4>
            <div className="form-grid">
              <div className="field span2">
                <label>Nombre *</label>
                <input
                  value={form.nombre}
                  onChange={(event) => {
                    const value = event.target.value;
                    setForm((prev) => ({
                      ...prev,
                      nombre: value,
                      slug: editItem ? prev.slug : toSlug(value),
                    }));
                  }}
                />
              </div>
              <div className="field">
                <label>Slug *</label>
                <input value={form.slug} onChange={set("slug")} />
              </div>
              <div className="field">
                <label>Destino *</label>
                <select value={form.destinoId} onChange={set("destinoId")}>
                  <option value="">Seleccioná un destino...</option>
                  {destinos.map((destino) => (
                    <option key={destino.id} value={destino.id}>
                      {destino.nombre} — {destino.paisRegion}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Naviera</label>
                <input value={form.naviera} onChange={set("naviera")} />
              </div>
              <div className="field">
                <label>Barco</label>
                <input value={form.barco} onChange={set("barco")} />
              </div>
              <div className="field">
                <label>Tipo de crucero</label>
                <input
                  value={form.tipoCrucero}
                  onChange={set("tipoCrucero")}
                  placeholder="Ej: Caribe, Mediterráneo, fluvial..."
                />
              </div>
              <div className="field">
                <label>Fecha de salida *</label>
                <input type="date" value={form.fechaSalida} onChange={set("fechaSalida")} />
              </div>
              <div className="field">
                <label>Hora de salida</label>
                <input type="time" value={form.horaSalida} onChange={set("horaSalida")} />
              </div>
              <div className="field">
                <label>Noches</label>
                <input
                  type="number"
                  min="0"
                  value={form.duracionNoches}
                  onChange={set("duracionNoches")}
                />
              </div>
              <div className="field">
                <label>Precio desde (ARS)</label>
                <input type="number" min="0" value={form.precio} onChange={set("precio")} />
              </div>
              <div className="field">
                <label>Cupos disponibles</label>
                <input type="number" min="0" value={form.cupos} onChange={set("cupos")} />
              </div>
              <div className="field span2">
                <label>Puerto de salida *</label>
                <input
                  value={form.puertoSalida}
                  onChange={set("puertoSalida")}
                  placeholder="Ej: Buenos Aires, Barcelona, Miami..."
                />
              </div>
              <div className="field span2">
                <label>URL imagen de portada *</label>
                <input
                  value={form.imagenPortada}
                  onChange={set("imagenPortada")}
                  placeholder="https://..."
                />
                {form.imagenPortada ? (
                  <img src={form.imagenPortada} alt="preview" className="img-preview" />
                ) : null}
              </div>
              <div className="field span2">
                <label>Descripción *</label>
                <textarea
                  rows={5}
                  value={form.descripcion}
                  onChange={set("descripcion")}
                />
              </div>
              <div className="field">
                <label>Orden</label>
                <input type="number" value={form.orden} onChange={set("orden")} />
              </div>
              <div className="field">
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={form.destacada}
                    onChange={set("destacada")}
                  />
                  ⭐ Destacado en inicio
                </label>
              </div>
              <div className="field">
                <label className="check-label">
                  <input type="checkbox" checked={form.activa} onChange={set("activa")} />
                  ✅ Activo (visible en web)
                </label>
              </div>
            </div>
          </div>

          <div className="gallery-section">
            <div className="section-row">
              <h4>📸 Galería del crucero</h4>
              <button
                className="btn-secondary sm"
                onClick={() =>
                  setGaleria((prev) => [...prev, { imagen: "", epigrafe: "" }])
                }
              >
                + Agregar foto
              </button>
            </div>
            {galeria.map((item, index) => (
              <div className="gallery-row" key={index}>
                <input
                  placeholder="URL de imagen"
                  value={item.imagen}
                  onChange={(event) =>
                    setGaleria((prev) =>
                      prev.map((current, currentIndex) =>
                        currentIndex === index
                          ? { ...current, imagen: event.target.value }
                          : current
                      )
                    )
                  }
                />
                <input
                  placeholder="Epígrafe (opcional)"
                  value={item.epigrafe}
                  onChange={(event) =>
                    setGaleria((prev) =>
                      prev.map((current, currentIndex) =>
                        currentIndex === index
                          ? { ...current, epigrafe: event.target.value }
                          : current
                      )
                    )
                  }
                />
                <button
                  className="btn-del sm"
                  onClick={() =>
                    setGaleria((prev) =>
                      prev.filter((_, currentIndex) => currentIndex !== index)
                    )
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            {galeria.length === 0 ? (
              <p className="hint">Sin fotos adicionales cargadas aún.</p>
            ) : null}
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={save} disabled={saving}>
              {saving
                ? "Guardando..."
                : editItem
                  ? "Guardar cambios"
                  : "Crear crucero"}
            </button>
          </div>
        </Modal>
      ) : null}

      {delTarget ? (
        <Modal title="Confirmar eliminación" onClose={() => setDelTarget(null)}>
          <p>
            ¿Eliminar <strong>{delTarget.nombre}</strong>?
          </p>
          <p className="hint">Esta acción es permanente.</p>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setDelTarget(null)}>
              Cancelar
            </button>
            <button className="btn-danger" onClick={() => doDelete(delTarget.id)}>
              Sí, eliminar
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

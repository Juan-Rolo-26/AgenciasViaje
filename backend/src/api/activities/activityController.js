const activityService = require("../../services/activityService");

async function listActividades(req, res, next) {
  try {
    const activas = req.query.activas !== "false";
    const actividades = await activityService.listActividades({ activas });
    res.json(actividades);
  } catch (error) {
    next(error);
  }
}

async function getActividadById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const actividad = await activityService.getActividadById(id);
    if (!actividad) {
      return res.status(404).json({ error: "Actividad no encontrada" });
    }
    res.json(actividad);
  } catch (error) {
    next(error);
  }
}

async function getActividadBySlug(req, res, next) {
  try {
    const actividad = await activityService.getActividadBySlug(req.params.slug);
    if (!actividad) {
      return res.status(404).json({ error: "Actividad no encontrada" });
    }
    res.json(actividad);
  } catch (error) {
    next(error);
  }
}

async function createActividad(req, res, next) {
  try {
    const { nombre, slug, destinoId, fecha, precio, puntoEncuentro, descripcion, imagenPortada } =
      req.body || {};

    if (
      !nombre ||
      !slug ||
      !destinoId ||
      !fecha ||
      !precio ||
      !puntoEncuentro ||
      !descripcion ||
      !imagenPortada
    ) {
      return res.status(400).json({
        error:
          "nombre, slug, destinoId, fecha, precio, puntoEncuentro, descripcion e imagenPortada son obligatorios"
      });
    }

    const payload = {
      ...req.body,
      destinoId: Number(destinoId)
    };

    const actividad = await activityService.createActividad(payload);
    res.status(201).json(actividad);
  } catch (error) {
    next(error);
  }
}

async function updateActividad(req, res, next) {
  try {
    const id = Number(req.params.id);
    const payload = { ...req.body };

    if (payload.destinoId) {
      payload.destinoId = Number(payload.destinoId);
    }

    const actividad = await activityService.updateActividad(id, payload);
    res.json(actividad);
  } catch (error) {
    next(error);
  }
}

async function deleteActividad(req, res, next) {
  try {
    const id = Number(req.params.id);
    await activityService.deleteActividad(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listActividades,
  getActividadById,
  getActividadBySlug,
  createActividad,
  updateActividad,
  deleteActividad
};

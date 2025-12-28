const aboutService = require("../../services/aboutService");

async function listSecciones(req, res, next) {
  try {
    const secciones = await aboutService.listSecciones();
    res.json(secciones);
  } catch (error) {
    next(error);
  }
}

async function getSeccionById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const seccion = await aboutService.getSeccionById(id);
    if (!seccion) {
      return res.status(404).json({ error: "Sección no encontrada" });
    }
    res.json(seccion);
  } catch (error) {
    next(error);
  }
}

async function createSeccion(req, res, next) {
  try {
    const { titulo, contenido } = req.body || {};
    if (!titulo || !contenido) {
      return res
        .status(400)
        .json({ error: "titulo y contenido son obligatorios" });
    }
    const seccion = await aboutService.createSeccion(req.body);
    res.status(201).json(seccion);
  } catch (error) {
    next(error);
  }
}

async function updateSeccion(req, res, next) {
  try {
    const id = Number(req.params.id);
    const seccion = await aboutService.updateSeccion(id, req.body || {});
    res.json(seccion);
  } catch (error) {
    next(error);
  }
}

async function deleteSeccion(req, res, next) {
  try {
    const id = Number(req.params.id);
    await aboutService.deleteSeccion(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listSecciones,
  getSeccionById,
  createSeccion,
  updateSeccion,
  deleteSeccion
};

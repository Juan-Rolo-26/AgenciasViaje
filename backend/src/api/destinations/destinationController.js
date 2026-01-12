const destinationService = require("../../services/destinationService");

async function listDestinos(req, res, next) {
  try {
    const activos = req.query.activos !== "false";
    const lite = req.query.lite === "1";
    const destinos = await destinationService.listDestinos({ activos, lite });
    res.json(destinos);
  } catch (error) {
    next(error);
  }
}

async function getDestinoById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const destino = await destinationService.getDestinoById(id);
    if (!destino) {
      return res.status(404).json({ error: "Destino no encontrado" });
    }
    res.json(destino);
  } catch (error) {
    next(error);
  }
}

async function getDestinoBySlug(req, res, next) {
  try {
    const destino = await destinationService.getDestinoBySlug(req.params.slug);
    if (!destino) {
      return res.status(404).json({ error: "Destino no encontrado" });
    }
    res.json(destino);
  } catch (error) {
    next(error);
  }
}

async function createDestino(req, res, next) {
  try {
    const { nombre, slug, descripcion, imagenPortada } = req.body || {};
    if (!nombre || !slug || !descripcion || !imagenPortada) {
      return res.status(400).json({
        error: "nombre, slug, descripcion e imagenPortada son obligatorios"
      });
    }

    const destino = await destinationService.createDestino(req.body);
    res.status(201).json(destino);
  } catch (error) {
    next(error);
  }
}

async function updateDestino(req, res, next) {
  try {
    const id = Number(req.params.id);
    const destino = await destinationService.updateDestino(id, req.body || {});
    res.json(destino);
  } catch (error) {
    next(error);
  }
}

async function deleteDestino(req, res, next) {
  try {
    const id = Number(req.params.id);
    await destinationService.deleteDestino(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listDestinos,
  getDestinoById,
  getDestinoBySlug,
  createDestino,
  updateDestino,
  deleteDestino
};

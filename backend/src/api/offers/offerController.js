const offerService = require("../../services/offerService");

function normalizeIds(value) {
  if (!value) {
    return undefined;
  }
  const ids = Array.isArray(value) ? value : [value];
  return ids.map((id) => Number(id));
}

async function listOfertas(req, res, next) {
  try {
    const activas = req.query.activas !== "false";
    const ofertas = await offerService.listOfertas({ activas });
    res.json(ofertas);
  } catch (error) {
    next(error);
  }
}

async function getOfertaById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const oferta = await offerService.getOfertaById(id);
    if (!oferta) {
      return res.status(404).json({ error: "Oferta no encontrada" });
    }
    res.json(oferta);
  } catch (error) {
    next(error);
  }
}

async function getOfertaBySlug(req, res, next) {
  try {
    const oferta = await offerService.getOfertaBySlug(req.params.slug);
    if (!oferta) {
      return res.status(404).json({ error: "Oferta no encontrada" });
    }
    res.json(oferta);
  } catch (error) {
    next(error);
  }
}

async function createOferta(req, res, next) {
  try {
    const { titulo, slug, destinoId } = req.body || {};
    if (!titulo || !slug || !destinoId) {
      return res
        .status(400)
        .json({ error: "titulo, slug y destinoId son obligatorios" });
    }

    const payload = { ...req.body, destinoId: Number(destinoId) };
    payload.destinosIds = normalizeIds(payload.destinosIds);
    payload.actividadesIds = normalizeIds(payload.actividadesIds);

    const oferta = await offerService.createOferta(payload);
    res.status(201).json(oferta);
  } catch (error) {
    next(error);
  }
}

async function updateOferta(req, res, next) {
  try {
    const id = Number(req.params.id);
    const payload = { ...req.body };

    if (payload.destinoId) {
      payload.destinoId = Number(payload.destinoId);
    }
    payload.destinosIds = normalizeIds(payload.destinosIds);
    payload.actividadesIds = normalizeIds(payload.actividadesIds);

    const oferta = await offerService.updateOferta(id, payload);
    res.json(oferta);
  } catch (error) {
    next(error);
  }
}

async function deleteOferta(req, res, next) {
  try {
    const id = Number(req.params.id);
    await offerService.deleteOferta(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listOfertas,
  getOfertaById,
  getOfertaBySlug,
  createOferta,
  updateOferta,
  deleteOferta
};

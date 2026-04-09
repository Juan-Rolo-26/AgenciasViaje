const cruiseService = require("../../services/cruiseService");

async function listCruceros(req, res, next) {
  try {
    const activos = req.query.activas !== "false";
    const lite = req.query.lite === "1";
    const cruceros = await cruiseService.listCruceros({ activos, lite });
    res.json(cruceros);
  } catch (error) {
    next(error);
  }
}

async function getCruceroById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const crucero = await cruiseService.getCruceroById(id);
    if (!crucero) {
      return res.status(404).json({ error: "Crucero no encontrado" });
    }
    res.json(crucero);
  } catch (error) {
    next(error);
  }
}

async function getCruceroBySlug(req, res, next) {
  try {
    const crucero = await cruiseService.getCruceroBySlug(req.params.slug);
    if (!crucero) {
      return res.status(404).json({ error: "Crucero no encontrado" });
    }
    res.json(crucero);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCruceros,
  getCruceroById,
  getCruceroBySlug
};

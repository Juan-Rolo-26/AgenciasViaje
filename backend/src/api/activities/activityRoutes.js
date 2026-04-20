const express = require("express");
const { actividadesCache: cache } = require("../../lib/publicCaches");
const {
  listActividades,
  getActividadById,
  getActividadBySlug,
  createActividad,
  updateActividad,
  deleteActividad
} = require("./activityController");

const router = express.Router();

router.get("/", cache, listActividades);
router.get("/slug/:slug", cache, getActividadBySlug);
router.get("/:id", cache, getActividadById);
router.post("/", createActividad);
router.put("/:id", updateActividad);
router.delete("/:id", deleteActividad);

module.exports = router;

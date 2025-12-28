const express = require("express");
const {
  listActividades,
  getActividadById,
  getActividadBySlug,
  createActividad,
  updateActividad,
  deleteActividad
} = require("./activityController");

const router = express.Router();

router.get("/", listActividades);
router.get("/slug/:slug", getActividadBySlug);
router.get("/:id", getActividadById);
router.post("/", createActividad);
router.put("/:id", updateActividad);
router.delete("/:id", deleteActividad);

module.exports = router;
